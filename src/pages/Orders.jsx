import { useState, useEffect, useCallback, useRef } from 'react';
import { Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import OrdersTable from '../components/orders/OrdersTable';
import OrderDetailsModal from '../components/common/OrderDetailsModal';
import CreateOrderModal from '../components/orders/CreateOrderModal';
import ToastContainer from '../components/common/Toast';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import * as ordersApi from '../services/ordersApi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [sortBy, setSortBy] = useState('date-desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast notifications
  const { toasts, removeToast, success, error } = useToast();

  // Ref to track pagination without causing re-renders
  const paginationRef = useRef(pagination);

  // Update ref when pagination changes
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Reset to page 0 when search query changes
  useEffect(() => {
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchQuery]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Parse sortBy to get field and direction
      const [sortField, sortDirection] = sortBy.split('-');
      const sortParam = sortField === 'date'
        ? `createdAt,${sortDirection}`
        : `totalAmount,${sortDirection}`;

      const params = {
        page: paginationRef.current.page,
        size: paginationRef.current.size,
        sort: sortParam,
      };

      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter.toUpperCase();
      }

      // Add search parameter if present
      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
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

      setOrders(transformedData);

      // Update pagination info from response - only update if values changed
      setPagination(prev => {
        const newPagination = {
          page: response.number ?? response.page ?? prev.page,
          size: response.size ?? prev.size,
          totalElements: response.totalElements ?? data.length,
          totalPages: response.totalPages ?? 1,
        };

        // Only update if values actually changed to prevent unnecessary re-renders
        if (
          prev.page === newPagination.page &&
          prev.size === newPagination.size &&
          prev.totalElements === newPagination.totalElements &&
          prev.totalPages === newPagination.totalPages
        ) {
          return prev;
        }

        return newPagination;
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [debouncedSearchQuery, statusFilter, sortBy]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 0 }));
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
      success('Le statut de la commande a été mis à jour avec succès');
    } catch (err) {
      console.error('Error updating order status:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || 'Une erreur est survenue';
      error(errorMessage, 'Erreur lors de la mise à jour');
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      await ordersApi.createOrder(orderData);
      setIsCreateModalOpen(false);
      fetchOrders();
      success('La commande a été créée avec succès');
    } catch (err) {
      console.error('Error creating order:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.detail || err.message || 'Une erreur est survenue';
      error(errorMessage, 'Erreur lors de la création');
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
      success('Les commandes ont été exportées avec succès');
    } catch (err) {
      console.error('Error exporting orders:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.detail || err.message || 'Une erreur est survenue';
      error(errorMessage, 'Erreur lors de l\'export');
    }
  };

  if (initialLoad && loading) {
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
        orders={orders}
        onViewOrder={handleViewOrder}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
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

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Orders;
