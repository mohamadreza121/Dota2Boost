import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { CoachDirectory } from "@/components/marketplace/coach-directory";
import { coaches } from "@/lib/data/content";

export const metadata: Metadata = { title: "Verified Dota 2 Coaches", description: "Find a verified Dota 2 coach by role, region, language, rank, style, and availability.", alternates: { canonical: "/coaches" } };

export default function CoachesPage() {
  return <><PageHero eyebrow="Coach marketplace" title="The right expert. The right way of explaining it." description="Search verified coaches by role, region, language, specialty, and availability." aside={<div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-panel/60 p-5"><BadgeCheck className="mt-0.5 size-5 shrink-0 text-cyan" /><div><p className="text-sm font-bold">Verification before visibility</p><p className="mt-2 text-xs leading-5 text-mist">Profiles are reviewed for rank evidence, communication quality, and coaching readiness before appearing here.</p></div></div>} /><section className="section-pad container-shell"><CoachDirectory coaches={coaches} /></section></>;
}
