import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import {
  randomMatrix,
  matrixToLatex,
  isReflexive,
  isSymmetric,
  isAntisymmetric,
  isTransitive,
  reflexiveClosure,
  symmetricClosure,
  transitiveClosure,
} from './relation-utils';

type PropertyName =
  | 'Reflexive'
  | 'Symmetric'
  | 'Antisymmetric'
  | 'Transitive'
  | 'Equivalence Relation'
  | 'Partial Order';

interface PropertyInfo {
  name: PropertyName;
  check: (m: boolean[][]) => boolean;
  definition: string;
}

const PROPERTIES: PropertyInfo[] = [
  { name: 'Reflexive', check: isReflexive, definition: '∀a: (a,a) ∈ R' },
  { name: 'Symmetric', check: isSymmetric, definition: '(a,b) ∈ R ⟹ (b,a) ∈ R' },
  { name: 'Antisymmetric', check: isAntisymmetric, definition: '(a,b) ∈ R ∧ (b,a) ∈ R ⟹ a = b' },
  { name: 'Transitive', check: isTransitive, definition: '(a,b) ∈ R ∧ (b,c) ∈ R ⟹ (a,c) ∈ R' },
  {
    name: 'Equivalence Relation',
    check: (m) => isReflexive(m) && isSymmetric(m) && isTransitive(m),
    definition: 'Reflexive, Symmetric, and Transitive',
  },
  {
    name: 'Partial Order',
    check: (m) => isReflexive(m) && isAntisymmetric(m) && isTransitive(m),
    definition: 'Reflexive, Antisymmetric, and Transitive',
  },
];

function generateInterestingMatrix(n: number, rng: () => number): boolean[][] {
  const roll = rng();
  let matrix = randomMatrix(n, rng, 0.2); // Start sparse

  if (roll < 0.15) {
    // Random noise (likely to fail many properties)
    return randomMatrix(n, rng, 0.4);
  } else if (roll < 0.3) {
    // Force Reflexive
    return reflexiveClosure(randomMatrix(n, rng, 0.3));
  } else if (roll < 0.45) {
    // Force Symmetric
    return symmetricClosure(randomMatrix(n, rng, 0.3));
  } else if (roll < 0.6) {
    // Force Transitive
    return transitiveClosure(randomMatrix(n, rng, 0.2));
  } else if (roll < 0.8) {
    // Force Equivalence Relation
    matrix = reflexiveClosure(matrix);
    matrix = symmetricClosure(matrix);
    return transitiveClosure(matrix);
  } else {
    // Force Partial Order
    // Start with upper triangular to ensure antisymmetry
    matrix = matrix.map((row, i) => row.map((val, j) => (i <= j ? val : false)));
    matrix = reflexiveClosure(matrix);
    return transitiveClosure(matrix);
  }
}

function getProperties(matrix: boolean[][]): PropertyName[] {
  return PROPERTIES.filter((p) => p.check(matrix)).map((p) => p.name);
}

function formatPropertyList(props: PropertyName[]): string {
  if (props.length === 0) return 'None';
  return props.join(', ');
}

// Generator 1: Which properties does this relation satisfy?
const whichPropertiesGenerator: ProblemGenerator = {
  type: 'relation-properties-which',
  displayName: 'Relation Properties (Which)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 3 + Math.floor(rng() * 2); // 3 or 4

    // Generate interesting matrix
    const matrix = generateInterestingMatrix(n, rng);
    const actualProps = getProperties(matrix);

    // Build correct answer string
    const correctAnswer = formatPropertyList(actualProps);

    // Common valid combinations for distractors
    const commonCombinations: PropertyName[][] = [
      [],
      ['Reflexive'],
      ['Symmetric'],
      ['Antisymmetric'],
      ['Transitive'],
      ['Reflexive', 'Symmetric'],
      ['Reflexive', 'Antisymmetric'],
      ['Reflexive', 'Transitive'],
      ['Symmetric', 'Transitive'],
      ['Antisymmetric', 'Transitive'],
      ['Reflexive', 'Symmetric', 'Transitive', 'Equivalence Relation'],
      ['Reflexive', 'Antisymmetric', 'Transitive', 'Partial Order'],
      // Identity matrix case (both)
      ['Reflexive', 'Symmetric', 'Antisymmetric', 'Transitive', 'Equivalence Relation', 'Partial Order']
    ];

    const correctKey = actualProps.sort().join(',');
    
    // Filter distractors and pick 3
    const distractors = commonCombinations
      .filter((combo) => combo.sort().join(',') !== correctKey)
      .map((combo) => formatPropertyList(combo));
      
    // If we don't have enough distractors (rare case), add some random subset strings
    // But commonCombinations should cover most cases.
    
    const shuffledDistractors = shuffleWithSeed(distractors, rng).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...shuffledDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    // Build explanation
    const explanationParts = PROPERTIES.map((p) => {
      const holds = p.check(matrix);
      // Don't show redundant checks for Equiv/PO in the list if they are just combinations?
      // Actually showing them is good reinforcement.
      return `- **${p.name}** (${p.definition}): ${holds ? '✓ Yes' : '✗ No'}`;
    });

    return {
      question: `Given the relation $R$ on $A = \\{1, 2, ${n === 3 ? '3' : '3, 4'}\\}$ with matrix:\n$$M_R = ${matrixToLatex(matrix)}$$\nWhich properties does $R$ satisfy?`,
      options,
      correctIndex,
      explanation: `Checking each property:\n\n${explanationParts.join('\n')}\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

// Generator 2: Is this relation [Property]?
const isPropertyGenerator: ProblemGenerator = {
  type: 'relation-properties-is',
  displayName: 'Relation Properties (Yes/No)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 3 + Math.floor(rng() * 2);
    const matrix = generateInterestingMatrix(n, rng);

    // Pick a random property to ask about
    const property = PROPERTIES[Math.floor(rng() * PROPERTIES.length)];
    const holds = property.check(matrix);

    const correctAnswer = holds ? 'Yes' : 'No';
    const options = shuffleWithSeed(['Yes', 'No', 'Cannot be determined', 'Only if reflexive'], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Is the relation $R$ with matrix\n$$M_R = ${matrixToLatex(matrix)}$$\n**${property.name}**?`,
      options,
      correctIndex,
      explanation: `**${property.name}**: ${property.definition}\n\nChecking the matrix: ${holds ? 'The property holds ✓' : 'The property does NOT hold ✗'}\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

// Generator 3: Which property fails?
const whichFailsGenerator: ProblemGenerator = {
  type: 'relation-properties-fails',
  displayName: 'Relation Properties (Which Fails)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 3;

    // Generate matrices until we find one with at least one failing property
    let matrix: boolean[][];
    let failingProps: PropertyName[];
    let attempts = 0;
    
    // We want a matrix that FAILS something, so pure random or slightly tweaked is good.
    // generateInterestingMatrix produces perfect things often, so maybe mix it up?
    // Actually generateInterestingMatrix covers random noise too.
    
    do {
      matrix = generateInterestingMatrix(n, rng);
      // We only care about failing basic properties for this question usually?
      // Or failing Equiv/PO?
      // Let's stick to checking all properties.
      failingProps = PROPERTIES.filter((p) => !p.check(matrix)).map((p) => p.name);
      attempts++;
    } while (failingProps.length === 0 && attempts < 50);

    // Fallback
    if (failingProps.length === 0) {
        // Identity matrix passes everything. Flip one bit to fail something.
        matrix[0][0] = false; // Fails Reflexive (and Equiv, PO)
        failingProps = ['Reflexive', 'Equivalence Relation', 'Partial Order'];
    }

    // Pick one failing property as the "Answer"
    // Prefer basic properties if possible, as failing Equiv is implied by failing Ref.
    const basicFailing = failingProps.filter(p => !['Equivalence Relation', 'Partial Order'].includes(p));
    const correctAnswer = basicFailing.length > 0 ? basicFailing[0] : failingProps[0];

    const passingProps = PROPERTIES.filter((p) => p.check(matrix)).map((p) => p.name);

    // Distractors are things that pass
    const distractors: string[] = passingProps.slice(0, 3);
    
    // If we don't have enough passing properties (e.g. empty matrix fails Ref, Equiv, PO, but is Sym, Anti, Trans)
    // We fill with other failing properties? No, question is "Which FAILS".
    // If options are [Fails1, Fails2, Pass1, Pass2], then Fails1 and Fails2 are both correct.
    // So distractors MUST be properties that PASS.
    
    // If everything fails (rare), we need fake properties or "None".
    while (distractors.length < 3) {
      distractors.push('None fail'); // This is technically a wrong answer if something fails
    }
    
    // Make sure we don't have multiple correct answers in the options.
    // The options should be: [CorrectFailing, Passing1, Passing2, Passing3]
    
    const options = shuffleWithSeed([correctAnswer, ...distractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Given the relation with matrix:\n$$M_R = ${matrixToLatex(matrix)}$$\nWhich property does this relation **fail**?`,
      options,
      correctIndex,
      explanation: `Checking each property:\n\n${PROPERTIES.map((p) => `- **${p.name}**: ${p.check(matrix) ? '✓ Holds' : '✗ Fails'}`).join('\n')}\n\n**Answer:** ${correctAnswer} fails.`,
    };
  },
};

export const generators = [
  whichPropertiesGenerator,
  isPropertyGenerator,
  whichFailsGenerator,
] as const;
