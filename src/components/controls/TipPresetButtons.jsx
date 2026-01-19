import React from "react";

export default function TipPresetButtons({ presets, activeTip, onSelect }) {
  return (
    <div className="button-group">
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          className={activeTip === preset ? "button button--active" : "button"}
          onClick={() => onSelect(preset)}
        >
          {preset}%
        </button>
      ))}
    </div>
  );
}
