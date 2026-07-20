import type { Metadata } from "next";
import { CinematicHome } from "@/components/home/cinematic-home";
import "./cinematic-home.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Highground — Dota 2 Coaching & MMR Boosting",
  description:
    "Climb with a precise rank route: private Dota 2 MMR boosting, calibration, assisted wins, and coaching built around your role and server."
};

export default function HomePage() {
  return <CinematicHome />;
}
