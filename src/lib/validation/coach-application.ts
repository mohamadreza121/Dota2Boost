import { z } from "zod";

export const coachApplicationSchema = z.object({
  legalName: z.string().trim().min(2).max(100),
  displayName: z.string().trim().min(2).max(50),
  email: z.email().max(160),
  country: z.string().trim().min(2).max(80),
  timeZone: z.string().trim().min(3).max(80),
  languages: z.string().trim().min(2).max(160),
  currentRank: z.string().trim().min(2).max(80),
  peakRank: z.string().trim().min(2).max(80),
  mainRoles: z.string().trim().min(2).max(160),
  bestHeroes: z.string().trim().min(2).max(240),
  gameplayProfile: z.url().max(500),
  coachingExperience: z.string().trim().min(20).max(2000),
  weeklyAvailability: z.string().trim().min(5).max(500),
  preferredCompensation: z.string().trim().min(2).max(200),
  biography: z.string().trim().min(60).max(1500),
  sampleReplayAnalysis: z.string().trim().min(80).max(4000),
  sampleCoachingVideoUrl: z.union([z.literal(""), z.url().max(500)]),
  whyJoin: z.string().trim().min(40).max(1500),
  agreement: z.boolean().refine((accepted) => accepted, "You must accept the booster conduct standards."),
  turnstileToken: z.string().max(2048).optional()
});

export type CoachApplicationInput = z.infer<typeof coachApplicationSchema>;
