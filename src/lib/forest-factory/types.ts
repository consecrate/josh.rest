import type { Problem } from '../generators/types';

export interface Pack {
  readonly id: string;             // URL-safe identifier (e.g., "comp-arch")
  readonly name: string;           // Display name (e.g., "Computer Architecture")
  readonly description: string;    // Short description
  readonly generators: readonly string[];  // Generator type IDs
}

export interface GeneratedQuiz {
  readonly seed: number;
  readonly generators: readonly string[];
  readonly questions: readonly Problem[];
}

export interface QuizState {
  readonly seed: number;
  readonly questions: readonly Problem[];
  readonly answers: readonly (number | null)[];
  readonly currentIndex: number;
  readonly startedAt: number | null;
  readonly submittedAt: number | null;
}

export type Phase = 'config' | 'quiz' | 'results';

export interface ForestFactoryState {
  // Configuration
  selectedPackId: string | null;
  activeGenerators: string[];
  questionCount: number;
  timeLimitMinutes: number | null;
  
  // Quiz state
  quiz: QuizState | null;
  
  // UI state
  phase: Phase;
  showAddGeneratorModal: boolean;
}
