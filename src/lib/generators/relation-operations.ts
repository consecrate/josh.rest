import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import {
  type Relation,
  createMatrix,
  matrixToRelation,
  relationToLatex,
  matrixUnion,
  matrixIntersection,
  matrixTranspose,
  matrixCompose,
  pickRandom,
} from './relation-utils';

type OperationType = 'union' | 'intersection' | 'inverse' | 'composition';

interface OperationInfo {
  type: OperationType;
  symbol: string;
  name: string;
  binary: boolean; // true if needs two relations
}

const OPERATIONS: OperationInfo[] = [
  { type: 'union', symbol: '∪', name: 'Union', binary: true },
  { type: 'intersection', symbol: '∩', name: 'Intersection', binary: true },
  { type: 'inverse', symbol: '⁻¹', name: 'Inverse', binary: false },
  { type: 'composition', symbol: '∘', name: 'Composition', binary: true },
];

/** Generate a random sparse relation */
function generateRelation(n: number, rng: () => number, count: number): Relation {
  const relation: Relation = [];
  const used = new Set<string>();
  const maxAttempts = count * 3;
  let attempts = 0;

  while (relation.length < count && attempts < maxAttempts) {
    const r = Math.floor(rng() * n);
    const c = Math.floor(rng() * n);
    const key = `${r},${c}`;
    if (!used.has(key)) {
      used.add(key);
      relation.push([r, c]);
    }
    attempts++;
  }
  return relation;
}

/** Compute operation result */
function computeOperation(
  op: OperationType,
  R: Relation,
  S: Relation,
  n: number
): Relation {
  const matR = createMatrix(n, R);
  const matS = createMatrix(n, S);

  let resultMatrix: boolean[][];
  switch (op) {
    case 'union':
      resultMatrix = matrixUnion(matR, matS);
      break;
    case 'intersection':
      resultMatrix = matrixIntersection(matR, matS);
      break;
    case 'inverse':
      resultMatrix = matrixTranspose(matR);
      break;
    case 'composition':
      // S ∘ R means: (a,c) ∈ S∘R iff ∃b: (a,b) ∈ R and (b,c) ∈ S
      resultMatrix = matrixCompose(matR, matS);
      break;
    default:
      resultMatrix = matR;
  }

  return matrixToRelation(resultMatrix);
}

const relationOperationsGenerator: ProblemGenerator = {
  type: 'relation-operations',
  displayName: 'Relation Operations',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const n = 3;
    const pairCount = 2 + Math.floor(rng() * 2); // 2-3 pairs each

    // Generate two relations
    const R = generateRelation(n, rng, pairCount);
    const S = generateRelation(n, rng, pairCount);

    // Pick an operation
    const op = pickRandom(OPERATIONS, rng);

    // Compute result
    const result = computeOperation(op.type, R, S, n);
    const correctAnswer = relationToLatex(result);

    // Format question based on operation type
    let questionPart: string;
    if (op.type === 'inverse') {
      questionPart = `$R^{-1}$`;
    } else if (op.type === 'composition') {
      questionPart = `$S \\circ R$`;
    } else {
      questionPart = `$R ${op.symbol} S$`;
    }

    // Generate distractors
    const distractors: string[] = [];

    // Other operations
    for (const otherOp of OPERATIONS) {
      if (otherOp.type !== op.type) {
        const otherResult = computeOperation(otherOp.type, R, S, n);
        distractors.push(relationToLatex(otherResult));
      }
    }

    // Wrong order composition
    if (op.type === 'composition') {
      const reversed = matrixToRelation(
        matrixCompose(createMatrix(n, S), createMatrix(n, R))
      );
      distractors.push(relationToLatex(reversed));
    }

    // Just R or S
    distractors.push(relationToLatex(R));
    distractors.push(relationToLatex(S));

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer);
    const finalDistractors = shuffleWithSeed(uniqueDistractors, rng).slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...finalDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    // Build explanation
    let explanation: string;
    if (op.type === 'inverse') {
      explanation = `**Inverse** $R^{-1}$: Swap all pairs $(a,b) \\to (b,a)$\n\n$R = ${relationToLatex(R)}$\n\n$R^{-1} = ${correctAnswer}$`;
    } else if (op.type === 'union') {
      explanation = `**Union** $R ∪ S$: All pairs in R or S\n\n$R = ${relationToLatex(R)}$, $S = ${relationToLatex(S)}$\n\n$R ∪ S = ${correctAnswer}$`;
    } else if (op.type === 'intersection') {
      explanation = `**Intersection** $R ∩ S$: Pairs in both R and S\n\n$R = ${relationToLatex(R)}$, $S = ${relationToLatex(S)}$\n\n$R ∩ S = ${correctAnswer}$`;
    } else {
      explanation = `**Composition** $S ∘ R$: $(a,c) ∈ S∘R$ iff $∃b: (a,b) ∈ R ∧ (b,c) ∈ S$\n\n$R = ${relationToLatex(R)}$, $S = ${relationToLatex(S)}$\n\n$S ∘ R = ${correctAnswer}$`;
    }

    return {
      question: `Given relations on $A = \\{1, 2, 3\\}$:\n\n$R = ${relationToLatex(R)}$\n\n${op.binary ? `$S = ${relationToLatex(S)}$\n\n` : ''}Find ${questionPart}.`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation,
    };
  },
};

export const generators = [relationOperationsGenerator] as const;
