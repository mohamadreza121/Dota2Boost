export const rankFamilies = [
  "Herald",
  "Guardian",
  "Crusader",
  "Archon",
  "Legend",
  "Ancient",
  "Divine",
  "Immortal"
] as const;

export type RankFamily = (typeof rankFamilies)[number];

const rankedFamilies = rankFamilies.slice(0, -1) as Exclude<RankFamily, "Immortal">[];
const divisions = ["I", "II", "III", "IV", "V"] as const;

export const rankOptions = [
  ...rankedFamilies.flatMap((family) => divisions.map((division) => `${family} ${division}` as const)),
  "Immortal"
] as const;

export type RankName = (typeof rankOptions)[number];

export const minimumMmr = 0;
export const maximumPricedMmr = 6500;

const rankMmrStarts: Record<RankName, number> = {
  "Herald I": 0,
  "Herald II": 154,
  "Herald III": 308,
  "Herald IV": 462,
  "Herald V": 616,
  "Guardian I": 770,
  "Guardian II": 924,
  "Guardian III": 1078,
  "Guardian IV": 1232,
  "Guardian V": 1386,
  "Crusader I": 1540,
  "Crusader II": 1694,
  "Crusader III": 1848,
  "Crusader IV": 2002,
  "Crusader V": 2156,
  "Archon I": 2310,
  "Archon II": 2464,
  "Archon III": 2618,
  "Archon IV": 2772,
  "Archon V": 2926,
  "Legend I": 3080,
  "Legend II": 3234,
  "Legend III": 3388,
  "Legend IV": 3542,
  "Legend V": 3696,
  "Ancient I": 3850,
  "Ancient II": 4004,
  "Ancient III": 4158,
  "Ancient IV": 4312,
  "Ancient V": 4466,
  "Divine I": 4620,
  "Divine II": 4780,
  "Divine III": 4940,
  "Divine IV": 5100,
  "Divine V": 5260,
  Immortal: 5420
};

export function rankFromMmr(mmr: number): RankName {
  const normalized = Math.max(minimumMmr, Math.min(maximumPricedMmr, Math.floor(mmr)));
  let resolved: RankName = rankOptions[0];
  for (const rank of rankOptions) {
    if (rankMmrStarts[rank] > normalized) break;
    resolved = rank;
  }
  return resolved;
}

export function mmrForRank(rank: RankName) {
  return rankMmrStarts[rank];
}

export const rankMedals: Record<RankFamily, { tier: number; image: string; tone: string }> = {
  Herald: { tier: 1, image: "/media/ranks/rank-icon-1.png", tone: "#77a463" },
  Guardian: { tier: 2, image: "/media/ranks/rank-icon-2.png", tone: "#b18d5c" },
  Crusader: { tier: 3, image: "/media/ranks/rank-icon-3.png", tone: "#56b8bd" },
  Archon: { tier: 4, image: "/media/ranks/rank-icon-4.png", tone: "#8ed0ce" },
  Legend: { tier: 5, image: "/media/ranks/rank-icon-5.png", tone: "#d8ad60" },
  Ancient: { tier: 6, image: "/media/ranks/rank-icon-6.png", tone: "#a687da" },
  Divine: { tier: 7, image: "/media/ranks/rank-icon-7.png", tone: "#d7bd74" },
  Immortal: { tier: 8, image: "/media/ranks/rank-icon-8.png", tone: "#d64f52" }
};

export function rankFamilyOf(rank: RankName | RankFamily) {
  return rank.split(" ")[0] as RankFamily;
}

export function rankIndex(rank: RankName) {
  return rankOptions.indexOf(rank);
}

export function rankRoute(current: RankName, target: RankName) {
  return Math.max(0, rankIndex(target) - rankIndex(current));
}

export function rankLabel(rank: RankName | RankFamily) {
  return rank;
}
