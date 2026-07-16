import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { ServiceGrid } from "@/components/home/service-grid";
import { HowItWorks } from "@/components/home/how-it-works";
import { CoachPreview } from "@/components/home/coach-preview";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { ReviewPreview } from "@/components/home/review-preview";
import { WorkCta } from "@/components/home/work-cta";
import { FaqPreview } from "@/components/home/faq-preview";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return <><Hero /><TrustStrip /><ServiceGrid /><HowItWorks /><CoachPreview /><DashboardPreview /><ReviewPreview /><WorkCta /><FaqPreview /></>;
}
