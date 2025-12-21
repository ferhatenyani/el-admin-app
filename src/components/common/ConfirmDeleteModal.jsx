import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import useScrollLock from '../../hooks/useScrollLock';

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, itemName = "cet élément" }) => {
  // Lock background scroll when modal is open
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - covers entire viewport and dims content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed top-0 left-0 w-screen h-screen bg-black/60 z-[100]"
            style={{ margin: 0, padding: 0 }}
          />

          {/* Modal Container */}
          <div
            className="fixed top-0 left-0 w-screen h-screen z-[101] flex items-center justify-center p-4"
            onClick={onCancel}
            style={{ margin: 0, padding: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 relative">
              

                <div className="flex items-center gap-3">
                  
                  <h2 className="text-xl font-bold text-white">Confirmation de suppression</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 text-base leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{itemName}</span> ?{' '}
                  <span className="text-red-600 font-medium">Cette action est irréversible.</span>
                </p>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  Annuler
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
                >
                  Confirmer
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
