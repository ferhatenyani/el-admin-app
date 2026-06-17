import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { MESSAGE_SENDER } from '../../services/whatsappApi';
import { clockTime } from './helpers';

/**
 * One message in the thread. Visually distinct by author:
 *  - CUSTOMER : left, white/grey
 *  - BOT      : right, light blue, "Bot" tag
 *  - ADMIN    : right, solid blue, "Vous" tag
 */
const MessageBubble = ({ message }) => {
  const isCustomer = message.senderType === MESSAGE_SENDER.CUSTOMER;
  const isAdmin = message.senderType === MESSAGE_SENDER.ADMIN;
  const isBot = message.senderType === MESSAGE_SENDER.BOT;

  const bubble = isCustomer
    ? 'bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-tl-sm'
    : isAdmin
      ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
      : 'bg-blue-50 text-blue-900 border border-blue-100 rounded-2xl rounded-tr-sm';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-[78%] sm:max-w-[70%] px-3.5 py-2 shadow-sm ${bubble}`}>
        {(isBot || isAdmin) && (
          <span
            className={`mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${
              isAdmin ? 'text-blue-100' : 'text-blue-500'
            }`}
          >
            {isBot && <Bot className="h-3 w-3" />}
            {isAdmin ? 'Vous' : 'Bot'}
          </span>
        )}
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
        <span className={`mt-1 block text-right text-[10px] ${isAdmin ? 'text-blue-100/80' : 'text-gray-400'}`}>
          {clockTime(message.sentAt || message.createdAt)}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
