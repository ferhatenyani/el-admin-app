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
  confirmed: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-400',
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
                      <span className="text-sm text-gray-600 font-medium">Nom complet</span>
                      <span className="text-sm font-bold text-gray-900">{order.customer || order.fullName}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Téléphone</span>
                      <span className="text-sm font-semibold text-gray-900">{order.phone || 'N/A'}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Email</span>
                      <span className="text-sm font-semibold text-blue-600">{order.customerEmail || order.email || 'N/A'}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Date de commande</span>
                      <span className="text-sm font-bold text-gray-900">{formatDateTime(order.date || order.createdAt)}</span>
                    </div>
                    {order.user && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Compte utilisateur</span>
                          <span className="text-sm font-semibold text-indigo-600">{order.user.login}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Shipping & Address Info Card */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Livraison et adresse</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Wilaya</span>
                      <span className="text-sm font-bold text-gray-900">{order.wilaya || 'N/A'}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Ville</span>
                      <span className="text-sm font-bold text-gray-900">{order.city || 'N/A'}</span>
                    </div>
                    {order.streetAddress && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Adresse</span>
                          <span className="text-sm font-semibold text-gray-900">{order.streetAddress}</span>
                        </div>
                      </>
                    )}
                    {order.postalCode && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Code postal</span>
                          <span className="text-sm font-semibold text-gray-900">{order.postalCode}</span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Méthode de livraison</span>
                      <span className="text-sm font-bold text-gray-900">
                        {order.shippingMethod === 'SHIPPING_PROVIDER' ? 'Fournisseur de livraison' : 'Livraison à domicile'}
                      </span>
                    </div>
                    {order.shippingProvider && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Fournisseur</span>
                          <span className="px-3 py-1 text-xs font-bold text-purple-700 bg-purple-100 rounded-full">
                            {order.shippingProvider}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-gray-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">Frais de livraison</span>
                      <span className="text-sm font-bold text-green-600">{formatCurrency(order.shippingCost || 0)}</span>
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
                          <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Article</th>
                          <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                          <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Auteur</th>
                          <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Qté</th>
                          <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Prix unitaire</th>
                          <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {(order.items || order.orderItems) && (order.items || order.orderItems).length > 0 ? (
                          (order.items || order.orderItems).map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                {item.title || item.bookTitle || item.bookPackTitle || 'N/A'}
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-700">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  item.itemType === 'BOOK'
                                    ? 'text-blue-700 bg-blue-100'
                                    : 'text-purple-700 bg-purple-100'
                                }`}>
                                  {item.itemType === 'BOOK' ? 'Livre' : 'Pack'}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-700">
                                {item.author || item.bookAuthor || 'N/A'}
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-700 text-right font-semibold">{item.quantity}</td>
                              <td className="px-5 py-4 text-sm text-gray-700 text-right">{formatCurrency(item.price || item.unitPrice)}</td>
                              <td className="px-5 py-4 text-sm font-bold text-gray-900 text-right">
                                {formatCurrency(item.totalPrice || (item.price * item.quantity) || (item.unitPrice * item.quantity))}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-5 py-8 text-center text-sm text-gray-500">
                              Aucun article disponible
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <tr>
                          <td colSpan="5" className="px-5 py-3 text-sm font-semibold text-gray-700 text-right">
                            Sous-total
                          </td>
                          <td className="px-5 py-3 text-sm font-bold text-gray-900 text-right">
                            {formatCurrency((order.total || order.totalAmount || 0) - (order.shippingCost || 0))}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="5" className="px-5 py-3 text-sm font-semibold text-gray-700 text-right">
                            Frais de livraison
                          </td>
                          <td className="px-5 py-3 text-sm font-bold text-green-600 text-right">
                            {formatCurrency(order.shippingCost || 0)}
                          </td>
                        </tr>
                        <tr className="border-t-2 border-gray-300">
                          <td colSpan="5" className="px-5 py-4 text-base font-bold text-gray-900 text-right">
                            Montant total
                          </td>
                          <td className="px-5 py-4 text-base font-extrabold text-blue-600 text-right">
                            {formatCurrency(order.total || order.totalAmount || 0)}
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
                            <option value="confirmed">Confirmé</option>
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

              {/* Footer with action buttons */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    Fermer
                  </button>
                  {onUpdateStatus && (
                    <button
                      onClick={handleUpdateStatus}
                      disabled={selectedStatus === order.status}
                      className={`
                        px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                        ${selectedStatus === order.status
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                        }
                      `}
                    >
                      Mettre à jour le statut
                    </button>
                  )}
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
