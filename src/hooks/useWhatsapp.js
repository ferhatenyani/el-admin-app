import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as whatsappApi from '../services/whatsappApi';

const WA = 'whatsapp';

// Polling intervals (ms). react-query pauses polling when the tab is in the
// background by default (refetchIntervalInBackground === false).
const INBOX_POLL = 6000;
const THREAD_POLL = 4000;
const UNREAD_POLL = 20000;

export const useConversations = (filters) =>
  useQuery({
    queryKey: [WA, 'conversations', filters],
    queryFn: ({ signal }) => whatsappApi.getConversations(filters, signal),
    refetchInterval: INBOX_POLL,
    placeholderData: (prev) => prev, // keep previous page while refetching
  });

export const useConversation = (id) =>
  useQuery({
    queryKey: [WA, 'conversation', id],
    queryFn: ({ signal }) => whatsappApi.getConversation(id, signal),
    enabled: !!id,
    refetchInterval: INBOX_POLL,
  });

export const useMessages = (id) =>
  useQuery({
    queryKey: [WA, 'messages', id],
    queryFn: ({ signal }) => whatsappApi.getMessages(id, {}, signal),
    enabled: !!id,
    refetchInterval: THREAD_POLL,
    placeholderData: (prev) => prev,
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: [WA, 'unread'],
    queryFn: ({ signal }) => whatsappApi.getUnreadCount(signal),
    refetchInterval: UNREAD_POLL,
  });

/**
 * Mutations for replying and driving the handoff state machine. Each invalidates
 * the whatsapp queries so the inbox, thread and badge refresh immediately.
 */
export const useConversationActions = () => {
  const qc = useQueryClient();
  const invalidateAll = () => qc.invalidateQueries({ queryKey: [WA] });

  const reply = useMutation({
    mutationFn: ({ id, content }) => whatsappApi.sendReply(id, content),
    onSuccess: invalidateAll,
  });
  const takeOver = useMutation({ mutationFn: (id) => whatsappApi.takeOver(id), onSuccess: invalidateAll });
  const handBack = useMutation({ mutationFn: (id) => whatsappApi.handBack(id), onSuccess: invalidateAll });
  const resolve = useMutation({ mutationFn: (id) => whatsappApi.resolveConversation(id), onSuccess: invalidateAll });
  const markRead = useMutation({
    mutationFn: (id) => whatsappApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [WA, 'conversations'] });
      qc.invalidateQueries({ queryKey: [WA, 'unread'] });
    },
  });

  return { reply, takeOver, handBack, resolve, markRead };
};
