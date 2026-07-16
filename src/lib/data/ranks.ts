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

export type RankName = (typeof rankOptions)[number];

export const rankMedals: Record<RankName, { tier: number; image: string; tone: string }> = {
  Herald: { tier: 1, image: "/media/ranks/rank-icon-1.png", tone: "#77a463" },
  Guardian: { tier: 2, image: "/media/ranks/rank-icon-2.png", tone: "#b18d5c" },
  Crusader: { tier: 3, image: "/media/ranks/rank-icon-3.png", tone: "#56b8bd" },
  Archon: { tier: 4, image: "/media/ranks/rank-icon-4.png", tone: "#8ed0ce" },
  Legend: { tier: 5, image: "/media/ranks/rank-icon-5.png", tone: "#d8ad60" },
  Ancient: { tier: 6, image: "/media/ranks/rank-icon-6.png", tone: "#a687da" },
  Divine: { tier: 7, image: "/media/ranks/rank-icon-7.png", tone: "#d7bd74" },
  Immortal: { tier: 8, image: "/media/ranks/rank-icon-8.png", tone: "#d64f52" }
};
