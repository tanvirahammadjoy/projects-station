import React from "react";

export function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
