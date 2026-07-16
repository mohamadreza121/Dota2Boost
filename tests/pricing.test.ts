import { describe, expect, it } from "vitest";
import { calculateQuote } from "@/lib/pricing";
import type { PricingInput } from "@/lib/validation/pricing";

const input: PricingInput = {
  service: "rank-boost",
  currentRank: "Legend",
  targetRank: "Ancient",
  role: "Carry",
  region: "North America",
  language: "English",
  winCount: 5,
  queueMode: "Party Queue",
  boosterTier: "Pro",
  priority: "Standard",
  partySize: 1,
  preferredHeroes: []
};

describe("calculateQuote", () => {
  it("prices a standard self-play rank boost", () => {
    const quote = calculateQuote(input);
    expect(quote.subtotal).toBe(10000);
    expect(quote.total).toBe(10000);
  });

  it("applies queue, booster tier, priority, and volume adjustments", () => {
    const quote = calculateQuote({
      ...input,
      winCount: 10,
      queueMode: "Duo Lane",
      boosterTier: "Master",
      priority: "Priority"
    });
    expect(quote.subtotal).toBe(30397);
    expect(quote.discount).toBe(1520);
    expect(quote.total).toBe(28877);
  });

  it("applies the twenty-win volume rate", () => {
    const quote = calculateQuote({ ...input, winCount: 20 });
    expect(quote.discount).toBe(4000);
    expect(quote.total).toBe(36000);
  });

  it("prices full-stack coverage without trusting a client total", () => {
    const quote = calculateQuote({
      ...input,
      service: "stack-boost",
      queueMode: "Full Stack",
      partySize: 5
    });
    expect(quote.total).toBeGreaterThan(calculateQuote(input).total);
    expect(quote.lines.some((line) => line.label.includes("stack coverage"))).toBe(true);
  });
});
