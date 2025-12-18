// Types
export type { Pack, GeneratedQuiz, QuizState, Phase, ForestFactoryState } from './types';

// Pack management
export { getPack, listPacks } from './packs';

// Quiz generation
export { generateMockTest } from './generate';

// Generator metadata utilities
import { listGenerators, getGenerator } from '../generators';

export interface GeneratorInfo {
  type: string;
  displayName: string;
  category: string;
}

/** Infer category from generator type prefix */
export function getCategory(type: string): string {
  if (type.startsWith('binary-') || type.startsWith('float-')) {
    return 'Binary Arithmetic';
  }
  if (type.startsWith('law-')) {
    return 'Law & GDPR';
  }
  return 'Other';
}

/** Get info for a single generator */
export function getGeneratorInfo(type: string): GeneratorInfo | undefined {
  try {
    const gen = getGenerator(type);
    return {
      type: gen.type,
      displayName: gen.displayName,
      category: getCategory(gen.type),
    };
  } catch {
    return undefined;
  }
}

/** List all generators grouped by category */
export function listGeneratorsByCategory(): Map<string, GeneratorInfo[]> {
  const result = new Map<string, GeneratorInfo[]>();
  
  for (const type of listGenerators()) {
    const info = getGeneratorInfo(type);
    if (info) {
      const list = result.get(info.category) ?? [];
      list.push(info);
      result.set(info.category, list);
    }
  }
  
  return result;
}

/** Get all generator info as a flat array */
export function listAllGenerators(): GeneratorInfo[] {
  return listGenerators()
    .map(getGeneratorInfo)
    .filter((info): info is GeneratorInfo => info !== undefined);
}
