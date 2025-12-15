export interface Problem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ProblemGenerator<P extends Problem = Problem> {
  readonly type: string;
  readonly displayName: string;
  generate(seed: number): P;
}
