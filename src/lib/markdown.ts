import { marked } from 'marked';

/**
 * Converts markdown to HTML using marked.
 * Uses parseInline to process inline elements (bold, italic, code, links)
 * without wrapping in paragraph tags.
 */
export function inlineMarkdown(text: string): string {
  // Use parseInline for inline formatting without <p> wrapping
  const html = marked.parseInline(text, { async: false }) as string;
  // Convert newlines to <br> for inline display, trim whitespace
  return html.trim().replace(/\n/g, '<br>');
}
