import type { PricingInput } from "@/lib/validation/pricing";
import { rankRoute } from "@/lib/data/ranks";

const rankFactor = (rank: PricingInput["currentRank"]) => 0.8 + Math.min(0.55, Math.max(0, (rank === "Immortal" ? 35 : rankRoute("Herald I", rank)) * 0.015));

const modeFactor: Record<PricingInput["boostMode"], number> = {
  Solo: 1,
  Duo: 1.2
};

const tierFactor: Record<PricingInput["boosterTier"], number> = {
  Pro: 1,
  Master: 1.1,
  Elite: 1.25
};

const priorityFactor: Record<PricingInput["priority"], number> = {
  Flexible: 0.92,
  Standard: 1,
  Priority: 1.18
};

const serviceLabels: Record<PricingInput["service"], string> = {
  "mmr-boost": "MMR Boost",
  "mmr-calibration": "MMR Calibration",
  "behavior-score-boost": "Behavior Score Boost",
  "win-boost": "Win Boost",
  coaching: "Dota 2 Coaching"
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
  summary: string;
  note: string;
}

function scope(input: PricingInput) {
  switch (input.service) {
    case "mmr-boost": {
      const units = input.mmrAmount / 100;
      const medalHops = rankRoute(input.currentRank, input.targetRank);
      // Customer-operated Duo/Solo market rate: price the larger of declared MMR scope or exact medal route.
      const amount = Math.max(units * 825, medalHops * 950);
      return { amount, units: Math.max(units, medalHops), label: `${input.currentRank} → ${input.targetRank} · ${medalHops} medal steps`, summary: `${input.currentRank} to ${input.targetRank} · ${input.mmrAmount} MMR · ${input.boostMode}` };
    }
    case "mmr-calibration":
      return { amount: input.matchCount * 1000, units: input.matchCount, label: `${input.matchCount} calibration matches`, summary: `${input.matchCount} matches · ${input.currentRank} · ${input.boostMode}` };
    case "behavior-score-boost": {
      const units = input.behaviorScoreAmount / 500;
      return { amount: units * 450, units, label: `${input.behaviorScoreAmount.toLocaleString()} behavior score`, summary: `${input.behaviorScoreAmount} score recovery scope` };
    }
    case "win-boost":
      return { amount: input.winCount * 750, units: input.winCount, label: `${input.winCount} assisted win${input.winCount === 1 ? "" : "s"}`, summary: `${input.winCount} wins · ${input.currentRank} · Duo` };
    case "coaching":
      return { amount: input.sessionCount * 3900, units: input.sessionCount, label: `${input.sessionCount} coaching session${input.sessionCount === 1 ? "" : "s"}`, summary: `${input.sessionCount} private session${input.sessionCount === 1 ? "" : "s"}` };
  }
}

function bracketFactor(input: PricingInput) {
  if (input.service === "mmr-boost") return (rankFactor(input.currentRank) + rankFactor(input.targetRank)) / 2;
  if (input.service === "mmr-calibration" || input.service === "win-boost") return rankFactor(input.currentRank);
  return 1;
}

function volumeDiscountRate(input: PricingInput, units: number) {
  if (input.service === "mmr-boost") {
    if (units >= 20) return 0.12;
    if (units >= 10) return 0.07;
    if (units >= 5) return 0.03;
  }
  if (input.service === "mmr-calibration" && units >= 10) return 0.1;
  if (input.service === "behavior-score-boost") {
    if (units >= 8) return 0.08;
    if (units >= 4) return 0.04;
  }
  if (input.service === "win-boost") {
    if (units >= 20) return 0.1;
    if (units >= 15) return 0.07;
    if (units >= 10) return 0.05;
  }
  if (input.service === "coaching") {
    if (units >= 8) return 0.12;
    if (units >= 4) return 0.07;
  }
  return 0;
}

export function describePricingInput(input: PricingInput) {
  return `${serviceLabels[input.service]} · ${scope(input).summary}`;
}

export function calculateQuote(input: PricingInput): PriceQuote {
  const configuredScope = scope(input);
  const baseAmount = configuredScope.amount;
  const bracketAmount = Math.round(baseAmount * bracketFactor(input));
  const usesMode = input.service === "mmr-boost" || input.service === "mmr-calibration" || input.service === "win-boost";
  const modeAmount = Math.round(bracketAmount * (usesMode ? modeFactor[input.boostMode] : 1));
  const tierAmount = Math.round(modeAmount * tierFactor[input.boosterTier]);
  const subtotal = Math.round(tierAmount * priorityFactor[input.priority]);
  const discount = Math.round(subtotal * volumeDiscountRate(input, configuredScope.units));
  const total = Math.max(2500, subtotal - discount);

  const lines: QuoteLine[] = [{ label: configuredScope.label, amount: baseAmount }];
  if (bracketAmount !== baseAmount) {
    const rankLabel = input.service === "mmr-boost" ? `${input.currentRank} → ${input.targetRank} brackets` : `${input.currentRank} bracket`;
    lines.push({ label: rankLabel, amount: bracketAmount - baseAmount });
  }
  if (modeAmount !== bracketAmount) lines.push({ label: `${input.boostMode} mode`, amount: modeAmount - bracketAmount });
  if (tierAmount !== modeAmount) lines.push({ label: `${input.boosterTier} booster tier`, amount: tierAmount - modeAmount });
  if (subtotal !== tierAmount) lines.push({ label: `${input.priority} delivery`, amount: subtotal - tierAmount });

  return {
    currency: "cad",
    subtotal,
    discount,
    total,
    lines,
    summary: `${serviceLabels[input.service]} · ${configuredScope.summary}`,
    note: "The customer remains in control of their own account. Taxes are calculated at checkout. Match, MMR, rank, calibration, and behavior-score outcomes are not guaranteed."
  };
}
