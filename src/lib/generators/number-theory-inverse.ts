import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';

/**
 * Compute GCD
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
 * Compute modular inverse using Extended Euclidean Algorithm
 * Returns null if inverse doesn't exist
 */
function modInverse(a: number, n: number): number | null {
  if (gcd(a, n) !== 1) return null;
  
  let [oldR, r] = [a, n];
  let [oldS, s] = [1, 0];
  
  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }
  
  return ((oldS % n) + n) % n;
}

/**
 * Get Extended Euclidean Algorithm steps
 */
function extendedEuclideanSteps(a: number, n: number): Array<{
  oldR: number; r: number; oldS: number; s: number; q: number;
}> {
  const steps: Array<{ oldR: number; r: number; oldS: number; s: number; q: number }> = [];
  
  let [oldR, r] = [a, n];
  let [oldS, s] = [1, 0];
  
  steps.push({ oldR, r, oldS, s, q: 0 });
  
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    steps.push({ oldR, r, oldS, s, q });
  }
  
  return steps;
}

/**
 * Compute positive mod
 */
function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}

// Generator 1: Does Inverse Exist?
const inverseExistsGenerator: ProblemGenerator = {
  type: 'number-theory-inverse-exists',
  displayName: 'Does Inverse Exist?',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const moduli = [10, 12, 15, 14, 21];
    const n = moduli[randInt(rng, 0, moduli.length - 1)];
    
    // Randomly decide if we want an invertible element
    const wantInvertible = rng() < 0.5;
    
    let a: number;
    if (wantInvertible) {
      // Find a coprime to n
      do {
        a = randInt(rng, 2, n - 1);
      } while (gcd(a, n) !== 1);
    } else {
      // Find a NOT coprime to n
      const factors = [];
      for (let d = 2; d <= n; d++) {
        if (n % d === 0 && d < n) factors.push(d);
      }
      a = factors[randInt(rng, 0, factors.length - 1)];
    }
    
    const hasInverse = gcd(a, n) === 1;
    const g = gcd(a, n);
    
    const correctAnswer = hasInverse ? 'Yes, inverse exists' : 'No, inverse does not exist';
    const options = shuffleWithSeed(
      ['Yes, inverse exists', 'No, inverse does not exist'],
      rng
    );
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Does $${a}$ have a multiplicative inverse in $\\mathbb{Z}_{${n}}$?`,
      options,
      correctIndex,
      explanation: `**Key theorem:** $a$ has an inverse in $\\mathbb{Z}_n$ if and only if $\\gcd(a, n) = 1$.\n\n$\\gcd(${a}, ${n}) = ${g}$\n\n${hasInverse ? `Since the GCD is 1, **yes**, $${a}$ has an inverse.` : `Since the GCD is ${g} ≠ 1, **no**, $${a}$ does not have an inverse.`}`,
    };
  },
};

// Generator 2: Find Inverse (Small Numbers)
const findInverseSmallGenerator: ProblemGenerator = {
  type: 'number-theory-inverse-small',
  displayName: 'Find Inverse (Small)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Use small prime moduli for clean inverses
    const primeModuli = [7, 11, 13];
    const n = primeModuli[randInt(rng, 0, primeModuli.length - 1)];
    
    const a = randInt(rng, 2, n - 1);
    const correct = modInverse(a, n)!;
    
    // Generate wrong answers
    const wrongs = new Set<number>();
    wrongs.add(a); // Confusing with original
    wrongs.add(n - a); // Additive inverse
    wrongs.add(mod(a + 1, n)); // Off by one
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 1, n - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `What is $${a}^{-1}$ in $\\mathbb{Z}_{${n}}$? (Find $x$ such that $${a} \\cdot x \\equiv 1 \\pmod{${n}}$)`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `We need $${a} \\cdot x \\equiv 1 \\pmod{${n}}$.\n\n**Check:** $${a} \\times ${correct} = ${a * correct}$\n\n$${a * correct} = ${n} \\times ${Math.floor((a * correct) / n)} + ${(a * correct) % n}$\n\nSo $${a} \\times ${correct} \\equiv 1 \\pmod{${n}}$ ✓\n\n**Answer: $${a}^{-1} = ${correct}$**`,
    };
  },
};

// Generator 3: Find Inverse using Extended Euclidean Algorithm
const findInverseEEAGenerator: ProblemGenerator = {
  type: 'number-theory-inverse-eea',
  displayName: 'Find Inverse (EEA)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Use moduli where EEA has a few steps
    const moduli = [17, 19, 23, 29, 31];
    const n = moduli[randInt(rng, 0, moduli.length - 1)];
    
    let a: number;
    do {
      a = randInt(rng, 3, n - 2);
    } while (gcd(a, n) !== 1);
    
    const correct = modInverse(a, n)!;
    
    const wrongs = new Set<number>();
    wrongs.add(n - correct); // Negation
    wrongs.add(mod(correct + 1, n));
    wrongs.add(mod(correct - 1, n));
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 1, n - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    const steps = extendedEuclideanSteps(a, n);
    const rawInverse = steps[steps.length - 1].oldS;

    return {
      question: `Use the Extended Euclidean Algorithm to find $${a}^{-1}$ in $\\mathbb{Z}_{${n}}$.`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**Extended Euclidean Algorithm** finds $x, y$ such that $${a} \\cdot x + ${n} \\cdot y = 1$.\n\nThe coefficient $x$ (mod ${n}) is the inverse.\n\nAfter running EEA: $x = ${rawInverse}$\n\n${rawInverse < 0 ? `Convert to positive: $${rawInverse} + ${n} = ${correct}$` : ''}\n\n**Verify:** $${a} \\times ${correct} = ${a * correct} \\equiv ${(a * correct) % n} \\pmod{${n}}$ ✓\n\n**Answer: $${a}^{-1} = ${correct}$**`,
    };
  },
};

// Generator 4: Modular Division
const modularDivisionGenerator: ProblemGenerator = {
  type: 'number-theory-mod-division',
  displayName: 'Modular Division',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const primeModuli = [7, 11, 13];
    const n = primeModuli[randInt(rng, 0, primeModuli.length - 1)];
    
    // a / b mod n = a * b^{-1} mod n
    const b = randInt(rng, 2, n - 1);
    const a = randInt(rng, 1, n - 1);
    
    const bInv = modInverse(b, n)!;
    const correct = mod(a * bInv, n);
    
    const wrongs = new Set<number>();
    wrongs.add(mod(a + b, n)); // Adding instead
    wrongs.add(mod(a - b, n)); // Subtracting
    wrongs.add(b); // Confusing
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 0, n - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `What is $\\frac{${a}}{${b}}$ in $\\mathbb{Z}_{${n}}$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**Modular division** = multiplication by the inverse.\n\n$$\\frac{${a}}{${b}} = ${a} \\times ${b}^{-1} \\pmod{${n}}$$\n\nFirst find $${b}^{-1}$: Check that $${b} \\times ${bInv} = ${b * bInv} \\equiv 1 \\pmod{${n}}$ ✓\n\nSo $${b}^{-1} = ${bInv}$.\n\nNow compute: $${a} \\times ${bInv} = ${a * bInv} \\equiv ${correct} \\pmod{${n}}$\n\n**Answer: ${correct}**`,
    };
  },
};

// Generator 5: Solve Linear Congruence ax ≡ b (mod n)
const linearCongruenceGenerator: ProblemGenerator = {
  type: 'number-theory-linear-congruence',
  displayName: 'Solve Linear Congruence',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const primeModuli = [7, 11, 13];
    const n = primeModuli[randInt(rng, 0, primeModuli.length - 1)];
    
    const a = randInt(rng, 2, n - 1);
    const b = randInt(rng, 1, n - 1);
    
    // ax ≡ b => x ≡ b * a^{-1}
    const aInv = modInverse(a, n)!;
    const correct = mod(b * aInv, n);
    
    const wrongs = new Set<number>();
    wrongs.add(mod(b - a, n));
    wrongs.add(mod(a - b, n));
    wrongs.add(aInv);
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 0, n - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `Solve $${a}x \\equiv ${b} \\pmod{${n}}$ for $x$.`,
      options: options.map((o) => `$x = ${o}$`),
      correctIndex,
      explanation: `To solve $${a}x \\equiv ${b} \\pmod{${n}}$:\n\n1. Find $${a}^{-1}$: Since $${a} \\times ${aInv} \\equiv 1 \\pmod{${n}}$, we have $${a}^{-1} = ${aInv}$.\n\n2. Multiply both sides by $${a}^{-1}$:\n$$x \\equiv ${b} \\times ${aInv} \\equiv ${b * aInv} \\equiv ${correct} \\pmod{${n}}$$\n\n**Verify:** $${a} \\times ${correct} = ${a * correct} \\equiv ${(a * correct) % n} \\pmod{${n}}$ ${(a * correct) % n === b ? '✓' : ''}\n\n**Answer: $x = ${correct}$**`,
    };
  },
};

// Generator 6: Which Elements are Invertible?
const whichInvertibleGenerator: ProblemGenerator = {
  type: 'number-theory-which-invertible',
  displayName: 'Which Elements are Invertible?',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const compositeModuli = [10, 12, 15, 14, 18];
    const n = compositeModuli[randInt(rng, 0, compositeModuli.length - 1)];
    
    // Find all invertible elements
    const invertible: number[] = [];
    for (let i = 1; i < n; i++) {
      if (gcd(i, n) === 1) invertible.push(i);
    }
    
    // Pick a random subset to ask about
    const sampleSize = Math.min(4, Math.floor(n / 2));
    const sample: number[] = [];
    const used = new Set<number>();
    
    while (sample.length < sampleSize) {
      const x = randInt(rng, 1, n - 1);
      if (!used.has(x)) {
        used.add(x);
        sample.push(x);
      }
    }
    sample.sort((a, b) => a - b);
    
    const correctCount = sample.filter((x) => gcd(x, n) === 1).length;
    
    const options = ['0', '1', '2', '3', '4'].slice(0, Math.min(5, sampleSize + 1));
    const correctIndex = options.indexOf(String(correctCount));

    const analysis = sample.map((x) => {
      const g = gcd(x, n);
      return `$\\gcd(${x}, ${n}) = ${g}$ → ${g === 1 ? '**invertible**' : 'not invertible'}`;
    }).join('\n\n');

    return {
      question: `In $\\mathbb{Z}_{${n}}$, how many of the elements $\\{${sample.join(', ')}\\}$ have multiplicative inverses?`,
      options,
      correctIndex,
      explanation: `An element $a$ is invertible in $\\mathbb{Z}_n$ iff $\\gcd(a, n) = 1$.\n\n${analysis}\n\n**Count: ${correctCount} element(s) are invertible.**`,
    };
  },
};

export const generators = [
  inverseExistsGenerator,
  findInverseSmallGenerator,
  findInverseEEAGenerator,
  modularDivisionGenerator,
  linearCongruenceGenerator,
  whichInvertibleGenerator,
] as const;
