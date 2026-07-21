import { ForgeHero } from "@/components/home/forge-hero";
import {
  CampaignFlow,
  ForgeAtmosphere,
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
import { HomeMotion } from "@/components/home/home-motion";

export function CinematicHome() {
  return (
    <div className="dire-forge">
      <ForgeHero />

      <div className="forge-world">
        <ForgeAtmosphere />
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
