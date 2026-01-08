import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'success', title, message, duration = 1000 }) => {
    const id = toastId++;
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, title = 'Succès') => {
    return showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((message, title = 'Erreur') => {
    return showToast({ type: 'error', title, message });
  }, [showToast]);

  const warning = useCallback((message, title = 'Attention') => {
    return showToast({ type: 'warning', title, message });
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
  };
};
