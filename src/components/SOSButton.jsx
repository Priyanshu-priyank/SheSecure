import React from "react";

export default function SOSButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 84,
        height: 84,
        borderRadius: 42,
        background: "red",
        color: "white",
        border: "none",
        fontSize: 18,
        boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
      }}
    >
      🚨 SOS
    </button>
  );
}
