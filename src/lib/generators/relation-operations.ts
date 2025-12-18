import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import {
  type Relation,
  createMatrix,
  matrixToRelation,
  relationToHtml,
  matrixUnion,
  matrixIntersection,
  matrixTranspose,
  matrixCompose,
  pickRandom,
} from './relation-utils';
import { tex } from './katex-utils';

type OperationType = 'union' | 'intersection' | 'inverse' | 'composition';

interface OperationInfo {
  type: OperationType;
  symbol: string;
  name: string;
  binary: boolean;
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
    const pairCount = 2 + Math.floor(rng() * 2);

    const R = generateRelation(n, rng, pairCount);
    const S = generateRelation(n, rng, pairCount);

    const op = pickRandom(OPERATIONS, rng);
    const result = computeOperation(op.type, R, S, n);
    const correctAnswer = relationToHtml(result);

    // Format question parts using pre-rendered math
    let questionPart: string;
    if (op.type === 'inverse') {
      questionPart = tex('R^{-1}');
    } else if (op.type === 'composition') {
      questionPart = tex('S \\circ R');
    } else {
      questionPart = tex(`R ${op.symbol} S`);
    }

    // Generate distractors (all pre-rendered)
    const distractors: string[] = [];

    for (const otherOp of OPERATIONS) {
      if (otherOp.type !== op.type) {
        const otherResult = computeOperation(otherOp.type, R, S, n);
        distractors.push(relationToHtml(otherResult));
      }
    }

    if (op.type === 'composition') {
      const reversed = matrixToRelation(
        matrixCompose(createMatrix(n, S), createMatrix(n, R))
      );
      distractors.push(relationToHtml(reversed));
    }

    distractors.push(relationToHtml(R));
    distractors.push(relationToHtml(S));

    const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correctAnswer);
    const finalDistractors = shuffleWithSeed(uniqueDistractors, rng).slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...finalDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    // Pre-rendered relations for display
    const RHtml = relationToHtml(R);
    const SHtml = relationToHtml(S);
    const setA = tex('A = \\{1, 2, 3\\}');

    // Build explanation
    let explanation: string;
    if (op.type === 'inverse') {
      explanation = `**Inverse** ${tex('R^{-1}')}: Swap all pairs ${tex('(a,b) \\to (b,a)')}<br><br>R = ${RHtml}<br><br>${tex('R^{-1}')} = ${correctAnswer}`;
    } else if (op.type === 'union') {
      explanation = `**Union** ${tex('R \\cup S')}: All pairs in R or S<br><br>R = ${RHtml}, S = ${SHtml}<br><br>${tex('R \\cup S')} = ${correctAnswer}`;
    } else if (op.type === 'intersection') {
      explanation = `**Intersection** ${tex('R \\cap S')}: Pairs in both R and S<br><br>R = ${RHtml}, S = ${SHtml}<br><br>${tex('R \\cap S')} = ${correctAnswer}`;
    } else {
      explanation = `**Composition** ${tex('S \\circ R')}: ${tex('(a,c) \\in S \\circ R')} iff ${tex('\\exists b: (a,b) \\in R \\land (b,c) \\in S')}<br><br>R = ${RHtml}, S = ${SHtml}<br><br>${tex('S \\circ R')} = ${correctAnswer}`;
    }

    // Build question
    let question = `Given relations on ${setA}:<br><br>R = ${RHtml}`;
    if (op.binary) {
      question += `<br><br>S = ${SHtml}`;
    }
    question += `<br><br>Find ${questionPart}.`;

    return {
      question,
      options,
      correctIndex,
      explanation,
    };
  },
};

export const generators = [relationOperationsGenerator] as const;
