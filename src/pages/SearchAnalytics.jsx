import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  SearchX,
  Hash,
  Percent,
  TrendingUp,
  PackageSearch,
  CheckCircle2,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as searchAnalyticsApi from '../services/searchAnalyticsApi';

const PERIOD_OPTIONS = [
  { days: 7, label: '7 jours' },
  { days: 30, label: '30 jours' },
  { days: 90, label: '90 jours' },
];

const formatNumber = (n) => Number(n || 0).toLocaleString('fr-FR');

const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateShort = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

/** Fill missing days with 0 so the trend reads as a continuous period */
const fillTrendGaps = (points, days) => {
  const byDate = new Map(points.map((p) => [p.date, p.count]));
  const filled = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    filled.push({
      date: key,
      label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      count: byDate.get(key) || 0,
    });
  }
  return filled;
};

const StatCard = ({ icon: Icon, label, value, hint, tone = 'blue', index = 0 }) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${tones[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

const TrendTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs text-gray-500">{point.label}</p>
      <p className="text-sm font-semibold text-gray-900">
        {formatNumber(point.count)} recherche{point.count > 1 ? 's' : ''}
      </p>
    </div>
  );
};

const ListSkeleton = ({ rows = 6 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="h-9 bg-gray-100 rounded-lg" />
    ))}
  </div>
);

const SearchAnalytics = () => {
  const [days, setDays] = useState(30);
  const [recentPage, setRecentPage] = useState(0);

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['search-logs', 'stats', days],
    queryFn: ({ signal }) => searchAnalyticsApi.getSearchStats(days, signal),
  });

  const { data: trendData, isLoading: isTrendLoading } = useQuery({
    queryKey: ['search-logs', 'trend', days],
    queryFn: ({ signal }) => searchAnalyticsApi.getSearchTrend(days, signal),
  });

  const { data: topTerms = [], isLoading: isTopLoading } = useQuery({
    queryKey: ['search-logs', 'top-terms', days],
    queryFn: ({ signal }) => searchAnalyticsApi.getTopTerms(days, 10, signal),
  });

  const { data: zeroTerms = [], isLoading: isZeroLoading } = useQuery({
    queryKey: ['search-logs', 'zero-results', days],
    queryFn: ({ signal }) => searchAnalyticsApi.getZeroResultTerms(days, 10, signal),
  });

  const { data: recent, isLoading: isRecentLoading } = useQuery({
    queryKey: ['search-logs', 'recent', recentPage],
    queryFn: ({ signal }) => searchAnalyticsApi.getRecentSearches(recentPage, 10, signal),
    placeholderData: keepPreviousData,
  });

  const isLoading = isStatsLoading || isTrendLoading || isTopLoading || isZeroLoading;
  const trend = useMemo(() => fillTrendGaps(trendData ?? [], days), [trendData, days]);

  const maxTopCount = topTerms.length > 0 ? topTerms[0].count : 1;
  const zeroResultRatePct = stats ? (stats.zeroResultRate * 100).toFixed(1).replace('.', ',') : '0';

  // 'anonymousUser' is Spring Security's anonymous principal, not a real login
  const realLogin = (log) => (log.userLogin && log.userLogin !== 'anonymousUser' ? log.userLogin : null);

  const clientCell = (log) => {
    const login = realLogin(log);
    if (login) {
      return (
        <Link
          to={`/admin/users?login=${encodeURIComponent(login)}`}
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline"
          title={`Voir la fiche de ${login}`}
        >
          <User className="w-3.5 h-3.5 text-blue-300" />
          {login}
        </Link>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-gray-500">
        <User className="w-3.5 h-3.5 text-gray-300" />
        {log.visitorId ? `Visiteur ${log.visitorId.slice(0, 8)}` : 'Anonyme'}
      </span>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Analyse des recherches</h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              Découvrez ce que vos clients cherchent — et surtout ce qu'ils ne trouvent pas
            </p>
          </div>
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg p-1 self-start md:self-auto">
            {PERIOD_OPTIONS.map(({ days: d, label }) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  days === d ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          index={0}
          icon={Search}
          label="Recherches totales"
          value={isLoading ? '…' : formatNumber(stats?.totalSearches)}
          hint={`Sur les ${days} derniers jours`}
          tone="blue"
        />
        <StatCard
          index={1}
          icon={Hash}
          label="Termes uniques"
          value={isLoading ? '…' : formatNumber(stats?.uniqueTerms)}
          hint="Requêtes distinctes"
          tone="indigo"
        />
        <StatCard
          index={2}
          icon={SearchX}
          label="Recherches sans résultat"
          value={isLoading ? '…' : formatNumber(stats?.zeroResultSearches)}
          hint="Opportunités de catalogue"
          tone="amber"
        />
        <StatCard
          index={3}
          icon={Percent}
          label="Taux sans résultat"
          value={isLoading ? '…' : `${zeroResultRatePct} %`}
          hint="Part des recherches infructueuses"
          tone="rose"
        />
      </div>

      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Volume de recherches par jour</h2>
        </div>
        <div className="h-64">
          {isLoading ? (
            <div className="h-full bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="searchTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={28}
                />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#bfdbfe' }} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#searchTrendFill)"
                  activeDot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Top terms + Zero-result terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top terms */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Termes les plus recherchés</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">Ce que vos clients demandent le plus</p>
          {isLoading ? (
            <ListSkeleton />
          ) : topTerms.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucune recherche enregistrée sur cette période</p>
            </div>
          ) : (
            <ol className="space-y-2">
              {topTerms.map((t, i) => (
                <li key={t.term} className="relative overflow-hidden rounded-lg">
                  {/* Proportional background bar */}
                  <div
                    className="absolute inset-y-0 left-0 bg-blue-50 rounded-lg"
                    style={{ width: `${Math.max((t.count / maxTopCount) * 100, 6)}%` }}
                  />
                  <div className="relative flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-blue-600 w-5 text-right shrink-0">{i + 1}</span>
                      <span className="text-sm font-medium text-gray-800 truncate" title={t.term}>
                        {t.term}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        ~{Math.round(t.avgResults ?? 0)} résultat{Math.round(t.avgResults ?? 0) > 1 ? 's' : ''}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{formatNumber(t.count)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </motion.div>

        {/* Zero-result terms - the actionable panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl sm:rounded-2xl border border-amber-200 shadow-sm p-4 sm:p-6 ring-1 ring-amber-100"
        >
          <div className="flex items-center gap-2 mb-1">
            <PackageSearch className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recherches sans résultat</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            Des demandes clients sans réponse — des livres à ajouter au catalogue&nbsp;?
          </p>
          {isLoading ? (
            <ListSkeleton />
          ) : zeroTerms.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-sm">Toutes les recherches ont donné des résultats sur cette période</p>
            </div>
          ) : (
            <ul className="divide-y divide-amber-50">
              {zeroTerms.map((t) => (
                <li key={t.term} className="flex items-center justify-between py-2.5 gap-3">
                  <span className="text-sm font-medium text-gray-800 truncate" title={t.term}>
                    {t.term}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateShort(t.lastSearchedAt)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      ×&nbsp;{formatNumber(t.count)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Recent searches table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm"
      >
        <div className="p-4 sm:p-6 pb-0 sm:pb-0 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Dernières recherches</h2>
        </div>
        <div className="p-4 sm:p-6 overflow-x-auto">
          {isRecentLoading ? (
            <ListSkeleton rows={8} />
          ) : !recent || recent.content?.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucune recherche enregistrée pour le moment</p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3 font-medium">Terme recherché</th>
                    <th className="pb-3 font-medium">Résultats</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Client</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.content.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 pr-4 font-medium text-gray-800 max-w-[200px] sm:max-w-xs truncate" title={log.searchTerm}>
                        {log.searchTerm}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            log.resultsCount === 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {formatNumber(log.resultsCount)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell">{clientCell(log)}</td>
                      <td className="py-3 text-right text-gray-500 whitespace-nowrap">{formatDateTime(log.searchedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {recent.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Page {recent.number + 1} sur {recent.totalPages} — {formatNumber(recent.totalElements)} recherches
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRecentPage((p) => Math.max(0, p - 1))}
                      disabled={recent.first}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Page précédente"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRecentPage((p) => p + 1)}
                      disabled={recent.last}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Page suivante"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SearchAnalytics;
