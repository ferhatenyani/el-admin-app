import { formatDate } from '../../utils/format';

/** Up-to-2-letter initials from a name, falling back to a phone's last digits. */
export const initials = (name, phone) => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }
  if (phone) return phone.slice(-2);
  return '?';
};

/** Short French relative time: "à l'instant", "il y a 5 min", "il y a 2 h", "hier", or a date. */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 172800) return 'hier';
  return formatDate(date);
};

/** HH:mm time label for a message bubble. */
export const clockTime = (dateStr) => {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
};

/**
 * WhatsApp 24h customer-care window state.
 * @returns {{ open: boolean, label: string }}
 */
export const careWindow = (withinWindow, expiresAt) => {
  if (!withinWindow || !expiresAt) {
    return { open: false, label: 'Fenêtre 24h fermée' };
  }
  const remaining = (new Date(expiresAt).getTime() - Date.now()) / 1000;
  if (remaining <= 0) return { open: false, label: 'Fenêtre 24h fermée' };
  const hours = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const left = hours >= 1 ? `${hours}h${mins.toString().padStart(2, '0')}` : `${mins} min`;
  return { open: true, label: `Fenêtre 24h : ${left} restantes` };
};

/** A readable label for a conversation: customer name, else phone/sender id. */
export const displayName = (conversation) =>
  conversation?.customerName?.trim() || conversation?.customerPhone || conversation?.senderId || 'Client';
