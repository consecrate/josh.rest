import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { binomial, pickRandom } from './relation-utils';

// Generator 1: Modulo equivalence class representative
const moduloClassGenerator: ProblemGenerator = {
  type: 'equivalence-class-modulo',
  displayName: 'Equivalence Class (Modulo)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const moduli = [3, 4, 5, 6, 7, 8, 12];
    const n = pickRandom(moduli, rng);

    // Generate a number to find its class
    const x = randInt(rng, -20, 50);
    const classRep = ((x % n) + n) % n; // Ensure positive

    const correctAnswer = `${classRep}`;

    // Generate distractors (other possible remainders)
    const distractors: string[] = [];
    for (let i = 0; i < n && distractors.length < 3; i++) {
      if (i !== classRep) {
        distractors.push(`${i}`);
      }
    }

    // Add some wrong answers if not enough
    while (distractors.length < 3) {
      const wrong = randInt(rng, n, n + 5);
      if (!distractors.includes(`${wrong}`)) {
        distractors.push(`${wrong}`);
      }
    }

    const options = shuffleWithSeed([correctAnswer, ...distractors.slice(0, 3)], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `In $\\mathbb{Z}_{${n}}$ (integers modulo ${n}), what equivalence class does $${x}$ belong to?\n\nIn other words, what is $[${x}]$ in $\\mathbb{Z}_{${n}}$?`,
      options: options.map((o) => `$[${o}]$`),
      correctIndex,
      explanation: `To find $[${x}]$ in $\\mathbb{Z}_{${n}}$, compute $${x} \\mod ${n}$.\n\n$${x} = ${Math.floor(x / n)} \\cdot ${n} + ${classRep}$\n\nSo $[${x}] = [${classRep}]$`,
    };
  },
};

// Generator 2: Bit string counting (C(n,k))
const bitStringCountGenerator: ProblemGenerator = {
  type: 'equivalence-class-bitstring',
  displayName: 'Bit String Counting',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const n = randInt(rng, 4, 8); // string length
    const k = randInt(rng, 1, Math.min(n - 1, 5)); // number of 1s

    const answer = binomial(n, k);
    const correctAnswer = `${answer}`;

    // Generate distractors using common mistakes
    const distractors = new Set<string>();
    distractors.add(`${binomial(n, k - 1)}`); // off by one
    distractors.add(`${binomial(n, k + 1)}`); // off by one
    distractors.add(`${Math.pow(2, n)}`); // total bit strings
    distractors.add(`${n * k}`); // simple product
    distractors.add(`${binomial(n - 1, k)}`); // wrong formula
    distractors.add(`${binomial(n + 1, k)}`); // wrong formula

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `How many bit strings of length **${n}** have exactly **${k}** ones?`,
      options,
      correctIndex,
      explanation: `We need to choose which ${k} positions (out of ${n}) will have a 1.\n\nThis is $\\binom{${n}}{${k}} = \\frac{${n}!}{${k}!(${n}-${k})!} = ${answer}$`,
    };
  },
};

// Generator 3: Number of equivalence classes
const countEquivalenceClassesGenerator: ProblemGenerator = {
  type: 'equivalence-class-count',
  displayName: 'Count Equivalence Classes',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const scenarios = [
      {
        description: 'integers modulo $n$',
        param: () => randInt(rng, 3, 12),
        count: (n: number) => n,
        explanation: (n: number) =>
          `$\\mathbb{Z}_${n}$ has exactly ${n} equivalence classes: $[0], [1], \\ldots, [${n - 1}]$`,
      },
      {
        description: 'parity relation on $\\{1, 2, ..., n\\}$',
        param: () => randInt(rng, 6, 20),
        count: () => 2,
        explanation: () => `The parity relation always has exactly 2 classes: even and odd numbers`,
      },
      {
        description: 'bit strings of length $n$ by number of 1s',
        param: () => randInt(rng, 3, 6),
        count: (n: number) => n + 1,
        explanation: (n: number) =>
          `Strings can have 0, 1, 2, ..., or ${n} ones. That's ${n + 1} possible equivalence classes.`,
      },
    ];

    const scenario = pickRandom(scenarios, rng);
    const param = scenario.param();
    const answer = scenario.count(param);
    const correctAnswer = `${answer}`;

    const distractors = new Set<string>();
    distractors.add(`${answer - 1}`);
    distractors.add(`${answer + 1}`);
    distractors.add(`${answer * 2}`);
    distractors.add(`${Math.pow(2, param)}`);
    distractors.add(`${param}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    const desc = scenario.description.replace('$n$', `${param}`);

    return {
      question: `How many equivalence classes are there for the ${desc}?`,
      options,
      correctIndex,
      explanation: scenario.explanation(param),
    };
  },
};

export const generators = [
  moduloClassGenerator,
  bitStringCountGenerator,
  countEquivalenceClassesGenerator,
] as const;
