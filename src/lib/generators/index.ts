import type { ProblemGenerator } from './types';

export type { Problem, ProblemGenerator } from './types';
export { mulberry32, shuffleWithSeed, randInt, hashCode } from './prng';

// Auto-discover all generator modules (exclude index, types, prng)
const modules = import.meta.glob<{ generators: readonly ProblemGenerator[] }>(
  ['./*.ts', '!./index.ts', '!./types.ts', '!./prng.ts', '!./relation-utils.ts'],
  { eager: true },
);

// Build registry from discovered modules
const registry = new Map<string, ProblemGenerator>();

for (const mod of Object.values(modules)) {
  if (!mod.generators) continue;
  for (const gen of mod.generators) {
    registry.set(gen.type, gen);
  }
}

export function getGenerator(type: string): ProblemGenerator {
  const gen = registry.get(type);
  if (!gen) throw new Error(`Unknown generator: ${type}`);
  return gen;
}

export function listGenerators(): string[] {
  return [...registry.keys()];
}
