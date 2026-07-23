import type { PricingInput } from "@/lib/validation/pricing";

export interface MmrBracket {
  from: number;
  to: number;
  ratePer100: number;
}

export interface VolumeDiscount {
  minimumUnits: number;
  rate: number;
}

export interface PricingCatalog {
  version: string;
  currency: "cad";
  minimumTotal: number;
  mmrBrackets: MmrBracket[];
  unitPrices: {
    calibrationMatch: number;
    lowPriorityWin: number;
    behaviorScore500: number;
    assistedWin: number;
    coachingSession: number;
  };
  volumeDiscounts: Partial<Record<PricingInput["service"], VolumeDiscount[]>>;
}

export interface PricingRule {
  key: string;
  conditions: Record<string, unknown>;
  adjustmentType: "fixed" | "percentage" | "multiplier";
  adjustmentValue: number;
  priority: number;
}

export const defaultPricingRules: PricingRule[] = [
  { key: "duo-delivery", conditions: { boostMode: "Duo" }, adjustmentType: "multiplier", adjustmentValue: 1.2, priority: 50 },
  { key: "coach-tier-master", conditions: { boosterTier: "Master" }, adjustmentType: "multiplier", adjustmentValue: 1.1, priority: 100 },
  { key: "coach-tier-elite", conditions: { boosterTier: "Elite" }, adjustmentType: "multiplier", adjustmentValue: 1.25, priority: 110 },
  { key: "flexible-delivery", conditions: { priority: "Flexible" }, adjustmentType: "multiplier", adjustmentValue: 0.92, priority: 120 },
  { key: "priority-delivery", conditions: { priority: "Priority" }, adjustmentType: "multiplier", adjustmentValue: 1.18, priority: 130 }
];

export const defaultPricingCatalog: PricingCatalog = {
  version: "2026.07.22",
  currency: "cad",
  minimumTotal: 2500,
  mmrBrackets: [
    { from: 0, to: 769, ratePer100: 450 },
    { from: 770, to: 1539, ratePer100: 500 },
    { from: 1540, to: 2309, ratePer100: 550 },
    { from: 2310, to: 3079, ratePer100: 600 },
    { from: 3080, to: 3849, ratePer100: 700 },
    { from: 3850, to: 4619, ratePer100: 850 },
    { from: 4620, to: 5419, ratePer100: 1150 },
    { from: 5420, to: 6500, ratePer100: 1600 }
  ],
  unitPrices: {
    calibrationMatch: 850,
    lowPriorityWin: 1200,
    behaviorScore500: 450,
    assistedWin: 750,
    coachingSession: 3900
  },
  volumeDiscounts: {
    "mmr-boost": [{ minimumUnits: 20, rate: 0.12 }, { minimumUnits: 10, rate: 0.07 }, { minimumUnits: 5, rate: 0.03 }],
    "mmr-calibration": [{ minimumUnits: 20, rate: 0.15 }, { minimumUnits: 10, rate: 0.1 }],
    "low-priority-recovery": [{ minimumUnits: 10, rate: 0.1 }, { minimumUnits: 5, rate: 0.05 }],
    "behavior-score-boost": [{ minimumUnits: 8, rate: 0.08 }, { minimumUnits: 4, rate: 0.04 }],
    "win-boost": [{ minimumUnits: 20, rate: 0.1 }, { minimumUnits: 15, rate: 0.07 }, { minimumUnits: 10, rate: 0.05 }],
    coaching: [{ minimumUnits: 8, rate: 0.12 }, { minimumUnits: 4, rate: 0.07 }]
  }
};

const serviceLabels: Record<PricingInput["service"], string> = {
  "mmr-boost": "MMR Boost",
  "mmr-calibration": "Calibration & Rank Confidence",
  "low-priority-recovery": "Low Priority Recovery Assist",
  "behavior-score-boost": "Behavior Score Boost",
  "win-boost": "Win Boost",
  coaching: "Dota 2 Coaching"
};

const ruleLabels: Record<string, string> = {
  "duo-delivery": "Duo delivery",
  "coach-tier-master": "Master booster tier",
  "coach-tier-elite": "Elite booster tier",
  "priority-delivery": "Priority delivery",
  "flexible-delivery": "Flexible delivery"
};

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface PriceQuote {
  currency: "cad";
  pricingVersion: string;
  subtotal: number;
  discount: number;
  total: number;
  lines: QuoteLine[];
  summary: string;
  note: string;
}

function mmrScope(input: PricingInput, catalog: PricingCatalog) {
  const amount = catalog.mmrBrackets.reduce((total, bracket) => {
    const overlap = Math.max(0, Math.min(input.targetMmr, bracket.to + 1) - Math.max(input.currentMmr, bracket.from));
    return total + (overlap / 100) * bracket.ratePer100;
  }, 0);
  return {
    amount: Math.round(amount),
    units: (input.targetMmr - input.currentMmr) / 100,
    label: `${input.currentMmr.toLocaleString()} → ${input.targetMmr.toLocaleString()} MMR`,
    summary: `${input.currentMmr.toLocaleString()} to ${input.targetMmr.toLocaleString()} MMR · ${input.mmrAmount.toLocaleString()} MMR scope · ${input.currentRank} to ${input.targetRank} · ${input.boostMode}`
  };
}

function scope(input: PricingInput, catalog: PricingCatalog) {
  switch (input.service) {
    case "mmr-boost":
      return mmrScope(input, catalog);
    case "mmr-calibration":
      return {
        amount: input.matchCount * catalog.unitPrices.calibrationMatch,
        units: input.matchCount,
        label: `${input.matchCount} assisted calibration game${input.matchCount === 1 ? "" : "s"}`,
        summary: `${input.calibrationType} · ${input.rankConfidence}% confidence · ${input.matchCount} game${input.matchCount === 1 ? "" : "s"} · ${input.boostMode}`
      };
    case "low-priority-recovery":
      return {
        amount: input.lowPriorityWins * catalog.unitPrices.lowPriorityWin,
        units: input.lowPriorityWins,
        label: `${input.lowPriorityWins} required Single Draft win${input.lowPriorityWins === 1 ? "" : "s"}`,
        summary: `${input.lowPriorityWins} required win${input.lowPriorityWins === 1 ? "" : "s"} · ${input.boostMode === "Duo" ? "eligible party assist" : "guided self-play"}`
      };
    case "behavior-score-boost": {
      const units = input.behaviorScoreAmount / 500;
      return {
        amount: units * catalog.unitPrices.behaviorScore500,
        units,
        label: `${input.behaviorScoreAmount.toLocaleString()} behavior score`,
        summary: `${input.behaviorScoreAmount.toLocaleString()} score recovery scope`
      };
    }
    case "win-boost":
      return {
        amount: input.winCount * catalog.unitPrices.assistedWin,
        units: input.winCount,
        label: `${input.winCount} assisted win${input.winCount === 1 ? "" : "s"}`,
        summary: `${input.winCount} wins · ${input.currentMmr.toLocaleString()} MMR · Duo`
      };
    case "coaching":
      return {
        amount: input.sessionCount * catalog.unitPrices.coachingSession,
        units: input.sessionCount,
        label: `${input.sessionCount} coaching session${input.sessionCount === 1 ? "" : "s"}`,
        summary: `${input.sessionCount} private session${input.sessionCount === 1 ? "" : "s"}`
      };
  }
}

function matchesRule(input: PricingInput, rule: PricingRule) {
  return Object.entries(rule.conditions).every(([key, value]) => {
    if (key.startsWith("_")) return true;
    return (input as unknown as Record<string, unknown>)[key] === value;
  });
}

function applyRule(amount: number, rule: PricingRule) {
  if (rule.adjustmentType === "fixed") return Math.round(amount + rule.adjustmentValue);
  if (rule.adjustmentType === "multiplier") return Math.round(amount * rule.adjustmentValue);
  const rate = Math.abs(rule.adjustmentValue) <= 1 ? rule.adjustmentValue : rule.adjustmentValue / 100;
  return Math.round(amount * (1 + rate));
}

function volumeDiscountRate(catalog: PricingCatalog, service: PricingInput["service"], units: number) {
  const bands = [...(catalog.volumeDiscounts[service] ?? [])].sort((left, right) => right.minimumUnits - left.minimumUnits);
  return bands.find((band) => units >= band.minimumUnits)?.rate ?? 0;
}

export function describePricingInput(input: PricingInput) {
  return `${serviceLabels[input.service]} · ${scope(input, defaultPricingCatalog).summary}`;
}

export function calculateQuote(input: PricingInput, catalog: PricingCatalog = defaultPricingCatalog, rules: PricingRule[] = defaultPricingRules): PriceQuote {
  const configuredScope = scope(input, catalog);
  const lines: QuoteLine[] = [{ label: configuredScope.label, amount: configuredScope.amount }];
  let subtotal = configuredScope.amount;

  for (const rule of [...rules].sort((left, right) => left.priority - right.priority)) {
    if (!matchesRule(input, rule)) continue;
    const adjusted = applyRule(subtotal, rule);
    if (adjusted !== subtotal) lines.push({ label: ruleLabels[rule.key] ?? String(rule.conditions._label ?? rule.key), amount: adjusted - subtotal });
    subtotal = adjusted;
  }

  const discount = Math.round(subtotal * volumeDiscountRate(catalog, input.service, configuredScope.units));
  const total = Math.max(catalog.minimumTotal, subtotal - discount);

  return {
    currency: catalog.currency,
    pricingVersion: catalog.version,
    subtotal,
    discount,
    total,
    lines,
    summary: `${serviceLabels[input.service]} · ${configuredScope.summary}`,
    note: "The customer remains in control of their own account. Taxes are calculated at checkout. Match, MMR, rank, confidence, score, and Low Priority outcomes are not guaranteed."
  };
}
