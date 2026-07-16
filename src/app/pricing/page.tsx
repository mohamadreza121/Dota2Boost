import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PricingConfigurator } from "@/components/forms/pricing-configurator";

export const metadata: Metadata = { title: "Dota 2 Coaching Pricing", description: "Build a personalized Dota 2 coaching plan and receive a live price estimate verified securely before checkout.", alternates: { canonical: "/pricing" } };
export default function PricingPage() { return <><PageHero eyebrow="Dynamic pricing" title="Pay for the plan—not a mystery package." description="Adjust the format, duration, coach tier, and review depth. The final amount is recalculated on the server before Stripe checkout." /><section className="section-pad container-shell"><PricingConfigurator /></section></>; }
