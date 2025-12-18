import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { pickRandom, factorial } from './relation-utils';

type FormulaType = 'total' | 'reflexive' | 'symmetric' | 'antisymmetric' | 'cross';

interface Formula {
  type: FormulaType;
  name: string;
  question: (n: number, m?: number) => string;
  compute: (n: number, m?: number) => number;
  formula: (n: number, m?: number) => string;
  explanation: string;
}

const FORMULAS: Formula[] = [
  {
    type: 'total',
    name: 'Total Relations',
    question: (n) => `How many binary relations are there on a set with **${n}** elements?`,
    compute: (n) => Math.pow(2, n * n),
    formula: (n) => `2^{${n}^2} = 2^{${n * n}}`,
    explanation: 'Each of the n² pairs can be in or out of the relation.',
  },
  {
    type: 'reflexive',
    name: 'Reflexive Relations',
    question: (n) => `How many **reflexive** relations are there on a set with **${n}** elements?`,
    compute: (n) => Math.pow(2, n * n - n),
    formula: (n) => `2^{n^2 - n} = 2^{${n * n - n}}`,
    explanation: 'The n diagonal pairs must be in the relation. The remaining n²-n pairs are free.',
  },
  {
    type: 'symmetric',
    name: 'Symmetric Relations',
    question: (n) => `How many **symmetric** relations are there on a set with **${n}** elements?`,
    compute: (n) => Math.pow(2, (n * (n + 1)) / 2),
    formula: (n) => `2^{n(n+1)/2} = 2^{${(n * (n + 1)) / 2}}`,
    explanation: 'Choose freely for diagonal (n choices) and upper triangle (n(n-1)/2 choices). Lower triangle is determined.',
  },
  {
    type: 'cross',
    name: 'Relations from A to B',
    question: (n, m) => `How many relations are there from a set A with **${n}** elements to a set B with **${m}** elements?`,
    compute: (n, m) => Math.pow(2, n * (m ?? n)),
    formula: (n, m) => `2^{|A| \\cdot |B|} = 2^{${n} \\cdot ${m}} = 2^{${n * (m ?? n)}}`,
    explanation: 'Each of the |A|·|B| pairs can independently be in or out.',
  },
];

const relationCountingGenerator: ProblemGenerator = {
  type: 'relation-counting',
  displayName: 'Relation Counting',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const formula = pickRandom(FORMULAS, rng);

    const n = randInt(rng, 2, 4);
    const m = formula.type === 'cross' ? randInt(rng, 2, 4) : undefined;

    const answer = formula.compute(n, m);
    const correctAnswer = `${answer}`;

    // Generate distractors with common mistakes
    const distractors = new Set<string>();
    
    // Wrong formulas
    distractors.add(`${Math.pow(2, n)}`); // 2^n instead of 2^(n²)
    distractors.add(`${n * n}`); // n² instead of 2^(n²)
    distractors.add(`${factorial(n)}`); // n!
    distractors.add(`${Math.pow(2, n * n + 1)}`); // off by one in exponent
    distractors.add(`${Math.pow(2, n * n - 1)}`); // off by one
    distractors.add(`${Math.pow(n, 2)}`); // confused
    
    if (m !== undefined) {
      distractors.add(`${Math.pow(2, n + m)}`); // wrong combination
      distractors.add(`${n * m}`);
    }

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    const questionText = formula.question(n, m);
    const formulaText = formula.formula(n, m);

    return {
      question: questionText,
      options,
      correctIndex,
      explanation: `**Formula:** $${formulaText} = ${answer}$\n\n${formula.explanation}`,
    };
  },
};

const relationCountingFormulaGenerator: ProblemGenerator = {
  type: 'relation-counting-formula',
  displayName: 'Relation Counting Formulas',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const questions = [
      {
        q: 'What is the formula for the number of **reflexive** relations on a set of size n?',
        correct: '$2^{n^2 - n}$',
        distractors: ['$2^{n^2}$', '$2^{n(n+1)/2}$', '$n^2$'],
        explanation: 'Reflexive: all n diagonal pairs must be included, leaving n²-n free choices.',
      },
      {
        q: 'What is the formula for the number of **symmetric** relations on a set of size n?',
        correct: '$2^{n(n+1)/2}$',
        distractors: ['$2^{n^2}$', '$2^{n^2 - n}$', '$2^{n(n-1)/2}$'],
        explanation: 'Symmetric: choose diagonal (n) + upper triangle (n(n-1)/2). Total = n(n+1)/2 free choices.',
      },
      {
        q: 'What is the formula for the **total** number of binary relations on a set of size n?',
        correct: '$2^{n^2}$',
        distractors: ['$2^n$', '$n^2$', '$2^{n(n-1)/2}$'],
        explanation: 'Total: each of n² pairs can be in or out independently.',
      },
      {
        q: 'What is the formula for relations from set A (size m) to set B (size n)?',
        correct: '$2^{mn}$',
        distractors: ['$2^{m+n}$', '$m \\cdot n$', '$2^{m^2 \\cdot n^2}$'],
        explanation: 'Cross product has m·n pairs, each can be in or out.',
      },
    ];

    const item = pickRandom(questions, rng);
    const options = shuffleWithSeed([item.correct, ...item.distractors], rng);
    const correctIndex = options.indexOf(item.correct);

    return {
      question: item.q,
      options,
      correctIndex,
      explanation: item.explanation,
    };
  },
};

export const generators = [relationCountingGenerator, relationCountingFormulaGenerator] as const;
