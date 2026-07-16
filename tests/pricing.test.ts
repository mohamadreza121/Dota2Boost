import { describe, expect, it } from "vitest";
import { calculateQuote, describePricingInput } from "@/lib/pricing";
import { pricingInputSchema, type PricingInput } from "@/lib/validation/pricing";

const input: PricingInput = {
  service: "mmr-boost",
  boostMode: "Duo",
  currentRank: "Legend",
  targetRank: "Ancient",
  mmrAmount: 500,
  matchCount: 5,
  behaviorScoreAmount: 2000,
  winCount: 5,
  sessionCount: 1,
  role: "Carry",
  region: "North America",
  language: "English",
  boosterTier: "Pro",
  priority: "Standard",
  preferredHeroes: []
};

describe("calculateQuote", () => {
  it("prices a bracket-aware Duo MMR climb", () => {
    const quote = calculateQuote(input);
    expect(quote.subtotal).toBe(14231);
    expect(quote.discount).toBe(427);
    expect(quote.total).toBe(13804);
    expect(quote.summary).toContain("500 MMR");
    expect(describePricingInput(input)).toContain("Legend to Ancient");
  });

  it("prices Solo below Duo without trusting a browser total", () => {
    const solo = calculateQuote({ ...input, boostMode: "Solo" });
    const duo = calculateQuote(input);
    expect(solo.total).toBe(12004);
    expect(duo.total).toBeGreaterThan(solo.total);
  });

  it("uses service-specific behavior-score units", () => {
    const quote = calculateQuote({ ...input, service: "behavior-score-boost", boostMode: "Solo", boosterTier: "Master" });
    expect(quote.subtotal).toBe(6440);
    expect(quote.discount).toBe(258);
    expect(quote.total).toBe(6182);
    expect(quote.lines[0]?.label).toContain("2,000 behavior score");
  });

  it("applies the ten-match calibration package rate", () => {
    const quote = calculateQuote({ ...input, service: "mmr-calibration", boostMode: "Solo", currentRank: "Herald", targetRank: "Herald", matchCount: 10, priority: "Flexible" });
    expect(quote.subtotal).toBe(19176);
    expect(quote.discount).toBe(1151);
    expect(quote.total).toBe(18025);
  });

  it("rejects unsupported hidden mode combinations", () => {
    expect(pricingInputSchema.safeParse({ ...input, service: "win-boost", boostMode: "Solo" }).success).toBe(false);
    expect(pricingInputSchema.safeParse({ ...input, service: "coaching", boostMode: "Duo" }).success).toBe(false);
  });
});
