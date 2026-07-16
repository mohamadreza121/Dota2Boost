import { z } from "zod";

export const pricingInputSchema = z.object({
  service: z.enum([
    "live-coaching",
    "replay-analysis",
    "role-mastery",
    "hero-mastery",
    "guided-rank-improvement",
    "team-coaching",
    "monthly-membership"
  ]),
  currentRank: z.string().trim().min(2).max(40),
  targetGoal: z.string().trim().min(2).max(80),
  role: z.enum(["Carry", "Mid", "Offlane", "Soft Support", "Hard Support", "Flexible"]),
  region: z.enum(["North America", "Europe West", "Europe East", "Southeast Asia", "South America", "Australia"]),
  language: z.string().trim().min(2).max(40),
  sessionCount: z.number().int().min(1).max(12),
  sessionDuration: z.enum(["60", "90", "120"]),
  replayCount: z.number().int().min(0).max(8),
  coachTier: z.enum(["Pro", "Master", "Elite"]),
  priority: z.enum(["Flexible", "Standard", "Priority"]),
  teamSize: z.number().int().min(1).max(5).default(1),
  preferredHeroes: z.array(z.string().trim().min(1).max(40)).max(8).default([])
});

export type PricingInput = z.infer<typeof pricingInputSchema>;

export const checkoutSchema = pricingInputSchema.extend({
  quoteToken: z.string().min(16).max(256).optional()
});
