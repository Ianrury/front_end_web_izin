import React from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = ({ type = "text", placeholder, value, onChange, icon: Icon, error, showPasswordToggle = false, onTogglePassword, showPassword = false, required = false, disabled = false }) => {
  return (
    <div className="relative mb-4">
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />}
        <input
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} ${showPasswordToggle ? "pr-11" : "pr-4"} py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 ${
            error ? "border-red-300 focus:border-red-500" : "border-blue-100 focus:border-blue-400 hover:border-blue-200"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        />
        {showPasswordToggle && (
          <button type="button" onClick={onTogglePassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center mt-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
