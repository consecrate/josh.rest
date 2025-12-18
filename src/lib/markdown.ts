import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';

/**
 * Configured marked instance with KaTeX math support.
 * 
 * Uses marked-katex-extension which is the official, battle-tested
 * extension for handling LaTeX math in marked. This properly handles:
 * - Inline math: $...$
 * - Display math: $$...$$
 * - Backslash escapes in LaTeX commands (\circ, \{, etc.)
 */
const marked = new Marked({
  // Disable features that can interfere with math content
  breaks: false,
  gfm: true,
});

marked.use(
  markedKatex({
    throwOnError: false,
    output: 'html',
    nonStandard: true, // More permissive math delimiter matching
  })
);

/**
 * Converts markdown to HTML using marked with KaTeX math support.
 * Uses parseInline to process inline elements (bold, italic, code, links, math)
 * without wrapping in paragraph tags.
 */
export function inlineMarkdown(text: string): string {
  if (!text) return '';
  
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
  return marked.parse(text, { async: false }) as string;
}
