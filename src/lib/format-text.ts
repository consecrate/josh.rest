/**
 * Client-side text formatting with math support.
 * Uses marked + marked-katex-extension for battle-tested markdown + LaTeX handling.
 * 
 * IMPORTANT: Content that already contains pre-rendered KaTeX HTML 
 * (from generators using katex-utils.ts) is passed through unchanged.
 */
import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';

// Configure marked with KaTeX extension
const marked = new Marked({
  breaks: false,
  gfm: true,
});

marked.use(
  markedKatex({
    throwOnError: false,
    output: 'html',
    nonStandard: true,
  })
);

/**
 * Check if text contains pre-rendered KaTeX HTML.
 * If so, we should skip marked processing to avoid double-processing.
 */
function containsPreRenderedKatex(text: string): boolean {
  return text.includes('class="katex"') || text.includes('class=\\"katex\\"');
}

/**
 * Format text with markdown and LaTeX math support.
 * 
 * - If text contains pre-rendered KaTeX HTML, only does basic formatting
 * - Otherwise, processes markdown and LaTeX with marked + katex extension
 */
export function formatText(text: string): string {
  if (!text) return '';
  
  // If already contains KaTeX HTML, skip marked processing
  // Just do basic markdown (bold, italic) without touching the HTML
  if (containsPreRenderedKatex(text)) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
  
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
  
  if (containsPreRenderedKatex(text)) {
    return text; // Already has KaTeX, just return as-is
  }
  
  return marked.parse(text, { async: false }) as string;
}
