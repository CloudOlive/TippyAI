import React from "react";
import { toCurrency } from "../../utils/calc.js";

export default function PersonRow({
  index,
  name,
  amount,
  adjustment,
  onNameChange,
  onAdjustmentChange,
  allowAdjustments,
}) {
  return (
    <div className="person-row">
      <input
        className="person-row__name"
        type="text"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder={`Person ${index + 1}`}
      />
      <div className="person-row__amount">{toCurrency(amount)}</div>
      <div className="person-row__actions">
        <button
          type="button"
          className="button"
          disabled={!allowAdjustments}
          onClick={() => onAdjustmentChange(adjustment - 1)}
        >
          -$1
        </button>
        <button
          type="button"
          className="button"
          disabled={!allowAdjustments}
          onClick={() => onAdjustmentChange(adjustment + 1)}
        >
          +$1
        </button>
      </div>
      {allowAdjustments && (
        <div className="person-row__adjustment">
          Adjustment: {toCurrency(adjustment)}
        </div>
      )}
    </div>
  );
}
