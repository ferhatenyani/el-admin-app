import { Search, X } from 'lucide-react';
import { CONVERSATION_STATUS } from '../../services/whatsappApi';

const STATUS_TABS = [
  { value: null, label: 'Toutes' },
  { value: CONVERSATION_STATUS.NEEDS_HUMAN, label: 'À traiter' },
  { value: CONVERSATION_STATUS.HUMAN_HANDLING, label: 'En cours' },
  { value: CONVERSATION_STATUS.BOT_HANDLING, label: 'Bot' },
  { value: CONVERSATION_STATUS.RESOLVED, label: 'Résolu' },
];

const ConversationFilters = ({ search, onSearchChange, status, onStatusChange }) => {
  return (
    <div className="border-b border-gray-200 px-3 py-3 space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un client, un numéro…"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-9 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS_TABS.map((tab) => {
          const isActive = status === tab.value;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationFilters;
