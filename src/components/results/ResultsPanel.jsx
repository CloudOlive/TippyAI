import React, { useMemo } from "react";
import PersonRow from "./PersonRow.jsx";
import { toCurrency } from "../../utils/calc.js";

export default function ResultsPanel({
  tipAmount,
  totalAmount,
  averagePerPerson,
  roundingDelta,
  roundingMode,
  peopleCount,
  names,
  setNames,
  roundedAmounts,
  adjustments,
  setAdjustments,
  unequalSplitEnabled,
  shareText,
}) {
  const roundedDeltaText = useMemo(() => {
    if (roundingMode === "none") {
      return "No rounding applied";
    }
    const deltaLabel = roundingDelta >= 0 ? "+" : "-";
    return `Rounding delta ${deltaLabel}${toCurrency(Math.abs(roundingDelta))}`;
  }, [roundingMode, roundingDelta]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      window.alert("Split copied to clipboard.");
    } catch (error) {
      window.alert("Copy failed. Please try again.");
    }
  };

  return (
    <section className="card card--results">
      <div className="card__header">
        <h2>Results</h2>
        <button className="button button--primary" type="button" onClick={handleShare}>
          Share breakdown
        </button>
      </div>

      <div className="results__hero">
        <div>
          <p className="results__label">Per person (avg)</p>
          <p className="results__value">{toCurrency(averagePerPerson)}</p>
        </div>
        <div>
          <p className="results__label">Tip amount</p>
          <p className="results__value">{toCurrency(tipAmount)}</p>
        </div>
        <div>
          <p className="results__label">Total bill</p>
          <p className="results__value">{toCurrency(totalAmount)}</p>
        </div>
      </div>

      <p className="results__rounding">{roundedDeltaText}</p>

      <div className="results__list">
        {Array.from({ length: peopleCount }).map((_, index) => (
          <PersonRow
            key={`person-${index}`}
            index={index}
            name={names[index]}
            amount={roundedAmounts[index]}
            adjustment={adjustments[index]}
            onNameChange={(value) =>
              setNames((prev) =>
                prev.map((entry, i) => (i === index ? value : entry)),
              )
            }
            onAdjustmentChange={(value) =>
              setAdjustments((prev) =>
                prev.map((entry, i) => (i === index ? value : entry)),
              )
            }
            allowAdjustments={unequalSplitEnabled}
          />
        ))}
      </div>
    </section>
  );
}
