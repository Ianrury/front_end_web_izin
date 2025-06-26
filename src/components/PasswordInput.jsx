import React from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

const PasswordInput = ({ label, name, value, show, onToggle, onChange, error, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${error ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"}`}
      />
      <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
    {error && (
      <p className="text-sm text-red-600 flex items-center space-x-1">
        <AlertTriangle className="w-4 h-4" />
        <span>{error}</span>
      </p>
    )}
  </div>
);

export default React.memo(PasswordInput);
