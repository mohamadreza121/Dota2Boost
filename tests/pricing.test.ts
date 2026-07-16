import { describe, expect, it } from "vitest";
import { calculateQuote } from "@/lib/pricing";
import type { PricingInput } from "@/lib/validation/pricing";

const input: PricingInput = {
  service: "live-coaching",
  currentRank: "Legend",
  targetGoal: "Improve decision making",
  role: "Carry",
  region: "North America",
  language: "English",
  sessionCount: 1,
  sessionDuration: "60",
  replayCount: 0,
  coachTier: "Pro",
  priority: "Standard",
  teamSize: 1,
  preferredHeroes: []
};

describe("calculateQuote", () => {
  it("returns the base live-coaching price", () => {
    expect(calculateQuote(input).total).toBe(6900);
  });

  it("applies tier, replay, and priority adjustments on the server model", () => {
    const quote = calculateQuote({
      ...input,
      sessionCount: 2,
      coachTier: "Elite",
      priority: "Priority",
      replayCount: 1
    });

    expect(quote.total).toBe(29508);
    expect(quote.lines).toHaveLength(4);
  });

  it("applies the six-session volume discount", () => {
    const quote = calculateQuote({ ...input, sessionCount: 6 });
    expect(quote.discount).toBe(3312);
    expect(quote.total).toBe(38088);
  });

  it("charges team size without trusting a client total", () => {
    const quote = calculateQuote({ ...input, service: "team-coaching", teamSize: 5 });
    expect(quote.total).toBe(19608);
  });
});
