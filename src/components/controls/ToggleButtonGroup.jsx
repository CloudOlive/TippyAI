import React from "react";

export default function ToggleButtonGroup({ value, onChange, options }) {
  return (
    <div className="button-group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            value === option.value ? "button button--active" : "button"
          }
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
