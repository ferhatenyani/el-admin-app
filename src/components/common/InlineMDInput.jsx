import { useRef } from 'react';
import { Bold, Italic, Strikethrough, Code } from 'lucide-react';

const FORMATS = [
    { icon: Bold,          label: 'Gras',        syntax: '**', placeholder: 'texte gras' },
    { icon: Italic,        label: 'Italique',     syntax: '*',  placeholder: 'texte italique' },
    { icon: Strikethrough, label: 'Barré',        syntax: '~~', placeholder: 'texte barré' },
    { icon: Code,          label: 'Code',         syntax: '`',  placeholder: 'code' },
];

/**
 * Single-line text input with a minimal inline-markdown toolbar.
 * onChange receives the new string value directly (not an event).
 */
const InlineMDInput = ({ value = '', onChange, placeholder, className = '', error }) => {
    const inputRef = useRef(null);

    const applyFormat = (syntax, ph) => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart ?? value.length;
        const end   = input.selectionEnd   ?? value.length;
        const selected = value.slice(start, end);
        const inner = selected || ph;
        const wrapped = `${syntax}${inner}${syntax}`;
        const next = value.slice(0, start) + wrapped + value.slice(end);

        onChange(next);

        requestAnimationFrame(() => {
            input.focus();
            if (selected) {
                input.setSelectionRange(start, start + wrapped.length);
            } else {
                // Select the placeholder so user can type right over it
                input.setSelectionRange(
                    start + syntax.length,
                    start + syntax.length + inner.length
                );
            }
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
                            e.preventDefault(); // keep input focused
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
