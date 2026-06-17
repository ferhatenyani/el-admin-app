import { motion } from 'framer-motion';
import StatusChip from './StatusChip';
import ChannelBadge from './ChannelBadge';
import { initials, timeAgo, displayName } from './helpers';

const ConversationRow = ({ conversation, active, onClick, index = 0 }) => {
  const name = displayName(conversation);
  const unread = conversation.unreadCount > 0;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
      className={`w-full text-left px-3 py-3 border-l-2 transition-colors ${
        active
          ? 'border-l-blue-600 bg-blue-50'
          : 'border-l-transparent hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
            {initials(conversation.customerName, conversation.customerPhone || conversation.senderId)}
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full">
            <ChannelBadge channel={conversation.channel} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className={`truncate text-sm ${unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
              {name}
            </span>
            <span className="flex-shrink-0 text-[11px] text-gray-400">{timeAgo(conversation.lastMessageAt)}</span>
          </div>

          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className={`truncate text-xs ${unread ? 'text-gray-700' : 'text-gray-500'}`}>
              {conversation.lastMessageSnippet || '—'}
            </p>
            {unread && (
              <span className="flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
                {conversation.unreadCount}
              </span>
            )}
          </div>

          <div className="mt-1.5">
            <StatusChip status={conversation.status} size="xs" withIcon={false} />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default ConversationRow;
