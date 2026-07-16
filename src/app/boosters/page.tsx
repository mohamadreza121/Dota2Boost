import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { BoosterDirectory } from "@/components/marketplace/coach-directory";
import { boosters } from "@/lib/data/content";

export const metadata: Metadata = { title: "Verified Dota 2 Boosters", description: "Find a verified Dota 2 self-play booster by role, region, language, rank, service type, and availability.", alternates: { canonical: "/boosters" } };

export default function BoostersPage() {
  return <><PageHero eyebrow="Verified booster marketplace" title="A stronger player for your next queue." description="Search verified high-MMR boosters by role, region, language, specialty, and live availability." aside={<div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-panel/60 p-5"><BadgeCheck className="mt-0.5 size-5 shrink-0 text-cyan" /><div><p className="text-sm font-bold">Verification before visibility</p><p className="mt-2 text-xs leading-5 text-mist">Profiles are reviewed for identity, rank history, conduct, communication, and delivery readiness before appearing here.</p></div></div>} /><section className="section-pad container-shell"><BoosterDirectory boosters={boosters} /></section></>;
}
