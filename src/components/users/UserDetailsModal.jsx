import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/format';
import useScrollLock from '../../hooks/useScrollLock';

/**
 * Reusable UserDetailsModal component
 * Features:
 * - Enhanced gradient design matching OrderDetailsModal
 * - Centered in main content area (excludes side menu)
 * - Smooth animations
 * - Responsive design
 */

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  if (!user) return null;

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Détails de l'utilisateur</h2>
                    <p className="text-blue-100 mt-1 font-medium">{user.name}</p>
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
                {/* Basic Info Card */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Informations générales</h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-gray-600 font-medium">Email</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{user.email}</span>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-gray-600 font-medium">Date d'inscription</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{formatDate(user.joinedDate)}</span>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">Statut</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${user.active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        <span className={`text-sm font-bold ${user.active ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {user.active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Statistiques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Commandes totales</p>
                      </div>
                      <p className="text-3xl font-extrabold text-blue-900">{user.totalOrders}</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Total dépensé</p>
                      </div>
                      <p className="text-3xl font-extrabold text-emerald-900">{formatCurrency(user.totalSpent)}</p>
                    </div>
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

export default UserDetailsModal;
