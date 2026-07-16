export const roles = ["customer", "coach", "support", "admin", "owner"] as const;
export type AppRole = (typeof roles)[number];

export type ServiceSlug =
  | "live-coaching"
  | "replay-analysis"
  | "role-mastery"
  | "hero-mastery"
  | "guided-rank-improvement"
  | "team-coaching"
  | "monthly-membership";

export interface ServiceDefinition {
  slug: ServiceSlug;
  eyebrow: string;
  name: string;
  shortDescription: string;
  description: string;
  priceFrom: number;
  duration: string;
  highlights: string[];
  idealFor: string[];
  sessionStructure: string[];
  accent: "crimson" | "amber" | "cyan";
}

export interface Coach {
  slug: string;
  displayName: string;
  initials: string;
  currentRank: string;
  peakRank: string;
  rating: number;
  reviewCount: number;
  sessions: number;
  roles: string[];
  specialties: string[];
  coachingTypes: string[];
  languages: string[];
  region: string;
  timeZone: string;
  availability: string;
  startingPrice: number;
  tier: "Elite" | "Master" | "Pro";
  biography: string;
  coachingStyle: string;
}

export interface Review {
  id: string;
  customer: string;
  coach: string;
  rating: number;
  service: string;
  role: string;
  rank: string;
  quote: string;
  date: string;
  verified: boolean;
}

export interface PortalUser {
  id: string;
  email: string;
  displayName: string;
  role: AppRole;
}
