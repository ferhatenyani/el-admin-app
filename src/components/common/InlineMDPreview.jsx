/**
 * Renders a string that may contain inline markdown tokens
 * (**bold**, *italic*, ~~strikethrough~~, `code`) as HTML inline elements.
 *
 * Renders as a <span> by default so it's safe inside flex/grid containers
 * that use line-clamp or overflow-hidden — no block wrappers are emitted.
 */

const TOKEN_RE = /\*\*(.+?)\*\*|\*(.+?)\*|~~(.+?)~~|`(.+?)`/g;

function parseInline(text) {
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      parts.push(<em key={key++}>{match[2]}</em>);
    } else if (match[3] !== undefined) {
      parts.push(<del key={key++}>{match[3]}</del>);
    } else if (match[4] !== undefined) {
      parts.push(
        <code key={key++} className="font-mono text-[0.9em] bg-black/10 px-1 rounded">
          {match[4]}
        </code>
      );
    }
    lastIndex = TOKEN_RE.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

const InlineMDPreview = ({ children, className, as: Tag = 'span' }) => {
  if (!children) return null;
  return <Tag className={className}>{parseInline(String(children))}</Tag>;
};

export default InlineMDPreview;
