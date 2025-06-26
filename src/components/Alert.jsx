import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const Alert = ({ type = "error", message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`border-2 rounded-xl p-4 mb-4 ${styles[type]} animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-current hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
