import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { pickRandom, pickRandomN } from './relation-utils';

/** Format set for display */
function formatSet(elements: (string | number)[]): string {
  return `\\{${elements.join(', ')}\\}`;
}

// Generator 1: What is |A × B|?
const cartesianSizeGenerator: ProblemGenerator = {
  type: 'cartesian-product-size',
  displayName: 'Cartesian Product Size',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const sizeA = randInt(rng, 2, 5);
    const sizeB = randInt(rng, 2, 5);

    const answer = sizeA * sizeB;
    const correctAnswer = `${answer}`;

    // Distractors
    const distractors = new Set<string>();
    distractors.add(`${sizeA + sizeB}`); // common mistake: addition
    distractors.add(`${Math.max(sizeA, sizeB)}`);
    distractors.add(`${answer + 1}`);
    distractors.add(`${answer - 1}`);
    distractors.add(`${sizeA * sizeA}`);
    distractors.add(`${Math.pow(2, sizeA)}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    // Create example sets
    const A = Array.from({ length: sizeA }, (_, i) => i + 1);
    const B = ['a', 'b', 'c', 'd', 'e'].slice(0, sizeB);

    return {
      question: `Let $A = ${formatSet(A)}$ and $B = ${formatSet(B)}$.\n\nWhat is $|A \\times B|$?`,
      options,
      correctIndex,
      explanation: `$|A \\times B| = |A| \\cdot |B| = ${sizeA} \\cdot ${sizeB} = ${answer}$\n\nThe Cartesian product contains all ordered pairs $(a, b)$ where $a \\in A$ and $b \\in B$.`,
    };
  },
};

// Generator 2: Is (x, y) ∈ A × B?
const cartesianMembershipGenerator: ProblemGenerator = {
  type: 'cartesian-product-membership',
  displayName: 'Cartesian Product Membership',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const A = [1, 2, 3];
    const B = ['a', 'b'];

    // Decide if we want a valid or invalid pair
    const isValid = rng() < 0.6;

    let pair: [number | string, string | number];
    if (isValid) {
      const a = pickRandom(A, rng);
      const b = pickRandom(B, rng);
      pair = [a, b];
    } else {
      // Generate invalid pair
      const invalidOptions: [number | string, string | number][] = [
        ['a', 1], // reversed order
        [4, 'a'], // 4 not in A
        [1, 'c'], // c not in B
        ['b', 2], // wrong order
      ];
      pair = pickRandom(invalidOptions, rng);
    }

    const correctAnswer = isValid ? 'Yes' : 'No';
    const options = shuffleWithSeed(['Yes', 'No', 'Only if A = B', 'Cannot determine'], rng);
    const correctIndex = options.indexOf(correctAnswer);

    let explanation: string;
    if (isValid) {
      explanation = `$(${pair[0]}, ${pair[1]}) \\in A \\times B$ because $${pair[0]} \\in A$ and $${pair[1]} \\in B$.`;
    } else {
      explanation = `$(${pair[0]}, ${pair[1]}) \\notin A \\times B$. Either the first element is not in A, the second is not in B, or the order is wrong.`;
    }

    return {
      question: `Let $A = ${formatSet(A)}$ and $B = ${formatSet(B)}$.\n\nIs $(${pair[0]}, ${pair[1]}) \\in A \\times B$?`,
      options,
      correctIndex,
      explanation,
    };
  },
};

// Generator 3: Which element is in A × B?
const cartesianElementGenerator: ProblemGenerator = {
  type: 'cartesian-product-element',
  displayName: 'Cartesian Product Elements',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const A = [1, 2, 3];
    const B = ['x', 'y'];

    // Generate correct answer
    const a = pickRandom(A, rng);
    const b = pickRandom(B, rng);
    const correctAnswer = `$(${a}, ${b})$`;

    // Generate distractors
    const distractors: string[] = [
      `$(${pickRandom(B, rng)}, ${pickRandom(A, rng)})$`, // reversed
      `$(4, ${pickRandom(B, rng)})$`, // 4 not in A
      `$(${pickRandom(A, rng)}, z)$`, // z not in B
      `$\\{${a}, ${b}\\}$`, // set notation instead of tuple
    ];

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Let $A = ${formatSet(A)}$ and $B = ${formatSet(B)}$.\n\nWhich of the following is an element of $A \\times B$?`,
      options,
      correctIndex,
      explanation: `$A \\times B$ consists of ordered pairs $(a, b)$ where $a \\in A$ and $b \\in B$.\n\n${correctAnswer} is valid because ${a} ∈ A and ${b} ∈ B.`,
    };
  },
};

// Generator 4: Properties of Cartesian products
const cartesianPropertiesGenerator: ProblemGenerator = {
  type: 'cartesian-product-properties',
  displayName: 'Cartesian Product Properties',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const properties = [
      {
        statement: '$A \\times B = B \\times A$ in general',
        isTrue: false,
        explanation: 'False. Order matters: (1, a) ≠ (a, 1). Only true if A = B.',
      },
      {
        statement: '$A \\times \\emptyset = \\emptyset$',
        isTrue: true,
        explanation: 'True. There are no elements b ∈ ∅ to form pairs with.',
      },
      {
        statement: '$|A \\times B| = |A| \\cdot |B|$',
        isTrue: true,
        explanation: 'True. This is the fundamental counting principle.',
      },
      {
        statement: '$A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$',
        isTrue: true,
        explanation: 'True. Cartesian product distributes over union.',
      },
      {
        statement: '$(A \\times B) \\cap (C \\times D) = (A \\cap C) \\times (B \\cap D)$',
        isTrue: true,
        explanation: 'True. Intersection of Cartesian products.',
      },
      {
        statement: '$A \\subseteq B$ implies $A \\times A \\subseteq B \\times B$',
        isTrue: true,
        explanation: 'True. If all elements of A are in B, all pairs from A are in B×B.',
      },
    ];

    const prop = pickRandom(properties, rng);
    const correctAnswer = prop.isTrue ? 'True' : 'False';
    const options = shuffleWithSeed(['True', 'False', 'Only if A = B', 'Only if B ⊆ A'], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Is the following statement **true** or **false**?\n\n${prop.statement}`,
      options,
      correctIndex,
      explanation: prop.explanation,
    };
  },
};

export const generators = [
  cartesianSizeGenerator,
  cartesianMembershipGenerator,
  cartesianElementGenerator,
  cartesianPropertiesGenerator,
] as const;
