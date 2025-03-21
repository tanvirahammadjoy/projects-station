import React from "react";

export default function Input({ value, onchange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onchange}
      placeholder={placeholder}
    />
  );
}
