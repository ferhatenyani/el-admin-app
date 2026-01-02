import { Users, TrendingUp, Sparkles, Calendar, ShoppingCart, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from '../components/common/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
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
  // Mock data - replace with real API call
  const recentOrders = [];
  const isLoading = false;

  // Mock dashboard data
  const mockDashboardData = {
    bestSellingBook: {
      title: "Le Petit Prince",
      soldCount: 1247,
      price: 12.99,
    },
    newUsers: {
      total: 342,
      today: 24,
      thisWeek: 89,
      thisMonth: 342,
    },
    totalOrders: 1893,
    monthlySales: 45678.50,
    growth: {
      bestSellingBook: {
        value: 18,
        isPositive: true,
      },
      newUsers: {
        value: 23,
        isPositive: true,
      },
      orders: {
        value: 12,
        isPositive: true,
      },
      sales: {
        value: 15,
        isPositive: true,
      },
    },
  };

  // Get current date for header
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Detail builders for each stat card - pure functions, no state
  const buildBestSellingBookDetails = (data) => ({
    description: "Le livre le plus populaire de votre catalogue",
    breakdown: [
      { label: "Exemplaires vendus", value: data.bestSellingBook.soldCount, color: "text-blue-600" },
      { label: "Prix unitaire", value: formatCurrency(data.bestSellingBook.price), color: "text-green-600" },
      { label: "Revenu total", value: formatCurrency(data.bestSellingBook.soldCount * data.bestSellingBook.price), color: "text-purple-600" }
    ],
    lastUpdated: "Mis à jour il y a 2 heures"
  });

  const buildNewUsersDetails = (data) => ({
    description: "Nouveaux utilisateurs inscrits sur votre plateforme",
    breakdown: [
      { label: "Cette semaine", value: data.newUsers.thisWeek, color: "text-blue-600" },
      { label: "Ce mois-ci", value: data.newUsers.thisMonth, color: "text-green-600" },
      { label: "Aujourd'hui", value: data.newUsers.today, color: "text-purple-600" }
    ],
    lastUpdated: "Mis à jour il y a 1 heure",
    comparison: {
      period: "vs mois dernier",
      change: `${data.growth.newUsers.isPositive ? '+' : '-'}${data.growth.newUsers.value}%`,
      isPositive: data.growth.newUsers.isPositive
    }
  });

  const buildOrdersDetails = (data) => ({
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

  const buildSalesDetails = (data) => ({
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
            title="Livre le plus vendu"
            icon={Award}
            color="blue"
            delay={0}
            metricKey="bestSellingBook"
            showTimeSelector={true}
            detailsDataBuilder={buildBestSellingBookDetails}
            mockData={mockDashboardData}
          />
          <StatsCard
            title="Nouveaux utilisateurs"
            icon={Users}
            color="green"
            delay={0.1}
            metricKey="newUsers"
            showTimeSelector={true}
            detailsDataBuilder={buildNewUsersDetails}
            mockData={mockDashboardData}
          />
          <StatsCard
            title="Total des commandes"
            icon={ShoppingCart}
            color="purple"
            delay={0.15}
            metricKey="orders"
            showTimeSelector={true}
            detailsDataBuilder={buildOrdersDetails}
            mockData={mockDashboardData}
          />
          <StatsCard
            title="Ventes mensuelles"
            icon={TrendingUp}
            color="red"
            delay={0.2}
            metricKey="sales"
            showTimeSelector={true}
            detailsDataBuilder={buildSalesDetails}
            mockData={mockDashboardData}
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
