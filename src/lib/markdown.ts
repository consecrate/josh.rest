import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';

/**
 * Configured marked instance with KaTeX math support.
 * 
 * Uses marked-katex-extension which is the official, battle-tested
 * extension for handling LaTeX math in marked.
 * 
 * IMPORTANT: Content that already contains pre-rendered KaTeX HTML 
 * (from generators using katex-utils.ts) is passed through unchanged.
 */
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
 */
function containsPreRenderedKatex(text: string): boolean {
  return text.includes('class="katex"') || text.includes('class=\\"katex\\"');
}

/**
 * Converts markdown to HTML using marked with KaTeX math support.
 * Uses parseInline to process inline elements (bold, italic, code, links, math)
 * without wrapping in paragraph tags.
 * 
 * If text already contains pre-rendered KaTeX, skips marked to avoid issues.
 */
export function inlineMarkdown(text: string): string {
  if (!text) return '';
  
  // If already contains KaTeX HTML, just do basic formatting
  if (containsPreRenderedKatex(text)) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
  
  // Parse inline markdown with math support
  const html = marked.parseInline(text, { async: false }) as string;
  
  // Convert newlines to <br> for inline display
  return html.trim().replace(/\n/g, '<br>');
}

/**
 * Converts full markdown (with paragraphs) to HTML with KaTeX math support.
 */
export function parseMarkdown(text: string): string {
  if (!text) return '';
  
  if (containsPreRenderedKatex(text)) {
    return text;
  }
  
  return marked.parse(text, { async: false }) as string;
}
