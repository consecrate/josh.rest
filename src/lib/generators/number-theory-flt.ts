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


    return {
      question: `Use Fermat's Little Theorem to compute ${tex(`${base}^{${exp}} \\pmod{${p}}`)}.`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**Fermat's Little Theorem:** If ${tex('p')} is prime and ${tex('\\gcd(a, p) = 1')}, then ${tex('a^{p-1} \\equiv 1 \\pmod{p}')}.<br><br>Since ${p} is prime and ${tex(`\\gcd(${base}, ${p}) = 1`)}:<br>${displayTex(`${base}^{${p - 1}} \\equiv 1 \\pmod{${p}}`)}<br><br>**Reduce the exponent:**<br>${tex(`${exp} = ${p - 1} \\times ${Math.floor(exp / (p - 1))} + ${exp % (p - 1)}`)}<br><br>So:<br>${displayTex(`${base}^{${exp}} = (${base}^{${p - 1}})^{${Math.floor(exp / (p - 1))}} \\cdot ${base}^{${exp % (p - 1)}} \\equiv 1 \\cdot ${base}^{${exp % (p - 1)}} \\pmod{${p}}`)}<br><br>Compute: ${tex(`${base}^{${exp % (p - 1)}} \\equiv ${correct} \\pmod{${p}}`)}<br><br>**Answer: ${correct}**`,
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
      ? `Yes, because ${n} is prime and ${tex(`\\gcd(${base}, ${n}) = 1`)}`
      : !isPrime 
        ? `No, because ${n} is not prime`
        : `No, because ${tex(`\\gcd(${base}, ${n}) \\neq 1`)}`;
    
    const options = shuffleWithSeed([
      `Yes, because ${n} is prime and ${tex(`\\gcd(${base}, ${n}) = 1`)}`,
      `No, because ${n} is not prime`,
      `No, because ${tex(`\\gcd(${base}, ${n}) \\neq 1`)}`,
      `Yes, FLT always applies`,
    ], rng);
    
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Can we apply Fermat's Little Theorem to compute ${tex(`${base}^{100} \\pmod{${n}}`)}?`,
      options,
      correctIndex,
      explanation: `**FLT requires two conditions:**<br>1. ${tex('n')} must be **prime**<br>2. ${tex('\\gcd(a, n) = 1')} (base coprime to modulus)<br><br>Check:<br>- Is ${n} prime? ${isPrime ? 'Yes ✓' : 'No ✗'}<br>- ${tex(`\\gcd(${base}, ${n}) = ${gcd(base, n)}`)} ${gcd(base, n) === 1 ? '✓' : '✗'}<br><br>${applies ? `Both conditions met! FLT says ${tex(`${base}^{${n - 1}} \\equiv 1 \\pmod{${n}}`)}` : `Cannot apply FLT directly. ${!isPrime ? `Use Euler's theorem for composite moduli, or find the cycle length.` : `The base shares a factor with the modulus.`}`}`,
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
      question: `What is the period (cycle length) of powers of ${tex(String(base))} modulo ${tex(String(p))}?`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `Compute powers of ${base} mod ${p}:<br><br>${cycle.map((v, i) => tex(`${base}^{${i + 1}} \\equiv ${v} \\pmod{${p}}`)).join(', ')}<br><br>The pattern returns to 1 after **${cycleLen}** steps.<br><br>**Note:** FLT guarantees cycle length divides ${tex(`p - 1 = ${p - 1}`)}, but the actual cycle may be shorter.`,
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
      question: `Compute ${tex(`${base}^{${exp}} \\pmod{${p}}`)} using Fermat's Little Theorem.`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**Step 1:** Apply FLT. Since ${p} is prime and ${tex(`\\gcd(${base}, ${p}) = 1`)}:<br>${displayTex(`${base}^{${p - 1}} \\equiv 1 \\pmod{${p}}`)}<br><br>**Step 2:** Reduce the exponent mod ${tex(`${p - 1}`)}:<br>${displayTex(`${exp} = ${p - 1} \\times ${quotient} + ${reducedExp}`)}<br><br>**Step 3:** Simplify:<br>${displayTex(`${base}^{${exp}} = (${base}^{${p - 1}})^{${quotient}} \\cdot ${base}^{${reducedExp}} \\equiv 1^{${quotient}} \\cdot ${base}^{${reducedExp}} \\pmod{${p}}`)}<br><br>**Step 4:** Compute ${tex(`${base}^{${reducedExp}} \\pmod{${p}}`)}:<br>${reducedExp <= 4 
        ? tex(`${base}^{${reducedExp}} = ${Math.pow(base, reducedExp)} \\equiv ${modPow(base, reducedExp, p)} \\pmod{${p}}`)
        : `Using repeated squaring or direct calculation: ${tex(`${base}^{${reducedExp}} \\equiv ${correct} \\pmod{${p}}`)}`
      }<br><br>**Answer: ${correct}**`,
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
      question: `Use FLT to find ${tex(`${a}^{-1} \\pmod{${p}}`)}.`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**FLT gives us inverses!**<br><br>From ${tex(`a^{p-1} \\equiv 1 \\pmod{p}`)}, we get:<br>${displayTex(`a \\cdot a^{p-2} \\equiv 1 \\pmod{p}`)}<br><br>So ${tex(`a^{-1} \\equiv a^{p-2} \\pmod{p}`)}.<br><br>Here: ${tex(`${a}^{-1} \\equiv ${a}^{${p - 2}} \\pmod{${p}}`)}<br><br>Compute: ${tex(`${a}^{${p - 2}} \\equiv ${correct} \\pmod{${p}}`)}<br><br>**Verify:** ${tex(`${a} \\times ${correct} = ${a * correct} \\equiv ${(a * correct) % p} \\pmod{${p}}`)} ✓<br><br>**Answer: ${correct}**`,
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
      question: `Using Euler's theorem (${tex(`a^{\\phi(n)} \\equiv 1`)}), compute ${tex(`${base}^{${exp}} \\pmod{${n}}`)}.<br><br>*Given: ${tex(`\\phi(${n}) = ${phi}`)}*`,
      options: options.map((o) => tex(String(o))),
      correctIndex,
      explanation: `**Euler's Theorem:** If ${tex('\\gcd(a, n) = 1')}, then ${tex('a^{\\phi(n)} \\equiv 1 \\pmod{n}')}.<br><br>Since ${tex(`\\gcd(${base}, ${n}) = 1`)} and ${tex(`\\phi(${n}) = ${phi}`)}:<br>${displayTex(`${base}^{${phi}} \\equiv 1 \\pmod{${n}}`)}<br><br>**Reduce exponent mod ${tex(`\\phi(${n})`)}:**<br>${displayTex(`${exp} = ${phi} \\times ${mult} + ${rem}`)}<br><br>So:<br>${displayTex(`${base}^{${exp}} \\equiv ${base}^{${rem}} \\pmod{${n}}`)}<br><br>Compute: ${tex(`${base}^{${rem}} = ${Math.pow(base, rem)} \\equiv ${correct} \\pmod{${n}}`)}<br><br>**Answer: ${correct}**`,
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
