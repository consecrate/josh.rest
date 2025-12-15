import type { ProblemGenerator } from './types';
import { binaryMultiplicationGenerator } from './binary-multiplication';
import { binaryMultiplicationCarryGenerator } from './binary-multiplication-carry';
import { binaryMultiplicationTableGenerator } from './binary-multiplication-table';
import { binaryDivisionQuotientGenerator } from './binary-division';
import { binaryDivisionTableGenerator } from './binary-division-table';

export type { Problem, ProblemGenerator } from './types';
export { mulberry32, shuffleWithSeed, randInt, hashCode } from './prng';

const generators = new Map<string, ProblemGenerator>([
  [binaryMultiplicationGenerator.type, binaryMultiplicationGenerator],
  [binaryMultiplicationCarryGenerator.type, binaryMultiplicationCarryGenerator],
  [binaryMultiplicationTableGenerator.type, binaryMultiplicationTableGenerator],
  [binaryDivisionQuotientGenerator.type, binaryDivisionQuotientGenerator],
  [binaryDivisionTableGenerator.type, binaryDivisionTableGenerator],
]);

export function getGenerator(type: string): ProblemGenerator {
  const gen = generators.get(type);
  if (!gen) throw new Error(`Unknown generator: ${type}`);
  return gen;
}

export function listGenerators(): string[] {
  return [...generators.keys()];
}

export {
  binaryMultiplicationGenerator,
  binaryMultiplicationCarryGenerator,
  binaryMultiplicationTableGenerator,
  binaryDivisionQuotientGenerator,
  binaryDivisionTableGenerator,
};
