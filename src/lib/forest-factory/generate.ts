import type { Problem } from '../generators/types';
import type { GeneratedQuiz } from './types';
import { getGenerator } from '../generators';
import { mulberry32 } from '../generators/prng';

/**
 * Generate a mock test with deterministic randomness and unique questions.
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
  const seenQuestions = new Set<string>();
  
  let attempt = 0;
  const maxAttempts = count * 10; // Prevent infinite loop if not enough unique questions

  while (questions.length < count && attempt < maxAttempts) {
    // Pick random generator from list
    const typeIndex = Math.floor(rng() * generatorTypes.length);
    const type = generatorTypes[typeIndex];
    
    try {
      const generator = getGenerator(type);
      // Derive question seed from quiz seed and attempt index
      const questionSeed = (seed * 31 + attempt * 7919) >>> 0;
      const problem = generator.generate(questionSeed);
      
      // Only add if question text is unique
      if (!seenQuestions.has(problem.question)) {
        seenQuestions.add(problem.question);
        questions.push(problem);
      }
    } catch {
      // Skip invalid generator types
      console.warn(`Unknown generator type: ${type}`);
    }
    
    attempt++;
  }

  return {
    seed,
    generators: [...generatorTypes],
    questions,
  };
}
