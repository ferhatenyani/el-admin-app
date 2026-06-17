import { useState, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { useConversations } from '../hooks/useWhatsapp';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';
import ConversationList from '../components/whatsapp/ConversationList';
import ThreadView from '../components/whatsapp/ThreadView';
import EmptyState from '../components/whatsapp/EmptyState';

const Whatsapp = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const debouncedSearch = useDebounce(search, 300);
  const filters = useMemo(
    () => ({ search: debouncedSearch || undefined, status: status || undefined, size: 30 }),
    [debouncedSearch, status]
  );

  const { data, isLoading, isError } = useConversations(filters);
  const conversations = data?.content || [];
  const total = data?.totalElements;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <MessageCircle className="h-5 w-5" />
          </span>
          Messagerie WhatsApp
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Suivez les conversations, reprenez la main sur le bot et répondez aux clients.
        </p>
      </div>

      <div className="flex h-[calc(100vh-12rem)] min-h-[480px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Conversation list (full width on mobile until one is selected) */}
        <div
          className={`${selectedId ? 'hidden lg:flex' : 'flex'} w-full flex-col border-r border-gray-200 lg:w-[360px] lg:flex-shrink-0`}
        >
          <ConversationList
            conversations={conversations}
            total={total}
            isLoading={isLoading}
            isError={isError}
            selectedId={selectedId}
            onSelect={setSelectedId}
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
          />
        </div>

        {/* Thread + composer */}
        <div className={`${selectedId ? 'flex' : 'hidden lg:flex'} min-w-0 flex-1 flex-col`}>
          {selectedId ? (
            <ThreadView
              conversationId={selectedId}
              onBack={() => setSelectedId(null)}
              success={success}
              error={error}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Whatsapp;
