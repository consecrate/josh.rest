import { marked } from 'marked';

/**
 * Converts markdown to HTML using marked.
 * Uses parseInline to process inline elements (bold, italic, code, links)
 * without wrapping in paragraph tags.
 *
 * Math content inside $...$ or $$...$$ is preserved and not processed by marked.
 */
export function inlineMarkdown(text: string): string {
  // Extract and protect math content from markdown processing
  const mathBlocks: string[] = [];
  const placeholder = '\x00MATH\x00';

  // Replace $$...$$ (display) and $...$ (inline) with placeholders
  // Handle $$ first to avoid matching as two $
  const protected_ = text
    .replace(/\$\$[\s\S]*?\$\$/g, (match) => {
      mathBlocks.push(match);
      return placeholder + (mathBlocks.length - 1) + placeholder;
    })
    .replace(/\$[^$\n]+?\$/g, (match) => {
      mathBlocks.push(match);
      return placeholder + (mathBlocks.length - 1) + placeholder;
    });

  // Process only non-math content with marked
  const html = marked.parseInline(protected_, { async: false }) as string;

  // Restore math blocks
  const restored = html.replace(
    new RegExp(placeholder + '(\\d+)' + placeholder, 'g'),
    (_, idx) => mathBlocks[parseInt(idx)]
  );

  // Convert newlines to <br> for inline display, trim whitespace
  return restored.trim().replace(/\n/g, '<br>');
}
