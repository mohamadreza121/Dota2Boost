import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PricingConfigurator } from "@/components/forms/pricing-configurator";

export const metadata: Metadata = { title: "Dota 2 MMR Boosting Prices", description: "Configure MMR boosting, MMR calibration, behavior score, assisted wins, or coaching and receive a server-verified price.", alternates: { canonical: "/pricing" } };
export default function PricingPage() { return <><PageHero eyebrow="Phase 3 · Commerce" title="Configure MMR. Price it on the server." description="Choose MMR Boost, Calibration, Behavior Score, or Win Boost; then set Solo or Duo mode, medals, scope, region, tier, and priority before Stripe Checkout." /><section className="section-pad container-shell"><PricingConfigurator /></section></>; }
