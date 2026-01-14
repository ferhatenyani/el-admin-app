import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import useScrollLock from '../../hooks/useScrollLock';
import CustomSelect from './CustomSelect';

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
    label: 'En attente',
  },
  confirmed: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-400',
    label: 'Confirmé',
  },
  shipped: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
    label: 'Expédié',
  },
  delivered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
    label: 'Livré',
  },
  cancelled: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
    label: 'Annulé',
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

  const statusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'shipped', label: 'Expédié' },
    { value: 'delivered', label: 'Livré' },
    { value: 'cancelled', label: 'Annulé' }
  ];

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
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 pointer-events-none"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col pointer-events-auto">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 xs:p-4 sm:p-6 text-white flex-shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold truncate">Détails de la commande</h2>
                    <p className="text-blue-100 mt-0.5 sm:mt-1 text-xs xs:text-sm font-medium truncate">{order.orderNumber}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-3 xs:p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Customer Info Card */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wide">Informations client</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-5 space-y-2.5 sm:space-y-3 border border-gray-200">
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Nom complet</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 break-words xs:text-right">{order.customer || order.fullName}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Téléphone</span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words xs:text-right">{order.phone || 'N/A'}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Email</span>
                      <span className="text-xs sm:text-sm font-semibold text-blue-600 break-all xs:text-right">{order.customerEmail || order.email || 'N/A'}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Date de commande</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 break-words xs:text-right">{formatDateTime(order.date || order.createdAt)}</span>
                    </div>
                    {order.user && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Compte utilisateur</span>
                          <span className="text-xs sm:text-sm font-semibold text-indigo-600 break-words xs:text-right">{order.user.login}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Shipping & Address Info Card */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wide">Livraison et adresse</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-5 space-y-2.5 sm:space-y-3 border border-gray-200">
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Wilaya</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 break-words xs:text-right">{order.wilaya || 'N/A'}</span>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Ville</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 break-words xs:text-right">{order.city || 'N/A'}</span>
                    </div>
                    {order.streetAddress && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-1 xs:gap-2">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Adresse</span>
                          <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words xs:text-right xs:max-w-[60%]">{order.streetAddress}</span>
                        </div>
                      </>
                    )}
                    {order.postalCode && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Code postal</span>
                          <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words xs:text-right">{order.postalCode}</span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-gray-200"></div>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-1 xs:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Méthode de livraison</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 break-words xs:text-right xs:max-w-[60%]">
                        {order.shippingMethod === 'SHIPPING_PROVIDER' ? 'Fournisseur de livraison' : 'Livraison à domicile'}
                      </span>
                    </div>
                    {order.shippingProvider && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Fournisseur</span>
                          <span className="px-2 xs:px-3 py-0.5 xs:py-1 text-[10px] xs:text-xs font-bold text-purple-700 bg-purple-100 rounded-full whitespace-nowrap">
                            {order.shippingProvider}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-gray-200"></div>
                    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Frais de livraison</span>
                      <span className="text-xs sm:text-sm font-bold text-green-600 break-words xs:text-right">{formatCurrency(order.shippingCost || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items Card */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wide">Articles commandés</h3>

                  {/* Desktop & Tablet: Table view (hidden on mobile) */}
                  <div className="hidden sm:block border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                          <tr>
                            <th className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Article</th>
                            <th className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Auteur</th>
                            <th className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Qté</th>
                            <th className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Prix unit.</th>
                            <th className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {(order.items || order.orderItems) && (order.items || order.orderItems).length > 0 ? (
                            (order.items || order.orderItems).map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                                  {item.title || item.bookTitle || item.bookPackTitle || 'N/A'}
                                </td>
                                <td className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${
                                    item.itemType === 'BOOK'
                                      ? 'text-blue-700 bg-blue-100'
                                      : 'text-purple-700 bg-purple-100'
                                  }`}>
                                    {item.itemType === 'BOOK' ? 'Livre' : 'Pack'}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                                  {item.author || item.bookAuthor || 'N/A'}
                                </td>
                                <td className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 text-right font-semibold">{item.quantity}</td>
                                <td className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 text-right">{formatCurrency(item.price || item.unitPrice)}</td>
                                <td className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-xs sm:text-sm font-bold text-gray-900 text-right">
                                  {formatCurrency(item.totalPrice || (item.price * item.quantity) || (item.unitPrice * item.quantity))}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-3 sm:px-5 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
                                Aucun article disponible
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="bg-gradient-to-r from-blue-50 to-purple-50">
                          <tr>
                            <td colSpan="5" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 text-right">
                              Sous-total
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-gray-900 text-right">
                              {formatCurrency((order.total || order.totalAmount || 0) - (order.shippingCost || 0))}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="5" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 text-right">
                              Frais de livraison
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-green-600 text-right">
                              {formatCurrency(order.shippingCost || 0)}
                            </td>
                          </tr>
                          <tr className="border-t-2 border-gray-300">
                            <td colSpan="5" className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-sm sm:text-base font-bold text-gray-900 text-right">
                              Montant total
                            </td>
                            <td className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 text-sm sm:text-base font-extrabold text-blue-600 text-right">
                              {formatCurrency(order.total || order.totalAmount || 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Mobile: Card view (visible only on mobile) */}
                  <div className="sm:hidden space-y-3">
                    {(order.items || order.orderItems) && (order.items || order.orderItems).length > 0 ? (
                      (order.items || order.orderItems).map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-gray-900 flex-1 break-words">
                              {item.title || item.bookTitle || item.bookPackTitle || 'N/A'}
                            </h4>
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0 ${
                              item.itemType === 'BOOK'
                                ? 'text-blue-700 bg-blue-100'
                                : 'text-purple-700 bg-purple-100'
                            }`}>
                              {item.itemType === 'BOOK' ? 'Livre' : 'Pack'}
                            </span>
                          </div>

                          <div className="text-[10px] text-gray-600 break-words">
                            <span className="font-medium">Auteur:</span> {item.author || item.bookAuthor || 'N/A'}
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                            <div>
                              <div className="text-[9px] text-gray-500 uppercase">Qté</div>
                              <div className="text-xs font-semibold text-gray-900">{item.quantity}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-gray-500 uppercase">Prix unit.</div>
                              <div className="text-xs font-medium text-gray-700">{formatCurrency(item.price || item.unitPrice)}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-gray-500 uppercase">Total</div>
                              <div className="text-xs font-bold text-gray-900">
                                {formatCurrency(item.totalPrice || (item.price * item.quantity) || (item.unitPrice * item.quantity))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-xs text-gray-500">
                        Aucun article disponible
                      </div>
                    )}

                    {/* Mobile totals summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700">Sous-total</span>
                        <span className="text-xs font-bold text-gray-900">
                          {formatCurrency((order.total || order.totalAmount || 0) - (order.shippingCost || 0))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700">Frais de livraison</span>
                        <span className="text-xs font-bold text-green-600">
                          {formatCurrency(order.shippingCost || 0)}
                        </span>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-2 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900">Montant total</span>
                        <span className="text-sm font-extrabold text-blue-600">
                          {formatCurrency(order.total || order.totalAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status Card */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wide">Statut de la commande</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-5 border border-gray-200 space-y-3 sm:space-y-4">
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">Statut actuel</span>
                      <div className={`
                        inline-flex items-center gap-1.5 xs:gap-2
                        px-3 xs:px-4 py-1.5 xs:py-2
                        ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.text}
                        border ${statusConfig[order.status]?.border}
                        rounded-full
                        self-start xs:self-auto
                      `}>
                        <span className={`w-2 xs:w-2.5 h-2 xs:h-2.5 rounded-full ${statusConfig[order.status]?.dot} animate-pulse flex-shrink-0`} />
                        <span className="text-xs xs:text-sm font-bold capitalize whitespace-nowrap">
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                      </div>
                    </div>

                    {/* Status Update Section - Only shown if onUpdateStatus is provided */}
                    {onUpdateStatus && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Mettre à jour le statut
                          </label>
                          <CustomSelect
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={statusOptions}
                            placeholder="Sélectionner un statut"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer with action buttons */}
              <div className="border-t border-gray-200 bg-gray-50 flex-shrink-0 px-3 xs:px-4 sm:px-6 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-6 md:pb-8">
                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="w-full xs:w-auto px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3 border border-gray-300 rounded-lg text-xs xs:text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    Fermer
                  </button>
                  {onUpdateStatus && (
                    <button
                      onClick={handleUpdateStatus}
                      disabled={selectedStatus === order.status}
                      className={`
                        w-full xs:w-auto px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 sm:py-3 rounded-lg text-xs xs:text-sm font-medium transition-all duration-200
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
