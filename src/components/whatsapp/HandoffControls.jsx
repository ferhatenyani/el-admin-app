import { motion } from 'framer-motion';
import { Headset, Bot, CheckCheck, Loader2 } from 'lucide-react';
import { CONVERSATION_STATUS } from '../../services/whatsappApi';

const btnBase =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60';

/**
 * Status-aware handoff actions: take over / hand back to bot / mark resolved.
 */
const HandoffControls = ({ status, busy, onTakeOver, onHandBack, onResolve }) => {
  const isPausedByHuman = status === CONVERSATION_STATUS.HUMAN_HANDLING;
  const isResolved = status === CONVERSATION_STATUS.RESOLVED;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isPausedByHuman ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={busy}
          onClick={onHandBack}
          className={`${btnBase} bg-gray-100 text-gray-700 hover:bg-gray-200`}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
          Rendre au bot
        </motion.button>
      ) : (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={busy}
          onClick={onTakeOver}
          className={`${btnBase} ${
            status === CONVERSATION_STATUS.NEEDS_HUMAN
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Headset className="h-4 w-4" />}
          {isResolved ? 'Reprendre' : 'Prendre en charge'}
        </motion.button>
      )}

      {!isResolved && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          disabled={busy}
          onClick={onResolve}
          className={`${btnBase} bg-green-50 text-green-700 hover:bg-green-100`}
        >
          <CheckCheck className="h-4 w-4" />
          Marquer résolu
        </motion.button>
      )}
    </div>
  );
};

export default HandoffControls;
