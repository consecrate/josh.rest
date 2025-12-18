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
