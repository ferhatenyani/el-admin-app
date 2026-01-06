import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import OrderDetailsModal from '../common/OrderDetailsModal';
import OrderStatusBadge from '../orders/OrderStatusBadge';

/**
 * Modern RecentOrdersTable component with enhanced design
 * Features:
 * - Enhanced header with icon and description
 * - Consistent status badges with OrdersTable
 * - Better hover effects and transitions
 * - Modern action buttons with hover states
 * - Improved typography and spacing
 * - Responsive table design
 * - Staggered row animations
 */

const RecentOrdersTable = ({ orders }) => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleViewAllOrders = () => {
    navigate('/admin/orders');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
      >
        {/* Enhanced Header Section with View All Button - Mobile Responsive */}
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Commandes récentes</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 line-clamp-1">Dernières transactions et mises à jour des commandes</p>
              </div>
            </div>

            {/* View All Button */}
            <motion.button
              onClick={handleViewAllOrders}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-xs md:text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 w-full sm:w-auto justify-center"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

      {/* Table Container with improved styling */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Enhanced Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-50/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID Commande
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Enhanced Table Body */}
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + index * 0.05,
                  duration: 0.3
                }}
                className="hover:bg-gray-50/50 transition-colors duration-200 group"
              >
                {/* Order Number */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {order.orderNumber}
                  </span>
                </td>

                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700 font-medium">
                    {order.customer}
                  </span>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {formatDateTime(order.date)}
                  </span>
                </td>

                {/* Total */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                </td>

                {/* Status Badge - Using OrderStatusBadge component */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>

                {/* Enhanced Action Button */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <motion.button
                    onClick={() => handleViewOrder(order)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2
                      bg-blue-50 text-blue-600
                      hover:bg-blue-600 hover:text-white
                      border border-blue-200
                      rounded-lg
                      font-semibold text-sm
                      transition-all duration-200
                      group/button
                    "
                  >
                    <Eye className="w-4 h-4" />
                    <span>Voir</span>
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

        {/* Optional: Empty State (shown when no orders) */}
        {orders.length === 0 && (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Aucune commande récente</p>
            <p className="text-gray-400 text-sm mt-1">Les commandes apparaîtront ici une fois passées</p>
          </div>
        )}
      </motion.div>

      {/* Order Details Modal - No status update for dashboard view */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default RecentOrdersTable;
