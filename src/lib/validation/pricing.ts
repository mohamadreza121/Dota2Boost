import { z } from "zod";
import { maximumPricedMmr, rankFromMmr, rankOptions } from "@/lib/data/ranks";

export { rankOptions };

export const serviceOptions = [
  "mmr-boost",
  "mmr-calibration",
  "low-priority-recovery",
  "behavior-score-boost",
  "win-boost",
  "coaching"
] as const;

const pricingFields = {
  service: z.enum(serviceOptions),
  boostMode: z.enum(["Solo", "Duo"]),
  currentRank: z.enum(rankOptions),
  targetRank: z.enum(rankOptions),
  currentMmr: z.number().int().min(0).max(maximumPricedMmr - 100),
  targetMmr: z.number().int().min(100).max(maximumPricedMmr),
  mmrAmount: z.number().int().min(100).max(maximumPricedMmr),
  calibrationType: z.enum(["New account", "Recalibration activated", "Returning player"]),
  rankConfidence: z.number().int().min(0).max(100),
  matchCount: z.number().int().min(1).max(30),
  lowPriorityWins: z.number().int().min(1).max(10),
  currentBehaviorScore: z.number().int().min(0).max(12000),
  behaviorScoreAmount: z.number().int().min(500).max(6000).refine((value) => value % 500 === 0, "Behavior score must use 500-point steps."),
  winCount: z.number().int().min(3).max(20),
  sessionCount: z.number().int().min(1).max(8),
  role: z.enum(["Carry", "Mid", "Offlane", "Soft Support", "Hard Support", "Flexible"]),
  region: z.enum(["North America", "Europe West", "Europe East", "Southeast Asia", "South America", "Australia"]),
  language: z.string().trim().min(2).max(40),
  boosterTier: z.enum(["Pro", "Master", "Elite"]),
  priority: z.enum(["Flexible", "Standard", "Priority"]),
  preferredHeroes: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  discountCode: z.string().trim().min(3).max(32).regex(/^[A-Za-z0-9_-]+$/).optional()
} as const;

type ConfigurableInput = {
  service: (typeof serviceOptions)[number];
  boostMode: "Solo" | "Duo";
  currentRank: (typeof rankOptions)[number];
  targetRank: (typeof rankOptions)[number];
  currentMmr: number;
  targetMmr: number;
  mmrAmount: number;
  matchCount: number;
};

function validateConfiguration(input: ConfigurableInput, context: z.RefinementCtx) {
  if (input.service === "mmr-boost") {
    if (input.targetMmr - input.currentMmr < 100) {
      context.addIssue({ code: "custom", path: ["targetMmr"], message: "Choose a target at least 100 MMR above the current MMR." });
    }
    if (input.mmrAmount !== input.targetMmr - input.currentMmr) {
      context.addIssue({ code: "custom", path: ["mmrAmount"], message: "MMR scope must match the exact current and target MMR." });
    }
    if (input.currentRank !== rankFromMmr(input.currentMmr)) {
      context.addIssue({ code: "custom", path: ["currentRank"], message: "Current medal does not match the exact current MMR." });
    }
    if (input.targetRank !== rankFromMmr(input.targetMmr)) {
      context.addIssue({ code: "custom", path: ["targetRank"], message: "Target medal does not match the exact target MMR." });
    }
  }
  if ((input.service === "mmr-calibration" || input.service === "win-boost") && input.currentRank !== rankFromMmr(input.currentMmr)) {
    context.addIssue({ code: "custom", path: ["currentRank"], message: "Current medal does not match the supplied MMR." });
  }
  if (input.service === "win-boost" && input.boostMode !== "Duo") {
    context.addIssue({ code: "custom", path: ["boostMode"], message: "Win Boost is delivered through Duo Queue." });
  }
  if ((input.service === "behavior-score-boost" || input.service === "coaching") && input.boostMode !== "Solo") {
    context.addIssue({ code: "custom", path: ["boostMode"], message: "This service uses customer-operated Solo delivery." });
  }
}

export const pricingInputSchema = z.object(pricingFields).superRefine(validateConfiguration);

export type PricingInput = z.infer<typeof pricingInputSchema>;

export const checkoutSchema = z.object({
  ...pricingFields,
  quoteToken: z.string().min(16).max(256).optional()
}).superRefine(validateConfiguration);
