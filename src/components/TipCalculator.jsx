import React, { useEffect, useMemo, useState } from "react";
import ControlsPanel from "./controls/ControlsPanel.jsx";
import ResultsPanel from "./results/ResultsPanel.jsx";
import {
  buildShareText,
  calculateSplitAmounts,
  calculateTipAmount,
  normalizeArrayLength,
} from "../utils/calc.js";

const DEFAULT_TIP = 18;
const DEFAULT_PEOPLE = "";
const DEFAULT_BILL = "";
const DEFAULT_TAX = "";
const DEFAULT_CUSTOM_TIP = "";

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState(DEFAULT_BILL);
  const [tipPercent, setTipPercent] = useState(DEFAULT_TIP);
  const [customTip, setCustomTip] = useState(DEFAULT_CUSTOM_TIP);
  const [useCustomTip, setUseCustomTip] = useState(false);
  const [peopleCount, setPeopleCount] = useState(DEFAULT_PEOPLE);
  const [includePreTax, setIncludePreTax] = useState(false);
  const [taxAmount, setTaxAmount] = useState(DEFAULT_TAX);
  const [names, setNames] = useState(
    Array.from({ length: DEFAULT_PEOPLE }, (_, index) => `Person ${index + 1}`),
  );
  const [adjustments, setAdjustments] = useState(
    Array.from({ length: DEFAULT_PEOPLE }, () => 0),
  );
  const [roundingMode, setRoundingMode] = useState("none");
  const [unequalSplitEnabled, setUnequalSplitEnabled] = useState(false);
  const [cashTipMode, setCashTipMode] = useState(false);
  const [cashTipPayerIndex, setCashTipPayerIndex] = useState(0);
  const [step, setStep] = useState("controls");

  useEffect(() => {
    setNames((prev) => {
      const next = [...prev];
      for (let i = prev.length; i < peopleCount; i += 1) {
        next.push(`Person ${i + 1}`);
      }
      return next.slice(0, peopleCount);
    });
    setAdjustments((prev) => normalizeArrayLength(prev, peopleCount, 0));
    if (cashTipPayerIndex >= peopleCount) {
      setCashTipPayerIndex(0);
    }
  }, [peopleCount, cashTipPayerIndex]);

  const numericBill = Number.parseFloat(billAmount) || 0;
  const numericTax = Number.parseFloat(taxAmount) || 0;
  const numericCustomTip = Number.parseFloat(customTip) || 0;
  const activeTipPercent = useCustomTip ? numericCustomTip : tipPercent;

  const tipData = useMemo(
    () =>
      calculateTipAmount({
        billAmount: numericBill,
        tipPercent: activeTipPercent,
        includePreTax,
        taxAmount: numericTax,
      }),
    [numericBill, activeTipPercent, includePreTax, numericTax],
  );

  const cashAdjustments = useMemo(() => {
    if (!cashTipMode) {
      return Array.from({ length: peopleCount }, () => 0);
    }
    return Array.from({ length: peopleCount }, (_, index) =>
      index === cashTipPayerIndex ? tipData.tipAmount : 0,
    );
  }, [cashTipMode, cashTipPayerIndex, peopleCount, tipData.tipAmount]);

  const totalAmount = tipData.totalWithTip;
  const basePerPerson = cashTipMode
    ? numericBill / peopleCount
    : totalAmount / peopleCount;

  const activeAdjustments = useMemo(() => {
    const zeroes = Array.from({ length: peopleCount }, () => 0);
    const baseAdjustments = unequalSplitEnabled ? adjustments : zeroes;
    if (!cashTipMode) {
      return baseAdjustments;
    }
    return baseAdjustments.map(
      (value, index) => value + cashAdjustments[index],
    );
  }, [adjustments, cashAdjustments, cashTipMode, unequalSplitEnabled, peopleCount]);

  const splitData = useMemo(
    () =>
      calculateSplitAmounts({
        totalAmount,
        basePerPerson,
        peopleCount,
        adjustments: activeAdjustments,
        roundingMode,
      }),
    [totalAmount, basePerPerson, peopleCount, activeAdjustments, roundingMode],
  );

  const roundedAmounts = splitData.roundedAmounts;
  const roundedTotal = splitData.roundedTotal;
  const roundingDelta = roundedTotal - totalAmount;
  const averagePerPerson =
    roundedAmounts.reduce((sum, value) => sum + value, 0) / peopleCount;

  const shareText = useMemo(() => {
    const labels = names.map((name, index) =>
      name?.trim() ? name.trim() : `Person ${index + 1}`,
    );
    const cashLabel = labels[cashTipPayerIndex] || "Person 1";
    return buildShareText({
      people: labels,
      roundedAmounts,
      tipAmount: tipData.tipAmount,
      totalAmount,
      roundingDelta,
      cashTipMode,
      cashTipPayerLabel: cashTipMode ? cashLabel : "",
    });
  }, [
    names,
    cashTipPayerIndex,
    roundedAmounts,
    tipData.tipAmount,
    totalAmount,
    roundingDelta,
    cashTipMode,
  ]);

  const handleCalculate = () => setStep("results");
  const handleBack = () => setStep("controls");

  const handleReset = () => {
    setBillAmount(DEFAULT_BILL);
    setTipPercent(DEFAULT_TIP);
    setCustomTip(DEFAULT_CUSTOM_TIP);
    setUseCustomTip(false);
    setPeopleCount(DEFAULT_PEOPLE);
    setIncludePreTax(false);
    setTaxAmount(DEFAULT_TAX);
    setNames(
      Array.from({ length: DEFAULT_PEOPLE }, (_, index) => `Person ${index + 1}`),
    );
    setAdjustments(Array.from({ length: DEFAULT_PEOPLE }, () => 0));
    setRoundingMode("none");
    setUnequalSplitEnabled(false);
    setCashTipMode(false);
    setCashTipPayerIndex(0);
    setStep("controls");
  };

  return (
    <div className="calculator">
      <div className="step-flow">
        <div className={`step-flow__track step-flow__track--${step}`}>
          <div className="step-flow__panel">
            <ControlsPanel
              billAmount={billAmount}
              onBillAmountChange={setBillAmount}
              tipPercent={tipPercent}
              onTipPercentChange={setTipPercent}
              useCustomTip={useCustomTip}
              onUseCustomTipChange={setUseCustomTip}
              customTip={customTip}
              onCustomTipChange={setCustomTip}
              peopleCount={peopleCount}
              onPeopleCountChange={(value) => {
                const safeValue = Math.min(10, Math.max(2, value || DEFAULT_PEOPLE));
                setPeopleCount(safeValue);
              }}
              includePreTax={includePreTax}
              onIncludePreTaxChange={setIncludePreTax}
              taxAmount={taxAmount}
              onTaxAmountChange={setTaxAmount}
              roundingMode={roundingMode}
              onRoundingModeChange={setRoundingMode}
              unequalSplitEnabled={unequalSplitEnabled}
              onUnequalSplitEnabledChange={(enabled) => {
                setUnequalSplitEnabled(enabled);
                if (!enabled) {
                  setAdjustments((prev) => prev.map(() => 0));
                }
              }}
              cashTipMode={cashTipMode}
              onCashTipModeChange={setCashTipMode}
              cashTipPayerIndex={cashTipPayerIndex}
              onCashTipPayerIndexChange={setCashTipPayerIndex}
              names={names}
              onReset={handleReset}
              onCalculate={handleCalculate}
            />
          </div>
          <div className="step-flow__panel">
            <ResultsPanel
              tipAmount={tipData.tipAmount}
              totalAmount={totalAmount}
              averagePerPerson={averagePerPerson}
              roundingDelta={roundingDelta}
              roundingMode={roundingMode}
              peopleCount={peopleCount}
              names={names}
              setNames={setNames}
              roundedAmounts={roundedAmounts}
              adjustments={adjustments}
              setAdjustments={setAdjustments}
              unequalSplitEnabled={unequalSplitEnabled}
              shareText={shareText}
              onBack={handleBack}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
