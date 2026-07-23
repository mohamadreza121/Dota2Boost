import { describe, expect, it } from "vitest";
import { calculateQuote, describePricingInput } from "@/lib/pricing";
import { pricingInputSchema, type PricingInput } from "@/lib/validation/pricing";

const input: PricingInput = {
  service: "mmr-boost",
  boostMode: "Duo",
  currentRank: "Legend III",
  targetRank: "Ancient I",
  currentMmr: 3400,
  targetMmr: 3900,
  mmrAmount: 500,
  calibrationType: "Recalibration activated",
  rankConfidence: 25,
  matchCount: 10,
  lowPriorityWins: 3,
  currentBehaviorScore: 8000,
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
    expect(quote.subtotal).toBe(4290);
    expect(quote.discount).toBe(129);
    expect(quote.total).toBe(4161);
    expect(quote.summary).toContain("500 MMR");
    expect(describePricingInput(input)).toContain("3,400 to 3,900 MMR");
    expect(quote.pricingVersion).toBe("2026.07.22");
  });

  it("prices Solo below Duo without trusting a browser total", () => {
    const solo = calculateQuote({ ...input, boostMode: "Solo" });
    const duo = calculateQuote(input);
    expect(solo.total).toBe(3468);
    expect(duo.total).toBeGreaterThan(solo.total);
  });

  it("uses service-specific behavior-score units", () => {
    const quote = calculateQuote({ ...input, service: "behavior-score-boost", boostMode: "Solo", boosterTier: "Master" });
    expect(quote.subtotal).toBe(1980);
    expect(quote.discount).toBe(79);
    expect(quote.total).toBe(2500);
    expect(quote.lines[0]?.label).toContain("2,000 behavior score");
  });

  it("applies the ten-match calibration package rate", () => {
    const quote = calculateQuote({ ...input, service: "mmr-calibration", boostMode: "Solo", matchCount: 10, priority: "Flexible" });
    expect(quote.subtotal).toBe(7820);
    expect(quote.discount).toBe(782);
    expect(quote.total).toBe(7038);
  });

  it("prices account-safe Low Priority recovery by required wins", () => {
    const quote = calculateQuote({ ...input, service: "low-priority-recovery", boostMode: "Solo", lowPriorityWins: 3 });
    expect(quote.subtotal).toBe(3600);
    expect(quote.total).toBe(3600);
    expect(quote.summary).toContain("required wins");
  });

  it("rejects unsupported hidden mode combinations", () => {
    expect(pricingInputSchema.safeParse({ ...input, service: "win-boost", boostMode: "Solo" }).success).toBe(false);
    expect(pricingInputSchema.safeParse({ ...input, service: "coaching", boostMode: "Duo" }).success).toBe(false);
  });

  it("rejects contradictory medal and MMR inputs", () => {
    expect(pricingInputSchema.safeParse({ ...input, currentRank: "Herald I" }).success).toBe(false);
    expect(pricingInputSchema.safeParse({ ...input, mmrAmount: 900 }).success).toBe(false);
  });

  it("accepts arbitrary whole-number target MMR values", () => {
    const result = pricingInputSchema.safeParse({
      ...input,
      currentMmr: 3500,
      targetMmr: 3880,
      mmrAmount: 380,
      currentRank: "Legend III",
      targetRank: "Ancient I"
    });

    expect(result.success).toBe(true);
  });
});
