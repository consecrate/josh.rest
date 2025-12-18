import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { tex } from './katex-utils';

/**
 * Compute GCD using Euclidean algorithm
 */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Compute LCM
 */
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Get Euclidean algorithm steps
 */
function euclideanSteps(a: number, b: number): Array<{ dividend: number; divisor: number; quotient: number; remainder: number }> {
  const steps: Array<{ dividend: number; divisor: number; quotient: number; remainder: number }> = [];
  if (a < b) [a, b] = [b, a];
  
  while (b !== 0) {
    const quotient = Math.floor(a / b);
    const remainder = a % b;
    steps.push({ dividend: a, divisor: b, quotient, remainder });
    a = b;
    b = remainder;
  }
  return steps;
}

/**
 * Generate plausible wrong GCD answers
 */
function generateGcdWrongs(correct: number, a: number, b: number, rng: () => number): number[] {
  const wrongs = new Set<number>();
  
  // Common mistakes
  if (correct > 1) wrongs.add(1); // Thinking they're coprime
  wrongs.add(correct * 2); // Double
  if (correct > 2) wrongs.add(correct - 1); // Off by one
  wrongs.add(Math.min(a, b)); // Thinking smaller number is GCD
  
  // Divisors of both that aren't the GCD
  for (let d = 2; d <= Math.min(a, b, 20); d++) {
    if (a % d === 0 && b % d === 0 && d !== correct) {
      wrongs.add(d);
    }
  }
  
  while (wrongs.size < 3) {
    const w = randInt(rng, 1, Math.min(a, b));
    if (w !== correct) wrongs.add(w);
  }
  
  return [...wrongs].slice(0, 3);
}

// Generator 1: Basic GCD (small numbers)
const basicGcdGenerator: ProblemGenerator = {
  type: 'number-theory-gcd-basic',
  displayName: 'GCD (Small Numbers)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Generate numbers with interesting GCDs
    const gcdValue = randInt(rng, 2, 12);
    const mult1 = randInt(rng, 2, 8);
    const mult2 = randInt(rng, 2, 8);
    
    // Ensure coprime multipliers for clean GCD
    let a = gcdValue * mult1;
    let b = gcdValue * mult2;
    
    // Make sure they're not equal
    if (a === b) b = gcdValue * (mult2 + 1);
    
    const correct = gcd(a, b);
    const wrongs = generateGcdWrongs(correct, a, b, rng);
    const options = shuffleWithSeed([correct, ...wrongs], rng);
    const correctIndex = options.indexOf(correct);

    const steps = euclideanSteps(a, b);
    const stepsStr = steps.map(
      (s) => tex(`${s.dividend} = ${s.divisor} \\times ${s.quotient} + ${s.remainder}`)
    ).join('<br><br>');

    return {
      question: `What is ${tex(`\\gcd(${a}, ${b})`)}?`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**Euclidean Algorithm:**<br><br>${stepsStr}<br><br>When the remainder is 0, the last non-zero remainder is the GCD.<br><br>**${tex(`\\gcd(${a}, ${b}) = ${correct}`)}**`,
    };
  },
};

// Generator 2: GCD with larger numbers (requiring Euclidean algorithm)
const euclideanGcdGenerator: ProblemGenerator = {
  type: 'number-theory-gcd-euclidean',
  displayName: 'GCD (Euclidean Algorithm)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Generate larger numbers
    const a = randInt(rng, 50, 200);
    const b = randInt(rng, 30, 150);
    
    const correct = gcd(a, b);
    const wrongs = generateGcdWrongs(correct, a, b, rng);
    const options = shuffleWithSeed([correct, ...wrongs], rng);
    const correctIndex = options.indexOf(correct);

    const steps = euclideanSteps(a, b);
    const stepsStr = steps.map(
      (s) => tex(`${s.dividend} = ${s.divisor} \\times ${s.quotient} + ${s.remainder}`)
    ).join('<br><br>');

    return {
      question: `Use the Euclidean Algorithm to find ${tex(`\\gcd(${a}, ${b})`)}.`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**Euclidean Algorithm:**<br><br>${stepsStr}<br><br>**${tex(`\\gcd(${a}, ${b}) = ${correct}`)}**`,
    };
  },
};

// Generator 3: Coprime Check
const coprimeCheckGenerator: ProblemGenerator = {
  type: 'number-theory-coprime-check',
  displayName: 'Coprime Check',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Randomly decide if we want coprime or not
    const wantCoprime = rng() < 0.5;
    
    let a: number, b: number;
    
    if (wantCoprime) {
      // Generate coprime pairs
      const coprimePairs = [
        [7, 9], [8, 15], [11, 13], [14, 15], [9, 16],
        [21, 22], [25, 36], [17, 19], [8, 9], [15, 16],
      ];
      const pair = coprimePairs[randInt(rng, 0, coprimePairs.length - 1)];
      [a, b] = pair;
    } else {
      // Generate non-coprime pairs
      const d = randInt(rng, 2, 7);
      a = d * randInt(rng, 2, 8);
      b = d * randInt(rng, 2, 8);
      if (a === b) b = d * (Math.floor(b / d) + 1);
    }
    
    const g = gcd(a, b);
    const areCoprime = g === 1;
    
    const options = shuffleWithSeed(
      ['Yes, they are coprime', 'No, they share a common factor'],
      rng
    );
    const correctAnswer = areCoprime ? 'Yes, they are coprime' : 'No, they share a common factor';
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Are ${tex(String(a))} and ${tex(String(b))} coprime (relatively prime)?`,
      options,
      correctIndex,
      explanation: `Two numbers are **coprime** if their GCD is 1.<br><br>${tex(`\\gcd(${a}, ${b}) = ${g}`)}<br><br>${areCoprime ? `Since the GCD is 1, they **are coprime**.` : `Since the GCD is ${g} ≠ 1, they are **not coprime** (both divisible by ${g}).`}`,
    };
  },
};

// Generator 4: LCM from GCD
const lcmFromGcdGenerator: ProblemGenerator = {
  type: 'number-theory-lcm',
  displayName: 'LCM Calculation',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const a = randInt(rng, 6, 30);
    const b = randInt(rng, 6, 30);
    
    const g = gcd(a, b);
    const correct = lcm(a, b);
    
    // Common wrong answers
    const wrongs = new Set<number>();
    wrongs.add(a * b); // Not using GCD
    wrongs.add(g); // Confusing with GCD
    wrongs.add(correct + g); // Off by GCD
    wrongs.add(Math.max(a, b)); // Thinking max is LCM
    
    while (wrongs.size < 3) {
      const w = randInt(rng, correct - 20, correct + 20);
      if (w > 0 && w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `What is ${tex(`\\text{lcm}(${a}, ${b})`)}?`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**Key Formula:** ${tex(`\\text{lcm}(a, b) = \\frac{a \\times b}{\\gcd(a, b)}`)}<br><br>First find: ${tex(`\\gcd(${a}, ${b}) = ${g}`)}<br><br>Then: ${tex(`\\text{lcm}(${a}, ${b}) = \\frac{${a} \\times ${b}}{${g}} = \\frac{${a * b}}{${g}} = ${correct}`)}`,
    };
  },
};

// Generator 5: GCD with Prime Factorization
const gcdPrimeFactorGenerator: ProblemGenerator = {
  type: 'number-theory-gcd-prime',
  displayName: 'GCD via Prime Factorization',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Generate numbers with known factorizations
    const primes = [2, 3, 5, 7];
    
    // Build two numbers with overlapping prime factors
    const exp1: Record<number, number> = {};
    const exp2: Record<number, number> = {};
    
    for (const p of primes) {
      if (rng() < 0.7) exp1[p] = randInt(rng, 1, 3);
      if (rng() < 0.7) exp2[p] = randInt(rng, 1, 3);
    }
    
    // Ensure at least one common factor
    if (Object.keys(exp1).length === 0) exp1[2] = 2;
    if (Object.keys(exp2).length === 0) exp2[2] = 1;
    
    let a = 1, b = 1, g = 1;
    for (const p of primes) {
      const e1 = exp1[p] || 0;
      const e2 = exp2[p] || 0;
      a *= Math.pow(p, e1);
      b *= Math.pow(p, e2);
      g *= Math.pow(p, Math.min(e1, e2));
    }
    
    // Ensure reasonable size
    if (a > 1000 || b > 1000) {
      a = 60; b = 84; g = 12; // Fallback
    }
    
    const correct = g;
    const wrongs = generateGcdWrongs(correct, a, b, rng);
    const options = shuffleWithSeed([correct, ...wrongs], rng);
    const correctIndex = options.indexOf(correct);

    // Format factorizations
    const formatFactors = (exps: Record<number, number>): string => {
      return primes
        .filter((p) => exps[p])
        .map((p) => (exps[p] === 1 ? `${p}` : `${p}^{${exps[p]}}`))
        .join(' \\cdot ') || '1';
    };

    const gcdFactors = primes.filter((p) => Math.min(exp1[p] || 0, exp2[p] || 0) > 0).map((p) => {
      const minExp = Math.min(exp1[p] || 0, exp2[p] || 0);
      return minExp === 1 ? `${p}` : `${p}^{${minExp}}`;
    }).join(' \\cdot ') || '1';

    return {
      question: `Given ${tex(`${a} = ${formatFactors(exp1)}`)} and ${tex(`${b} = ${formatFactors(exp2)}`)}, what is ${tex(`\\gcd(${a}, ${b})`)}?`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**GCD from prime factorization:** Take the minimum exponent of each prime.<br><br>${tex(`${a} = ${formatFactors(exp1)}`)}<br>${tex(`${b} = ${formatFactors(exp2)}`)}<br><br>For each prime, take ${tex('\\min')} of the exponents:<br><br>${tex(`\\gcd = ${gcdFactors} = ${correct}`)}`,
    };
  },
};

export const generators = [
  basicGcdGenerator,
  euclideanGcdGenerator,
  coprimeCheckGenerator,
  lcmFromGcdGenerator,
  gcdPrimeFactorGenerator,
] as const;
