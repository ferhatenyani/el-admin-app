import { useRef } from 'react';
import { Bold, Italic, Strikethrough, Code } from 'lucide-react';

const FORMATS = [
    { icon: Bold,          label: 'Gras',     syntax: '**', placeholder: 'texte gras' },
    { icon: Italic,        label: 'Italique',  syntax: '*',  placeholder: 'texte italique' },
    { icon: Strikethrough, label: 'Barré',     syntax: '~~', placeholder: 'texte barré' },
    { icon: Code,          label: 'Code',      syntax: '`',  placeholder: 'code' },
];

/**
 * True if `text` is wrapped by `syntax` and the inner content starts with a
 * different char — guards against treating **bold** as *-wrapped.
 */
const isWrappedWith = (text, syntax) => {
    const sl = syntax.length;
    if (text.length < sl * 2 + 1) return false;
    if (!text.startsWith(syntax) || !text.endsWith(syntax)) return false;
    if (text[sl] === syntax[0]) return false; // e.g. "**..." must not be a bold marker for italic
    return true;
};

/**
 * True if [start, end] inside `full` is immediately surrounded by `syntax`.
 * For single-char syntax, also checks no outer double-marker exists (** around *).
 */
const isSurroundedBy = (full, start, end, syntax) => {
    const sl = syntax.length;
    if (start < sl) return false;
    if (full.slice(start - sl, start) !== syntax) return false;
    if (full.slice(end, end + sl)     !== syntax) return false;
    if (sl === 1) {
        const outerBefore = start - sl - 1 >= 0            ? full[start - sl - 1] : '';
        const outerAfter  = end   + sl     < full.length   ? full[end + sl]       : '';
        if (outerBefore === syntax[0] || outerAfter === syntax[0]) return false;
    }
    return true;
};

/**
 * Single-line input with a compact inline-markdown toolbar.
 * onChange receives the new string value directly (not an event).
 */
const InlineMDInput = ({ value = '', onChange, placeholder, className = '', error }) => {
    const inputRef = useRef(null);

    const applyFormat = (syntax, ph) => {
        const input = inputRef.current;
        if (!input) return;

        const start    = input.selectionStart ?? 0;
        const end      = input.selectionEnd   ?? 0;
        const current  = input.value;
        const selected = current.slice(start, end);
        const sl       = syntax.length;

        let replacement, replaceStart, replaceEnd, selStart, selEnd;

        if (isWrappedWith(selected, syntax)) {
            // Toggle off — selection includes the markers (e.g. user selected "**bold**")
            const inner  = selected.slice(sl, selected.length - sl);
            replacement  = inner;
            replaceStart = start;
            replaceEnd   = end;
            selStart     = start;
            selEnd       = start + inner.length;
        } else if (isSurroundedBy(current, start, end, syntax)) {
            // Toggle off — markers are outside the selection (cursor inside **bold**)
            replacement  = selected;
            replaceStart = start - sl;
            replaceEnd   = end   + sl;
            selStart     = start - sl;
            selEnd       = start - sl + selected.length;
        } else {
            // Apply formatting
            const inner  = selected || ph;
            replacement  = `${syntax}${inner}${syntax}`;
            replaceStart = start;
            replaceEnd   = end;
            selStart     = selected ? start                  : start + sl;
            selEnd       = selected ? start + replacement.length : start + sl + inner.length;
        }

        // execCommand('insertText') integrates with the browser's native undo/redo
        // stack and fires an input event that React's onChange handler catches
        // automatically — so we never manually call onChange here.
        input.setSelectionRange(replaceStart, replaceEnd);
        const ok = document.execCommand('insertText', false, replacement);

        if (!ok) {
            // Fallback for environments where execCommand is unavailable.
            // Undo won't work in this path, but formatting still applies.
            const next = current.slice(0, replaceStart) + replacement + current.slice(replaceEnd);
            onChange(next);
        }

        requestAnimationFrame(() => {
            input.focus();
            input.setSelectionRange(selStart, selEnd);
        });
    };

    const baseInputClass = [
        'w-full px-4 py-3 border rounded-lg',
        'focus:outline-none focus:ring-2 focus:border-transparent',
        'transition-all duration-200',
        error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500',
        className,
    ].join(' ');

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 mb-1.5 px-0.5">
                {FORMATS.map(({ icon: Icon, label, syntax, placeholder: ph }) => (
                    <button
                        key={label}
                        type="button"
                        title={label}
                        onMouseDown={(e) => {
                            e.preventDefault(); // keep input focused + preserve selection
                            applyFormat(syntax, ph);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                        <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </button>
                ))}
                <span className="ml-1.5 text-[10px] text-gray-300 select-none font-mono tracking-wide">
                    **gras** &nbsp; *italique*
                </span>
            </div>

            {/* Input */}
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={baseInputClass}
            />
        </div>
    );
};

export default InlineMDInput;
