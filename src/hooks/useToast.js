import { useState } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message, options = {}) => {
    const id = Date.now() + Math.random(); // Lebih unique ID
    const newToast = {
      id,
      type,
      message,
      isVisible: true,
      duration: 5000,
      ...options,
    };

    setToasts((prev) => [...prev, newToast]);

    return id;
  };

  const hideToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Helper methods untuk setiap tipe toast
  const showSuccess = (message, options = {}) => {
    return showToast("success", message, options);
  };

  const showDanger = (message, options = {}) => {
    return showToast("danger", message, options);
  };

  const showWarning = (message, options = {}) => {
    return showToast("warning", message, options);
  };

  const showInfo = (message, options = {}) => {
    return showToast("info", message, options);
  };

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    showSuccess,
    showDanger,
    showWarning,
    showInfo,
  };
};

export default useToast;
