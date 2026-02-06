import React from "react";
import ToggleButtonGroup from "./ToggleButtonGroup.jsx";
import TipPresetButtons from "./TipPresetButtons.jsx";

const tipPresets = [15, 18, 20, 25];

export default function ControlsPanel({
  billAmount,
  onBillAmountChange,
  tipPercent,
  onTipPercentChange,
  useCustomTip,
  onUseCustomTipChange,
  customTip,
  onCustomTipChange,
  peopleCount,
  onPeopleCountChange,
  includePreTax,
  onIncludePreTaxChange,
  taxAmount,
  onTaxAmountChange,
  roundingMode,
  onRoundingModeChange,
  unequalSplitEnabled,
  onUnequalSplitEnabledChange,
  cashTipMode,
  onCashTipModeChange,
  cashTipPayerIndex,
  onCashTipPayerIndexChange,
  names,
  onReset,
  onCalculate,
}) {
  return (
    <section className="card card--inputs">
      <div className="card__header">
        <h2>Bill details</h2>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={billAmount}
            onChange={(event) => onBillAmountChange(event.target.value)}
            placeholder="0.00"
          />
        </label>

        <div className="field">
          <span>Tip percentage</span>
          <TipPresetButtons
            presets={tipPresets}
            activeTip={tipPercent}
            onSelect={(value) => {
              onUseCustomTipChange(false);
              onTipPercentChange(value);
            }}
          />
          <label className="field__inline">
            <input
              type="checkbox"
              checked={useCustomTip}
              onChange={(event) => onUseCustomTipChange(event.target.checked)}
            />
            Custom tip
          </label>
          {useCustomTip && (
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={customTip}
              onChange={(event) => onCustomTipChange(event.target.value)}
              placeholder="Custom %"
            />
          )}
        </div>

        <label className="field">
          <span>Number of people</span>
          <input
            type="number"
            min="2"
            max="10"
            value={peopleCount}
            onChange={(event) =>
              onPeopleCountChange(Number(event.target.value))
            }
          />
        </label>

        <div className="field">
          <label className="field__inline">
            <input
              type="checkbox"
              checked={includePreTax}
              onChange={(event) => onIncludePreTaxChange(event.target.checked)}
            />
            Calculate tip on pre-tax amount
          </label>
          {includePreTax && (
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={taxAmount}
              onChange={(event) => onTaxAmountChange(event.target.value)}
              placeholder="Tax amount"
            />
          )}
        </div>

        <div className="field">
          <span>Rounding options</span>
          <ToggleButtonGroup
            value={roundingMode}
            onChange={onRoundingModeChange}
            options={[
              { label: "No rounding", value: "none" },
              { label: "Nearest $1", value: "1" },
              { label: "Nearest $5", value: "5" },
            ]}
          />
        </div>

        <div className="field">
          <label className="field__inline">
            <input
              type="checkbox"
              checked={unequalSplitEnabled}
              onChange={(event) =>
                onUnequalSplitEnabledChange(event.target.checked)
              }
            />
            Enable unequal split adjustments
          </label>
        </div>

        <div className="field">
          <label className="field__inline">
            <input
              type="checkbox"
              checked={cashTipMode}
              onChange={(event) => onCashTipModeChange(event.target.checked)}
            />
            Cash tip helper mode
          </label>
          {cashTipMode && (
            <label className="field">
              <span>Who pays the cash tip?</span>
              <select
                value={cashTipPayerIndex}
                onChange={(event) =>
                  onCashTipPayerIndexChange(Number(event.target.value))
                }
              >
                {names.map((name, index) => (
                  <option key={name + index} value={index}>
                    {name?.trim() ? name.trim() : `Person ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <button
          className="button button--primary button--calculate"
          type="button"
          onClick={onCalculate}
        >
          Calculate
        </button>
      </div>
    </section>
  );
}
