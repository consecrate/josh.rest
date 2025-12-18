import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import {
  randomMatrix,
  matrixToLatex,
  matrixTranspose,
  matrixCompose,
  matrixUnion,
  cloneMatrix,
  pickRandom,
} from './relation-utils';

type MatrixOperation = 'transpose' | 'compose' | 'union' | 'square';

interface OpInfo {
  type: MatrixOperation;
  name: string;
  symbol: string;
}

const OPERATIONS: OpInfo[] = [
  { type: 'transpose', name: 'Transpose', symbol: '^T' },
  { type: 'compose', name: 'Boolean Product', symbol: '\\odot' },
  { type: 'union', name: 'Boolean Sum (OR)', symbol: '\\lor' },
  { type: 'square', name: 'Square', symbol: '^2' },
];

/** Compute the operation result */
function computeOperation(op: MatrixOperation, A: boolean[][], B: boolean[][]): boolean[][] {
  switch (op) {
    case 'transpose':
      return matrixTranspose(A);
    case 'compose':
      return matrixCompose(A, B);
    case 'union':
      return matrixUnion(A, B);
    case 'square':
      return matrixCompose(A, A);
  }
}

// Generator 1: What is the entry at (i, j)?
const matrixEntryGenerator: ProblemGenerator = {
  type: 'matrix-boolean-entry',
  displayName: 'Boolean Matrix Entry',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 3;

    const A = randomMatrix(n, rng, 0.4);
    const B = randomMatrix(n, rng, 0.4);

    const op = pickRandom(OPERATIONS, rng);
    const result = computeOperation(op.type, A, B);

    // Pick a random entry
    const i = randInt(rng, 0, n - 1);
    const j = randInt(rng, 0, n - 1);
    const entry = result[i][j];

    const correctAnswer = entry ? '1' : '0';
    const options = shuffleWithSeed(['0', '1', 'Undefined', 'Depends on context'], rng);
    const correctIndex = options.indexOf(correctAnswer);

    let questionText: string;
    let matrixDisplay: string;

    if (op.type === 'transpose') {
      matrixDisplay = `A = ${matrixToLatex(A)}`;
      questionText = `Given $${matrixDisplay}$\n\nWhat is the entry at position $(${i + 1}, ${j + 1})$ in $A^T$?`;
    } else if (op.type === 'square') {
      matrixDisplay = `A = ${matrixToLatex(A)}`;
      questionText = `Given $${matrixDisplay}$\n\nWhat is the entry at position $(${i + 1}, ${j + 1})$ in $A^2 = A \\odot A$?`;
    } else {
      matrixDisplay = `A = ${matrixToLatex(A)}, \\quad B = ${matrixToLatex(B)}`;
      questionText = `Given $$${matrixDisplay}$$\n\nWhat is the entry at position $(${i + 1}, ${j + 1})$ in $A ${op.symbol} B$?`;
    }

    let explanation: string;
    if (op.type === 'transpose') {
      explanation = `$(A^T)_{${i + 1},${j + 1}} = A_{${j + 1},${i + 1}} = ${A[j][i] ? 1 : 0}$`;
    } else if (op.type === 'compose' || op.type === 'square') {
      const terms = Array.from({ length: n }, (_, k) => 
        `A_{${i + 1},${k + 1}} \\land ${op.type === 'square' ? 'A' : 'B'}_{${k + 1},${j + 1}}`
      );
      explanation = `$(A ${op.type === 'square' ? '^2' : '\\odot B'})_{${i + 1},${j + 1}} = ${terms.join(' \\lor ')} = ${correctAnswer}$`;
    } else {
      explanation = `$(A \\lor B)_{${i + 1},${j + 1}} = A_{${i + 1},${j + 1}} \\lor B_{${i + 1},${j + 1}} = ${A[i][j] ? 1 : 0} \\lor ${B[i][j] ? 1 : 0} = ${correctAnswer}$`;
    }

    return {
      question: questionText,
      options,
      correctIndex,
      explanation,
    };
  },
};

// Generator 2: Compute the full result matrix
const matrixResultGenerator: ProblemGenerator = {
  type: 'matrix-boolean-result',
  displayName: 'Boolean Matrix Result',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 2; // Use 2×2 for simpler display

    const A = randomMatrix(n, rng, 0.5);
    const B = randomMatrix(n, rng, 0.5);

    // Only use simpler operations for full result
    const simpleOps: OpInfo[] = [
      { type: 'transpose', name: 'Transpose', symbol: '^T' },
      { type: 'union', name: 'Boolean Sum', symbol: '\\lor' },
    ];
    const op = pickRandom(simpleOps, rng);
    const result = computeOperation(op.type, A, B);

    const correctAnswer = `$${matrixToLatex(result)}$`;

    // Generate wrong matrices
    const distractors: string[] = [];
    
    // Complement
    const complement = result.map((row) => row.map((v) => !v));
    distractors.push(`$${matrixToLatex(complement)}$`);

    // Different operation
    if (op.type === 'transpose') {
      distractors.push(`$${matrixToLatex(A)}$`); // unchanged
    } else {
      const intersection = A.map((row, i) => row.map((v, j) => v && B[i][j]));
      distractors.push(`$${matrixToLatex(intersection)}$`);
    }

    // Random wrong
    const wrong = randomMatrix(n, rng, 0.5);
    distractors.push(`$${matrixToLatex(wrong)}$`);

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer).slice(0, 3);
    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    let questionText: string;
    if (op.type === 'transpose') {
      questionText = `Given $A = ${matrixToLatex(A)}$\n\nCompute $A^T$:`;
    } else {
      questionText = `Given $A = ${matrixToLatex(A)}$ and $B = ${matrixToLatex(B)}$\n\nCompute $A ${op.symbol} B$:`;
    }

    return {
      question: questionText,
      options,
      correctIndex,
      explanation: `The result is:\n$$${matrixToLatex(result)}$$`,
    };
  },
};

// Generator 3: Boolean matrix properties
const matrixPropertyGenerator: ProblemGenerator = {
  type: 'matrix-boolean-property',
  displayName: 'Boolean Matrix Properties',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const properties = [
      {
        statement: '$(M^T)^T = M$ for any boolean matrix M',
        isTrue: true,
        explanation: 'True. Transpose is an involution.',
      },
      {
        statement: '$M \\odot I = M$ where I is the identity matrix',
        isTrue: true,
        explanation: 'True. The identity matrix is the multiplicative identity.',
      },
      {
        statement: '$M \\odot N = N \\odot M$ (boolean product is commutative)',
        isTrue: false,
        explanation: 'False. Matrix multiplication is not commutative in general.',
      },
      {
        statement: '$(M \\lor N)^T = M^T \\lor N^T$',
        isTrue: true,
        explanation: 'True. Transpose distributes over boolean sum.',
      },
      {
        statement: '$(M \\odot N)^T = N^T \\odot M^T$',
        isTrue: true,
        explanation: 'True. Transpose reverses order in products.',
      },
      {
        statement: '$M \\lor M = M$ (idempotent)',
        isTrue: true,
        explanation: 'True. OR with itself gives the same matrix.',
      },
    ];

    const prop = pickRandom(properties, rng);
    const correctAnswer = prop.isTrue ? 'True' : 'False';
    const options = shuffleWithSeed(['True', 'False', 'Only for square matrices', 'Only for symmetric matrices'], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Is the following statement about boolean matrices **true** or **false**?\n\n${prop.statement}`,
      options,
      correctIndex,
      explanation: prop.explanation,
    };
  },
};

export const generators = [
  matrixEntryGenerator,
  matrixResultGenerator,
  matrixPropertyGenerator,
] as const;
