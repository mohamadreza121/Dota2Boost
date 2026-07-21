import type { Metadata } from "next";
import { CinematicHome } from "@/components/home/cinematic-home";
import "./dire-forge.css";

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
        alt: "The Dire Forge rank campaign with Doom from Dota 2"
      }
    ]
  }
};

export default function HomePage() {
  return <CinematicHome />;
}
