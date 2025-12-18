/**
 * KaTeX utilities for pre-rendering math in generators.
 * 
 * This is the STABLE solution: render LaTeX to HTML at generation time,
 * bypassing all string escaping issues in the pipeline.
 */
import katex from 'katex';

/**
 * Render inline LaTeX to HTML.
 * Use this in generators instead of $...$ delimiters.
 */
export function tex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
    });
  } catch {
    // Fallback to raw LaTeX wrapped in $ if KaTeX fails
    return `$${latex}$`;
  }
}

/**
 * Render display LaTeX to HTML.
 * Use this in generators instead of $$...$$ delimiters.
 */
export function displayTex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    });
  } catch {
    return `$$${latex}$$`;
  }
}

/**
 * Template tag for inline math - makes generator code cleaner.
 * Usage: tex`\mathbb{Z}_5` instead of tex('\\mathbb{Z}_5')
 * 
 * The template tag receives the RAW string, bypassing JS escape processing.
 */
export function texRaw(strings: TemplateStringsArray, ...values: unknown[]): string {
  // Reconstruct the string with interpolated values
  let latex = strings[0];
  for (let i = 0; i < values.length; i++) {
    latex += String(values[i]) + strings[i + 1];
  }
  return tex(latex);
}

/**
 * Common math symbols pre-rendered for convenience.
 * Use these directly in generators to avoid any escaping issues.
 */
export const symbols = {
  // Sets
  Z: tex('\\mathbb{Z}'),
  Q: tex('\\mathbb{Q}'),
  R: tex('\\mathbb{R}'),
  N: tex('\\mathbb{N}'),
  C: tex('\\mathbb{C}'),
  emptyset: tex('\\emptyset'),
  
  // Operations
  circ: tex('\\circ'),
  cdot: tex('\\cdot'),
  times: tex('\\times'),
  div: tex('\\div'),
  pm: tex('\\pm'),
  
  // Relations
  equiv: tex('\\equiv'),
  approx: tex('\\approx'),
  neq: tex('\\neq'),
  leq: tex('\\leq'),
  geq: tex('\\geq'),
  subset: tex('\\subset'),
  subseteq: tex('\\subseteq'),
  in_: tex('\\in'),
  notin: tex('\\notin'),
  
  // Arrows
  to: tex('\\to'),
  mapsto: tex('\\mapsto'),
  implies: tex('\\Rightarrow'),
  iff: tex('\\Leftrightarrow'),
  
  // Greek
  alpha: tex('\\alpha'),
  beta: tex('\\beta'),
  gamma: tex('\\gamma'),
  delta: tex('\\delta'),
  epsilon: tex('\\epsilon'),
  phi: tex('\\phi'),
  
  // Misc
  infty: tex('\\infty'),
  forall: tex('\\forall'),
  exists: tex('\\exists'),
} as const;

/**
 * Helper to create Zn notation (integers mod n)
 */
export function Zn(n: number): string {
  return tex(`\\mathbb{Z}_{${n}}`);
}

/**
 * Helper for equivalence class notation [a]
 */
export function eqClass(a: number | string): string {
  return tex(`[${a}]`);
}

/**
 * Helper for modular arithmetic: a ≡ b (mod n)
 */
export function modEq(a: number | string, b: number | string, n: number): string {
  return tex(`${a} \\equiv ${b} \\pmod{${n}}`);
}

/**
 * Helper for fractions
 */
export function frac(num: number | string, den: number | string): string {
  return tex(`\\frac{${num}}{${den}}`);
}

/**
 * Helper for subscripts
 */
export function sub(base: string, subscript: string | number): string {
  return tex(`${base}_{${subscript}}`);
}

/**
 * Helper for superscripts
 */
export function sup(base: string, superscript: string | number): string {
  return tex(`${base}^{${superscript}}`);
}
