/**
 * Converts basic markdown to HTML (no dependencies).
 * Supports: **bold**, *italic*, and line breaks.
 */
export function inlineMarkdown(text: string): string {
  return text
    // Bold: **text** → <strong>text</strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* → <em>text</em> (must run after bold)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Line breaks: \n\n → double break, \n → single break
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}
