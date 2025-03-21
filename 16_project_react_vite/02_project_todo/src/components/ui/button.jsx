import React from "react";

export default function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className={`px-4 py-2 rounded ${props.className} transition`}
    >
      {props.children}
    </button>
  );
}
