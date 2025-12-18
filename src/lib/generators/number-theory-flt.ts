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
 * Compute a^exp mod n using fast exponentiation
 */
function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

/**
 * Compute positive mod
 */
function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}

// Generator 1: Apply Fermat's Little Theorem (Reduce Exponent)
const fltBasicGenerator: ProblemGenerator = {
  type: 'number-theory-flt-basic',
  displayName: "Fermat's Little Theorem",

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const primes = [5, 7, 11, 13];
    const p = primes[randInt(rng, 0, primes.length - 1)];
    
    // Base not divisible by p
    let base: number;
    do {
      base = randInt(rng, 2, 10);
    } while (base % p === 0);
    
    // Large exponent to make FLT useful
    const expMultiple = randInt(rng, 10, 50);
    const expRemainder = randInt(rng, 0, p - 2);
    const exp = expMultiple * (p - 1) + expRemainder;
    
    const correct = modPow(base, exp, p);
    
    // Wrong answers
    const wrongs = new Set<number>();
    wrongs.add(mod(base, p)); // Forgetting to apply power
    wrongs.add(modPow(base, expRemainder + 1, p)); // Off by one in reduced exp
    wrongs.add(1); // Thinking everything reduces to 1
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 1, p - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    const reducedExp = expRemainder === 0 ? p - 1 : expRemainder;

    return {
      question: `Use Fermat's Little Theorem to compute $${base}^{${exp}} \\pmod{${p}}$.`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**Fermat's Little Theorem:** If $p$ is prime and $\\gcd(a, p) = 1$, then $a^{p-1} \\equiv 1 \\pmod{p}$.\n\nSince ${p} is prime and $\\gcd(${base}, ${p}) = 1$:\n$$${base}^{${p - 1}} \\equiv 1 \\pmod{${p}}$$\n\n**Reduce the exponent:**\n$${exp} = ${p - 1} \\times ${Math.floor(exp / (p - 1))} + ${exp % (p - 1)}$\n\nSo:\n$$${base}^{${exp}} = (${base}^{${p - 1}})^{${Math.floor(exp / (p - 1))}} \\cdot ${base}^{${exp % (p - 1)}} \\equiv 1 \\cdot ${base}^{${exp % (p - 1)}} \\pmod{${p}}$$\n\nCompute: $${base}^{${exp % (p - 1)}} \\equiv ${correct} \\pmod{${p}}$\n\n**Answer: ${correct}**`,
    };
  },
};

// Generator 2: When Does FLT Apply?
const fltApplicabilityGenerator: ProblemGenerator = {
  type: 'number-theory-flt-applies',
  displayName: 'Does FLT Apply?',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Mix of primes and composites
    const numbers = [
      { n: 7, isPrime: true },
      { n: 11, isPrime: true },
      { n: 13, isPrime: true },
      { n: 9, isPrime: false },
      { n: 12, isPrime: false },
      { n: 15, isPrime: false },
    ];
    
    const { n, isPrime } = numbers[randInt(rng, 0, numbers.length - 1)];
    
    // Pick a base
    const wantCoprime = rng() < 0.7;
    let base: number;
    
    if (wantCoprime) {
      do {
        base = randInt(rng, 2, n - 1);
      } while (gcd(base, n) !== 1);
    } else {
      // Pick a non-coprime base
      if (n === 9) base = 3;
      else if (n === 12) base = rng() < 0.5 ? 2 : 6;
      else if (n === 15) base = rng() < 0.5 ? 3 : 5;
      else base = randInt(rng, 2, n - 1);
    }
    
    const applies = isPrime && gcd(base, n) === 1;
    
    const correctAnswer = applies 
      ? `Yes, because ${n} is prime and $\\gcd(${base}, ${n}) = 1$`
      : !isPrime 
        ? `No, because ${n} is not prime`
        : `No, because $\\gcd(${base}, ${n}) \\neq 1$`;
    
    const options = shuffleWithSeed([
      `Yes, because ${n} is prime and $\\gcd(${base}, ${n}) = 1$`,
      `No, because ${n} is not prime`,
      `No, because $\\gcd(${base}, ${n}) \\neq 1$`,
      `Yes, FLT always applies`,
    ], rng);
    
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Can we apply Fermat's Little Theorem to compute $${base}^{100} \\pmod{${n}}$?`,
      options,
      correctIndex,
      explanation: `**FLT requires two conditions:**\n1. $n$ must be **prime**\n2. $\\gcd(a, n) = 1$ (base coprime to modulus)\n\nCheck:\n- Is ${n} prime? ${isPrime ? 'Yes ✓' : 'No ✗'}\n- $\\gcd(${base}, ${n}) = ${gcd(base, n)}$ ${gcd(base, n) === 1 ? '✓' : '✗'}\n\n${applies ? `Both conditions met! FLT says $${base}^{${n - 1}} \\equiv 1 \\pmod{${n}}$` : `Cannot apply FLT directly. ${!isPrime ? `Use Euler's theorem for composite moduli, or find the cycle length.` : `The base shares a factor with the modulus.`}`}`,
    };
  },
};

// Generator 3: Find the Cycle Length
const cycleLengthGenerator: ProblemGenerator = {
  type: 'number-theory-cycle-length',
  displayName: 'Find Cycle Length',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const primes = [5, 7, 11, 13];
    const p = primes[randInt(rng, 0, primes.length - 1)];
    
    let base: number;
    do {
      base = randInt(rng, 2, p - 1);
    } while (base % p === 0);
    
    // Find actual cycle length (order of base mod p)
    let cycleLen = 1;
    let power = base % p;
    while (power !== 1 && cycleLen <= p) {
      power = (power * base) % p;
      cycleLen++;
    }
    
    const correct = cycleLen;
    
    const wrongs = new Set<number>();
    wrongs.add(p - 1); // FLT gives upper bound, not always exact
    wrongs.add(p);
    wrongs.add(cycleLen + 1);
    if (cycleLen > 1) wrongs.add(cycleLen - 1);
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 1, p);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    // Generate the cycle
    const cycle: number[] = [];
    power = base;
    for (let i = 0; i < cycleLen; i++) {
      cycle.push(power);
      power = (power * base) % p;
    }

    return {
      question: `What is the period (cycle length) of powers of $${base}$ modulo $${p}$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `Compute powers of ${base} mod ${p}:\n\n${cycle.map((v, i) => `$${base}^{${i + 1}} \\equiv ${v} \\pmod{${p}}$`).join(', ')}\n\nThe pattern returns to 1 after **${cycleLen}** steps.\n\n**Note:** FLT guarantees cycle length divides $p - 1 = ${p - 1}$, but the actual cycle may be shorter.`,
    };
  },
};

// Generator 4: Large Exponent with FLT (Step by Step)
const fltStepByStepGenerator: ProblemGenerator = {
  type: 'number-theory-flt-steps',
  displayName: 'FLT Step by Step',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const primes = [7, 11, 13];
    const p = primes[randInt(rng, 0, primes.length - 1)];
    
    let base: number;
    do {
      base = randInt(rng, 2, 6);
    } while (base % p === 0);
    
    // Nice large exponent
    const exp = randInt(rng, 100, 500);
    
    const correct = modPow(base, exp, p);
    
    const wrongs = new Set<number>();
    wrongs.add(modPow(base, exp % p, p)); // Wrong reduction
    wrongs.add(modPow(base, exp % (p + 1), p)); // Another wrong
    wrongs.add(1);
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 1, p - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    const reducedExp = exp % (p - 1);
    const quotient = Math.floor(exp / (p - 1));

    return {
      question: `Compute $${base}^{${exp}} \\pmod{${p}}$ using Fermat's Little Theorem.`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**Step 1:** Apply FLT. Since ${p} is prime and $\\gcd(${base}, ${p}) = 1$:\n$$${base}^{${p - 1}} \\equiv 1 \\pmod{${p}}$$\n\n**Step 2:** Reduce the exponent mod $${p - 1}$:\n$$${exp} = ${p - 1} \\times ${quotient} + ${reducedExp}$$\n\n**Step 3:** Simplify:\n$$${base}^{${exp}} = (${base}^{${p - 1}})^{${quotient}} \\cdot ${base}^{${reducedExp}} \\equiv 1^{${quotient}} \\cdot ${base}^{${reducedExp}} \\pmod{${p}}$$\n\n**Step 4:** Compute $${base}^{${reducedExp}} \\pmod{${p}}$:\n${reducedExp <= 4 
        ? `$${base}^{${reducedExp}} = ${Math.pow(base, reducedExp)} \\equiv ${modPow(base, reducedExp, p)} \\pmod{${p}}$`
        : `Using repeated squaring or direct calculation: $${base}^{${reducedExp}} \\equiv ${correct} \\pmod{${p}}$`
      }\n\n**Answer: ${correct}**`,
    };
  },
};

// Generator 5: FLT for Finding Inverses
const fltInverseGenerator: ProblemGenerator = {
  type: 'number-theory-flt-inverse',
  displayName: 'FLT for Inverses',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const primes = [5, 7, 11, 13];
    const p = primes[randInt(rng, 0, primes.length - 1)];
    
    const a = randInt(rng, 2, p - 1);
    
    // By FLT: a^{p-1} ≡ 1, so a * a^{p-2} ≡ 1, meaning a^{-1} ≡ a^{p-2}
    const correct = modPow(a, p - 2, p);
    
    const wrongs = new Set<number>();
    wrongs.add(modPow(a, p - 1, p)); // a^{p-1} = 1, not the inverse
    wrongs.add(p - a); // Additive inverse
    wrongs.add(modPow(a, p, p)); // Wrong exponent
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 1, p - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `Use FLT to find $${a}^{-1} \\pmod{${p}}$.`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**FLT gives us inverses!**\n\nFrom $a^{p-1} \\equiv 1 \\pmod{p}$, we get:\n$$a \\cdot a^{p-2} \\equiv 1 \\pmod{p}$$\n\nSo $a^{-1} \\equiv a^{p-2} \\pmod{p}$.\n\nHere: $${a}^{-1} \\equiv ${a}^{${p - 2}} \\pmod{${p}}$\n\nCompute: $${a}^{${p - 2}} \\equiv ${correct} \\pmod{${p}}$\n\n**Verify:** $${a} \\times ${correct} = ${a * correct} \\equiv ${(a * correct) % p} \\pmod{${p}}$ ✓\n\n**Answer: ${correct}**`,
    };
  },
};

// Generator 6: Euler's Theorem (Generalization)
const eulerTheoremGenerator: ProblemGenerator = {
  type: 'number-theory-euler-theorem',
  displayName: "Euler's Theorem",

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Composite moduli with small phi values
    const configs = [
      { n: 10, phi: 4 }, // phi(10) = phi(2)*phi(5) = 1*4 = 4
      { n: 9, phi: 6 },  // phi(9) = 9(1-1/3) = 6
      { n: 12, phi: 4 }, // phi(12) = 12(1-1/2)(1-1/3) = 4
      { n: 15, phi: 8 }, // phi(15) = 15(1-1/3)(1-1/5) = 8
    ];
    
    const { n, phi } = configs[randInt(rng, 0, configs.length - 1)];
    
    // Pick coprime base
    let base: number;
    do {
      base = randInt(rng, 2, n - 1);
    } while (gcd(base, n) !== 1);
    
    // Generate exponent
    const mult = randInt(rng, 3, 10);
    const rem = randInt(rng, 0, phi - 1);
    const exp = mult * phi + rem;
    
    const correct = modPow(base, exp, n);
    
    const wrongs = new Set<number>();
    wrongs.add(modPow(base, rem + 1, n));
    wrongs.add(1);
    wrongs.add(modPow(base, exp % (n - 1), n)); // Wrong: using n-1 instead of phi(n)
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 0, n - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `Using Euler's theorem ($a^{\\phi(n)} \\equiv 1$), compute $${base}^{${exp}} \\pmod{${n}}$.\n\n*Given: $\\phi(${n}) = ${phi}$*`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**Euler's Theorem:** If $\\gcd(a, n) = 1$, then $a^{\\phi(n)} \\equiv 1 \\pmod{n}$.\n\nSince $\\gcd(${base}, ${n}) = 1$ and $\\phi(${n}) = ${phi}$:\n$$${base}^{${phi}} \\equiv 1 \\pmod{${n}}$$\n\n**Reduce exponent mod $\\phi(${n})$:**\n$$${exp} = ${phi} \\times ${mult} + ${rem}$$\n\nSo:\n$$${base}^{${exp}} \\equiv ${base}^{${rem}} \\pmod{${n}}$$\n\nCompute: $${base}^{${rem}} = ${Math.pow(base, rem)} \\equiv ${correct} \\pmod{${n}}$\n\n**Answer: ${correct}**`,
    };
  },
};

export const generators = [
  fltBasicGenerator,
  fltApplicabilityGenerator,
  cycleLengthGenerator,
  fltStepByStepGenerator,
  fltInverseGenerator,
  eulerTheoremGenerator,
] as const;
