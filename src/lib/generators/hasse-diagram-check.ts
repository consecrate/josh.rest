import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import { pickRandom, pickRandomN, gcd } from './relation-utils';

interface Poset {
  name: string;
  elements: number[];
  relation: (a: number, b: number) => boolean; // a ≤ b
  description: string;
}

/** Compute cover relation: a covers b iff a < b and no c with a < c < b */
function computeCovers(elements: number[], lessThan: (a: number, b: number) => boolean): [number, number][] {
  const covers: [number, number][] = [];

  for (const a of elements) {
    for (const b of elements) {
      if (a !== b && lessThan(a, b)) {
        // Check if there's any c strictly between a and b
        let hasBetween = false;
        for (const c of elements) {
          if (c !== a && c !== b && lessThan(a, c) && lessThan(c, b)) {
            hasBetween = true;
            break;
          }
        }
        if (!hasBetween) {
          covers.push([a, b]);
        }
      }
    }
  }

  return covers;
}

/** Get elements immediately above x (elements that x covers) */
function getImmediatelyAbove(x: number, covers: [number, number][]): number[] {
  return covers.filter(([a]) => a === x).map(([, b]) => b);
}

/** Get elements immediately below x */
function getImmediatelyBelow(x: number, covers: [number, number][]): number[] {
  return covers.filter(([, b]) => b === x).map(([a]) => a);
}

const POSETS: Poset[] = [
  {
    name: 'Divisibility on {1, 2, 3, 6}',
    elements: [1, 2, 3, 6],
    relation: (a, b) => b % a === 0,
    description: 'a | b (a divides b)',
  },
  {
    name: 'Divisibility on {1, 2, 4, 8}',
    elements: [1, 2, 4, 8],
    relation: (a, b) => b % a === 0,
    description: 'a | b (chain poset)',
  },
  {
    name: 'Divisibility on {2, 3, 4, 6, 12}',
    elements: [2, 3, 4, 6, 12],
    relation: (a, b) => b % a === 0,
    description: 'a | b (partial order)',
  },
  {
    name: 'Divisibility on {1, 2, 3, 4, 6, 12}',
    elements: [1, 2, 3, 4, 6, 12],
    relation: (a, b) => b % a === 0,
    description: 'a | b',
  },
  {
    name: 'Divisibility on {2, 4, 5, 10, 20}',
    elements: [2, 4, 5, 10, 20],
    relation: (a, b) => b % a === 0,
    description: 'a | b',
  },
];

// Generator 1: Does edge exist in Hasse diagram?
const hasseEdgeExistsGenerator: ProblemGenerator = {
  type: 'hasse-edge-exists',
  displayName: 'Hasse Diagram Edge Check',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const poset = pickRandom(POSETS, rng);
    const covers = computeCovers(poset.elements, (a, b) => a !== b && poset.relation(a, b));

    // Pick two distinct elements
    const [a, b] = pickRandomN(poset.elements, 2, rng).sort((x, y) => x - y);

    // Check if there's a direct edge from a to b
    const hasEdge = covers.some(([x, y]) => x === a && y === b);

    const correctAnswer = hasEdge ? 'Yes' : 'No';
    const options = shuffleWithSeed(['Yes', 'No', 'Only if a = b', 'Cannot determine'], rng);
    const correctIndex = options.indexOf(correctAnswer);

    let explanation: string;
    if (hasEdge) {
      explanation = `Yes, there is a direct edge from ${a} to ${b} because ${a} | ${b} and there is no element c with ${a} | c | ${b}.`;
    } else if (poset.relation(a, b)) {
      explanation = `No. While ${a} | ${b}, there exists an intermediate element, so it's not a direct (cover) edge.`;
    } else {
      explanation = `No. ${a} does not divide ${b}, so there's no edge at all.`;
    }

    return {
      question: `In the Hasse diagram for the poset "${poset.name}":\n\nIs there a **direct edge** from $${a}$ to $${b}$?`,
      options,
      correctIndex,
      explanation,
    };
  },
};

// Generator 2: What elements are immediately above/below x?
const hasseImmediateGenerator: ProblemGenerator = {
  type: 'hasse-immediate-elements',
  displayName: 'Hasse Diagram Neighbors',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const poset = pickRandom(POSETS, rng);
    const covers = computeCovers(poset.elements, (a, b) => a !== b && poset.relation(a, b));

    const x = pickRandom(poset.elements, rng);
    const askAbove = rng() < 0.5;

    const neighbors = askAbove
      ? getImmediatelyAbove(x, covers)
      : getImmediatelyBelow(x, covers);

    const correctAnswer =
      neighbors.length === 0
        ? 'None'
        : neighbors.sort((a, b) => a - b).join(', ');

    // Generate distractors
    const distractors: string[] = ['None'];
    
    // Other elements
    const others = poset.elements.filter((e) => e !== x && !neighbors.includes(e));
    for (const e of others.slice(0, 2)) {
      distractors.push(`${e}`);
    }
    
    // Some pairs
    if (others.length >= 2) {
      distractors.push(others.slice(0, 2).join(', '));
    }

    // All elements except x
    distractors.push(poset.elements.filter((e) => e !== x).join(', '));

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    const direction = askAbove ? 'immediately above' : 'immediately below';

    return {
      question: `In the Hasse diagram for "${poset.name}":\n\nWhich element(s) are **${direction}** $${x}$?`,
      options,
      correctIndex,
      explanation: `The elements ${direction} ${x} are those connected by a direct edge.\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

// Generator 3: Identify minimal/maximal elements
const hasseMinMaxGenerator: ProblemGenerator = {
  type: 'hasse-minmax-elements',
  displayName: 'Minimal/Maximal Elements',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const poset = pickRandom(POSETS, rng);
    const covers = computeCovers(poset.elements, (a, b) => a !== b && poset.relation(a, b));

    const askMinimal = rng() < 0.5;

    // Minimal: no elements below; Maximal: no elements above
    const targetElements = poset.elements.filter((x) => {
      const neighbors = askMinimal
        ? getImmediatelyBelow(x, covers)
        : getImmediatelyAbove(x, covers);
      return neighbors.length === 0;
    });

    const correctAnswer = targetElements.sort((a, b) => a - b).join(', ');

    // Distractors
    const distractors: string[] = [];
    const nonTarget = poset.elements.filter((e) => !targetElements.includes(e));
    
    if (nonTarget.length > 0) {
      distractors.push(nonTarget[0].toString());
    }
    
    // All elements
    distractors.push(poset.elements.join(', '));
    
    // Single element from target
    if (targetElements.length > 1) {
      distractors.push(targetElements[0].toString());
    }
    
    // Some other combination
    if (nonTarget.length >= 2) {
      distractors.push(nonTarget.slice(0, 2).join(', '));
    }

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    while (uniqueDistractors.length < 3) {
      uniqueDistractors.push('Cannot determine');
    }

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    const elementType = askMinimal ? 'minimal' : 'maximal';
    const desc = askMinimal
      ? 'Elements with no element below them'
      : 'Elements with no element above them';

    return {
      question: `In the poset "${poset.name}", what are the **${elementType}** element(s)?`,
      options,
      correctIndex,
      explanation: `**${elementType.charAt(0).toUpperCase() + elementType.slice(1)} elements**: ${desc}\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

export const generators = [
  hasseEdgeExistsGenerator,
  hasseImmediateGenerator,
  hasseMinMaxGenerator,
] as const;
