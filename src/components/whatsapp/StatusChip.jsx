import { Bot, AlertTriangle, Headset, CheckCheck } from 'lucide-react';
import { CONVERSATION_STATUS } from '../../services/whatsappApi';

const STATUS_CONFIG = {
  [CONVERSATION_STATUS.BOT_HANDLING]: {
    label: 'Bot',
    icon: Bot,
    chip: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
  },
  [CONVERSATION_STATUS.NEEDS_HUMAN]: {
    label: 'À traiter',
    icon: AlertTriangle,
    chip: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-500',
    pulse: true,
  },
  [CONVERSATION_STATUS.HUMAN_HANDLING]: {
    label: 'En cours',
    icon: Headset,
    chip: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  [CONVERSATION_STATUS.RESOLVED]: {
    label: 'Résolu',
    icon: CheckCheck,
    chip: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
};

const StatusChip = ({ status, size = 'sm', withIcon = true }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[CONVERSATION_STATUS.BOT_HANDLING];
  const Icon = config.icon;
  const padding = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding} ${config.chip}`}>
      {withIcon ? (
        <Icon className="w-3.5 h-3.5" />
      ) : (
        <span className="relative flex h-2 w-2">
          {config.pulse && (
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.dot}`} />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`} />
        </span>
      )}
      {config.label}
    </span>
  );
};

export default StatusChip;
