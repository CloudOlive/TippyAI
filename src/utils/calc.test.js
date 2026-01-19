import { describe, expect, it } from "vitest";
import {
  buildShareText,
  calculateSplitAmounts,
  calculateTipAmount,
} from "./calc.js";

describe("calculateTipAmount", () => {
  it("calculates tip based on pre-tax bill when enabled", () => {
    const result = calculateTipAmount({
      billAmount: 120,
      tipPercent: 20,
      includePreTax: true,
      taxAmount: 20,
    });

    expect(result.tipAmount).toBeCloseTo(20);
    expect(result.totalWithTip).toBeCloseTo(140);
  });
});

describe("calculateSplitAmounts", () => {
  it("keeps totals aligned after adjustments", () => {
    const result = calculateSplitAmounts({
      totalAmount: 100,
      basePerPerson: 50,
      peopleCount: 2,
      adjustments: [10, -5],
      roundingMode: "none",
    });

    const sum = result.roundedAmounts.reduce((acc, value) => acc + value, 0);
    expect(sum).toBeCloseTo(100);
  });
});

describe("buildShareText", () => {
  it("builds a readable summary", () => {
    const text = buildShareText({
      people: ["Alex", "Sam"],
      roundedAmounts: [30, 30],
      tipAmount: 10,
      totalAmount: 70,
      roundingDelta: 0,
      cashTipMode: false,
      cashTipPayerLabel: "",
    });

    expect(text).toContain("TippyAI split summary");
    expect(text).toContain("Alex: $30.00");
  });
});
