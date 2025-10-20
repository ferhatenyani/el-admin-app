import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Sparkles, Calendar, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from '../components/common/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import { getStats, getSalesChartData, getRecentOrders } from '../mock/mockApi';
import { formatCurrency } from '../utils/format';

/**
 * Modern Dashboard Page with enhanced design
 * Features:
 * - Elegant header with gradient background
 * - Improved visual hierarchy and spacing
 * - Smooth animations and transitions
 * - Better loading states
 * - Responsive grid layouts
 * - Consistent color palette and typography
 */

const Dashboard = () => {
  // Individual state for each stat card
  const [booksStats, setBooksStats] = useState({ value: 0, growth: { value: 0, isPositive: true } });
  const [usersStats, setUsersStats] = useState({ value: 0, growth: { value: 0, isPositive: true } });
  const [ordersStats, setOrdersStats] = useState({ value: 0, growth: { value: 0, isPositive: true } });
  const [salesStats, setSalesStats] = useState({ value: 0, growth: { value: 0, isPositive: true } });

  // Individual time filters for each component
  const [booksTimeFilter, setBooksTimeFilter] = useState('Ce mois-ci');
  const [usersTimeFilter, setUsersTimeFilter] = useState('Ce mois-ci');
  const [ordersTimeFilter, setOrdersTimeFilter] = useState('Ce mois-ci');
  const [salesTimeFilter, setSalesTimeFilter] = useState('Ce mois-ci');
  const [chartTimeFilter, setChartTimeFilter] = useState('Ce mois-ci');

  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const ordersData = await getRecentOrders(6);
        setRecentOrders(ordersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch books stats when its time filter changes
  useEffect(() => {
    const fetchBooksStats = async () => {
      try {
        const statsData = await getStats(booksTimeFilter);
        setBooksStats({ value: statsData.totalBooks, growth: statsData.growth.books });
      } catch (error) {
        console.error('Error fetching books stats:', error);
      }
    };
    fetchBooksStats();
  }, [booksTimeFilter]);

  // Fetch users stats when its time filter changes
  useEffect(() => {
    const fetchUsersStats = async () => {
      try {
        const statsData = await getStats(usersTimeFilter);
        setUsersStats({ value: statsData.totalUsers, growth: statsData.growth.users });
      } catch (error) {
        console.error('Error fetching users stats:', error);
      }
    };
    fetchUsersStats();
  }, [usersTimeFilter]);

  // Fetch orders stats when its time filter changes
  useEffect(() => {
    const fetchOrdersStats = async () => {
      try {
        const statsData = await getStats(ordersTimeFilter);
        setOrdersStats({ value: statsData.totalOrders, growth: statsData.growth.orders });
      } catch (error) {
        console.error('Error fetching orders stats:', error);
      }
    };
    fetchOrdersStats();
  }, [ordersTimeFilter]);

  // Fetch sales stats when its time filter changes
  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const statsData = await getStats(salesTimeFilter);
        setSalesStats({ value: statsData.monthlySales, growth: statsData.growth.sales });
      } catch (error) {
        console.error('Error fetching sales stats:', error);
      }
    };
    fetchSalesStats();
  }, [salesTimeFilter]);

  // Fetch chart data when its time filter changes
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const salesData = await getSalesChartData(chartTimeFilter);
        setChartData(salesData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchChartData();
  }, [chartTimeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get current date for header
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Detailed information for each stat card popup
  const statsDetails = {
    totalBooks: {
      description: "Nombre total de livres disponibles dans votre catalogue",
      breakdown: [
        { label: "Disponibles", value: booksStats.value - 45, color: "text-green-600" },
        { label: "En rupture de stock", value: 45, color: "text-red-600" },
        { label: "Nouveaux ce mois-ci", value: 23, color: "text-blue-600" }
      ],
      lastUpdated: "Mis à jour il y a 2 heures",
      comparison: {
        period: "vs mois dernier",
        change: "+12%",
        isPositive: true
      }
    },
    totalUsers: {
      description: "Utilisateurs inscrits sur votre plateforme",
      breakdown: [
        { label: "Utilisateurs actifs", value: Math.floor(usersStats.value * 0.68), color: "text-green-600" },
        { label: "Utilisateurs inactifs", value: Math.floor(usersStats.value * 0.32), color: "text-gray-600" },
        { label: "Nouveaux cette semaine", value: 156, color: "text-blue-600" }
      ],
      lastUpdated: "Mis à jour il y a 1 heure",
      comparison: {
        period: "vs mois dernier",
        change: "+8%",
        isPositive: true
      }
    },
    totalOrders: {
      description: "Total des commandes reçues depuis toujours",
      breakdown: [
        { label: "Terminées", value: Math.floor(recentOrders.length * 13), color: "text-green-600" },
        { label: "En attente", value: recentOrders.length * 2, color: "text-yellow-600" },
        { label: "Cette semaine", value: 47, color: "text-blue-600" }
      ],
      lastUpdated: "Mis à jour il y a 30 minutes",
      comparison: {
        period: "vs mois dernier",
        change: "+15%",
        isPositive: true
      }
    },
    monthlySales: {
      description: "Revenu généré ce mois-ci",
      breakdown: [
        { label: "Ventes en ligne", value: formatCurrency(salesStats.value * 0.72), color: "text-green-600" },
        { label: "Ventes en magasin", value: formatCurrency(salesStats.value * 0.28), color: "text-blue-600" },
        { label: "Commande moyenne", value: formatCurrency(salesStats.value / (recentOrders.length * 15)), color: "text-purple-600" }
      ],
      lastUpdated: "Mis à jour il y a 10 minutes",
      comparison: {
        period: "vs mois dernier",
        change: "+10%",
        isPositive: true
      }
    }
  };

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
        {/* Stats Cards Grid - 2x2 layout on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10" style={{ overflow: 'visible' }}>
          <StatsCard
            title="Total des livres"
            value={booksStats.value}
            icon={BookOpen}
            color="blue"
            delay={0}
            growth={booksStats.growth}
            detailsData={statsDetails.totalBooks}
            showTimeSelector={true}
            currentTimeRange={booksTimeFilter}
            onTimeRangeChange={setBooksTimeFilter}
          />
          <StatsCard
            title="Total des utilisateurs"
            value={usersStats.value}
            icon={Users}
            color="green"
            delay={0.1}
            growth={usersStats.growth}
            detailsData={statsDetails.totalUsers}
            showTimeSelector={true}
            currentTimeRange={usersTimeFilter}
            onTimeRangeChange={setUsersTimeFilter}
          />
          <StatsCard
            title="Total des commandes"
            value={ordersStats.value}
            icon={ShoppingCart}
            color="purple"
            delay={0.15}
            growth={ordersStats.growth}
            detailsData={statsDetails.totalOrders}
            showTimeSelector={true}
            currentTimeRange={ordersTimeFilter}
            onTimeRangeChange={setOrdersTimeFilter}
          />
          <StatsCard
            title="Ventes mensuelles"
            value={formatCurrency(salesStats.value)}
            icon={TrendingUp}
            color="red"
            delay={0.2}
            growth={salesStats.growth}
            detailsData={statsDetails.monthlySales}
            showTimeSelector={true}
            currentTimeRange={salesTimeFilter}
            onTimeRangeChange={setSalesTimeFilter}
          />
        </div>

        {/* Sales Chart Section */}
        <div className="relative z-0">
          <SalesChart
            data={chartData}
            timeRange={chartTimeFilter}
            onTimeRangeChange={setChartTimeFilter}
          />
        </div>

        {/* Recent Orders Section */}
        <div className="relative z-0">
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
