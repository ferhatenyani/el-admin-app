import { Users, TrendingUp, Sparkles, Calendar, ShoppingCart, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import StatsCard from '../components/common/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import { formatCurrency } from '../utils/format';
import * as dashboardApi from '../services/dashboardApi';
import * as ordersApi from '../services/ordersApi';

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
  const [dashboardData, setDashboardData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const stats = await dashboardApi.getDashboardStats('Ce mois-ci');
        setDashboardData(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch recent orders on component mount
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setIsOrdersLoading(true);
        // Fetch 5 most recent orders, sorted by creation date descending
        const response = await ordersApi.getOrders({
          page: 0,
          size: 5,
          sort: 'createdAt,desc',
        });

        const orders = response.content || response || [];

        // Map backend status to frontend status
        const mapStatus = (backendStatus) => {
          const statusMap = {
            'PENDING': 'pending',
            'CONFIRMED': 'confirmed',
            'SHIPPED': 'shipped',
            'DELIVERED': 'delivered',
            'CANCELLED': 'cancelled',
          };
          return statusMap[backendStatus] || 'pending';
        };

        // Transform backend OrderDTO to frontend format
        const transformedOrders = orders.map(order => {
          const mappedStatus = mapStatus(order.status);
          return {
            // Keep full order data for modal first
            ...order,
            // Then override with transformed frontend properties
            id: order.id,
            orderNumber: order.uniqueId || `#${order.id}`,
            customer: order.fullName || (order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : null) || 'Guest',
            date: order.createdAt,
            total: Number(order.totalAmount) || 0,
            status: mappedStatus,
          };
        });

        setRecentOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        setRecentOrders([]);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  // Get current date for header
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Detail builders for each stat card - pure functions, no state
  const buildBestSellingBookDetails = (data) => {
    if (!data?.bestSellingBook) return null;
    return {
      description: "Le livre le plus populaire de votre catalogue",
      breakdown: [
        { label: "Exemplaires vendus", value: data.bestSellingBook.soldCount, color: "text-blue-600" },
        { label: "Prix unitaire", value: formatCurrency(data.bestSellingBook.price), color: "text-green-600" },
        { label: "Revenu total", value: formatCurrency(data.bestSellingBook.soldCount * data.bestSellingBook.price), color: "text-purple-600" }
      ],
      lastUpdated: "Mis à jour il y a 2 heures"
    };
  };

  const buildNewUsersDetails = (data) => {
    if (!data?.newUsers) return null;
    return {
      description: "Nouveaux utilisateurs inscrits sur votre plateforme",
      breakdown: [
        { label: "Cette semaine", value: data.newUsers.thisWeek, color: "text-blue-600" },
        { label: "Ce mois-ci", value: data.newUsers.thisMonth, color: "text-green-600" },
        { label: "Aujourd'hui", value: data.newUsers.today, color: "text-purple-600" }
      ],
      lastUpdated: "Mis à jour il y a 1 heure",
      comparison: data.growth?.newUsers ? {
        period: "vs mois dernier",
        change: `${data.growth.newUsers.isPositive ? '+' : ''}${data.growth.newUsers.value}%`,
        isPositive: data.growth.newUsers.isPositive
      } : null
    };
  };

  const buildOrdersDetails = (data) => {
    if (!data?.totalOrders) return null;
    return {
      description: "Total des commandes reçues depuis toujours",
      breakdown: [
        { label: "Terminées", value: Math.floor(data.totalOrders * 0.65), color: "text-green-600" },
        { label: "En attente", value: Math.floor(data.totalOrders * 0.25), color: "text-yellow-600" },
        { label: "Cette semaine", value: 47, color: "text-blue-600" }
      ],
      lastUpdated: "Mis à jour il y a 30 minutes",
      comparison: data.growth?.orders ? {
        period: "vs mois dernier",
        change: `${data.growth.orders.isPositive ? '+' : ''}${data.growth.orders.value}%`,
        isPositive: data.growth.orders.isPositive
      } : null
    };
  };

  const buildSalesDetails = (data) => {
    if (!data?.monthlySales) return null;
    return {
      description: "Revenu généré ce mois-ci",
      breakdown: [
        { label: "Ventes en ligne", value: formatCurrency(data.monthlySales * 0.72), color: "text-green-600" },
        { label: "Ventes en magasin", value: formatCurrency(data.monthlySales * 0.28), color: "text-blue-600" },
        { label: "Commande moyenne", value: formatCurrency(data.monthlySales / Math.max(data.totalOrders, 1)), color: "text-purple-600" }
      ],
      lastUpdated: "Mis à jour il y a 10 minutes",
      comparison: data.growth?.sales ? {
        period: "vs mois dernier",
        change: `${data.growth.sales.isPositive ? '+' : ''}${data.growth.sales.value}%`,
        isPositive: data.growth.sales.isPositive
      } : null
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header Section with modern design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-xl md:rounded-2xl shadow-xl mb-6 md:mb-8 overflow-hidden relative"
      >
        {/* Decorative elements - hidden on mobile for cleaner look */}
        <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="hidden md:block absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

        <div className="relative px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-10">
          <div className="space-y-3">
            {/* Title row */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="p-2 sm:p-2.5 md:p-3 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white">
                Tableau de bord
              </h1>
            </motion.div>

            {/* Bienvenue + Date row (horizontal on mobile < 500px) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between gap-3"
            >
              <p className="text-blue-100 text-sm sm:text-base md:text-lg">
                <span className="max-[500px]:inline hidden">Bienvenue !</span>
                <span className="min-[501px]:inline hidden">Bienvenue ! Voici ce qui se passe dans votre boutique aujourd'hui.</span>
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/20">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                <span className="text-white font-medium text-xs sm:text-sm whitespace-nowrap">{currentDate}</span>
              </div>
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
            mockData={dashboardData}
          />
          <StatsCard
            title="Nouveaux utilisateurs"
            icon={Users}
            color="green"
            delay={0.1}
            metricKey="newUsers"
            showTimeSelector={true}
            detailsDataBuilder={buildNewUsersDetails}
            mockData={dashboardData}
          />
          <StatsCard
            title="Total des commandes"
            icon={ShoppingCart}
            color="purple"
            delay={0.15}
            metricKey="orders"
            showTimeSelector={true}
            detailsDataBuilder={buildOrdersDetails}
            mockData={dashboardData}
          />
          <StatsCard
            title="Ventes mensuelles"
            icon={TrendingUp}
            color="red"
            delay={0.2}
            metricKey="sales"
            showTimeSelector={true}
            detailsDataBuilder={buildSalesDetails}
            mockData={dashboardData}
          />
        </div>

        {/* Sales Chart Section - Independent time filter */}
        <div className="relative z-0">
          <SalesChart />
        </div>

        {/* Recent Orders Section */}
        {!isOrdersLoading && (
          <div className="relative z-0">
            <RecentOrdersTable orders={recentOrders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
