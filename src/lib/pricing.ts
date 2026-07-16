import type { PricingInput } from "@/lib/validation/pricing";

const basePerWin: Record<PricingInput["service"], number> = {
  "rank-boost": 1600,
  "win-boost": 1400,
  "calibration-support": 2300,
  "duo-lane-boost": 1850,
  "mmr-sprint": 1750,
  "stack-boost": 1900,
  "priority-membership": 1500
};

const rankFactor: Record<PricingInput["currentRank"], number> = {
  Herald: 0.85,
  Guardian: 0.9,
  Crusader: 1,
  Archon: 1.1,
  Legend: 1.25,
  Ancient: 1.5,
  Divine: 1.9,
  Immortal: 2.6
};

const queueFactor: Record<PricingInput["queueMode"], number> = {
  "Party Queue": 1,
  "Duo Lane": 1.12,
  "Full Stack": 1.2
};

const tierFactor: Record<PricingInput["boosterTier"], number> = {
  Pro: 1,
  Master: 1.15,
  Elite: 1.35
};

const priorityFactor: Record<PricingInput["priority"], number> = {
  Flexible: 0.94,
  Standard: 1,
  Priority: 1.18
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

function volumeDiscountRate(winCount: number) {
  if (winCount >= 20) return 0.1;
  if (winCount >= 15) return 0.07;
  if (winCount >= 10) return 0.05;
  return 0;
}

export function calculateQuote(input: PricingInput): PriceQuote {
  const baseAmount = basePerWin[input.service] * input.winCount;
  const rankedAmount = Math.round(baseAmount * rankFactor[input.currentRank]);
  const queuedAmount = Math.round(rankedAmount * queueFactor[input.queueMode]);
  const partyFactor = input.service === "stack-boost" || input.queueMode === "Full Stack"
    ? 1 + Math.max(0, input.partySize - 1) * 0.18
    : 1;
  const partyAmount = Math.round(queuedAmount * partyFactor);
  const tierAmount = Math.round(partyAmount * tierFactor[input.boosterTier]);
  const subtotal = Math.round(tierAmount * priorityFactor[input.priority]);
  const discount = Math.round(subtotal * volumeDiscountRate(input.winCount));
  const total = Math.max(2500, subtotal - discount);

  const lines: QuoteLine[] = [
    { label: `${input.winCount} assisted win${input.winCount === 1 ? "" : "s"}`, amount: baseAmount }
  ];
  if (rankedAmount !== baseAmount) lines.push({ label: `${input.currentRank} bracket`, amount: rankedAmount - baseAmount });
  if (queuedAmount !== rankedAmount) lines.push({ label: input.queueMode, amount: queuedAmount - rankedAmount });
  if (partyAmount !== queuedAmount) lines.push({ label: `${input.partySize}-player stack coverage`, amount: partyAmount - queuedAmount });
  if (tierAmount !== partyAmount) lines.push({ label: `${input.boosterTier} booster tier`, amount: tierAmount - partyAmount });
  if (subtotal !== tierAmount) lines.push({ label: `${input.priority} delivery`, amount: subtotal - tierAmount });

  return {
    currency: "cad",
    subtotal,
    discount,
    total,
    lines,
    note: "The customer plays every match on their own account. Taxes are calculated at checkout. Rank and MMR results are not guaranteed."
  };
}
