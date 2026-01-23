import { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmé', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Expédié', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Livré', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800' }
];

const StatusChangeModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) {
      onClose();
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await onUpdateStatus(order.id, newStatus);
      onClose();
    } catch (err) {
      setError('Échec de la mise à jour du statut');
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Changer le statut</h3>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                disabled={isUpdating}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  order.status === status.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                  {order.status === status.value && (
                    <span className="text-xs text-blue-600 font-medium">Actuel</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Loading Overlay */}
        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Mise à jour...</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StatusChangeModal;
