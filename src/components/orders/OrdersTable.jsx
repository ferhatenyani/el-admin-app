import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Search, Trash2 } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import CustomSelect from '../common/CustomSelect';
import Pagination from '../common/Pagination';

// Status options for inline editing (same as OrderDetailsModal)
const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'shipped', label: 'Expédié' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' }
];

// Inline status select component for table rows
const InlineStatusSelect = ({ order, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync local state with order.status when it changes
  useEffect(() => {
    setSelectedStatus(order?.status || 'pending');
  }, [order?.status]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus !== selectedStatus && onUpdateStatus) {
      setIsUpdating(true);
      setSelectedStatus(newStatus);
      try {
        await onUpdateStatus(order.id, newStatus);
      } catch (error) {
        // Revert on error
        setSelectedStatus(order.status);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="min-w-[140px]" onClick={(e) => e.stopPropagation()}>
      <CustomSelect
        value={selectedStatus}
        onChange={handleStatusChange}
        options={statusOptions}
        placeholder="Sélectionner un statut"
      />
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

// Mobile status select with badge styling
const MobileStatusSelect = ({ order, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync local state with order.status when it changes
  useEffect(() => {
    setSelectedStatus(order?.status || 'pending');
  }, [order?.status]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus !== selectedStatus && onUpdateStatus) {
      setIsUpdating(true);
      setSelectedStatus(newStatus);
      try {
        await onUpdateStatus(order.id, newStatus);
      } catch (error) {
        setSelectedStatus(order.status);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="relative min-w-[130px]" onClick={(e) => e.stopPropagation()}>
      <CustomSelect
        value={selectedStatus}
        onChange={handleStatusChange}
        options={statusOptions}
        placeholder="Statut"
      />
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

const OrdersTable = ({
  orders,
  onViewOrder,
  onDelete,
  onUpdateStatus,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  loading = false,
  pagination = null,
  onPageChange = null,
  onPageSizeChange = null
}) => {
  // Use orders directly (server-side pagination)
  const displayOrders = orders || [];
  const totalCount = pagination?.totalElements || orders.length;

  // Filter status options (includes 'all' option)
  const filterStatusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'shipped', label: 'Expédié' },
    { value: 'delivered', label: 'Livré' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date (plus récent)' },
    { value: 'date-asc', label: 'Date (plus ancien)' },
    { value: 'price-desc', label: 'Prix (décroissant)' },
    { value: 'price-asc', label: 'Prix (croissant)' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Toutes les commandes</h2>

        <div className="flex flex-col sm:flex-row justify-between gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des commandes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
            <div className="w-full sm:min-w-[140px]">
              <CustomSelect
                value={statusFilter}
                onChange={onStatusFilterChange}
                options={filterStatusOptions}
                placeholder="Tous les statuts"
              />
            </div>

            <div className="w-full sm:min-w-[180px]">
              <CustomSelect
                value={sortBy}
                onChange={onSortChange}
                options={sortOptions}
                placeholder="Trier par..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        </div>
      )}

      {/* Desktop table */}
      {!loading && (
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro de commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDateTime(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InlineStatusSelect order={order} onUpdateStatus={onUpdateStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(order)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!loading && (
        <div className="md:hidden p-4 space-y-4">
          {displayOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.customerEmail}</p>
                </div>
                <MobileStatusSelect order={order} onUpdateStatus={onUpdateStatus} />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm text-gray-600">{formatDateTime(order.date)}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onViewOrder(order)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4 flex-shrink-0" />
                  <span>Voir</span>
                </button>
                <button
                  onClick={() => onDelete(order)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 flex-shrink-0" />
                  <span>Supprimer</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayOrders.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">Aucune commande trouvée</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && displayOrders.length > 0 && pagination && onPageChange && (
        <Pagination
          currentPage={pagination.page + 1}
          totalPages={pagination.totalPages}
          onPageChange={(page) => onPageChange(page - 1)}
          itemsPerPage={pagination.size}
          totalItems={pagination.totalElements}
          onItemsPerPageChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default OrdersTable;
