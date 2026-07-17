import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CampaignContracts } from "@/components/home/campaign-contracts";
import { RankLadder } from "@/components/home/rank-ladder";
import { BattlefieldCampaign } from "@/components/home/battle-map-services";
import { BoosterDraft } from "@/components/home/dota-hero-roster";
import { VictoryLedger } from "@/components/home/review-preview";
import { HomeFinalCta } from "@/components/home/home-final-cta";
import { HomeMotion } from "@/components/home/home-motion";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <main className="war-room-home">
      <HomeMotion />
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
