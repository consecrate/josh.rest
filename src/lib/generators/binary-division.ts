import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface BinaryDivProblem extends Problem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

/** Convert number to 4-bit binary string */
function toBin4(n: number): string {
  return n.toString(2).padStart(4, '0');
}

/** Generate plausible wrong quotients */
function generateWrongQuotients(correct: number, dividend: number, divisor: number, rng: () => number): number[] {
  const wrongs = new Set<number>();
  const attempts = [
    () => correct + 1,                    // off by one
    () => correct - 1,                    // off by one
    () => correct ^ 1,                    // flip LSB
    () => Math.floor(dividend / (divisor + 1)), // wrong divisor
    () => Math.floor(dividend / (divisor - 1)), // wrong divisor
    () => (correct << 1) & 0xf,           // shifted
    () => correct >> 1,                   // shifted
  ];

  let tries = 0;
  while (wrongs.size < 3 && tries < 50) {
    const gen = attempts[Math.floor(rng() * attempts.length)];
    const val = gen();
    if (val >= 0 && val < 16 && val !== correct && !wrongs.has(val)) {
      wrongs.add(val);
    }
    tries++;
  }

  while (wrongs.size < 3) {
    const fallback = Math.floor(rng() * 15) + 1;
    if (fallback !== correct) wrongs.add(fallback);
  }

  return [...wrongs];
}

const binaryDivisionQuotientGenerator: ProblemGenerator<BinaryDivProblem> = {
  type: 'binary-division-quotient',
  displayName: 'Binary Division (Find Quotient)',

  generate(seed: number): BinaryDivProblem {
    const rng = mulberry32(seed);

    // Generate dividend (4-15) and divisor (2-7) ensuring clean results
    let dividend: number, divisor: number;
    const isExample = (d: number, v: number) => d === 7 && v === 2;

    do {
      dividend = Math.floor(rng() * 12) + 4;  // 4-15
      divisor = Math.floor(rng() * 6) + 2;    // 2-7
    } while (isExample(dividend, divisor) || divisor >= dividend);

    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;

    const wrongs = generateWrongQuotients(quotient, dividend, divisor, rng);
    const allOptions = [quotient, ...wrongs].map(toBin4);
    const shuffled = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffled.indexOf(toBin4(quotient));

    const explanation =
      `$${dividend} \\div ${divisor} = ${quotient}$ with remainder $${remainder}$.\n\n` +
      `In binary: $${toBin4(dividend)} \\div ${toBin4(divisor)} = ${toBin4(quotient)}$ (quotient) with remainder $${toBin4(remainder)}$.`;

    return {
      question: `What is the quotient of $${dividend} \\div ${divisor}$ in binary?`,
      options: shuffled.map((opt) => `$${opt}$`),
      correctIndex,
      explanation,
      dividend,
      divisor,
      quotient,
      remainder,
    };
  },
};

export const generators = [binaryDivisionQuotientGenerator] as const;

// ------- TESTS -------
// Run via: node -e "import('./binary-division.js').then(m => m.runTests())"

export function runTests() {
  const qGen = binaryDivisionQuotientGenerator;

  // Test 1: Determinism
  const p1 = qGen.generate(42);
  const p2 = qGen.generate(42);
  console.assert(p1.question === p2.question, 'Same seed should produce same question');
  console.assert(p1.quotient === p2.quotient, 'Same seed should produce same quotient');
  console.log('✓ Quotient determinism test passed');

  // Test 2: Different seeds
  const p3 = qGen.generate(43);
  console.assert(p1.dividend !== p3.dividend || p1.divisor !== p3.divisor, 'Different seed should likely differ');
  console.log('✓ Variety test passed');

  // Test 3: Quotient correctness
  for (let i = 0; i < 50; i++) {
    const p = qGen.generate(i);
    console.assert(p.quotient === Math.floor(p.dividend / p.divisor), `Seed ${i}: quotient should be correct`);
    console.assert(p.remainder === p.dividend % p.divisor, `Seed ${i}: remainder should be correct`);
  }
  console.log('✓ Quotient correctness test passed');

  // Test 4: Options valid
  for (let i = 0; i < 20; i++) {
    const p = qGen.generate(i * 7);
    console.assert(p.options.length === 4, 'Should have 4 options');
    console.assert(p.correctIndex >= 0 && p.correctIndex < 4, 'Correct index in range');
  }
  console.log('✓ Options validity test passed');

  console.log('\nAll tests passed!');
}
