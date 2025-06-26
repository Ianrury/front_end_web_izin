import React from "react";

const Button = ({ children, type = "button", onClick, loading = false, disabled = false, variant = "primary", className = "" }) => {
  const baseClasses = "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center";

  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${baseClasses} ${variants[variant]} ${disabled || loading ? "opacity-60 cursor-not-allowed transform-none" : ""} ${className}`}>
      {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : null}
      {children}
    </button>
  );
};

export default Button;
