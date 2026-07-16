import { z } from "zod";

export const rankOptions = [
  "Herald",
  "Guardian",
  "Crusader",
  "Archon",
  "Legend",
  "Ancient",
  "Divine",
  "Immortal"
] as const;

const pricingFields = {
  service: z.enum([
    "rank-boost",
    "win-boost",
    "calibration-support",
    "duo-lane-boost",
    "mmr-sprint",
    "stack-boost",
    "priority-membership"
  ]),
  currentRank: z.enum(rankOptions),
  targetRank: z.enum(rankOptions),
  role: z.enum(["Carry", "Mid", "Offlane", "Soft Support", "Hard Support", "Flexible"]),
  region: z.enum(["North America", "Europe West", "Europe East", "Southeast Asia", "South America", "Australia"]),
  language: z.string().trim().min(2).max(40),
  winCount: z.number().int().min(3).max(20),
  queueMode: z.enum(["Party Queue", "Duo Lane", "Full Stack"]),
  boosterTier: z.enum(["Pro", "Master", "Elite"]),
  priority: z.enum(["Flexible", "Standard", "Priority"]),
  partySize: z.number().int().min(1).max(5).default(1),
  preferredHeroes: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  discountCode: z.string().trim().min(3).max(32).regex(/^[A-Za-z0-9_-]+$/).optional()
} as const;

function validateRankPath(
  input: { currentRank: (typeof rankOptions)[number]; targetRank: (typeof rankOptions)[number] },
  context: z.RefinementCtx
) {
  if (rankOptions.indexOf(input.targetRank) < rankOptions.indexOf(input.currentRank)) {
    context.addIssue({ code: "custom", path: ["targetRank"], message: "Target rank cannot be below the current rank." });
  }
}

export const pricingInputSchema = z.object(pricingFields).superRefine(validateRankPath);

export type PricingInput = z.infer<typeof pricingInputSchema>;

export const checkoutSchema = z.object({
  ...pricingFields,
  quoteToken: z.string().min(16).max(256).optional()
}).superRefine(validateRankPath);
