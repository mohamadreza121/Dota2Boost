import type { Metadata } from "next";
import { WarTableHome } from "@/components/home/war-table-home";
import "./war-table-home.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Highground — Dota 2 Coaching & MMR Boosting",
  description:
    "Forge a precise Dota 2 rank route with customer-operated MMR boosting, calibration, assisted wins, behavior score recovery, and coaching.",
  openGraph: {
    images: [
      {
        url: "/media/dire-forge/dire-forge-poster.webp",
        width: 1920,
        height: 1080,
        alt: "Highground tactical Dota 2 rank campaign"
      }
    ]
  }
};

export default function HomePage() {
  return <WarTableHome />;
}
