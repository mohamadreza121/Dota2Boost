import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PricingConfigurator } from "@/components/forms/pricing-configurator";

export const metadata: Metadata = { title: "Dota 2 Boosting Prices", description: "Configure a customer-controlled Dota 2 rank boost or assisted win package and receive a server-verified estimate.", alternates: { canonical: "/pricing" } };
export default function PricingPage() { return <><PageHero eyebrow="Server-verified pricing" title="Build the boost. See every adjustment." description="Choose your bracket, target, wins, queue format, booster tier, and priority. Discounts are usage-limited and taxes are calculated securely at checkout." /><section className="section-pad container-shell"><PricingConfigurator /></section></>; }
