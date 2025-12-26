import { BookOpen, Users, TrendingUp, Sparkles, Calendar, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import StatsCard from '../components/common/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import { getRecentOrders } from '../mock/mockApi';
import { formatCurrency } from '../utils/format';

/**
 * Modern Dashboard Page - Stateless Container
 * Features:
 * - No state management - each child manages its own data
 * - Each StatsCard independently fetches and filters its data
 * - SalesChart independently manages its time filter
 * - Only RecentOrders fetched at dashboard level (static, no filter)
 * - Minimal re-renders - only components that change data re-render
 */

const Dashboard = () => {
  // Only fetch recent orders (no time filter, static data)
  const { data: recentOrders = [], isLoading } = useQuery({
    queryKey: ['recentOrders'],
    queryFn: () => getRecentOrders(6),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Get current date for header
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Detail builders for each stat card - pure functions, no state
  const buildBooksDetails = (data, timeRange) => ({
    description: "Nombre total de livres disponibles dans votre catalogue",
    breakdown: [
      { label: "Disponibles", value: data.totalBooks - 45, color: "text-green-600" },
      { label: "En rupture de stock", value: 45, color: "text-red-600" },
      { label: "Nouveaux ce mois-ci", value: 23, color: "text-blue-600" }
    ],
    lastUpdated: "Mis à jour il y a 2 heures",
    comparison: {
      period: "vs mois dernier",
      change: `${data.growth.books.isPositive ? '+' : '-'}${data.growth.books.value}%`,
      isPositive: data.growth.books.isPositive
    }
  });

  const buildUsersDetails = (data, timeRange) => ({
    description: "Utilisateurs inscrits sur votre plateforme",
    breakdown: [
      { label: "Utilisateurs actifs", value: Math.floor(data.totalUsers * 0.68), color: "text-green-600" },
      { label: "Utilisateurs inactifs", value: Math.floor(data.totalUsers * 0.32), color: "text-gray-600" },
      { label: "Nouveaux cette semaine", value: 156, color: "text-blue-600" }
    ],
    lastUpdated: "Mis à jour il y a 1 heure",
    comparison: {
      period: "vs mois dernier",
      change: `${data.growth.users.isPositive ? '+' : '-'}${data.growth.users.value}%`,
      isPositive: data.growth.users.isPositive
    }
  });

  const buildOrdersDetails = (data, timeRange) => ({
    description: "Total des commandes reçues depuis toujours",
    breakdown: [
      { label: "Terminées", value: Math.floor(data.totalOrders * 0.65), color: "text-green-600" },
      { label: "En attente", value: Math.floor(data.totalOrders * 0.25), color: "text-yellow-600" },
      { label: "Cette semaine", value: 47, color: "text-blue-600" }
    ],
    lastUpdated: "Mis à jour il y a 30 minutes",
    comparison: {
      period: "vs mois dernier",
      change: `${data.growth.orders.isPositive ? '+' : '-'}${data.growth.orders.value}%`,
      isPositive: data.growth.orders.isPositive
    }
  });

  const buildSalesDetails = (data, timeRange) => ({
    description: "Revenu généré ce mois-ci",
    breakdown: [
      { label: "Ventes en ligne", value: formatCurrency(data.monthlySales * 0.72), color: "text-green-600" },
      { label: "Ventes en magasin", value: formatCurrency(data.monthlySales * 0.28), color: "text-blue-600" },
      { label: "Commande moyenne", value: formatCurrency(data.monthlySales / Math.max(data.totalOrders, 1)), color: "text-purple-600" }
    ],
    lastUpdated: "Mis à jour il y a 10 minutes",
    comparison: {
      period: "vs mois dernier",
      change: `${data.growth.sales.isPositive ? '+' : '-'}${data.growth.sales.value}%`,
      isPositive: data.growth.sales.isPositive
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header Section with modern design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-xl mb-8 overflow-hidden relative"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">
                  Tableau de bord
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-blue-100 text-lg"
              >
                Bienvenue ! Voici ce qui se passe dans votre boutique aujourd'hui.
              </motion.p>
            </div>

            {/* Date badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            >
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-white font-medium text-sm">{currentDate}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area with improved spacing */}
      <div className="space-y-8 pb-8">
        {/* Stats Cards Grid - Each card is independent and self-managing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10" style={{ overflow: 'visible' }}>
          <StatsCard
            title="Total des livres"
            icon={BookOpen}
            color="blue"
            delay={0}
            metricKey="books"
            showTimeSelector={true}
            detailsDataBuilder={buildBooksDetails}
          />
          <StatsCard
            title="Total des utilisateurs"
            icon={Users}
            color="green"
            delay={0.1}
            metricKey="users"
            showTimeSelector={true}
            detailsDataBuilder={buildUsersDetails}
          />
          <StatsCard
            title="Total des commandes"
            icon={ShoppingCart}
            color="purple"
            delay={0.15}
            metricKey="orders"
            showTimeSelector={true}
            detailsDataBuilder={buildOrdersDetails}
          />
          <StatsCard
            title="Ventes mensuelles"
            icon={TrendingUp}
            color="red"
            delay={0.2}
            metricKey="sales"
            showTimeSelector={true}
            detailsDataBuilder={buildSalesDetails}
          />
        </div>

        {/* Sales Chart Section - Independent time filter */}
        <div className="relative z-0">
          <SalesChart />
        </div>

        {/* Recent Orders Section */}
        {!isLoading && (
          <div className="relative z-0">
            <RecentOrdersTable orders={recentOrders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
