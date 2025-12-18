import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { randomMatrix, matrixToLatex, cloneMatrix, pickRandom } from './relation-utils';

/** Perform Warshall's algorithm up to step k, return intermediate matrices */
function warshallSteps(M: boolean[][]): boolean[][][] {
  const n = M.length;
  const steps: boolean[][][] = [cloneMatrix(M)];

  const W = cloneMatrix(M);
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        W[i][j] = W[i][j] || (W[i][k] && W[k][j]);
      }
    }
    steps.push(cloneMatrix(W));
  }

  return steps;
}

/** Find entries that changed from step k to k+1 */
function findChangedEntries(before: boolean[][], after: boolean[][]): [number, number][] {
  const changes: [number, number][] = [];
  for (let i = 0; i < before.length; i++) {
    for (let j = 0; j < before[i].length; j++) {
      if (!before[i][j] && after[i][j]) {
        changes.push([i, j]);
      }
    }
  }
  return changes;
}

// Generator 1: Which entry changes at step k?
const warshallChangeGenerator: ProblemGenerator = {
  type: 'warshall-entry-change',
  displayName: 'Warshall: Entry Changes',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 3;

    // Generate matrix and ensure some changes happen
    let M: boolean[][];
    let steps: boolean[][][];
    let stepWithChanges = -1;
    let changes: [number, number][] = [];

    let attempts = 0;
    do {
      M = randomMatrix(n, rng, 0.35);
      steps = warshallSteps(M);

      // Find a step with changes
      for (let k = 0; k < n; k++) {
        const ch = findChangedEntries(steps[k], steps[k + 1]);
        if (ch.length > 0) {
          stepWithChanges = k;
          changes = ch;
          break;
        }
      }
      attempts++;
    } while (stepWithChanges === -1 && attempts < 50);

    // Fallback: use a known matrix with changes
    if (stepWithChanges === -1) {
      M = [
        [false, true, false],
        [false, false, true],
        [false, false, false],
      ];
      steps = warshallSteps(M);
      stepWithChanges = 0;
      changes = findChangedEntries(steps[0], steps[1]);
    }

    const changedEntry = changes[0];
    const correctAnswer = `(${changedEntry[0] + 1}, ${changedEntry[1] + 1})`;

    // Generate distractors - entries that didn't change
    const distractors: string[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const entry = `(${i + 1}, ${j + 1})`;
        if (entry !== correctAnswer && !changes.some(([r, c]) => r === i && c === j)) {
          distractors.push(entry);
        }
      }
    }

    const finalDistractors = shuffleWithSeed(distractors, rng).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...finalDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Given the initial matrix:\n$$W_0 = ${matrixToLatex(M)}$$\n\nUsing Warshall's algorithm, which entry changes from 0 to 1 after processing node **${stepWithChanges + 1}** (i.e., from $W_{${stepWithChanges}}$ to $W_{${stepWithChanges + 1}}$)?`,
      options,
      correctIndex,
      explanation: `After processing node ${stepWithChanges + 1}:\n\n$W_{${stepWithChanges + 1}} = ${matrixToLatex(steps[stepWithChanges + 1])}$\n\nThe entry at ${correctAnswer} changed from 0 to 1 because there's a path through node ${stepWithChanges + 1}.`,
    };
  },
};

// Generator 2: What is W_k after step k?
const warshallMatrixGenerator: ProblemGenerator = {
  type: 'warshall-matrix-step',
  displayName: 'Warshall: Matrix After Step',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 2; // Use 2×2 for simpler display

    const M = randomMatrix(n, rng, 0.4);
    const steps = warshallSteps(M);

    // Pick a step to ask about
    const k = randInt(rng, 1, n);
    const correctMatrix = steps[k];
    const correctAnswer = `$${matrixToLatex(correctMatrix)}$`;

    // Generate distractors
    const distractors: string[] = [];

    // Previous step
    if (k > 0) {
      distractors.push(`$${matrixToLatex(steps[k - 1])}$`);
    }

    // Next step
    if (k < n) {
      distractors.push(`$${matrixToLatex(steps[k + 1])}$`);
    }

    // Original matrix
    distractors.push(`$${matrixToLatex(M)}$`);

    // Random wrong matrix
    const wrong = randomMatrix(n, rng, 0.5);
    distractors.push(`$${matrixToLatex(wrong)}$`);

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Given the initial matrix:\n$$W_0 = ${matrixToLatex(M)}$$\n\nUsing Warshall's algorithm, what is $W_{${k}}$ (the matrix after processing nodes 1 through ${k})?`,
      options,
      correctIndex,
      explanation: `Warshall's algorithm:\n- $W_0 = ${matrixToLatex(M)}$ (initial)\n- At step k, we add paths through node k.\n\n$W_{${k}} = ${matrixToLatex(correctMatrix)}$`,
    };
  },
};

// Generator 3: Warshall algorithm understanding
const warshallConceptGenerator: ProblemGenerator = {
  type: 'warshall-concept',
  displayName: 'Warshall: Concepts',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const questions = [
      {
        q: "What does Warshall's algorithm compute?",
        correct: 'The transitive closure of a relation',
        distractors: [
          'The reflexive closure of a relation',
          'The symmetric closure of a relation',
          'The inverse of a relation',
        ],
        explanation: "Warshall's algorithm computes the transitive closure efficiently in O(n³) time.",
      },
      {
        q: 'In Warshall\'s algorithm, what does $W_k[i][j] = W_{k-1}[i][j] \\lor (W_{k-1}[i][k] \\land W_{k-1}[k][j])$ compute?',
        correct: 'Whether there is a path from i to j using only intermediate nodes 1 through k',
        distractors: [
          'Whether there is a direct edge from i to j',
          'The shortest path from i to j',
          'Whether i and j are in the same equivalence class',
        ],
        explanation: 'The formula adds paths that go through node k as an intermediate node.',
      },
      {
        q: "What is the time complexity of Warshall's algorithm on an n×n matrix?",
        correct: 'O(n³)',
        distractors: ['O(n²)', 'O(n⁴)', 'O(2ⁿ)'],
        explanation: 'Three nested loops, each running n times: O(n × n × n) = O(n³).',
      },
      {
        q: 'After running Warshall\'s algorithm, $W[i][j] = 1$ means:',
        correct: 'There exists a path from i to j in the original relation',
        distractors: [
          'There is a direct edge from i to j',
          'i and j are adjacent',
          'The shortest path from i to j has length 1',
        ],
        explanation: 'The transitive closure indicates reachability, not direct edges.',
      },
    ];

    const item = pickRandom(questions, rng);
    const options = shuffleWithSeed([item.correct, ...item.distractors], rng);
    const correctIndex = options.indexOf(item.correct);

    return {
      question: item.q,
      options,
      correctIndex,
      explanation: item.explanation,
    };
  },
};

export const generators = [
  warshallChangeGenerator,
  warshallMatrixGenerator,
  warshallConceptGenerator,
] as const;
