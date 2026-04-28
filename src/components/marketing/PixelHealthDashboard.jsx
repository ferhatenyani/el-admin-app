import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, Eye, Search, ShoppingCart, CreditCard,
  UserCheck, MessageCircle, TrendingUp, Activity,
  AlertTriangle, CheckCircle2, WifiOff, Zap,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { getPixelEvents } from '../../services/pixelApi';
import { formatDateTime } from '../../utils/format';

const EVENT_META = {
  PageView:            { label: 'Vue de page',         icon: Eye,           color: '#6366f1' },
  ViewContent:         { label: 'Vue produit',          icon: Eye,           color: '#8b5cf6' },
  Search:              { label: 'Recherche',            icon: Search,        color: '#0ea5e9' },
  AddToCart:           { label: 'Ajout panier',         icon: ShoppingCart,  color: '#f59e0b' },
  InitiateCheckout:    { label: 'Démarrage paiement',   icon: CreditCard,    color: '#f97316' },
  Purchase:            { label: 'Achat',                icon: TrendingUp,    color: '#10b981' },
  CompleteRegistration:{ label: 'Inscription',          icon: UserCheck,     color: '#3b82f6' },
  Contact:             { label: 'Contact',              icon: MessageCircle, color: '#ec4899' },
};

const SHORT_LABELS = {
  PageView: 'Page',
  ViewContent: 'Produit',
  Search: 'Recherche',
  AddToCart: 'Panier',
  InitiateCheckout: 'Paiement',
  Purchase: 'Achat',
  CompleteRegistration: 'Inscription',
  Contact: 'Contact',
};

function deriveStatus(events) {
  if (!events || events.length === 0) return 'unknown';
  const totalEvents = events.reduce((s, e) => s + e.count24h, 0);
  if (totalEvents === 0) return 'red';
  const purchase = events.find(e => e.eventName === 'Purchase');
  if (purchase && purchase.count24h > 0) return 'green';
  return 'yellow';
}

const STATUS_CONFIG = {
  green:   { label: 'Pixel actif — achat détecté',   color: 'text-emerald-700', bg: 'bg-emerald-50',   border: 'border-emerald-200', dot: 'bg-emerald-500' },
  yellow:  { label: 'Actif — aucun achat récent',    color: 'text-amber-700',   bg: 'bg-amber-50',     border: 'border-amber-200',   dot: 'bg-amber-400' },
  red:     { label: 'Aucun événement CAPI (24h)',     color: 'text-red-700',     bg: 'bg-red-50',       border: 'border-red-200',     dot: 'bg-red-500' },
  unknown: { label: 'Statut inconnu',                 color: 'text-gray-500',    bg: 'bg-gray-50',      border: 'border-gray-200',    dot: 'bg-gray-400' },
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse shrink-0" />
      <div className="flex-1 h-4 rounded bg-gray-100 animate-pulse" />
      <div className="w-16 h-6 rounded-full bg-gray-100 animate-pulse" />
      <div className="w-32 h-4 rounded bg-gray-100 animate-pulse" />
    </div>
  );
}

function CustomBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { eventName, count24h } = payload[0].payload;
  const meta = EVENT_META[eventName] || {};
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800">{meta.label || eventName}</p>
      <p className="text-gray-500 mt-0.5">
        <span className="font-bold text-gray-900">{count24h}</span> événement{count24h !== 1 ? 's' : ''} (24h)
      </p>
    </div>
  );
}

export default function PixelHealthDashboard() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getPixelEvents();
      setEvents(data);
      setLastFetch(new Date());
    } catch {
      setError('Impossible de charger les événements pixel.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const status = deriveStatus(events);
  const statusCfg = STATUS_CONFIG[status];
  const chartData = events
    ? events.map(e => ({ ...e, shortLabel: SHORT_LABELS[e.eventName] || e.eventName }))
    : [];
  const totalCount = events ? events.reduce((s, e) => s + e.count24h, 0) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Suivi Pixel Meta</h2>
            <p className="text-slate-400 text-xs mt-0.5">Événements CAPI · 24 dernières heures</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status pill */}
          {!loading && !error && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}>
              <span className={`w-2 h-2 rounded-full ${statusCfg.dot} ${status === 'green' ? 'animate-pulse' : ''}`} />
              {statusCfg.label}
            </div>
          )}

          {/* Refresh button */}
          <button
            onClick={() => fetchEvents(true)}
            disabled={loading || refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Last fetch timestamp */}
        {lastFetch && (
          <p className="text-xs text-gray-400">
            Dernière mise à jour : {formatDateTime(lastFetch.toISOString())}
          </p>
        )}

        {/* ── Error state ── */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-10 text-center"
            >
              <WifiOff className="w-10 h-10 text-red-300" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
              <button
                onClick={() => fetchEvents()}
                className="text-xs text-blue-600 hover:underline"
              >
                Réessayer
              </button>
            </motion.div>
          )}

          {/* ── Loading skeletons ── */}
          {loading && !error && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="h-40 bg-gray-50 rounded-xl animate-pulse mb-5" />
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              </div>
            </motion.div>
          )}

          {/* ── Content ── */}
          {!loading && !error && events && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              {/* Summary strip */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Total événements (24h)</p>
                  <p className="text-3xl font-bold text-blue-700">{totalCount}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-1">Achats CAPI (24h)</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {events.find(e => e.eventName === 'Purchase')?.count24h ?? 0}
                  </p>
                </div>
              </div>

              {/* Bar chart */}
              {totalCount > 0 ? (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Répartition des événements</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="shortLabel"
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 6 }} />
                      <Bar dataKey="count24h" radius={[5, 5, 0, 0]}>
                        {chartData.map(entry => (
                          <Cell
                            key={entry.eventName}
                            fill={entry.count24h > 0 ? (EVENT_META[entry.eventName]?.color ?? '#6366f1') : '#e5e7eb'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 bg-gray-50 rounded-xl border border-gray-100">
                  <Zap className="w-9 h-9 text-gray-300" />
                  <p className="text-sm text-gray-500 font-medium">Aucun événement CAPI dans les dernières 24h</p>
                  <p className="text-xs text-gray-400 text-center max-w-xs">
                    Les événements apparaissent ici dès qu&apos;un achat est traité par le serveur avec META_ENABLED=true.
                  </p>
                </div>
              )}

              {/* Events table */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Événement</th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">24h</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Dernier vu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {events.map((evt, i) => {
                      const meta = EVENT_META[evt.eventName] || { label: evt.eventName, icon: Activity, color: '#6b7280' };
                      const Icon = meta.icon;
                      const hasActivity = evt.count24h > 0;
                      return (
                        <motion.tr
                          key={evt.eventName}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${meta.color}14` }}
                              >
                                <Icon className="w-4 h-4" style={{ color: meta.color }} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{meta.label}</p>
                                <p className="text-xs text-gray-400">{evt.eventName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {hasActivity ? (
                              <span
                                className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 rounded-full text-xs font-bold"
                                style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                              >
                                {evt.count24h}
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                                0
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {evt.lastSeenAt ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="text-xs text-gray-500">{formatDateTime(evt.lastSeenAt)}</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                <span className="text-xs text-gray-400">Jamais</span>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-gray-400 text-center pb-1">
                Seuls les événements envoyés via CAPI (côté serveur) sont comptabilisés ici.
                Les événements navigateur (PageView, etc.) ne sont pas journalisés par le backend.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
