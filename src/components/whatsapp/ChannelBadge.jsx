import { MessageCircle, Send, Instagram } from 'lucide-react';
import { CHANNEL } from '../../services/whatsappApi';

const CHANNEL_CONFIG = {
  [CHANNEL.WHATSAPP]: { label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
  [CHANNEL.MESSENGER]: { label: 'Messenger', icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
  [CHANNEL.INSTAGRAM]: { label: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
};

const ChannelBadge = ({ channel, showLabel = false }) => {
  const config = CHANNEL_CONFIG[channel] || CHANNEL_CONFIG[CHANNEL.WHATSAPP];
  const Icon = config.icon;

  if (showLabel) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${config.bg} ${config.color}`}
      title={config.label}
    >
      <Icon className="w-3 h-3" />
    </span>
  );
};

export default ChannelBadge;
