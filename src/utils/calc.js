export function clampNumber(value, min, max) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

export function normalizeArrayLength(items, length, fallback) {
  const next = Array.from({ length }, (_, index) => items[index] ?? fallback);
  return next;
}

export function toCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function calculateTipAmount({
  billAmount,
  tipPercent,
  includePreTax,
  taxAmount,
}) {
  const safeBill = Math.max(0, billAmount);
  const safeTax = includePreTax ? clampNumber(taxAmount, 0, safeBill) : 0;
  const tipBase = includePreTax ? Math.max(0, safeBill - safeTax) : safeBill;
  const tip = (tipBase * Math.max(0, tipPercent)) / 100;
  return {
    tipBase,
    tipAmount: tip,
    totalWithTip: safeBill + tip,
    taxAmount: safeTax,
  };
}

export function calculateSplitAmounts({
  totalAmount,
  basePerPerson,
  peopleCount,
  adjustments,
  roundingMode,
}) {
  const safePeople = Math.max(1, peopleCount);
  const baseAmounts = Array.from({ length: safePeople }, () => basePerPerson);
  const safeAdjustments = normalizeArrayLength(adjustments, safePeople, 0);

  const unnormalized = baseAmounts.map(
    (amount, index) => amount + safeAdjustments[index],
  );
  const sumUnnormalized = unnormalized.reduce((sum, value) => sum + value, 0);
  const correction = (totalAmount - sumUnnormalized) / safePeople;
  const corrected = unnormalized.map((value) => value + correction);

  if (roundingMode === "none") {
    return {
      rawAmounts: corrected,
      roundedAmounts: corrected,
      roundedTotal: corrected.reduce((sum, value) => sum + value, 0),
    };
  }

  const roundingFactor = roundingMode === "5" ? 5 : 1;
  const rounded = corrected.map(
    (value) => Math.round(value / roundingFactor) * roundingFactor,
  );
  const roundedTotal = rounded.reduce((sum, value) => sum + value, 0);
  return {
    rawAmounts: corrected,
    roundedAmounts: rounded,
    roundedTotal,
  };
}

export function buildShareText({
  people,
  roundedAmounts,
  tipAmount,
  totalAmount,
  roundingDelta,
  cashTipMode,
  cashTipPayerLabel,
}) {
  const lines = [
    "TippyAI split summary",
    `Tip: ${toCurrency(tipAmount)}`,
    `Total: ${toCurrency(totalAmount)}`,
  ];

  if (roundingDelta !== 0) {
    lines.push(`Rounding delta: ${toCurrency(roundingDelta)}`);
  }

  if (cashTipMode && cashTipPayerLabel) {
    lines.push(`Cash tip payer: ${cashTipPayerLabel}`);
  }

  lines.push("Per person:");

  people.forEach((label, index) => {
    lines.push(`${label}: ${toCurrency(roundedAmounts[index])}`);
  });

  return lines.join("\n");
}
