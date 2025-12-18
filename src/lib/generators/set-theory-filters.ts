import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { isPrime, isPerfectSquare, pickRandom } from './relation-utils';

type Predicate = {
  name: string;
  latex: string;
  test: (n: number) => boolean;
};

function createDivisiblePredicate(k: number): Predicate {
  return {
    name: `divisible by ${k}`,
    latex: `${k} | x`,
    test: (n) => n % k === 0,
  };
}

function createModuloPredicate(m: number, r: number): Predicate {
  return {
    name: `congruent to ${r} mod ${m}`,
    latex: `x \\equiv ${r} \\pmod{${m}}`,
    test: (n) => n % m === r,
  };
}

const PREDICATES: Predicate[] = [
  createDivisiblePredicate(2),
  createDivisiblePredicate(3),
  createDivisiblePredicate(4),
  createDivisiblePredicate(5),
  createDivisiblePredicate(6),
  { name: 'prime', latex: 'x \\text{ is prime}', test: isPrime },
  { name: 'perfect square', latex: 'x \\text{ is a perfect square}', test: isPerfectSquare },
  { name: 'odd', latex: 'x \\text{ is odd}', test: (n) => n % 2 === 1 },
  createModuloPredicate(3, 1),
  createModuloPredicate(4, 2),
  createModuloPredicate(5, 0),
];

/** Format set for display */
function formatSet(elements: number[]): string {
  if (elements.length === 0) return '\\emptyset';
  const sorted = [...elements].sort((a, b) => a - b);
  if (sorted.length > 10) {
    return `\\{${sorted.slice(0, 8).join(', ')}, \\ldots\\}`;
  }
  return `\\{${sorted.join(', ')}\\}`;
}

// Generator 1: List elements of A = {x | P(x)}
const setListGenerator: ProblemGenerator = {
  type: 'set-list-elements',
  displayName: 'Set Builder Elements',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const max = randInt(rng, 20, 30);
    const predicate = pickRandom(PREDICATES, rng);

    // Find elements satisfying the predicate
    const elements: number[] = [];
    for (let i = 1; i <= max; i++) {
      if (predicate.test(i)) elements.push(i);
    }

    const correctAnswer = `$${formatSet(elements)}$`;

    // Generate distractors
    const distractors: string[] = [];

    // Wrong predicate
    const otherPred = PREDICATES.find((p) => p.name !== predicate.name);
    if (otherPred) {
      const wrongElements: number[] = [];
      for (let i = 1; i <= max; i++) {
        if (otherPred.test(i)) wrongElements.push(i);
      }
      distractors.push(`$${formatSet(wrongElements)}$`);
    }

    // Missing some elements
    if (elements.length > 2) {
      distractors.push(`$${formatSet(elements.slice(0, -2))}$`);
    }

    // Extra elements
    const extra = [...elements, elements[elements.length - 1] + 1];
    distractors.push(`$${formatSet(extra)}$`);

    // All numbers
    const all = Array.from({ length: max }, (_, i) => i + 1);
    distractors.push(`$${formatSet(all.slice(0, 10))}$`);

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Let $U = \\{1, 2, \\ldots, ${max}\\}$.\n\nList the elements of $A = \\{x \\in U \\mid ${predicate.latex}\\}$:`,
      options,
      correctIndex,
      explanation: `Checking each element 1 to ${max} for the property "${predicate.name}":\n\n$A = ${formatSet(elements)}$\n\nThere are ${elements.length} elements.`,
    };
  },
};

// Generator 2: Find |A ∩ B|
const setIntersectionSizeGenerator: ProblemGenerator = {
  type: 'set-intersection-size',
  displayName: 'Set Intersection Size',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const max = randInt(rng, 20, 40);
    const pred1 = PREDICATES[Math.floor(rng() * PREDICATES.length)];
    let pred2 = PREDICATES[Math.floor(rng() * PREDICATES.length)];
    // Ensure different predicates
    while (pred2.name === pred1.name) {
      pred2 = PREDICATES[Math.floor(rng() * PREDICATES.length)];
    }

    // Compute intersection
    const intersection: number[] = [];
    for (let i = 1; i <= max; i++) {
      if (pred1.test(i) && pred2.test(i)) {
        intersection.push(i);
      }
    }

    const answer = intersection.length;
    const correctAnswer = `${answer}`;

    // Distractors
    const distractors = new Set<string>();
    
    // Count of A only
    let countA = 0;
    for (let i = 1; i <= max; i++) if (pred1.test(i)) countA++;
    distractors.add(`${countA}`);
    
    // Count of B only
    let countB = 0;
    for (let i = 1; i <= max; i++) if (pred2.test(i)) countB++;
    distractors.add(`${countB}`);
    
    // Off by one
    distractors.add(`${answer + 1}`);
    distractors.add(`${answer - 1}`);
    
    // Union size
    let countUnion = 0;
    for (let i = 1; i <= max; i++) if (pred1.test(i) || pred2.test(i)) countUnion++;
    distractors.add(`${countUnion}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) >= 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Let $U = \\{1, 2, \\ldots, ${max}\\}$.\n\nLet $A = \\{x \\in U \\mid ${pred1.latex}\\}$\nLet $B = \\{x \\in U \\mid ${pred2.latex}\\}$\n\nFind $|A \\cap B|$:`,
      options,
      correctIndex,
      explanation: `$A \\cap B$ contains elements satisfying both conditions.\n\n$A \\cap B = ${formatSet(intersection)}$\n\n$|A \\cap B| = ${answer}$`,
    };
  },
};

// Generator 3: Set complement
const setComplementGenerator: ProblemGenerator = {
  type: 'set-complement',
  displayName: 'Set Complement',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const max = randInt(rng, 10, 15);
    const predicate = pickRandom(PREDICATES, rng);

    // Find complement
    const A: number[] = [];
    const complement: number[] = [];
    for (let i = 1; i <= max; i++) {
      if (predicate.test(i)) {
        A.push(i);
      } else {
        complement.push(i);
      }
    }

    const correctAnswer = `$${formatSet(complement)}$`;

    // Distractors
    const distractors: string[] = [];
    
    // A itself
    distractors.push(`$${formatSet(A)}$`);
    
    // Missing some elements
    if (complement.length > 2) {
      distractors.push(`$${formatSet(complement.slice(1))}$`);
    }
    
    // Wrong complement (extra elements)
    const wrong = [...complement, A[0] || max + 1];
    distractors.push(`$${formatSet(wrong)}$`);

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    while (uniqueDistractors.length < 3) {
      uniqueDistractors.push(`$${formatSet([1, 2, 3])}$`);
    }

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Let $U = \\{1, 2, \\ldots, ${max}\\}$ and $A = \\{x \\in U \\mid ${predicate.latex}\\}$.\n\nFind $\\overline{A}$ (the complement of A):`,
      options,
      correctIndex,
      explanation: `$A = ${formatSet(A)}$ (elements satisfying "${predicate.name}")\n\n$\\overline{A} = U \\setminus A = ${formatSet(complement)}$`,
    };
  },
};

export const generators = [
  setListGenerator,
  setIntersectionSizeGenerator,
  setComplementGenerator,
] as const;
