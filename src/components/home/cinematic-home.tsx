import { ForgeHero } from "@/components/home/forge-hero";
import {
  CampaignFlow,
  ForgeTrustRail,
  RankForge
} from "@/components/home/forge-core-sections";
import { ServiceArsenal } from "@/components/home/forge-service-arsenal";
import {
  ForgeFaq,
  RosterPreview,
  SiegeCta,
  VictoryProof,
  WhyHighground
} from "@/components/home/forge-proof-sections";
import { ForgeWorldAtmosphere } from "@/components/home/forge-world-atmosphere";
import { HomeMotion } from "@/components/home/home-motion";

export function CinematicHome() {
  return (
    <div className="dire-forge">
      <ForgeHero />

      <div className="forge-world">
        <ForgeWorldAtmosphere />
        <ForgeTrustRail />
        <RankForge />
        <ServiceArsenal />
        <CampaignFlow />
        <VictoryProof />
        <RosterPreview />
        <WhyHighground />
        <ForgeFaq />
        <SiegeCta />
      </div>

      <HomeMotion />
    </div>
  );
}
