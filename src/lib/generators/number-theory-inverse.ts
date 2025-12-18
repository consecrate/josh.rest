import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { tex, displayTex } from './katex-utils';

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
      question: `Does ${tex(String(a))} have a multiplicative inverse in ${tex(`\\mathbb{Z}_{${n}}`)}?`,
      options,
      correctIndex,
      explanation: `**Key theorem:** ${tex('a')} has an inverse in ${tex('\\mathbb{Z}_n')} if and only if ${tex('\\gcd(a, n) = 1')}.<br><br>${tex(`\\gcd(${a}, ${n}) = ${g}`)}<br><br>${hasInverse ? `Since the GCD is 1, **yes**, ${tex(String(a))} has an inverse.` : `Since the GCD is ${g} ≠ 1, **no**, ${tex(String(a))} does not have an inverse.`}`,
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
      question: `What is ${tex(`${a}^{-1}`)} in ${tex(`\\mathbb{Z}_{${n}}`)}? (Find ${tex('x')} such that ${tex(`${a} \\cdot x \\equiv 1 \\pmod{${n}}`)})`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `We need ${tex(`${a} \\cdot x \\equiv 1 \\pmod{${n}}`)}.<br><br>**Check:** ${tex(`${a} \\times ${correct} = ${a * correct}`)}<br><br>${tex(`${a * correct} = ${n} \\times ${Math.floor((a * correct) / n)} + ${(a * correct) % n}`)}<br><br>So ${tex(`${a} \\times ${correct} \\equiv 1 \\pmod{${n}}`)} ✓<br><br>**Answer: ${tex(`${a}^{-1} = ${correct}`)}**`,
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
      question: `Use the Extended Euclidean Algorithm to find ${tex(`${a}^{-1}`)} in ${tex(`\\mathbb{Z}_{${n}}`)}.`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**Extended Euclidean Algorithm** finds ${tex('x, y')} such that ${tex(`${a} \\cdot x + ${n} \\cdot y = 1`)}.<br><br>The coefficient ${tex('x')} (mod ${n}) is the inverse.<br><br>After running EEA: ${tex(`x = ${rawInverse}`)}<br><br>${rawInverse < 0 ? `Convert to positive: ${tex(`${rawInverse} + ${n} = ${correct}`)}` : ''}<br><br>**Verify:** ${tex(`${a} \\times ${correct} = ${a * correct} \\equiv ${(a * correct) % n} \\pmod{${n}}`)} ✓<br><br>**Answer: ${tex(`${a}^{-1} = ${correct}`)}**`,
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
      question: `What is ${tex(`\\frac{${a}}{${b}}`)} in ${tex(`\\mathbb{Z}_{${n}}`)}?`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**Modular division** = multiplication by the inverse.<br><br>${displayTex(`\\frac{${a}}{${b}} = ${a} \\times ${b}^{-1} \\pmod{${n}}`)}<br><br>First find ${tex(`${b}^{-1}`)}: Check that ${tex(`${b} \\times ${bInv} = ${b * bInv} \\equiv 1 \\pmod{${n}}`)} ✓<br><br>So ${tex(`${b}^{-1} = ${bInv}`)}.<br><br>Now compute: ${tex(`${a} \\times ${bInv} = ${a * bInv} \\equiv ${correct} \\pmod{${n}}`)}<br><br>**Answer: ${correct}**`,
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
      question: `Solve ${tex(`${a}x \\equiv ${b} \\pmod{${n}}`)} for ${tex('x')}.`,
      options: options.map((o) => tex(`x = ${o}`)),
      correctIndex,
      explanation: `To solve ${tex(`${a}x \\equiv ${b} \\pmod{${n}}`)}:<br><br>1. Find ${tex(`${a}^{-1}`)}: Since ${tex(`${a} \\times ${aInv} \\equiv 1 \\pmod{${n}}`)}, we have ${tex(`${a}^{-1} = ${aInv}`)}.<br><br>2. Multiply both sides by ${tex(`${a}^{-1}`)}:<br>${displayTex(`x \\equiv ${b} \\times ${aInv} \\equiv ${b * aInv} \\equiv ${correct} \\pmod{${n}}`)}<br><br>**Verify:** ${tex(`${a} \\times ${correct} = ${a * correct} \\equiv ${(a * correct) % n} \\pmod{${n}}`)} ${(a * correct) % n === b ? '✓' : ''}<br><br>**Answer: ${tex(`x = ${correct}`)}**`,
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
      return `${tex(`\\gcd(${x}, ${n}) = ${g}`)} → ${g === 1 ? '**invertible**' : 'not invertible'}`;
    }).join('<br><br>');

    return {
      question: `In ${tex(`\\mathbb{Z}_{${n}}`)}, how many of the elements ${tex(`\\{${sample.join(', ')}\\}`)} have multiplicative inverses?`,
      options,
      correctIndex,
      explanation: `An element ${tex('a')} is invertible in ${tex('\\mathbb{Z}_n')} iff ${tex('\\gcd(a, n) = 1')}.<br><br>${analysis}<br><br>**Count: ${correctCount} element(s) are invertible.**`,
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
