import axios from 'axios';
import { createApiClient } from './apiClient';
import { getApiErrorMessage } from '../utils/apiErrors';

const api = createApiClient();

export const CHANNEL = {
  WHATSAPP: 'WHATSAPP',
  MESSENGER: 'MESSENGER',
  INSTAGRAM: 'INSTAGRAM',
};

export const CONVERSATION_STATUS = {
  BOT_HANDLING: 'BOT_HANDLING',
  NEEDS_HUMAN: 'NEEDS_HUMAN',
  HUMAN_HANDLING: 'HUMAN_HANDLING',
  RESOLVED: 'RESOLVED',
};

export const MESSAGE_SENDER = {
  CUSTOMER: 'CUSTOMER',
  BOT: 'BOT',
  ADMIN: 'ADMIN',
};

// A directly-serialized Spring Page can be flat (PageImpl) or nested ({page:{...}});
// also fall back to the X-Total-Count header. Parse all shapes defensively.
const parsePage = (data, headers) => {
  const content = data?.content || [];
  const meta = data?.page || data || {};
  const headerTotal = headers?.['x-total-count'] != null ? Number(headers['x-total-count']) : undefined;
  return {
    content,
    number: meta.number ?? 0,
    size: meta.size ?? content.length,
    totalElements: meta.totalElements ?? headerTotal ?? content.length,
    totalPages: meta.totalPages ?? 1,
  };
};

export const getConversations = async (params = {}, signal = null) => {
  try {
    const queryParams = {
      page: params.page ?? 0,
      size: params.size ?? 30,
      ...(params.channel && { channel: params.channel }),
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search }),
      ...(params.sort && { sort: params.sort }),
    };
    const res = await api.get('/api/conversations', { params: queryParams, signal });
    return parsePage(res.data, res.headers);
  } catch (error) {
    if (axios.isCancel(error)) throw new Error('REQUEST_CANCELLED');
    throw error;
  }
};

export const getConversation = async (id, signal = null) => {
  const res = await api.get(`/api/conversations/${id}`, { signal });
  return res.data;
};

export const getMessages = async (id, params = {}, signal = null) => {
  try {
    const res = await api.get(`/api/conversations/${id}/messages`, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 200,
        sort: 'id,asc',
        ...(params.afterId && { afterId: params.afterId }),
      },
      signal,
    });
    return parsePage(res.data, res.headers).content;
  } catch (error) {
    if (axios.isCancel(error)) throw new Error('REQUEST_CANCELLED');
    throw error;
  }
};

export const getUnreadCount = async (signal = null) => {
  const res = await api.get('/api/conversations/unread-count', { signal });
  return res.data?.unreadCount ?? 0;
};

export const sendReply = async (id, content) => {
  const res = await api.post(`/api/conversations/${id}/reply`, { content });
  return res.data;
};

export const takeOver = async (id) => (await api.post(`/api/conversations/${id}/take-over`)).data;
export const handBack = async (id) => (await api.post(`/api/conversations/${id}/hand-back`)).data;
export const resolveConversation = async (id) => (await api.post(`/api/conversations/${id}/resolve`)).data;
export const markRead = async (id) => (await api.post(`/api/conversations/${id}/read`)).data;

/**
 * Surfaces backend errors for the messaging module.
 * Our custom errors (24h window closed, bot unreachable) come through as RFC7807
 * ProblemDetail with the French text in `detail` and no `message` code — prefer that.
 * JHipster coded errors (with a `message` key) defer to the shared mapper.
 */
export const whatsappError = (error, fallback = 'Une erreur est survenue') => {
  const data = error?.response?.data;
  if (data && !data.message && data.detail) return data.detail;
  return getApiErrorMessage(error, fallback);
};
