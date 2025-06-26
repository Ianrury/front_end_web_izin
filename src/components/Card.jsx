import React from "react";

const Card = ({ children, className = "" }) => {
  return <div className={`bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden ${className}`}>{children}</div>;
};

export default Card;
