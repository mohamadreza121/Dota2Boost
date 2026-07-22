import { Barlow, Cinzel } from "next/font/google";
import { CampaignProtocol } from "@/components/home/campaign-protocol";
import { CampaignTrustStrip } from "@/components/home/campaign-trust-strip";
import { ContractLanes } from "@/components/home/contract-lanes";
import { DeliveryRecord } from "@/components/home/delivery-record";
import { FinalRouteCta } from "@/components/home/final-route-cta";
import { HomeReveal } from "@/components/home/home-reveal";
import { ObjectiveRoute } from "@/components/home/objective-route";
import { RosterIntel } from "@/components/home/roster-intel";
import { WarTableHero } from "@/components/home/war-table-hero";

const displayFont = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--war-display"
});

const interfaceFont = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--war-interface"
});

export function WarTableHome() {
  return (
    <div className={`war-table ${displayFont.variable} ${interfaceFont.variable}`}>
      <WarTableHero />
      <div className="war-table__campaign">
        <div className="war-table__spine" aria-hidden="true"><span /><i /><i /><i /><i /><i /><i /></div>
        <CampaignTrustStrip />
        <ObjectiveRoute />
        <ContractLanes />
        <CampaignProtocol />
        <RosterIntel />
        <DeliveryRecord />
        <FinalRouteCta />
      </div>
      <HomeReveal />
    </div>
  );
}
