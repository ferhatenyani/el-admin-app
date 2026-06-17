import { useEffect, useRef } from 'react';
import { ArrowLeft, AlertTriangle, Loader2, Phone } from 'lucide-react';
import { useConversation, useMessages, useConversationActions } from '../../hooks/useWhatsapp';
import { whatsappError, CONVERSATION_STATUS } from '../../services/whatsappApi';
import { initials, displayName, careWindow } from './helpers';
import StatusChip from './StatusChip';
import ChannelBadge from './ChannelBadge';
import HandoffControls from './HandoffControls';
import MessageBubble from './MessageBubble';
import Composer from './Composer';

const ThreadView = ({ conversationId, onBack, success, error }) => {
  const { data: conversation } = useConversation(conversationId);
  const { data: messages = [], isLoading } = useMessages(conversationId);
  const { reply, takeOver, handBack, resolve, markRead } = useConversationActions();

  const scrollRef = useRef(null);
  const prevCount = useRef(0);

  // Mark the conversation read when it is opened.
  useEffect(() => {
    if (conversationId) {
      markRead.mutate(conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Auto-scroll to the bottom when new messages arrive (or the thread changes).
  useEffect(() => {
    const grew = messages.length > prevCount.current;
    prevCount.current = messages.length;
    if (scrollRef.current && grew) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, conversationId]);

  const busy = takeOver.isPending || handBack.isPending || resolve.isPending;
  const window = careWindow(conversation?.withinCustomerCareWindow, conversation?.customerCareWindowExpiresAt);

  const runAction = (mutation, okMessage) =>
    mutation.mutate(conversationId, {
      onSuccess: () => success(okMessage),
      onError: (e) => error(whatsappError(e)),
    });

  const handleSend = async (content) => {
    try {
      await reply.mutateAsync({ id: conversationId, content });
      success('Message envoyé');
      return true;
    } catch (e) {
      error(whatsappError(e, "L'envoi du message a échoué."));
      return false;
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const name = displayName(conversation);
  const isEscalated = conversation.status === CONVERSATION_STATUS.NEEDS_HUMAN;

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="-ml-1 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
            {initials(conversation.customerName, conversation.customerPhone || conversation.senderId)}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold text-gray-900">{name}</span>
              <StatusChip status={conversation.status} />
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
              <ChannelBadge channel={conversation.channel} showLabel />
              {conversation.customerPhone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {conversation.customerPhone}
                </span>
              )}
            </div>
          </div>

          <div className="hidden sm:block">
            <HandoffControls
              status={conversation.status}
              busy={busy}
              onTakeOver={() => runAction(takeOver, 'Conversation prise en charge')}
              onHandBack={() => runAction(handBack, 'Rendue au bot')}
              onResolve={() => runAction(resolve, 'Conversation résolue')}
            />
          </div>
        </div>

        {/* Handoff controls on mobile (wrap below) */}
        <div className="sm:hidden">
          <HandoffControls
            status={conversation.status}
            busy={busy}
            onTakeOver={() => runAction(takeOver, 'Conversation prise en charge')}
            onHandBack={() => runAction(handBack, 'Rendue au bot')}
            onResolve={() => runAction(resolve, 'Conversation résolue')}
          />
        </div>

        {isEscalated && conversation.escalationReason && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>
              <span className="font-semibold">Escaladé par le bot : </span>
              {conversation.escalationReason}
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="pt-8 text-center text-sm text-gray-400">Aucun message.</p>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>

      {/* Composer */}
      <Composer
        windowOpen={window.open}
        windowLabel={window.label}
        sending={reply.isPending}
        onSend={handleSend}
      />
    </div>
  );
};

export default ThreadView;
