/**
 * Strips inline markdown syntax to produce plain text.
 * Used for native `title` tooltip attributes and aria-labels.
 */
export function stripMarkdown(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`(.+?)`/g, '$1');
}
