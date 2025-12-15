import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface BinaryMultTableProblem extends Problem {
  a: number;
  b: number;
  product: number;
}

/** Convert number to 4-bit binary string */
function toBin4(n: number): string {
  return n.toString(2).padStart(4, '0');
}

/** Convert number to 8-bit binary string with space separator (xxxx xxxx) */
function toBin8Spaced(n: number): string {
  const bin = n.toString(2).padStart(8, '0');
  return bin.slice(0, 4) + ' ' + bin.slice(4);
}

/** Convert number to 8-bit binary string with LaTeX space (xxxx\ xxxx) */
function toBin8SpacedLatex(n: number): string {
  const bin = n.toString(2).padStart(8, '0');
  return bin.slice(0, 4) + '\\ ' + bin.slice(4);
}

/** Generate the iteration table HTML */
function generateTableHtml(a: number, b: number): string {
  const bits = 4;
  let multiplier = b;
  let multiplicand = a;
  let product = 0;

  const rows: string[] = [];

  // Initial row (iteration 0)
  const multiplierWithCircle = (bin: string, highlight: boolean) => {
    if (!highlight) return bin;
    return bin.slice(0, 3) + `<span class="circled">${bin[3]}</span>`;
  };

  rows.push(`<tr>
  <td>0</td>
  <td class="step">Initial values</td>
  <td>${multiplierWithCircle(toBin4(multiplier), true)}</td>
  <td>${toBin8Spaced(multiplicand)}</td>
  <td>${toBin8Spaced(product)}</td>
</tr>`);

  // Iterations 1 through bits
  for (let iter = 1; iter <= bits; iter++) {
    const lsb = multiplier & 1;
    const prevMultiplicand = multiplicand;

    // Step 1: Check LSB and possibly add
    if (lsb === 1) {
      product = product + multiplicand;
      rows.push(`<tr>
  <td rowspan="3">${iter}</td>
  <td class="step">1a: 1 ⇒ Prod = Prod + Mcand</td>
  <td>${toBin4(multiplier)}</td>
  <td>${toBin8Spaced(prevMultiplicand)}</td>
  <td class="changed">${toBin8Spaced(product)}</td>
</tr>`);
    } else {
      rows.push(`<tr>
  <td rowspan="3">${iter}</td>
  <td class="step">1: 0 ⇒ No operation</td>
  <td>${toBin4(multiplier)}</td>
  <td>${toBin8Spaced(prevMultiplicand)}</td>
  <td>${toBin8Spaced(product)}</td>
</tr>`);
    }

    // Step 2: Shift left multiplicand
    multiplicand = multiplicand << 1;
    rows.push(`<tr>
  <td class="step">2: Shift left Multiplicand</td>
  <td>${toBin4(multiplier)}</td>
  <td class="changed">${toBin8Spaced(multiplicand)}</td>
  <td>${toBin8Spaced(product)}</td>
</tr>`);

    // Step 3: Shift right multiplier
    multiplier = multiplier >> 1;
    const showCircle = iter < bits; // Don't circle on last iteration
    rows.push(`<tr>
  <td class="step">3: Shift right Multiplier</td>
  <td>${showCircle ? multiplierWithCircle(toBin4(multiplier), true) : toBin4(multiplier)}</td>
  <td>${toBin8Spaced(multiplicand)}</td>
  <td>${toBin8Spaced(product)}</td>
</tr>`);
  }

  return `<table class="mult-table">
<thead>
<tr>
  <th>Iteration</th>
  <th>Step</th>
  <th>Multiplier</th>
  <th>Multiplicand</th>
  <th>Product</th>
</tr>
</thead>
<tbody>
${rows.join('\n')}
</tbody>
</table>

<style>
.mult-table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  font-family: monospace;
  font-size: 0.7rem;
  margin: 1.5rem 0;
}
.mult-table th,
.mult-table td {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.mult-table th {
  background: #00a8cc;
  color: white;
  padding: 0.3rem 0.5rem;
  font-weight: 600;
}
.mult-table th:nth-child(2) {
  text-align: left;
}
.mult-table td {
  border: 1px solid #333;
  padding: 0.2rem 0.4rem;
  text-align: center;
}
.mult-table .step {
  text-align: left;
}
.mult-table .changed {
  color: #00a8cc;
}
.mult-table .circled {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  line-height: 1.2em;
  border: 2px solid #00a8cc;
  border-radius: 50%;
  color: #00a8cc;
  text-align: center;
}
</style>`;
}

/** Generate plausible wrong answers for the product */
function generateWrongAnswers(correct: number, rng: () => number): number[] {
  const wrongs = new Set<number>();
  const attempts = [
    () => correct ^ (1 << Math.floor(rng() * 8)), // flip one bit
    () => correct + (rng() < 0.5 ? 1 : -1),       // off by one
    () => (correct << 1) & 0xff,                  // shifted left
    () => correct >> 1,                           // shifted right
    () => correct ^ 0b11,                         // flip last 2 bits
    () => correct ^ (1 << 2),                     // common carry mistake
    () => correct ^ (1 << 4),                     // middle bit flip
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

  while (wrongs.size < 3) {
    const fallback = Math.floor(rng() * 255) + 1;
    if (fallback !== correct) wrongs.add(fallback);
  }

  return [...wrongs];
}

export const binaryMultiplicationTableGenerator: ProblemGenerator<BinaryMultTableProblem> = {
  type: 'binary-multiplication-table',
  displayName: 'Binary Multiplication (Iteration Table)',

  generate(seed: number): BinaryMultTableProblem {
    const rng = mulberry32(seed);

    // Generate two 4-bit numbers (1-15), avoiding trivial cases
    let a: number, b: number;
    const trivialPairs = new Set(['2,3', '3,2', '3,3', '2,5', '5,2']);

    do {
      a = Math.floor(rng() * 14) + 2; // 2-15
      b = Math.floor(rng() * 14) + 2; // 2-15
    } while (trivialPairs.has(`${a},${b}`));

    const product = a * b;
    const wrongs = generateWrongAnswers(product, rng);
    const allOptions = [product, ...wrongs].map(toBin8SpacedLatex);
    const shuffled = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffled.indexOf(toBin8SpacedLatex(product));

    const tableHtml = generateTableHtml(a, b);

    const explanation =
      `Trace through the multiplication algorithm for $${toBin4(a)} \\times ${toBin4(b)}$ ($${a} \\times ${b}$):\n\n` +
      tableHtml +
      `\n\nThe final product is $${toBin8SpacedLatex(product)}$ ($${product}$ in decimal).`;

    return {
      question: `Using the binary multiplication algorithm, calculate $${toBin4(a)} \\times ${toBin4(b)}$ ($${a} \\times ${b}$). What is the final product?`,
      options: shuffled.map((opt) => `$${opt}$`),
      correctIndex,
      explanation,
      a,
      b,
      product,
    };
  },
};

// ------- TESTS -------
// Run via: node -e "import('./binary-multiplication-table.js').then(m => m.runTests())"

export function runTests() {
  const gen = binaryMultiplicationTableGenerator;

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

  // Test 3: Product is correct
  for (let i = 0; i < 50; i++) {
    const p = gen.generate(i);
    console.assert(p.product === p.a * p.b, `Seed ${i}: product should be a * b`);
  }
  console.log('✓ Product correctness test passed');

  // Test 4: Options are valid
  for (let i = 0; i < 20; i++) {
    const p = gen.generate(i * 7);
    console.assert(p.options.length === 4, 'Should have 4 options');
    console.assert(p.correctIndex >= 0 && p.correctIndex < 4, 'Correct index in range');
  }
  console.log('✓ Options validity test passed');

  // Test 5: Table is in explanation
  console.assert(p1.explanation.includes('mult-table'), 'Should have table in explanation');
  console.assert(p1.explanation.includes('Iteration'), 'Should have iteration header');
  console.log('✓ Table generation test passed');

  console.log('\nAll tests passed!');
}
