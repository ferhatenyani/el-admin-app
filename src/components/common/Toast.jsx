import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
      title: 'text-green-900',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
      title: 'text-red-900',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-800',
      title: 'text-yellow-900',
    },
  };

  const style = styles[toast.type] || styles.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.1 }}
      className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-3 sm:p-4 mb-2 sm:mb-3 w-full min-w-[280px] max-w-[calc(100vw-2rem)] sm:max-w-md`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`${style.icon} flex-shrink-0 mt-0.5`}>
          {icons[toast.type]}
        </div>

        <div className="flex-1 min-w-0">
          {toast.title && (
            <h3 className={`${style.title} font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 break-words`}>
              {toast.title}
            </h3>
          )}
          <p className={`${style.text} text-xs sm:text-sm break-words`}>
            {toast.message}
          </p>
        </div>

        <button
          onClick={() => onClose(toast.id)}
          className={`${style.icon} hover:opacity-70 transition-opacity flex-shrink-0 p-0.5`}
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 pointer-events-none max-w-[calc(100vw-1rem)] sm:max-w-md">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={onClose} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ToastContainer;
