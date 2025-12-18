import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import {
  randomMatrix,
  matrixToLatex,
  isReflexive,
  isSymmetric,
  isAntisymmetric,
  isTransitive,
} from './relation-utils';

type PropertyName = 'Reflexive' | 'Symmetric' | 'Antisymmetric' | 'Transitive';

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
];

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

    // Generate random matrix
    const matrix = randomMatrix(n, rng, 0.35);
    const actualProps = getProperties(matrix);

    // Build correct answer string
    const correctAnswer = formatPropertyList(actualProps);

    // Generate distractors (wrong property combinations)
    const allCombinations: PropertyName[][] = [
      [],
      ['Reflexive'],
      ['Symmetric'],
      ['Transitive'],
      ['Reflexive', 'Symmetric'],
      ['Reflexive', 'Transitive'],
      ['Symmetric', 'Transitive'],
      ['Antisymmetric', 'Transitive'],
      ['Reflexive', 'Symmetric', 'Transitive'],
      ['Reflexive', 'Antisymmetric', 'Transitive'],
    ];

    const correctKey = actualProps.sort().join(',');
    const distractors = allCombinations
      .filter((combo) => combo.sort().join(',') !== correctKey)
      .map((combo) => formatPropertyList(combo));

    // Shuffle and pick 3 distractors
    const shuffledDistractors = shuffleWithSeed(distractors, rng).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...shuffledDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    // Build explanation
    const explanationParts = PROPERTIES.map((p) => {
      const holds = p.check(matrix);
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
    const matrix = randomMatrix(n, rng, 0.4);

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
    do {
      matrix = randomMatrix(n, rng, 0.45);
      failingProps = PROPERTIES.filter((p) => !p.check(matrix)).map((p) => p.name);
      attempts++;
    } while (failingProps.length === 0 && attempts < 50);

    // Fallback: make a clearly non-reflexive matrix
    if (failingProps.length === 0) {
      matrix[0][0] = false;
      failingProps = ['Reflexive'];
    }

    const correctAnswer = failingProps[0];
    const passingProps = PROPERTIES.filter((p) => p.check(matrix)).map((p) => p.name);

    const distractors = passingProps.slice(0, 3);
    while (distractors.length < 3) {
      distractors.push('None fail');
    }

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
