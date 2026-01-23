import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, RefreshCw, Search, Trash2, Truck } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import CustomSelect from '../common/CustomSelect';
import Pagination from '../common/Pagination';
import StatusChangeModal from './StatusChangeModal';

// Status options for inline editing (same as OrderDetailsModal)
const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'shipped', label: 'Expédié' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' }
];

// Status badge colors
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

// Clickable status badge for desktop
const StatusBadge = ({ order, onClick }) => {
  const statusLabel = statusOptions.find(opt => opt.value === order.status)?.label || order.status;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${getStatusColor(order.status)}`}
      title="Cliquer pour modifier le statut"
    >
      {statusLabel}
    </button>
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
  onPageSizeChange = null,
  onRefresh = null
}) => {
  // Use orders directly (server-side pagination)
  const displayOrders = orders || [];
  const totalCount = pagination?.totalElements || orders.length;

  // Modal state for status change
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedOrder(null);
  };

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Toutes les commandes</h2>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Rafraîchir</span>
            </button>
          )}
        </div>

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
                  className="hover:bg-gray-100 transition-colors duration-150 cursor-default"
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
                    <StatusBadge order={order} onClick={() => handleOpenStatusModal(order)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 cursor-pointer"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.trackingNumber ? (
                        <a
                          href={order.shippingProvider === 'ZR'
                            ? 'https://app.zrexpress.app/parcels/default/all'
                            : `https://yalidine.app/app/colis/modifier-ecommerce.php?&id=${order.trackingNumber}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50 cursor-pointer"
                          title={order.shippingProvider === 'ZR' ? 'Voir sur ZR Express' : 'Modifier sur Yalidine'}
                        >
                          <Truck className="w-4 h-4" />
                        </a>
                      ) : (
                        <span
                          className="text-gray-300 p-1 rounded cursor-default"
                          title="Lien de suivi non disponible"
                        >
                          <Truck className="w-4 h-4" />
                        </span>
                      )}
                      <button
                        onClick={() => onDelete(order)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 cursor-pointer"
                        title="Supprimer"
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

              <div className="flex gap-1.5 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onViewOrder(order)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                  title="Voir les détails"
                >
                  <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Voir</span>
                </button>
                {order.trackingNumber ? (
                  <a
                    href={order.shippingProvider === 'ZR'
                      ? 'https://app.zrexpress.app/parcels/default/all'
                      : `https://yalidine.app/app/colis/modifier-ecommerce.php?&id=${order.trackingNumber}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 transition-colors"
                    title={order.shippingProvider === 'ZR' ? 'Voir sur ZR Express' : 'Modifier sur Yalidine'}
                  >
                    <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{order.shippingProvider === 'ZR' ? 'ZR' : 'Yali'}</span>
                  </a>
                ) : (
                  <span
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-300 text-gray-500 text-xs font-medium rounded-md cursor-default"
                    title="Lien de suivi non disponible"
                  >
                    <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Suivi</span>
                  </span>
                )}
                <button
                  onClick={() => onDelete(order)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Suppr.</span>
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

      {/* Status Change Modal */}
      {selectedOrder && (
        <StatusChangeModal
          isOpen={statusModalOpen}
          onClose={handleCloseStatusModal}
          order={selectedOrder}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
};

export default OrdersTable;
