import React from "react";

export function Button({ children, onClick, variant = "default" }) {
  const variants = {
    default: "bg-blue-500 hover:bg-blue-600 text-white",
    ghost: "bg-transparent text-gray-500 hover:text-gray-700",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${variants[variant]} transition`}
    >
      {children}
    </button>
  );
}
