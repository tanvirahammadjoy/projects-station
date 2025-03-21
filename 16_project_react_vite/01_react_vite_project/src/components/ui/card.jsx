import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-gray-100 p-4 rounded shadow ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="text-gray-700 text-lg">{children}</div>;
}
