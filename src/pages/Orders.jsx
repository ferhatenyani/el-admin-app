import { useState, useEffect } from 'react';
import { Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import OrdersTable from '../components/orders/OrdersTable';
import OrderDetailsModal from '../components/common/OrderDetailsModal';
import CreateOrderModal from '../components/orders/CreateOrderModal';
import * as ordersApi from '../services/ordersApi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date-desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [sortBy, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Parse sortBy to get field and direction
      const [sortField, sortDirection] = sortBy.split('-');
      const sortParam = sortField === 'date'
        ? `createdAt,${sortDirection}`
        : `totalAmount,${sortDirection}`;

      const params = {
        page: 0,
        size: 1000,
        sort: sortParam,
      };

      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter.toUpperCase();
      }

      const response = await ordersApi.getOrders(params);
      const data = response.content || response || [];

      // Transform API data to match OrdersTable expected format
      const transformedData = data.map(order => ({
        ...order,
        orderNumber: order.uniqueId || order.orderNumber,
        customer: order.fullName || order.customer,
        customerEmail: order.email || order.customerEmail,
        date: order.createdAt || order.date,
        total: order.totalAmount || order.total,
        status: order.status ? order.status.toLowerCase() : 'pending',
      }));

      // Client-side search filtering (since API doesn't support search)
      let filteredData = transformedData;
      if (searchQuery) {
        filteredData = transformedData.filter(
          (order) =>
            (order.uniqueId && order.uniqueId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.fullName && order.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.email && order.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.phone && order.phone.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      setOrders(transformedData);
      setFilteredOrders(filteredData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      // Fetch the complete order data from the API to get all fields including orderItems
      const fullOrder = await ordersApi.getOrderById(orderId);

      // Send all fields as-is from the API response, only updating the status
      await ordersApi.updateOrder(orderId, {
        ...fullOrder,
        status: status.toUpperCase(),
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erreur lors de la mise à jour du statut de la commande: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      await ordersApi.createOrder(orderData);
      setIsCreateModalOpen(false);
      fetchOrders();
      alert('Commande créée avec succès!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erreur lors de la création de la commande: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleExport = async () => {
    try {
      const response = await ordersApi.exportOrders();

      // Create a download link for the blob
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'orders_export.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting orders:', error);
      alert('Erreur lors de l\'export des commandes');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-600 mt-1">Gérez les commandes clients et suivez les livraisons</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm whitespace-nowrap text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Ajouter une commande</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm whitespace-nowrap text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Exporter</span>
          </motion.button>
        </div>
      </div>

      <OrdersTable
        orders={filteredOrders}
        onViewOrder={handleViewOrder}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
};

export default Orders;
