import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';

const BIAS = 127;

interface FloatParts {
  sign: number;
  exponent: number; // stored (biased)
  fraction: number; // 23-bit integer
}

/** Convert parts to decimal value (single precision) */
function partsToDecimal(p: FloatParts): number {
  if (p.exponent === 0 && p.fraction === 0) return p.sign ? -0 : 0;
  if (p.exponent === 255 && p.fraction === 0) return p.sign ? -Infinity : Infinity;
  if (p.exponent === 255) return NaN;

  const e = p.exponent - BIAS;
  const m = p.exponent === 0 ? p.fraction / (1 << 23) : 1 + p.fraction / (1 << 23);
  return (p.sign ? -1 : 1) * m * Math.pow(2, p.exponent === 0 ? 1 - BIAS : e);
}

/** Format fraction bits as binary string */
function fracToBin(f: number): string {
  return f.toString(2).padStart(23, '0');
}

/** Format exponent as binary string */
function expToBin(e: number): string {
  return e.toString(2).padStart(8, '0');
}

/** Generate simple normalized numbers for decode problems */
function generateSimpleParts(rng: () => number): FloatParts {
  const sign = rng() < 0.5 ? 0 : 1;
  // Exponent range: 124-130 (decimal values 0.125 to 16)
  const exponent = randInt(rng, 124, 130);
  // Simple fractions: 0, 0.5, 0.25, 0.75 etc (top 2-3 bits only)
  const fracPatterns = [0, 1 << 22, 1 << 21, (1 << 22) | (1 << 21), 1 << 20];
  const fraction = fracPatterns[randInt(rng, 0, fracPatterns.length - 1)];
  return { sign, exponent, fraction };
}

/** Decode generator: Given IEEE 754 bits, find the decimal value */
const floatDecodeGenerator: ProblemGenerator = {
  type: 'float-decode-simple',
  displayName: 'IEEE 754 Decode (Simple)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const parts = generateSimpleParts(rng);
    const correct = partsToDecimal(parts);

    // Generate wrong answers
    const wrongs: number[] = [];
    // Wrong exponent
    wrongs.push(partsToDecimal({ ...parts, exponent: parts.exponent + 1 }));
    wrongs.push(partsToDecimal({ ...parts, exponent: parts.exponent - 1 }));
    // Wrong sign
    wrongs.push(-correct);

    const validWrongs = wrongs.filter((w) => w !== correct && isFinite(w));
    while (validWrongs.length < 3) {
      validWrongs.push(correct * (rng() < 0.5 ? 2 : 0.5));
    }

    const allOptions = [correct, ...validWrongs.slice(0, 3)];
    const shuffled = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffled.indexOf(correct);

    const e = parts.exponent - BIAS;
    const mantissa = parts.fraction === 0 ? '1.0' : `1.${fracToBin(parts.fraction).replace(/0+$/, '')}`;

    return {
      question: `What decimal value does this IEEE 754 single-precision number represent?\n\nSign: $${parts.sign}$, Exponent: $${expToBin(parts.exponent)}_2$ ($${parts.exponent}$), Fraction: $${fracToBin(parts.fraction).slice(0, 8)}..._2$`,
      options: shuffled.map((v) => `$${v}$`),
      correctIndex,
      explanation:
        `$$(-1)^{${parts.sign}} \\times (1 + \\text{frac}) \\times 2^{${parts.exponent} - ${BIAS}}$$\n\n` +
        `$$= ${parts.sign ? '-' : ''}${mantissa.replace('_2', '')} \\times 2^{${e}} = ${correct}$$`,
    };
  },
};

/** Encode generator: Given decimal, find the IEEE 754 components */
const floatEncodeGenerator: ProblemGenerator = {
  type: 'float-encode-simple',
  displayName: 'IEEE 754 Encode (Simple)',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    // Simple values: powers of 2, small integers
    const simpleValues = [1, 2, 4, 8, 0.5, 0.25, 0.125, -1, -2, -4, 3, 5, 6, -0.5];
    const value = simpleValues[randInt(rng, 0, simpleValues.length - 1)];

    // Compute correct IEEE 754 parts
    const sign = value < 0 ? 1 : 0;
    const absVal = Math.abs(value);
    const exp = Math.floor(Math.log2(absVal));
    const storedExp = exp + BIAS;
    const mantissa = absVal / Math.pow(2, exp) - 1;
    const fraction = Math.round(mantissa * (1 << 23));

    const correctAnswer = `Sign=$${sign}$, Exp=$${storedExp}$, Frac=$${fraction === 0 ? '0' : fracToBin(fraction).replace(/0+$/, '')}$`;

    // Wrong answers
    const wrongs = [
      `Sign=$${1 - sign}$, Exp=$${storedExp}$, Frac=$${fraction === 0 ? '0' : fracToBin(fraction).replace(/0+$/, '')}$`,
      `Sign=$${sign}$, Exp=$${storedExp + 1}$, Frac=$${fraction === 0 ? '0' : fracToBin(fraction).replace(/0+$/, '')}$`,
      `Sign=$${sign}$, Exp=$${storedExp - 1}$, Frac=$${fraction === 0 ? '0' : fracToBin(fraction).replace(/0+$/, '')}$`,
    ];

    const allOptions = [correctAnswer, ...wrongs];
    const shuffled = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffled.indexOf(correctAnswer);

    return {
      question: `What are the IEEE 754 single-precision components for $${value}$?`,
      options: shuffled,
      correctIndex,
      explanation:
        `1. Sign: ${value < 0 ? 'negative → 1' : 'positive → 0'}\n` +
        `2. $|${value}| = ${absVal} = 2^{${exp}} \\times ${absVal / Math.pow(2, exp)}$\n` +
        `3. Stored exponent: $${exp} + ${BIAS} = ${storedExp}$\n` +
        `4. Fraction: $${(absVal / Math.pow(2, exp) - 1).toFixed(6)}$`,
    };
  },
};

/** Special cases generator: Identify zero, infinity, NaN, normal, subnormal */
const floatSpecialCasesGenerator: ProblemGenerator = {
  type: 'float-special-cases',
  displayName: 'IEEE 754 Special Cases',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    type Case = { name: string; e: string; f: string; explanation: string };
    const cases: Case[] = [
      { name: 'Positive Zero', e: '00000000', f: '0...0', explanation: 'e = 0, f = 0 → ±0' },
      { name: 'Negative Zero', e: '00000000', f: '0...0', explanation: 'e = 0, f = 0 → ±0 (sign bit = 1)' },
      { name: 'Positive Infinity', e: '11111111', f: '0...0', explanation: 'e = 255, f = 0 → +∞' },
      { name: 'Negative Infinity', e: '11111111', f: '0...0', explanation: 'e = 255, f = 0 → -∞ (sign bit = 1)' },
      { name: 'NaN (Not a Number)', e: '11111111', f: '1...0', explanation: 'e = 255, f ≠ 0 → NaN' },
      { name: 'Subnormal (Denormalized)', e: '00000000', f: '0...1', explanation: 'e = 0, f ≠ 0 → subnormal' },
      { name: 'Normal Number', e: '01111111', f: 'any', explanation: '1 ≤ e ≤ 254 → normal number' },
    ];

    const correctCase = cases[randInt(rng, 0, cases.length - 1)];
    const wrongCases = cases.filter((c) => c.name !== correctCase.name).slice(0, 3);

    const allOptions = [correctCase.name, ...wrongCases.map((c) => c.name)];
    const shuffled = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffled.indexOf(correctCase.name);

    return {
      question: `What does this IEEE 754 pattern represent?\n\nExponent bits: $${correctCase.e}_2$, Fraction bits: $${correctCase.f}$`,
      options: shuffled,
      correctIndex,
      explanation: correctCase.explanation,
    };
  },
};

export const generators = [
  floatDecodeGenerator,
  floatEncodeGenerator,
  floatSpecialCasesGenerator,
] as const;
