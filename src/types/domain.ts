export const roles = ["customer", "coach", "support", "admin", "owner"] as const;
export type AppRole = (typeof roles)[number];

export type ServiceSlug =
  | "mmr-boost"
  | "mmr-calibration"
  | "low-priority-recovery"
  | "behavior-score-boost"
  | "win-boost"
  | "coaching";

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

export interface Booster {
  slug: string;
  displayName: string;
  initials: string;
  currentRank: string;
  peakRank: string;
  rating: number;
  reviewCount: number;
  winsDelivered: number;
  roles: string[];
  specialties: string[];
  boostingTypes: string[];
  languages: string[];
  region: string;
  timeZone: string;
  availability: string;
  startingPrice: number;
  tier: "Elite" | "Master" | "Pro";
  biography: string;
  playStyle: string;
}

export interface Review {
  id: string;
  customer: string;
  booster: string;
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
