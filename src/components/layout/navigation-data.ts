import type { AppRole } from "@/types/domain";

export const primaryNavigation = [
  { chapter: "01", label: "MMR Boost", href: "/services/mmr-boost" },
  { chapter: "02", label: "Services", href: "/services", disclosure: true },
  { chapter: "03", label: "Roster", href: "/boosters" },
  { chapter: "04", label: "How it works", href: "/how-it-works", collapsible: true },
  { chapter: "05", label: "Reviews", href: "/reviews", collapsible: true }
] as const;

export const serviceGroups = [
  {
    eyebrow: "Rank route",
    services: [
      {
        label: "MMR Boost",
        detail: "Configure an exact medal and MMR campaign.",
        unit: "MMR route",
        href: "/services/mmr-boost",
        featured: true
      }
    ]
  },
  {
    eyebrow: "Match contracts",
    services: [
      {
        label: "Calibration",
        detail: "Structured placement matches for new or returning players.",
        unit: "5 or 10 matches",
        href: "/services/mmr-calibration"
      },
      {
        label: "Assisted wins",
        detail: "Customer-controlled fixed-win packages.",
        unit: "3–20 wins",
        href: "/services/win-boost"
      }
    ]
  },
  {
    eyebrow: "Account and development",
    services: [
      {
        label: "Behavior score",
        detail: "A defined conduct-recovery scope with tracked milestones.",
        unit: "500–6,000 score",
        href: "/services/behavior-score-boost"
      },
      {
        label: "Coaching",
        detail: "Replay review and role-specific development sessions.",
        unit: "1–8 sessions",
        href: "/services/coaching"
      }
    ]
  }
] as const;

export type NavigationAccount =
  | { status: "loading" }
  | { status: "guest" }
  | {
      status: "authenticated";
      displayName: string;
      email: string;
      role: AppRole;
      workspaceHref: string;
      workspaceLabel: string;
    };

export function getWorkspaceMeta(role: AppRole) {
  switch (role) {
    case "coach":
      return { href: "/coach", label: "Coach workspace" };
    case "admin":
    case "owner":
    case "support":
      return { href: "/admin", label: "Operations workspace" };
    default:
      return { href: "/dashboard", label: "My workspace" };
  }
}
