import { Loader2, Inbox } from 'lucide-react';
import ConversationFilters from './ConversationFilters';
import ConversationRow from './ConversationRow';

const ConversationList = ({
  conversations,
  total,
  isLoading,
  isError,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-base font-semibold text-gray-900">Conversations</h2>
        {total != null && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">{total}</span>
        )}
      </div>

      <ConversationFilters
        search={search}
        onSearchChange={onSearchChange}
        status={status}
        onStatusChange={onStatusChange}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading && conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-gray-500">
            Impossible de charger les conversations.
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-gray-400">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">Aucune conversation</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation, index) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                index={index}
                active={conversation.id === selectedId}
                onClick={() => onSelect(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
