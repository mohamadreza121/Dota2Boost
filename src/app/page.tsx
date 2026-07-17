import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CampaignContracts } from "@/components/home/campaign-contracts";
import { RankLadder } from "@/components/home/rank-ladder";
import { BattlefieldCampaign } from "@/components/home/battle-map-services";
import { BoosterDraft } from "@/components/home/dota-hero-roster";
import { VictoryLedger } from "@/components/home/review-preview";
import { HomeFinalCta } from "@/components/home/home-final-cta";
import { HomeMotion } from "@/components/home/home-motion";
import "./home-v2-core.css";
import "./home-v2-draft.css";
import "./home-v2-ranks-map.css";
import "./home-v2-roster.css";
import "./home-v2-final.css";
import "./home-v3-map-finale.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <main className="war-room-home dota-journey">
      <HomeMotion />
      <div className="dota-page-progress" aria-hidden="true"><span /></div>
      <Hero />
      <CampaignContracts />
      <RankLadder />
      <BattlefieldCampaign />
      <BoosterDraft />
      <VictoryLedger />
      <HomeFinalCta />
    </main>
  );
}
