import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PricingConfigurator } from "@/components/forms/pricing-configurator";

export const metadata: Metadata = { title: "Dota 2 MMR Boosting Prices", description: "Configure exact-MMR boosting, Rank Confidence calibration, account-safe Low Priority recovery, behavior score, assisted wins, or coaching.", alternates: { canonical: "/pricing" } };
export default function PricingPage() { return <><PageHero eyebrow="Dota 2 · Live contracts" title="Set the exact objective." description="Enter exact MMR, Rank Confidence, or required Low Priority wins. Medals are derived automatically and every quote is calculated from the active server pricing version." /><section className="section-pad container-shell"><PricingConfigurator /></section></>; }
