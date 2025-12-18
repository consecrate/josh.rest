import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';

/**
 * Compute a mod n, handling negative numbers correctly
 */
function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}

/**
 * Generate plausible wrong answers for modular arithmetic
 */
function generateModWrongs(correct: number, n: number, rng: () => number): number[] {
  const wrongs = new Set<number>();
  const attempts = [
    () => (correct + 1) % n,
    () => (correct - 1 + n) % n,
    () => (correct + Math.floor(n / 2)) % n,
    () => n - correct,
    () => randInt(rng, 0, n - 1),
  ];

  let tries = 0;
  while (wrongs.size < 3 && tries < 50) {
    const val = attempts[Math.floor(rng() * attempts.length)]();
    if (val !== correct && val >= 0 && val < n) {
      wrongs.add(val);
    }
    tries++;
  }

  while (wrongs.size < 3) {
    const fallback = randInt(rng, 0, n - 1);
    if (fallback !== correct) wrongs.add(fallback);
  }

  return [...wrongs];
}

// Generator 1: Basic Mod Operation
const basicModGenerator: ProblemGenerator = {
  type: 'number-theory-mod-basic',
  displayName: 'Basic Modular Arithmetic',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Choose modulus (small primes or composites for variety)
    const moduli = [7, 9, 10, 11, 12, 13];
    const n = moduli[randInt(rng, 0, moduli.length - 1)];
    
    // Generate a positive number
    const a = randInt(rng, n + 1, n * 10);
    const correct = mod(a, n);
    
    const wrongs = generateModWrongs(correct, n, rng);
    const options = shuffleWithSeed([correct, ...wrongs], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `What is $${a} \\pmod{${n}}$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `To find $${a} \\pmod{${n}}$, divide ${a} by ${n}:\n\n$$${a} = ${n} \\times ${Math.floor(a / n)} + ${correct}$$\n\nThe remainder is **${correct}**.`,
    };
  },
};

// Generator 2: Negative Mod
const negativeModGenerator: ProblemGenerator = {
  type: 'number-theory-mod-negative',
  displayName: 'Negative Numbers in Mod',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const moduli = [7, 9, 10, 11, 12];
    const n = moduli[randInt(rng, 0, moduli.length - 1)];
    
    // Generate a small negative number
    const a = -randInt(rng, 1, n + 5);
    const correct = mod(a, n);
    
    // Common mistake: just taking absolute value, or forgetting to add n
    const wrongs = new Set<number>();
    wrongs.add(mod(-a, n)); // Common mistake: using |a|
    wrongs.add(mod(a + n, n) === correct ? mod(a - 1, n) : mod(a + n, n)); // Off by one
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 0, n - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    const positiveEquiv = correct;
    const stepsToAdd = Math.ceil(-a / n);

    return {
      question: `What is $${a} \\pmod{${n}}$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `For negative numbers, we need a positive remainder.\n\n**Method:** Add multiples of ${n} until positive.\n\n$$${a} + ${stepsToAdd} \\times ${n} = ${a + stepsToAdd * n}$$\n\nSince $${a} \\equiv ${positiveEquiv} \\pmod{${n}}$, the answer is **${correct}**.`,
    };
  },
};

// Generator 3: Modular Multiplication (reduce first, then multiply)
const modMultiplyGenerator: ProblemGenerator = {
  type: 'number-theory-mod-multiply',
  displayName: 'Modular Multiplication',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const moduli = [7, 9, 11, 12, 13];
    const n = moduli[randInt(rng, 0, moduli.length - 1)];
    
    // Generate two numbers that benefit from reduction
    const a = randInt(rng, n + 1, n * 3);
    const b = randInt(rng, n + 1, n * 3);
    
    const aReduced = mod(a, n);
    const bReduced = mod(b, n);
    const product = aReduced * bReduced;
    const correct = mod(product, n);
    
    // Common mistakes
    const wrongs = new Set<number>();
    wrongs.add(mod(a * b, n) === correct ? mod(correct + 1, n) : mod(a + b, n)); // Adding instead
    wrongs.add(mod(aReduced * bReduced + 1, n)); // Off by one
    wrongs.add(mod(a * bReduced, n)); // Only reducing one
    
    while (wrongs.size < 3) {
      const w = randInt(rng, 0, n - 1);
      if (w !== correct) wrongs.add(w);
    }
    
    const options = shuffleWithSeed([correct, ...[...wrongs].slice(0, 3)], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `What is $${a} \\cdot ${b} \\pmod{${n}}$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**Key insight:** Reduce each factor first, then multiply!\n\n$$${a} \\equiv ${aReduced} \\pmod{${n}}$$\n$$${b} \\equiv ${bReduced} \\pmod{${n}}$$\n\nNow multiply:\n$$${aReduced} \\times ${bReduced} = ${product}$$\n\nFinally reduce:\n$$${product} \\equiv ${correct} \\pmod{${n}}$$\n\n**Answer: ${correct}**`,
    };
  },
};

// Generator 4: Modular Addition
const modAddGenerator: ProblemGenerator = {
  type: 'number-theory-mod-add',
  displayName: 'Modular Addition',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const moduli = [9, 10, 11, 12];
    const n = moduli[randInt(rng, 0, moduli.length - 1)];
    
    const a = randInt(rng, n, n * 3);
    const b = randInt(rng, n, n * 3);
    
    const aReduced = mod(a, n);
    const bReduced = mod(b, n);
    const sum = aReduced + bReduced;
    const correct = mod(sum, n);
    
    const wrongs = generateModWrongs(correct, n, rng);
    const options = shuffleWithSeed([correct, ...wrongs], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `What is $${a} + ${b} \\pmod{${n}}$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `Reduce each term first:\n\n$$${a} \\equiv ${aReduced} \\pmod{${n}}$$\n$$${b} \\equiv ${bReduced} \\pmod{${n}}$$\n\nAdd: $${aReduced} + ${bReduced} = ${sum}$\n\n${sum >= n ? `Reduce: $${sum} \\equiv ${correct} \\pmod{${n}}$` : ''}\n\n**Answer: ${correct}**`,
    };
  },
};

// Generator 5: Last Digit (mod 10 application)
const lastDigitGenerator: ProblemGenerator = {
  type: 'number-theory-last-digit',
  displayName: 'Last Digit Problems',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Generate 3-4 numbers for a sum
    const count = randInt(rng, 3, 4);
    const numbers: number[] = [];
    let digitSum = 0;
    
    for (let i = 0; i < count; i++) {
      const num = randInt(rng, 100, 9999);
      numbers.push(num);
      digitSum += num % 10;
    }
    
    const correct = mod(digitSum, 10);
    const wrongs = generateModWrongs(correct, 10, rng);
    const options = shuffleWithSeed([correct, ...wrongs], rng);
    const correctIndex = options.indexOf(correct);

    const sumStr = numbers.join(' + ');
    const lastDigits = numbers.map((n) => n % 10);
    const lastDigitSum = lastDigits.reduce((a, b) => a + b, 0);

    return {
      question: `What is the last digit of $${sumStr}$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**Key insight:** The last digit of a sum depends only on the last digits of each term!\n\nLast digits: ${lastDigits.join(' + ')} = ${lastDigitSum}\n\n${lastDigitSum >= 10 ? `Last digit of ${lastDigitSum} is **${correct}**` : `**Answer: ${correct}**`}`,
    };
  },
};

// Generator 6: Power Cycles (without FLT - just pattern recognition)
const powerCycleGenerator: ProblemGenerator = {
  type: 'number-theory-power-cycle',
  displayName: 'Power Cycles in Mod',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Choose base and modulus that give nice cycles
    const configs = [
      { base: 2, mod: 7, cycle: [2, 4, 1] }, // 2^1=2, 2^2=4, 2^3=1
      { base: 3, mod: 7, cycle: [3, 2, 6, 4, 5, 1] },
      { base: 2, mod: 9, cycle: [2, 4, 8, 7, 5, 1] },
      { base: 5, mod: 7, cycle: [5, 4, 6, 2, 3, 1] },
      { base: 3, mod: 10, cycle: [3, 9, 7, 1] },
      { base: 7, mod: 10, cycle: [7, 9, 3, 1] },
    ];
    
    const config = configs[randInt(rng, 0, configs.length - 1)];
    const { base, mod: n, cycle } = config;
    const cycleLen = cycle.length;
    
    // Generate a moderate exponent
    const exp = randInt(rng, cycleLen + 1, cycleLen * 5);
    const posInCycle = mod(exp - 1, cycleLen); // exp=1 -> pos=0
    const correct = cycle[posInCycle];
    
    const wrongs = generateModWrongs(correct, n, rng);
    const options = shuffleWithSeed([correct, ...wrongs], rng);
    const correctIndex = options.indexOf(correct);

    const cycleStr = cycle.map((v, i) => `$${base}^{${i + 1}} \\equiv ${v}$`).join(', ');

    return {
      question: `What is $${base}^{${exp}} \\pmod{${n}}$?`,
      options: options.map((o) => `$${o}$`),
      correctIndex,
      explanation: `**Find the cycle:** Compute successive powers of ${base} mod ${n}:\n\n${cycleStr}\n\nThe pattern repeats with **period ${cycleLen}**.\n\nSince $${exp} = ${cycleLen} \\times ${Math.floor((exp - 1) / cycleLen)} + ${((exp - 1) % cycleLen) + 1}$,\n\n$${base}^{${exp}} \\equiv ${base}^{${((exp - 1) % cycleLen) + 1}} \\equiv ${correct} \\pmod{${n}}$`,
    };
  },
};

export const generators = [
  basicModGenerator,
  negativeModGenerator,
  modMultiplyGenerator,
  modAddGenerator,
  lastDigitGenerator,
  powerCycleGenerator,
] as const;
