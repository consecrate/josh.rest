/**
 * Client-side text formatting with math support.
 * Uses marked + marked-katex-extension for battle-tested markdown + LaTeX handling.
 */
import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';

// Configure marked with KaTeX extension
const marked = new Marked();
marked.use(
  markedKatex({
    throwOnError: false,
    output: 'html',
  })
);

/**
 * Format text with markdown and LaTeX math support.
 * Handles inline markdown (bold, italic, links) and math ($...$, $$...$$).
 */
export function formatText(text: string): string {
  if (!text) return '';
  
  // Use marked's parseInline for inline content (no paragraph wrapping)
  const html = marked.parseInline(text, { async: false }) as string;
  
  // Convert newlines to <br> for display
  return html.trim().replace(/\n/g, '<br>');
}

/**
 * Format full markdown text (with paragraphs) and LaTeX math support.
 */
export function formatMarkdown(text: string): string {
  if (!text) return '';
  return marked.parse(text, { async: false }) as string;
}
