import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { binomial, factorial, permutation, pickRandom } from './relation-utils';

// Generator 1: Bit strings with weight k
const bitStringWeightGenerator: ProblemGenerator = {
  type: 'counting-bitstring-weight',
  displayName: 'Bit String Weight Counting',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const n = randInt(rng, 5, 10); // string length
    const k = randInt(rng, 1, Math.min(n - 1, 5)); // weight

    const answer = binomial(n, k);
    const correctAnswer = `${answer}`;

    const distractors = new Set<string>();
    distractors.add(`${binomial(n, k - 1)}`);
    distractors.add(`${binomial(n, k + 1)}`);
    distractors.add(`${Math.pow(2, n)}`);
    distractors.add(`${n * k}`);
    distractors.add(`${factorial(k)}`);
    distractors.add(`${permutation(n, k)}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `How many bit strings of length **${n}** have exactly **${k}** ones?`,
      options,
      correctIndex,
      explanation: `Choose ${k} positions out of ${n} for the 1s:\n\n$\\binom{${n}}{${k}} = \\frac{${n}!}{${k}!(${n - k})!} = ${answer}$`,
    };
  },
};

// Generator 2: Injective functions count
const injectiveFunctionsGenerator: ProblemGenerator = {
  type: 'counting-injective-functions',
  displayName: 'Injective Functions Count',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const m = randInt(rng, 2, 4); // |A| domain size
    const n = randInt(rng, m, m + 3); // |B| codomain size (must be >= m)

    const answer = permutation(n, m);
    const correctAnswer = `${answer}`;

    const distractors = new Set<string>();
    distractors.add(`${Math.pow(n, m)}`); // all functions
    distractors.add(`${factorial(m)}`);
    distractors.add(`${factorial(n)}`);
    distractors.add(`${binomial(n, m)}`);
    distractors.add(`${n * m}`);
    distractors.add(`${permutation(n, m - 1)}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `How many **injective** (one-to-one) functions are there from a set A with **${m}** elements to a set B with **${n}** elements?`,
      options,
      correctIndex,
      explanation: `For an injective function, each element in A maps to a distinct element in B.\n\nFirst element: ${n} choices\nSecond element: ${n - 1} choices\n...\n\n$P(${n}, ${m}) = \\frac{${n}!}{(${n}-${m})!} = ${answer}$`,
    };
  },
};

// Generator 3: Total functions count
const totalFunctionsGenerator: ProblemGenerator = {
  type: 'counting-total-functions',
  displayName: 'Total Functions Count',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const m = randInt(rng, 2, 4); // |A|
    const n = randInt(rng, 2, 4); // |B|

    const answer = Math.pow(n, m);
    const correctAnswer = `${answer}`;

    const distractors = new Set<string>();
    distractors.add(`${Math.pow(m, n)}`); // swapped
    distractors.add(`${m * n}`);
    distractors.add(`${factorial(m) * factorial(n)}`);
    distractors.add(`${binomial(m + n, m)}`);
    distractors.add(`${permutation(n, Math.min(m, n))}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `How many functions are there from a set A with **${m}** elements to a set B with **${n}** elements?`,
      options,
      correctIndex,
      explanation: `Each of the ${m} elements in A can map to any of the ${n} elements in B.\n\n$${n}^{${m}} = ${answer}$`,
    };
  },
};

// Generator 4: Symmetric relations count
const symmetricRelationsGenerator: ProblemGenerator = {
  type: 'counting-symmetric-relations',
  displayName: 'Symmetric Relations Count',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const n = randInt(rng, 2, 4);
    const exponent = (n * (n + 1)) / 2;
    const answer = Math.pow(2, exponent);
    const correctAnswer = `${answer}`;

    const distractors = new Set<string>();
    distractors.add(`${Math.pow(2, n * n)}`); // total relations
    distractors.add(`${Math.pow(2, n * n - n)}`); // reflexive
    distractors.add(`${Math.pow(2, (n * (n - 1)) / 2)}`); // off by n
    distractors.add(`${Math.pow(2, n)}`);
    distractors.add(`${factorial(n)}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `How many **symmetric** relations are there on a set with **${n}** elements?`,
      options,
      correctIndex,
      explanation: `For symmetric relations:\n- Diagonal entries: ${n} free choices\n- Upper triangle: ${(n * (n - 1)) / 2} free choices\n- Lower triangle: determined by upper\n\n$2^{n(n+1)/2} = 2^{${exponent}} = ${answer}$`,
    };
  },
};

// Generator 5: Binomial coefficient
const binomialCoefficientGenerator: ProblemGenerator = {
  type: 'counting-binomial',
  displayName: 'Binomial Coefficient',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const n = randInt(rng, 4, 10);
    const k = randInt(rng, 1, n - 1);

    const answer = binomial(n, k);
    const correctAnswer = `${answer}`;

    const distractors = new Set<string>();
    distractors.add(`${binomial(n, k - 1)}`);
    distractors.add(`${binomial(n, k + 1)}`);
    distractors.add(`${binomial(n - 1, k)}`);
    distractors.add(`${binomial(n + 1, k)}`);
    distractors.add(`${permutation(n, k)}`);
    distractors.add(`${n * k}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Compute $\\binom{${n}}{${k}}$:`,
      options,
      correctIndex,
      explanation: `$\\binom{${n}}{${k}} = \\frac{${n}!}{${k}!(${n - k})!} = ${answer}$\n\nThis counts the number of ways to choose ${k} items from ${n} items.`,
    };
  },
};

// Generator 6: Permutation
const permutationGenerator: ProblemGenerator = {
  type: 'counting-permutation',
  displayName: 'Permutation P(n,r)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const n = randInt(rng, 4, 8);
    const r = randInt(rng, 2, Math.min(n, 4));

    const answer = permutation(n, r);
    const correctAnswer = `${answer}`;

    const distractors = new Set<string>();
    distractors.add(`${binomial(n, r)}`);
    distractors.add(`${permutation(n, r - 1)}`);
    distractors.add(`${permutation(n, r + 1)}`);
    distractors.add(`${factorial(n)}`);
    distractors.add(`${n * r}`);
    distractors.add(`${Math.pow(n, r)}`);

    const uniqueDistractors = [...distractors]
      .filter((d) => d !== correctAnswer && parseInt(d) > 0)
      .slice(0, 3);

    const options = shuffleWithSeed([correctAnswer, ...uniqueDistractors], rng);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Compute $P(${n}, ${r})$ (the number of ${r}-permutations of ${n} elements):`,
      options,
      correctIndex,
      explanation: `$P(${n}, ${r}) = \\frac{${n}!}{(${n}-${r})!} = ${n} \\times ${n - 1} \\times \\ldots \\times ${n - r + 1} = ${answer}$\n\nThis counts ordered arrangements of ${r} items from ${n} items.`,
    };
  },
};

export const generators = [
  bitStringWeightGenerator,
  injectiveFunctionsGenerator,
  totalFunctionsGenerator,
  symmetricRelationsGenerator,
  binomialCoefficientGenerator,
  permutationGenerator,
] as const;
