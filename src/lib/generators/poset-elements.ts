import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import { pickRandom, pickRandomN } from './relation-utils';

interface Poset {
  name: string;
  elements: number[];
  leq: (a: number, b: number) => boolean; // a ≤ b in the order
}

const POSETS: Poset[] = [
  {
    name: 'Divisibility on {1, 2, 3, 4, 6, 12}',
    elements: [1, 2, 3, 4, 6, 12],
    leq: (a, b) => b % a === 0,
  },
  {
    name: 'Divisibility on {2, 3, 4, 6, 8, 12, 24}',
    elements: [2, 3, 4, 6, 8, 12, 24],
    leq: (a, b) => b % a === 0,
  },
  {
    name: 'Divisibility on {1, 2, 4, 8, 16}',
    elements: [1, 2, 4, 8, 16],
    leq: (a, b) => b % a === 0,
  },
  {
    name: 'Divisibility on {2, 3, 5, 6, 10, 15, 30}',
    elements: [2, 3, 5, 6, 10, 15, 30],
    leq: (a, b) => b % a === 0,
  },
];

/** Get minimal elements: no smaller element exists */
function getMinimal(poset: Poset): number[] {
  return poset.elements.filter((x) =>
    !poset.elements.some((y) => y !== x && poset.leq(y, x))
  );
}

/** Get maximal elements: no larger element exists */
function getMaximal(poset: Poset): number[] {
  return poset.elements.filter((x) =>
    !poset.elements.some((y) => y !== x && poset.leq(x, y))
  );
}

/** Get least element (unique minimum if exists) */
function getLeast(poset: Poset): number | null {
  const minimals = getMinimal(poset);
  if (minimals.length !== 1) return null;
  const candidate = minimals[0];
  // Must be ≤ all elements
  if (poset.elements.every((x) => poset.leq(candidate, x))) {
    return candidate;
  }
  return null;
}

/** Get greatest element (unique maximum if exists) */
function getGreatest(poset: Poset): number | null {
  const maximals = getMaximal(poset);
  if (maximals.length !== 1) return null;
  const candidate = maximals[0];
  // Must be ≥ all elements
  if (poset.elements.every((x) => poset.leq(x, candidate))) {
    return candidate;
  }
  return null;
}

/** Get upper bounds of a subset */
function getUpperBounds(poset: Poset, subset: number[]): number[] {
  return poset.elements.filter((u) => subset.every((x) => poset.leq(x, u)));
}

/** Get lower bounds of a subset */
function getLowerBounds(poset: Poset, subset: number[]): number[] {
  return poset.elements.filter((l) => subset.every((x) => poset.leq(l, x)));
}

/** Get LUB (least upper bound / supremum / join) */
function getLUB(poset: Poset, subset: number[]): number | null {
  const ubs = getUpperBounds(poset, subset);
  if (ubs.length === 0) return null;
  // Find the smallest upper bound
  for (const candidate of ubs) {
    if (ubs.every((u) => poset.leq(candidate, u))) {
      return candidate;
    }
  }
  return null;
}

/** Get GLB (greatest lower bound / infimum / meet) */
function getGLB(poset: Poset, subset: number[]): number | null {
  const lbs = getLowerBounds(poset, subset);
  if (lbs.length === 0) return null;
  // Find the largest lower bound
  for (const candidate of lbs) {
    if (lbs.every((l) => poset.leq(l, candidate))) {
      return candidate;
    }
  }
  return null;
}

function formatAnswer(elements: number[]): string {
  if (elements.length === 0) return 'None';
  return elements.sort((a, b) => a - b).join(', ');
}

// Generator 1: Minimal/Maximal elements
const posetMinMaxGenerator: ProblemGenerator = {
  type: 'poset-minmax',
  displayName: 'Poset Minimal/Maximal',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const poset = pickRandom(POSETS, rng);
    const askMinimal = rng() < 0.5;

    const elements = askMinimal ? getMinimal(poset) : getMaximal(poset);
    const correctAnswer = formatAnswer(elements);

    // Distractors
    const distractors: string[] = [];
    const other = askMinimal ? getMaximal(poset) : getMinimal(poset);
    distractors.push(formatAnswer(other));
    
    // Some random elements
    const randoms = pickRandomN(poset.elements, 2, rng);
    distractors.push(formatAnswer(randoms));
    
    // All elements
    distractors.push(formatAnswer(poset.elements));

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    while (uniqueDistractors.length < 3) {
      uniqueDistractors.push('Cannot determine');
    }

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    const type = askMinimal ? 'minimal' : 'maximal';
    const definition = askMinimal
      ? 'Elements with no element strictly below them'
      : 'Elements with no element strictly above them';

    return {
      question: `In the poset "${poset.name}", what are the **${type}** element(s)?`,
      options,
      correctIndex,
      explanation: `**${type.charAt(0).toUpperCase() + type.slice(1)} elements**: ${definition}\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

// Generator 2: Greatest/Least element
const posetGreatestLeastGenerator: ProblemGenerator = {
  type: 'poset-greatest-least',
  displayName: 'Poset Greatest/Least',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const poset = pickRandom(POSETS, rng);
    const askLeast = rng() < 0.5;

    const element = askLeast ? getLeast(poset) : getGreatest(poset);
    const correctAnswer = element !== null ? `${element}` : 'Does not exist';

    // Distractors
    const distractors: string[] = ['Does not exist'];
    const other = askLeast ? getGreatest(poset) : getLeast(poset);
    if (other !== null) distractors.push(`${other}`);
    
    // Random elements
    for (const e of poset.elements.slice(0, 3)) {
      if (`${e}` !== correctAnswer) distractors.push(`${e}`);
    }

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    const type = askLeast ? 'least' : 'greatest';
    const definition = askLeast
      ? 'An element ≤ all other elements (unique minimum)'
      : 'An element ≥ all other elements (unique maximum)';

    return {
      question: `In the poset "${poset.name}", what is the **${type}** element?`,
      options,
      correctIndex,
      explanation: `**${type.charAt(0).toUpperCase() + type.slice(1)} element**: ${definition}\n\n${element !== null ? `The ${type} element is ${element}.` : `No ${type} element exists in this poset.`}`,
    };
  },
};

// Generator 3: LUB/GLB of a subset
const posetBoundsGenerator: ProblemGenerator = {
  type: 'poset-bounds',
  displayName: 'Poset LUB/GLB',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const poset = pickRandom(POSETS, rng);

    // Pick a small subset (2-3 elements)
    const subsetSize = 2 + Math.floor(rng() * 2);
    const subset = pickRandomN(poset.elements, subsetSize, rng).sort((a, b) => a - b);

    const askLUB = rng() < 0.5;
    const bound = askLUB ? getLUB(poset, subset) : getGLB(poset, subset);
    const correctAnswer = bound !== null ? `${bound}` : 'Does not exist';

    // Distractors
    const distractors: string[] = ['Does not exist'];
    const other = askLUB ? getGLB(poset, subset) : getLUB(poset, subset);
    if (other !== null) distractors.push(`${other}`);
    
    // Elements from the subset
    for (const e of subset) {
      if (`${e}` !== correctAnswer) distractors.push(`${e}`);
    }
    
    // Some upper/lower bounds
    const bounds = askLUB ? getUpperBounds(poset, subset) : getLowerBounds(poset, subset);
    for (const b of bounds) {
      if (`${b}` !== correctAnswer) distractors.push(`${b}`);
    }

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    const type = askLUB ? 'LUB (least upper bound)' : 'GLB (greatest lower bound)';
    const aka = askLUB ? 'supremum / join' : 'infimum / meet';

    return {
      question: `In the poset "${poset.name}", find the **${type}** of the subset $\\{${subset.join(', ')}\\}$.`,
      options,
      correctIndex,
      explanation: `**${type}** (also called ${aka}):\n\n${bound !== null ? `The ${askLUB ? 'LUB' : 'GLB'} is ${bound}.` : `No ${askLUB ? 'LUB' : 'GLB'} exists for this subset.`}`,
    };
  },
};

export const generators = [
  posetMinMaxGenerator,
  posetGreatestLeastGenerator,
  posetBoundsGenerator,
] as const;
