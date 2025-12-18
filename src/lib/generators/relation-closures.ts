import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import {
  type Relation,
  createMatrix,
  matrixToRelation,
  relationToLatex,
  reflexiveClosure,
  symmetricClosure,
  transitiveClosure,
  relationDiff,
  pickRandom,
} from './relation-utils';

type ClosureType = 'reflexive' | 'symmetric' | 'transitive';

interface ClosureInfo {
  type: ClosureType;
  name: string;
  compute: (m: boolean[][]) => boolean[][];
  description: string;
}

const CLOSURES: ClosureInfo[] = [
  {
    type: 'reflexive',
    name: 'Reflexive Closure',
    compute: reflexiveClosure,
    description: 'Add all (a, a) pairs',
  },
  {
    type: 'symmetric',
    name: 'Symmetric Closure',
    compute: symmetricClosure,
    description: 'Add (b, a) for each (a, b)',
  },
  {
    type: 'transitive',
    name: 'Transitive Closure',
    compute: transitiveClosure,
    description: 'Add all pairs reachable by transitivity (Warshall)',
  },
];

/** Generate a sparse random relation */
function generateSparseRelation(n: number, rng: () => number, count: number): Relation {
  const relation: Relation = [];
  const used = new Set<string>();

  while (relation.length < count) {
    const r = Math.floor(rng() * n);
    const c = Math.floor(rng() * n);
    const key = `${r},${c}`;
    if (!used.has(key)) {
      used.add(key);
      relation.push([r, c]);
    }
  }
  return relation;
}

const closurePairsGenerator: ProblemGenerator = {
  type: 'relation-closure-pairs',
  displayName: 'Closure: Find Missing Pairs',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 3;
    const numPairs = 2 + Math.floor(rng() * 3); // 2-4 pairs

    // Generate initial relation
    const relation = generateSparseRelation(n, rng, numPairs);
    const matrix = createMatrix(n, relation);

    // Pick a closure type
    const closureInfo = pickRandom(CLOSURES, rng);
    const closedMatrix = closureInfo.compute(matrix);
    const closedRelation = matrixToRelation(closedMatrix);

    // Find pairs that need to be added
    const addedPairs = relationDiff(relation, closedRelation);

    const correctAnswer =
      addedPairs.length === 0
        ? 'No pairs need to be added'
        : relationToLatex(addedPairs);

    // Generate distractors
    const distractors: string[] = [];

    // Wrong closure type
    for (const other of CLOSURES) {
      if (other.type !== closureInfo.type) {
        const otherClosed = other.compute(matrix);
        const otherAdded = relationDiff(relation, matrixToRelation(otherClosed));
        if (otherAdded.length > 0) {
          distractors.push(relationToLatex(otherAdded));
        }
      }
    }

    // Random wrong pairs
    const allPossible: Relation = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!matrix[i][j]) allPossible.push([i, j]);
      }
    }
    if (allPossible.length > 0) {
      const wrongPairs = shuffleWithSeed(allPossible, rng).slice(0, 2);
      distractors.push(relationToLatex(wrongPairs));
    }

    // Ensure we have enough unique distractors
    distractors.push('No pairs need to be added');
    distractors.push(relationToLatex([[0, 1], [2, 2]]));

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer);
    const finalDistractors = uniqueDistractors.slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...finalDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Given the relation $R = ${relationToLatex(relation)}$ on $A = \\{1, 2, 3\\}$.\n\nWhich pairs must be added to form the **${closureInfo.name}** of $R$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**${closureInfo.name}**: ${closureInfo.description}\n\nOriginal: $R = ${relationToLatex(relation)}$\n\nClosure: $${relationToLatex(closedRelation)}$\n\n**Pairs to add:** $${correctAnswer}$`,
    };
  },
};

const closureResultGenerator: ProblemGenerator = {
  type: 'relation-closure-result',
  displayName: 'Closure: Find Result',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 3;
    const numPairs = 2 + Math.floor(rng() * 2);

    const relation = generateSparseRelation(n, rng, numPairs);
    const matrix = createMatrix(n, relation);
    const closureInfo = pickRandom(CLOSURES, rng);
    const closedMatrix = closureInfo.compute(matrix);
    const closedRelation = matrixToRelation(closedMatrix);

    const correctAnswer = relationToLatex(closedRelation);

    // Generate wrong answers
    const distractors: string[] = [];

    // Original relation (if different)
    if (closedRelation.length !== relation.length) {
      distractors.push(relationToLatex(relation));
    }

    // Other closure types
    for (const other of CLOSURES) {
      if (other.type !== closureInfo.type) {
        const otherResult = matrixToRelation(other.compute(matrix));
        distractors.push(relationToLatex(otherResult));
      }
    }

    // Incomplete closure
    if (closedRelation.length > relation.length) {
      const partial = closedRelation.slice(0, -1);
      distractors.push(relationToLatex(partial));
    }

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer);
    const finalDistractors = uniqueDistractors.slice(0, 3);

    // Pad if needed
    while (finalDistractors.length < 3) {
      finalDistractors.push(relationToLatex([[0, 0], [1, 1], [2, 2]]));
    }

    const options = shuffleWithSeed([correctAnswer, ...finalDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Find the **${closureInfo.name}** of the relation:\n$$R = ${relationToLatex(relation)}$$\non the set $A = \\{1, 2, 3\\}$.`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**${closureInfo.name}**: ${closureInfo.description}\n\nStarting with $R = ${relationToLatex(relation)}$\n\nThe ${closureInfo.name.toLowerCase()} is:\n$$${correctAnswer}$$`,
    };
  },
};

export const generators = [closurePairsGenerator, closureResultGenerator] as const;
