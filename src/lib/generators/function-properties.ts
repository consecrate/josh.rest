import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import { pickRandom } from './relation-utils';

interface FunctionDef {
  f: string;
  latex: string;
  domain: string;
  codomain: string;
  injective: boolean;
  surjective: boolean;
  reason: string;
}

const FUNCTIONS: FunctionDef[] = [
  // --- Number Theory / Arithmetic ---
  {
    f: 'f(n) = 2n',
    latex: 'f(n) = 2n',
    domain: 'ℤ',
    codomain: 'ℤ',
    injective: true,
    surjective: false,
    reason: 'Injective: 2n₁ = 2n₂ ⟹ n₁ = n₂. Not surjective: odd integers are never reached.',
  },
  {
    f: 'f(n) = n + 1',
    latex: 'f(n) = n + 1',
    domain: 'ℤ',
    codomain: 'ℤ',
    injective: true,
    surjective: true,
    reason: 'Bijection: shift is reversible (inverse n-1).',
  },
  {
    f: 'f(n) = n mod 5',
    latex: 'f(n) = n \\bmod 5',
    domain: 'ℤ',
    codomain: '{0, 1, 2, 3, 4}',
    injective: false,
    surjective: true,
    reason: 'Not injective: many n map to same remainder. Surjective: all remainders possible.',
  },
  {
    f: 'f(x) = |x|',
    latex: 'f(x) = |x|',
    domain: 'ℤ',
    codomain: 'ℕ',
    injective: false,
    surjective: true,
    reason: 'Not injective: |-1| = |1|. Surjective: every natural number is |n|.',
  },
  {
    f: 'GCD(n, 12)',
    latex: 'f(n) = \\gcd(n, 12)',
    domain: 'ℤ⁺',
    codomain: 'ℤ⁺',
    injective: false,
    surjective: false,
    reason: 'Not injective: gcd(1,12)=1, gcd(13,12)=1. Not surjective: outputs only divisors of 12.',
  },
  {
    f: 'Factorial',
    latex: 'f(n) = n!',
    domain: 'ℕ',
    codomain: 'ℕ',
    injective: true,
    surjective: false,
    reason: 'Injective (strictly increasing). Not surjective (skips many numbers like 3, 4, 5).',
  },
  
  // --- Calculus / Analysis ---
  {
    f: 'f(x) = x²',
    latex: 'f(x) = x^2',
    domain: 'ℝ',
    codomain: 'ℝ',
    injective: false,
    surjective: false,
    reason: 'Not injective (±x). Not surjective (negative output impossible).',
  },
  {
    f: 'f(x) = x²',
    latex: 'f(x) = x^2',
    domain: 'ℝ',
    codomain: 'ℝ_{\\ge 0}',
    injective: false,
    surjective: true,
    reason: 'Not injective (±x). Surjective on non-negative reals.',
  },
  {
    f: 'f(x) = x³',
    latex: 'f(x) = x^3',
    domain: 'ℝ',
    codomain: 'ℝ',
    injective: true,
    surjective: true,
    reason: 'Strictly increasing bijection.',
  },
  {
    f: 'f(x) = eˣ',
    latex: 'f(x) = e^x',
    domain: 'ℝ',
    codomain: 'ℝ',
    injective: true,
    surjective: false,
    reason: 'Injective. Not surjective (output always positive).',
  },
  {
    f: 'f(x) = eˣ',
    latex: 'f(x) = e^x',
    domain: 'ℝ',
    codomain: 'ℝ^{+}',
    injective: true,
    surjective: true,
    reason: 'Bijection between R and R+.',
  },
  {
    f: 'f(x) = ln(x)',
    latex: 'f(x) = \\ln(x)',
    domain: 'ℝ^{+}',
    codomain: 'ℝ',
    injective: true,
    surjective: true,
    reason: 'Bijection (inverse of e^x).',
  },
  {
    f: 'f(x) = 1/x',
    latex: 'f(x) = 1/x',
    domain: 'ℝ \\setminus \\{0\\}',
    codomain: 'ℝ \\setminus \\{0\\}',
    injective: true,
    surjective: true,
    reason: 'Self-inverse bijection.',
  },
  {
    f: 'f(x) = sin(x)',
    latex: 'f(x) = \\sin(x)',
    domain: 'ℝ',
    codomain: '[-1, 1]',
    injective: false,
    surjective: true,
    reason: 'Periodic (not injective). Surjective onto [-1, 1].',
  },
  {
    f: 'f(x) = tan(x)',
    latex: 'f(x) = \\tan(x)',
    domain: '(-\\pi/2, \\pi/2)',
    codomain: 'ℝ',
    injective: true,
    surjective: true,
    reason: 'Restricted tangent is a bijection.',
  },
  {
    f: 'Floor',
    latex: 'f(x) = \\lfloor x \\rfloor',
    domain: 'ℝ',
    codomain: 'ℤ',
    injective: false,
    surjective: true,
    reason: 'Step function (not injective). Surjective on Integers.',
  },
  {
    f: 'Ceiling',
    latex: 'f(x) = \\lceil x \\rceil',
    domain: 'ℝ',
    codomain: 'ℤ',
    injective: false,
    surjective: true,
    reason: 'Step function (not injective). Surjective on Integers.',
  },
  {
    f: 'Signum',
    latex: 'f(x) = \\text{sgn}(x)',
    domain: 'ℝ',
    codomain: '\\{-1, 0, 1\\}',
    injective: false,
    surjective: true,
    reason: 'Maps all positives to 1, negatives to -1. Not injective.',
  },
  {
    f: 'Logistic',
    latex: 'f(x) = \\frac{1}{1+e^{-x}}',
    domain: 'ℝ',
    codomain: '(0, 1)',
    injective: true,
    surjective: true,
    reason: 'Strictly increasing sigmoid bijection.',
  },

  // --- Linear Algebra ---
  {
    f: 'Determinant',
    latex: 'f(A) = \\det(A)',
    domain: 'M_{2 \\times 2}(\\mathbb{R})',
    codomain: 'ℝ',
    injective: false,
    surjective: true,
    reason: 'Many matrices have same det. Can produce any real value.',
  },
  {
    f: 'Trace',
    latex: 'f(A) = \\text{tr}(A)',
    domain: 'M_{n \\times n}(\\mathbb{R})',
    codomain: 'ℝ',
    injective: false,
    surjective: true,
    reason: 'Sum of diagonal elements. Not injective (many matrices same trace).',
  },
  {
    f: 'Transpose',
    latex: 'f(A) = A^T',
    domain: 'M_{n \\times n}',
    codomain: 'M_{n \\times n}',
    injective: true,
    surjective: true,
    reason: 'Involution (f(f(A)) = A), so bijection.',
  },
  {
    f: 'Zero Map',
    latex: 'f(v) = 0',
    domain: 'ℝ^n',
    codomain: 'ℝ^n',
    injective: false,
    surjective: false,
    reason: 'Collapses all to 0 (not inj). Range is {0} (not surj).',
  },
  {
    f: 'Identity',
    latex: 'f(v) = v',
    domain: 'V',
    codomain: 'V',
    injective: true,
    surjective: true,
    reason: 'Trivial bijection.',
  },
  {
    f: 'Projection 2D',
    latex: 'f(x, y) = x',
    domain: 'ℝ^2',
    codomain: 'ℝ',
    injective: false,
    surjective: true,
    reason: 'Collapses y dimension (not inj). Covers all x (surj).',
  },
  {
    f: 'Vector Norm',
    latex: 'f(v) = \\|v\\|',
    domain: 'ℝ^n',
    codomain: 'ℝ_{\\ge 0}',
    injective: false,
    surjective: true,
    reason: 'Many vectors have same length. Covers all non-negative lengths.',
  },

  // --- String / Bitwise / CS ---
  {
    f: 'String Length',
    latex: 'f(s) = |s|',
    domain: '\\Sigma^*',
    codomain: 'ℕ_0',
    injective: false,
    surjective: true,
    reason: 'Many strings have same length. Can make string of any length.',
  },
  {
    f: 'Reverse String',
    latex: 'f(s) = s^R',
    domain: '\\Sigma^*',
    codomain: '\\Sigma^*',
    injective: true,
    surjective: true,
    reason: 'Involution, hence bijection.',
  },
  {
    f: 'Bitwise NOT',
    latex: 'f(x) = \\sim x',
    domain: 'Byte',
    codomain: 'Byte',
    injective: true,
    surjective: true,
    reason: 'Reversible bit flip.',
  },
  {
    f: 'Bitwise Left Shift',
    latex: 'f(n) = n \\ll 1',
    domain: 'ℤ',
    codomain: 'ℤ',
    injective: true,
    surjective: false,
    reason: 'Multiplication by 2 (injective). Outputs only even numbers (not surjective).',
  },
  {
    f: 'Hamming Weight',
    latex: 'f(x) = \\text{popcount}(x)',
    domain: 'Byte',
    codomain: '\\{0..8\\}',
    injective: false,
    surjective: true,
    reason: 'Many bytes have same number of 1s.',
  },
  {
    f: 'Boolean Not',
    latex: 'f(b) = \\neg b',
    domain: '\\{T, F\\}',
    codomain: '\\{T, F\\}',
    injective: true,
    surjective: true,
    reason: 'Bijection on booleans.',
  },

  // --- Set Theory ---
  {
    f: 'Power Set Map',
    latex: 'f(x) = \\{x\\}',
    domain: 'S',
    codomain: '𝒫(S)',
    injective: true,
    surjective: false,
    reason: 'Distinct elements map to distinct singletons. Not all subsets are singletons.',
  },
  {
    f: 'Cardinality',
    latex: 'f(A) = |A|',
    domain: 'FiniteSets',
    codomain: 'ℕ_0',
    injective: false,
    surjective: true,
    reason: 'Many sets have same size. Can construct set of any size.',
  },
  {
    f: 'Indicator',
    latex: 'f(x) = 1_A(x)',
    domain: 'U',
    codomain: '\\{0, 1\\}',
    injective: false,
    surjective: true,
    reason: 'Maps everything to 0 or 1. Surjective if A is proper non-empty subset.',
  },
  {
    f: 'Cartesian Diagonal',
    latex: 'f(x) = (x, x)',
    domain: 'A',
    codomain: 'A \\times A',
    injective: true,
    surjective: false,
    reason: 'Injective. Image is only the diagonal, not all pairs.',
  },
  {
    f: 'Projection Pair',
    latex: 'f(a, b) = a',
    domain: 'A \\times B',
    codomain: 'A',
    injective: false,
    surjective: true,
    reason: 'Not injective (many b for same a). Surjective (assuming B not empty).',
  },
  
  // --- Complex Numbers ---
  {
    f: 'Conjugate',
    latex: 'f(z) = \\bar{z}',
    domain: 'ℂ',
    codomain: 'ℂ',
    injective: true,
    surjective: true,
    reason: 'Reflection over real axis, bijection.',
  },
  {
    f: 'Modulus',
    latex: 'f(z) = |z|',
    domain: 'ℂ',
    codomain: 'ℝ_{\\ge 0}',
    injective: false,
    surjective: true,
    reason: 'Many z on same circle. Covers all non-negative reals.',
  },
  {
    f: 'Real Part',
    latex: 'f(z) = \\text{Re}(z)',
    domain: 'ℂ',
    codomain: 'ℝ',
    injective: false,
    surjective: true,
    reason: 'Collapses imaginary part.',
  },
];

type PropertyQuestion = 'injective' | 'surjective' | 'bijective' | 'invertible';

const functionPropertyGenerator: ProblemGenerator = {
  type: 'function-properties',
  displayName: 'Function Properties',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const fn = pickRandom(FUNCTIONS, rng);

    const properties: PropertyQuestion[] = ['injective', 'surjective', 'bijective', 'invertible'];
    const property = pickRandom(properties, rng);

    let holds: boolean;
    let definition: string;

    switch (property) {
      case 'injective':
        holds = fn.injective;
        definition = 'f(a) = f(b) ⟹ a = b (one-to-one)';
        break;
      case 'surjective':
        holds = fn.surjective;
        definition = '∀y ∈ codomain, ∃x: f(x) = y (onto)';
        break;
      case 'bijective':
        holds = fn.injective && fn.surjective;
        definition = 'Both injective and surjective';
        break;
      case 'invertible':
        holds = fn.injective && fn.surjective;
        definition = 'Has an inverse function (equivalent to bijective)';
        break;
    }

    const correctAnswer = holds ? 'Yes' : 'No';
    const options = shuffleWithSeed(
      ['Yes', 'No', 'Only on a restricted domain', 'Depends on the codomain'],
      rng
    );
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `Consider the function $${fn.latex}$ with domain $${fn.domain}$ and codomain $${fn.codomain}$.\n\nIs this function **${property}**?`,
      options,
      correctIndex,
      explanation: `**${property.charAt(0).toUpperCase() + property.slice(1)}**: ${definition}\n\n${fn.reason}\n\nInjective: ${fn.injective ? '✓' : '✗'}, Surjective: ${fn.surjective ? '✓' : '✗'}\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

const functionClassifyGenerator: ProblemGenerator = {
  type: 'function-classify',
  displayName: 'Classify Function Type',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const fn = pickRandom(FUNCTIONS, rng);

    let classification: string;
    if (fn.injective && fn.surjective) {
      classification = 'Bijective (one-to-one and onto)';
    } else if (fn.injective && !fn.surjective) {
      classification = 'Injective only (one-to-one but not onto)';
    } else if (!fn.injective && fn.surjective) {
      classification = 'Surjective only (onto but not one-to-one)';
    } else {
      classification = 'Neither injective nor surjective';
    }

    const options = shuffleWithSeed(
      [
        'Bijective (one-to-one and onto)',
        'Injective only (one-to-one but not onto)',
        'Surjective only (onto but not one-to-one)',
        'Neither injective nor surjective',
      ],
      rng
    );
    const correctIndex = options.indexOf(classification);

    return {
      question: `Classify the function $${fn.latex}$\nwith domain $${fn.domain}$ and codomain $${fn.codomain}$:`,
      options,
      correctIndex,
      explanation: `${fn.reason}\n\n**Classification:** ${classification}`,
    };
  },
};

export const generators = [functionPropertyGenerator, functionClassifyGenerator] as const;
