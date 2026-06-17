import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Lock } from 'lucide-react';

/**
 * Message composer. Disabled (with an explanatory banner) when the WhatsApp 24h
 * customer-care window is closed. Enter sends, Shift+Enter inserts a newline.
 * `onSend` returns a Promise<boolean>; the input clears only on success.
 */
const Composer = ({ windowOpen, windowLabel, sending, onSend }) => {
  const [text, setText] = useState('');

  if (!windowOpen) {
    return (
      <div className="border-t border-gray-200 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-2 text-sm text-amber-800">
          <Lock className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            {windowLabel || 'Fenêtre 24h fermée'} — la réponse libre n'est plus autorisée.
            Le client doit réécrire pour rouvrir la fenêtre.
          </span>
        </div>
      </div>
    );
  }

  const submit = async () => {
    const value = text.trim();
    if (!value || sending) return;
    const ok = await onSend(value);
    if (ok) setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-3 py-3">
      <div className="flex items-end gap-2">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Écrivez votre réponse…  (Entrée pour envoyer, Maj+Entrée = nouvelle ligne)"
          className="max-h-32 flex-1 resize-none rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={submit}
          disabled={sending || !text.trim()}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          aria-label="Envoyer"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </motion.button>
      </div>
    </div>
  );
};

export default Composer;
