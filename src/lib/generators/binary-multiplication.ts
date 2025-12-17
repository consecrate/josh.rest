import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface BinaryMultProblem extends Problem {
  a: number;
  b: number;
  product: number;
}

/** Convert number to 4-bit binary string */
function toBin4(n: number): string {
  return n.toString(2).padStart(4, '0');
}

/** Convert number to 8-bit binary string (compact, for LaTeX arrays) */
function toBin8(n: number): string {
  return n.toString(2).padStart(8, '0');
}

/** Convert number to 8-bit binary string with space separator (xxxx xxxx) */
function toBin8Spaced(n: number): string {
  const bin = n.toString(2).padStart(8, '0');
  return bin.slice(0, 4) + '\\ ' + bin.slice(4);
}

/**
 * Check if a × b produces no carries when adding partial products.
 * For each column 0-7, at most one partial product should have a 1.
 */
function hasNoCarries(a: number, b: number): boolean {
  for (let col = 0; col < 8; col++) {
    let count = 0;
    for (let i = 0; i < 4; i++) {
      if ((b >> i) & 1) {
        const partial = a << i;
        if ((partial >> col) & 1) count++;
      }
    }
    if (count > 1) return false;
  }
  return true;
}

/** Generate the LaTeX for long multiplication display */
function generateLatex(a: number, b: number): string {
  const aBin = toBin4(a);
  const bBin = toBin4(b);
  const product = a * b;

  const lines: string[] = [];
  for (let i = 0; i < 4; i++) {
    const bitSet = (b >> i) & 1;
    const partial = bitSet ? a : 0;
    const partialBin = partial.toString(2).padStart(4, '0');
    const phantoms = '\\phantom{0}'.repeat(i);
    lines.push(partialBin + phantoms);
  }

  return `\\begin{array}{r}
${aBin} \\\\
\\times \\quad ${bBin} \\\\
\\hline
${lines.join(' \\\\\n')}\\\\
\\hline
${toBin8(product)}
\\end{array}`;
}

/** Generate plausible wrong answers */
function generateWrongAnswers(correct: number, rng: () => number): number[] {
  const wrongs = new Set<number>();
  const attempts = [
    () => correct ^ (1 << Math.floor(rng() * 8)), // flip one bit
    () => correct + (rng() < 0.5 ? 1 : -1),       // off by one
    () => (correct << 1) & 0xff,                  // shifted left
    () => correct >> 1,                           // shifted right
    () => correct ^ 0b11,                         // flip last 2 bits
  ];

  let tries = 0;
  while (wrongs.size < 3 && tries < 50) {
    const gen = attempts[Math.floor(rng() * attempts.length)];
    const val = gen();
    if (val > 0 && val < 256 && val !== correct && !wrongs.has(val)) {
      wrongs.add(val);
    }
    tries++;
  }

  // Fallback if not enough wrongs generated
  while (wrongs.size < 3) {
    const fallback = Math.floor(rng() * 255) + 1;
    if (fallback !== correct) wrongs.add(fallback);
  }

  return [...wrongs];
}

const binaryMultiplicationGenerator: ProblemGenerator<BinaryMultProblem> = {
  type: 'binary-multiplication-no-carry',
  displayName: 'Binary Multiplication (No Carries)',

  generate(seed: number): BinaryMultProblem {
    const rng = mulberry32(seed);
    let a: number, b: number;

    // Rejection sampling to find valid pair
    let attempts = 0;
    const isExample = (x: number, y: number) => (x === 2 && y === 3) || (x === 3 && y === 2);
    do {
      a = Math.floor(rng() * 15) + 1; // 1-15
      b = Math.floor(rng() * 15) + 1; // 1-15
      attempts++;
    } while ((!hasNoCarries(a, b) || isExample(a, b)) && attempts < 200);

    // Fallback to known-good pair
    if (!hasNoCarries(a, b)) {
      a = 2;
      b = 5;
    }

    const product = a * b;
    const wrongs = generateWrongAnswers(product, rng);
    const allOptions = [product, ...wrongs].map(toBin8Spaced);
    const shuffled = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffled.indexOf(toBin8Spaced(product));

    const explanation =
      `$$${generateLatex(a, b)}$$\n\n` +
      `$${a} \\times ${b} = ${product}$, which is $${toBin8Spaced(product)}$ in binary.`;

    return {
      question: `What is $${a} \\times ${b}$ in binary?`,
      options: shuffled.map((opt) => `$${opt}$`),
      correctIndex,
      explanation,
      a,
      b,
      product,
    };
  },
};

export const generators = [binaryMultiplicationGenerator] as const;

// ------- TESTS (run via: node -e "import('./binary-multiplication.js').then(m => m.runTests())") -------

export function runTests() {
  const gen = binaryMultiplicationGenerator;

  // Test 1: Determinism
  const p1 = gen.generate(42);
  const p2 = gen.generate(42);
  console.assert(p1.question === p2.question, 'Same seed should produce same question');
  console.assert(p1.product === p2.product, 'Same seed should produce same product');
  console.log('✓ Determinism test passed');

  // Test 2: Different seeds produce different problems
  const p3 = gen.generate(43);
  console.assert(p1.product !== p3.product || p1.a !== p3.a, 'Different seed should likely differ');
  console.log('✓ Variety test passed');

  // Test 3: hasNoCarries is correctly checked
  for (let i = 0; i < 50; i++) {
    const p = gen.generate(i);
    console.assert(hasNoCarries(p.a, p.b), `Seed ${i}: should have no carries`);
  }
  console.log('✓ No-carries constraint test passed');

  // Test 4: Options are valid
  for (let i = 0; i < 20; i++) {
    const p = gen.generate(i * 7);
    console.assert(p.options.length === 4, 'Should have 4 options');
    console.assert(p.correctIndex >= 0 && p.correctIndex < 4, 'Correct index in range');
  }
  console.log('✓ Options validity test passed');

  // Test 5: LaTeX is in explanation
  console.assert(p1.explanation.includes('\\begin{array}'), 'Should have LaTeX in explanation');
  console.log('✓ LaTeX generation test passed');

  console.log('\nAll tests passed!');
}
