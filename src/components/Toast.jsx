import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const Toast = ({ type = "info", message, isVisible, onClose, duration = 5000, position = "top-right" }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: "bg-green-50 border-green-200",
        iconColor: "text-green-500",
        textColor: "text-green-800",
        progressColor: "bg-green-500",
      },
      danger: {
        icon: XCircle,
        bgColor: "bg-red-50 border-red-200",
        iconColor: "text-red-500",
        textColor: "text-red-800",
        progressColor: "bg-red-500",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "bg-yellow-50 border-yellow-200",
        iconColor: "text-yellow-500",
        textColor: "text-yellow-800",
        progressColor: "bg-yellow-500",
      },
      info: {
        icon: Info,
        bgColor: "bg-blue-50 border-blue-200",
        iconColor: "text-blue-500",
        textColor: "text-blue-800",
        progressColor: "bg-blue-500",
      },
    };
    return configs[type] || configs.info;
  };

  const getPositionClasses = () => {
    const positions = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    };
    return positions[position] || positions["top-right"];
  };

  if (!isVisible) return null;

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <div
        className={`
        ${config.bgColor} border rounded-lg shadow-lg p-4 
        max-w-sm w-full sm:max-w-md
        transform transition-all duration-300 ease-in-out
        ${isShowing ? "translate-y-0 opacity-100 scale-100" : "translate-y-2 opacity-0 scale-95"}
        mx-4 sm:mx-0
      `}
      >
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <IconComponent size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${config.textColor} break-words`}>{message}</p>
          </div>

          <button onClick={handleClose} className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity duration-200`}>
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div
            className={`h-1 ${config.progressColor} rounded-full transition-all duration-100 ease-linear`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onHideToast, position = "top-right" }) => {
  return (
    <div className="pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} type={toast.type} message={toast.message} isVisible={toast.isVisible} onClose={() => onHideToast(toast.id)} duration={toast.duration} position={position} />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
