import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface BinaryDivTableProblem extends Problem {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

/** Convert number to 4-bit binary string */
function toBin4(n: number): string {
  return n.toString(2).padStart(4, '0');
}

/** Convert number to 8-bit binary string with space (xxxx xxxx) */
function toBin8Spaced(n: number): string {
  const bin = n.toString(2).padStart(8, '0');
  return bin.slice(0, 4) + ' ' + bin.slice(4);
}

/** Convert number to 8-bit binary string with LaTeX space */
function toBin8SpacedLatex(n: number): string {
  const bin = n.toString(2).padStart(8, '0');
  return bin.slice(0, 4) + '\\ ' + bin.slice(4);
}

/** Add circled MSB to remainder display */
function addCircledMsb(bin: string): string {
  return `<span class="circled">${bin[0]}</span>${bin.slice(1)}`;
}

/**
 * Simulate the division algorithm and generate HTML table
 * Algorithm (restoring division, 4-bit):
 * - Divisor starts in left half of 8-bit register
 * - For n iterations:
 *   1. Rem = Rem - Div
 *   2. If Rem < 0: Rem += Div (restore), sll Q, Q0 = 0
 *      If Rem >= 0: sll Q, Q0 = 1
 *   3. Shift Div right
 */
function generateTableHtml(dividend: number, divisor: number): string {
  const bits = 4;
  let quotient = 0;
  let remainder = dividend;               // Starts as dividend
  let div = divisor << bits;              // Divisor in left half (e.g., 2 -> 0010 0000)

  const rows: string[] = [];

  // Initial row (iteration 0)
  rows.push(`<tr>
  <td>0</td>
  <td class="step">Initial values</td>
  <td>${toBin4(quotient)}</td>
  <td>${toBin8Spaced(div)}</td>
  <td>${toBin8Spaced(remainder)}</td>
</tr>`);

  // Iterations 1 through bits+1 (5 iterations for 4-bit numbers)
  for (let iter = 1; iter <= bits + 1; iter++) {
    const prevRemainder = remainder;

    // Step 1: Rem = Rem - Div (signed subtraction)
    const testRem = remainder - div;
    const remNegative = testRem < 0;

    // Show the subtraction result with circled sign bit
    const subResultBin = toBin8Spaced(remNegative ? (testRem & 0xff) : testRem);
    const subResultDisplay = remNegative
      ? addCircledMsb(subResultBin)
      : `<span class="circled-zero">${subResultBin[0]}</span>${subResultBin.slice(1)}`;

    rows.push(`<tr>
  <td rowspan="3">${iter}</td>
  <td class="step">1: Rem = Rem − Div</td>
  <td>${toBin4(quotient)}</td>
  <td>${toBin8Spaced(div)}</td>
  <td class="changed">${subResultDisplay}</td>
</tr>`);

    // Step 2a or 2b depending on sign
    if (remNegative) {
      // Restore: Rem = Rem + Div, shift Q left, Q0 = 0
      remainder = prevRemainder; // Restore
      quotient = (quotient << 1) & 0xf; // Shift left, Q0 = 0
      rows.push(`<tr>
  <td class="step">2b: Rem < 0 ⇒ +Div, sll Q, Q0 = 0</td>
  <td class="changed">${toBin4(quotient)}</td>
  <td>${toBin8Spaced(div)}</td>
  <td class="changed">${toBin8Spaced(remainder)}</td>
</tr>`);
    } else {
      // Keep: shift Q left, Q0 = 1
      remainder = testRem;
      quotient = ((quotient << 1) | 1) & 0xf; // Shift left, Q0 = 1
      rows.push(`<tr>
  <td class="step">2a: Rem ≥ 0 ⇒ sll Q, Q0 = 1</td>
  <td class="changed">${toBin4(quotient)}</td>
  <td>${toBin8Spaced(div)}</td>
  <td>${toBin8Spaced(remainder)}</td>
</tr>`);
    }

    // Step 3: Shift Div right
    div = div >> 1;
    rows.push(`<tr>
  <td class="step">3: Shift Div right</td>
  <td>${toBin4(quotient)}</td>
  <td class="changed">${toBin8Spaced(div)}</td>
  <td>${toBin8Spaced(remainder)}</td>
</tr>`);
  }

  return `<table class="div-table">
<thead>
<tr>
  <th>Iteration</th>
  <th>Step</th>
  <th>Quotient</th>
  <th>Divisor</th>
  <th>Remainder</th>
</tr>
</thead>
<tbody>
${rows.join('\n')}
</tbody>
</table>

<style>
.div-table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  font-family: monospace;
  font-size: 0.7rem;
  margin: 1.5rem 0;
}
.div-table th,
.div-table td {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.div-table th {
  background: #00a8cc;
  color: white;
  padding: 0.3rem 0.5rem;
  font-weight: 600;
}
.div-table th:nth-child(2) {
  text-align: left;
}
.div-table td {
  border: 1px solid #333;
  padding: 0.2rem 0.4rem;
  text-align: center;
}
.div-table .step {
  text-align: left;
}
.div-table .changed {
  color: #00a8cc;
}
.div-table .circled {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  line-height: 1.2em;
  border: 2px solid #00a8cc;
  border-radius: 50%;
  color: #00a8cc;
  text-align: center;
}
.div-table .circled-zero {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  line-height: 1.2em;
  border: 2px solid #4caf50;
  border-radius: 50%;
  color: #4caf50;
  text-align: center;
}
</style>`;
}

/** Generate plausible wrong quotients */
function generateWrongQuotients(correct: number, rng: () => number): number[] {
  const wrongs = new Set<number>();
  const attempts = [
    () => correct + 1,
    () => correct - 1,
    () => correct ^ 1,
    () => (correct << 1) & 0xf,
    () => correct >> 1,
    () => correct ^ 0b10,
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

export const binaryDivisionTableGenerator: ProblemGenerator<BinaryDivTableProblem> = {
  type: 'binary-division-table',
  displayName: 'Binary Division (Iteration Table)',

  generate(seed: number): BinaryDivTableProblem {
    const rng = mulberry32(seed);

    // Generate dividend (6-15) and divisor (2-5) for interesting results
    let dividend: number, divisor: number;
    const trivialPairs = new Set(['7,2']); // Exclude example from lesson

    do {
      dividend = Math.floor(rng() * 10) + 6;  // 6-15
      divisor = Math.floor(rng() * 4) + 2;    // 2-5
    } while (trivialPairs.has(`${dividend},${divisor}`) || divisor >= dividend);

    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;

    const wrongs = generateWrongQuotients(quotient, rng);
    const allOptions = [quotient, ...wrongs].map(toBin4);
    const shuffled = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffled.indexOf(toBin4(quotient));

    const tableHtml = generateTableHtml(dividend, divisor);

    const explanation =
      `Trace through the division algorithm for $${toBin8SpacedLatex(dividend)}$ ($${dividend}$) ÷ $${toBin4(divisor)}$ ($${divisor}$):\n\n` +
      tableHtml +
      `\n\nThe final quotient is $${toBin4(quotient)}$ ($${quotient}$) with remainder $${toBin4(remainder)}$ ($${remainder}$).`;

    return {
      question: `Using the binary division algorithm, calculate $${toBin4(dividend)} \\div ${toBin4(divisor)}$ ($${dividend} \\div ${divisor}$). What is the final quotient?`,
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

// ------- TESTS -------
// Run via: node -e "import('./binary-division-table.js').then(m => m.runTests())"

export function runTests() {
  const gen = binaryDivisionTableGenerator;

  // Test 1: Determinism
  const p1 = gen.generate(42);
  const p2 = gen.generate(42);
  console.assert(p1.question === p2.question, 'Same seed should produce same question');
  console.assert(p1.quotient === p2.quotient, 'Same seed should produce same quotient');
  console.log('✓ Determinism test passed');

  // Test 2: Different seeds
  const p3 = gen.generate(43);
  console.assert(p1.dividend !== p3.dividend || p1.divisor !== p3.divisor, 'Different seed should likely differ');
  console.log('✓ Variety test passed');

  // Test 3: Quotient and remainder correctness
  for (let i = 0; i < 50; i++) {
    const p = gen.generate(i);
    console.assert(p.quotient === Math.floor(p.dividend / p.divisor), `Seed ${i}: quotient should be correct`);
    console.assert(p.remainder === p.dividend % p.divisor, `Seed ${i}: remainder should be correct`);
  }
  console.log('✓ Division correctness test passed');

  // Test 4: Options valid
  for (let i = 0; i < 20; i++) {
    const p = gen.generate(i * 7);
    console.assert(p.options.length === 4, 'Should have 4 options');
    console.assert(p.correctIndex >= 0 && p.correctIndex < 4, 'Correct index in range');
  }
  console.log('✓ Options validity test passed');

  // Test 5: Table is in explanation
  console.assert(p1.explanation.includes('div-table'), 'Should have table in explanation');
  console.assert(p1.explanation.includes('Iteration'), 'Should have iteration header');
  console.log('✓ Table generation test passed');

  console.log('\nAll tests passed!');
}
