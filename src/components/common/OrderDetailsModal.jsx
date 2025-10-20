import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import useScrollLock from '../../hooks/useScrollLock';

/**
 * Reusable OrderDetailsModal component
 * Features:
 * - Enhanced gradient design
 * - Centered in main content area (excludes side menu)
 * - Optional status update functionality
 * - Smooth animations
 * - Responsive design
 */

// Enhanced status configuration with icons and modern colors
const statusConfig = {
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  shipped: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
  },
  delivered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
  cancelled: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
  },
};

const OrderDetailsModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'pending');

  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  if (!order) return null;

  const handleUpdateStatus = async () => {
    if (selectedStatus !== order.status && onUpdateStatus) {
      await onUpdateStatus(order.id, selectedStatus);
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - covers entire viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal - centered in viewport, uses pointer-events-none to allow backdrop click */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Détails de la commande</h2>
                    <p className="text-blue-100 mt-1 font-medium">{order.orderNumber}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
                {/* Customer Info Card */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Informations client</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Nom</span>
                      <span className="text-sm font-bold text-gray-900">{order.customer}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Email</span>
                      <span className="text-sm font-semibold text-blue-600">{order.customerEmail || 'N/A'}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Date de commande</span>
                      <span className="text-sm font-bold text-gray-900">{formatDateTime(order.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items Card */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Articles commandés</h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Mobile: Add horizontal scroll */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                        <tr>
                          <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Livre</th>
                          <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Langue</th>
                          <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Qté</th>
                          <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Prix</th>
                          <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-5 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                              <td className="px-5 py-4 text-sm text-gray-700">
                                <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                  {item.language || 'Langue inconnue'}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-700 text-right font-semibold">{item.quantity}</td>
                              <td className="px-5 py-4 text-sm text-gray-700 text-right">{formatCurrency(item.price)}</td>
                              <td className="px-5 py-4 text-sm font-bold text-gray-900 text-right">
                                {formatCurrency(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-5 py-8 text-center text-sm text-gray-500">
                              Aucun article disponible
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <tr>
                          <td colSpan="4" className="px-5 py-4 text-base font-bold text-gray-900 text-right">
                            Montant total
                          </td>
                          <td className="px-5 py-4 text-base font-extrabold text-blue-600 text-right">
                            {formatCurrency(order.total)}
                          </td>
                        </tr>
                      </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Order Status Card */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Statut de la commande</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">Statut actuel</span>
                      <div className={`
                        inline-flex items-center gap-2
                        px-4 py-2
                        ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.text}
                        border ${statusConfig[order.status]?.border}
                        rounded-full
                      `}>
                        <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[order.status]?.dot} animate-pulse`} />
                        <span className="text-sm font-bold capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Status Update Section - Only shown if onUpdateStatus is provided */}
                    {onUpdateStatus && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mettre à jour le statut
                          </label>
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pending">En attente</option>
                            <option value="shipped">Expédié</option>
                            <option value="delivered">Livré</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

             
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default OrderDetailsModal;
