import { z } from "zod";
import { rankOptions } from "@/lib/data/ranks";

export { rankOptions };

export const serviceOptions = [
  "mmr-boost",
  "mmr-calibration",
  "behavior-score-boost",
  "win-boost",
  "coaching"
] as const;

const pricingFields = {
  service: z.enum(serviceOptions),
  boostMode: z.enum(["Solo", "Duo"]),
  currentRank: z.enum(rankOptions),
  targetRank: z.enum(rankOptions),
  mmrAmount: z.number().int().min(100).max(3000).refine((value) => value % 100 === 0, "MMR must use 100-point steps."),
  matchCount: z.number().int().min(5).max(10),
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
  matchCount: number;
};

function validateConfiguration(input: ConfigurableInput, context: z.RefinementCtx) {
  if (input.service === "mmr-boost" && rankOptions.indexOf(input.targetRank) < rankOptions.indexOf(input.currentRank)) {
    context.addIssue({ code: "custom", path: ["targetRank"], message: "Target rank cannot be below the current rank." });
  }
  if (input.service === "mmr-calibration" && input.matchCount !== 5 && input.matchCount !== 10) {
    context.addIssue({ code: "custom", path: ["matchCount"], message: "Calibration is available in five- or ten-match blocks." });
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
