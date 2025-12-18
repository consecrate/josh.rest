import type { Problem } from '../generators/types';
import type { GeneratedQuiz } from './types';
import { getGenerator } from '../generators';
import { mulberry32 } from '../generators/prng';

/**
 * Generate a mock test with deterministic randomness.
 * 
 * @param generatorTypes - Array of generator type IDs to use
 * @param seed - Seed for deterministic RNG (same seed = same quiz)
 * @param count - Number of questions to generate
 */
export function generateMockTest(
  generatorTypes: readonly string[],
  seed: number,
  count: number
): GeneratedQuiz {
  if (generatorTypes.length === 0) {
    return { seed, generators: [], questions: [] };
  }

  const rng = mulberry32(seed);
  const questions: Problem[] = [];

  for (let i = 0; i < count; i++) {
    // Pick random generator from list
    const typeIndex = Math.floor(rng() * generatorTypes.length);
    const type = generatorTypes[typeIndex];
    
    try {
      const generator = getGenerator(type);
      // Derive question seed from quiz seed and question index
      const questionSeed = (seed * 31 + i * 7919) >>> 0;
      const problem = generator.generate(questionSeed);
      questions.push(problem);
    } catch {
      // Skip invalid generator types
      console.warn(`Unknown generator type: ${type}`);
      i--; // Try again with a different generator
    }
  }

  return {
    seed,
    generators: [...generatorTypes],
    questions,
  };
}
