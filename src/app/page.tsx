import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { DotaHeroRoster } from "@/components/home/dota-hero-roster";
import { TrustStrip } from "@/components/home/trust-strip";
import { RankLadder } from "@/components/home/rank-ladder";
import { BattleMapServices } from "@/components/home/battle-map-services";
import { HomeMotion } from "@/components/home/home-motion";
import { BoostSystem } from "@/components/home/boost-system";
import { HowItWorks } from "@/components/home/how-it-works";
import { CoachPreview } from "@/components/home/coach-preview";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { ReviewPreview } from "@/components/home/review-preview";
import { WorkCta } from "@/components/home/work-cta";
import { FaqPreview } from "@/components/home/faq-preview";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return <main className="legacy-home"><HomeMotion /><Hero /><BattleMapServices /><RankLadder /><TrustStrip /><DotaHeroRoster /><BoostSystem /><HowItWorks /><CoachPreview /><DashboardPreview /><ReviewPreview /><WorkCta /><FaqPreview /></main>;
}
