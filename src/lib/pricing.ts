import type { PricingInput } from "@/lib/validation/pricing";

const basePrice: Record<PricingInput["service"], number> = {
  "live-coaching": 6900,
  "replay-analysis": 4500,
  "role-mastery": 6300,
  "hero-mastery": 7200,
  "guided-rank-improvement": 8900,
  "team-coaching": 12900,
  "monthly-membership": 24900
};

const durationFactor: Record<PricingInput["sessionDuration"], number> = {
  "60": 1,
  "90": 1.42,
  "120": 1.82
};

const tierFactor: Record<PricingInput["coachTier"], number> = {
  Pro: 1,
  Master: 1.25,
  Elite: 1.55
};

const priorityFactor: Record<PricingInput["priority"], number> = {
  Flexible: 0.95,
  Standard: 1,
  Priority: 1.2
};

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface PriceQuote {
  currency: "cad";
  subtotal: number;
  discount: number;
  total: number;
  lines: QuoteLine[];
  note: string;
}

export function calculateQuote(input: PricingInput): PriceQuote {
  const isMembership = input.service === "monthly-membership";
  const isReplayOnly = input.service === "replay-analysis";
  const isTeam = input.service === "team-coaching";
  const quantity = isMembership ? 1 : isReplayOnly ? Math.max(1, input.replayCount) : input.sessionCount;
  const duration = isReplayOnly || isMembership ? 1 : durationFactor[input.sessionDuration];
  const team = isTeam ? 1 + (input.teamSize - 1) * 0.13 : 1;
  const serviceAmount = Math.round(basePrice[input.service] * quantity * duration * team);
  const tierAdjustment = Math.round(serviceAmount * (tierFactor[input.coachTier] - 1));
  const replayAddOn = isReplayOnly || isMembership ? 0 : input.replayCount * 3200;
  const beforePriority = serviceAmount + tierAdjustment + replayAddOn;
  const priorityAdjustment = Math.round(beforePriority * (priorityFactor[input.priority] - 1));
  const volumeDiscount = input.sessionCount >= 6 && !isMembership ? Math.round(beforePriority * 0.08) : 0;
  const total = Math.max(2500, beforePriority + priorityAdjustment - volumeDiscount);

  const lines: QuoteLine[] = [
    { label: isReplayOnly ? `${quantity} replay review${quantity === 1 ? "" : "s"}` : isMembership ? "Monthly coaching membership" : `${quantity} × ${input.sessionDuration}-minute session${quantity === 1 ? "" : "s"}`, amount: serviceAmount }
  ];

  if (tierAdjustment > 0) lines.push({ label: `${input.coachTier} coach tier`, amount: tierAdjustment });
  if (replayAddOn > 0) lines.push({ label: `${input.replayCount} replay review add-on${input.replayCount === 1 ? "" : "s"}`, amount: replayAddOn });
  if (priorityAdjustment !== 0) lines.push({ label: `${input.priority} scheduling`, amount: priorityAdjustment });

  return {
    currency: "cad",
    subtotal: beforePriority + priorityAdjustment,
    discount: volumeDiscount,
    total,
    lines,
    note: "Final availability and price are verified securely before checkout. Results and MMR gains are not guaranteed."
  };
}
