import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Eye, LockKeyhole, Route } from "lucide-react";
import { RankRoutePreview } from "@/components/home/rank-route-preview";

const trustPoints = [
  { icon: LockKeyhole, title: "No credentials", detail: "Your account stays in your hands." },
  { icon: Route, title: "Exact scope", detail: "Rank, region, role, and mode are defined first." },
  { icon: Eye, title: "Private progress", detail: "Messages and milestones stay with the order." }
] as const;

export function WarTableHero() {
  return (
    <section className="war-hero" aria-labelledby="war-hero-title">
      <div className="war-hero__image" aria-hidden="true">
        <Image
          src="/media/dire-forge/dire-forge-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="war-hero__terrain" aria-hidden="true" />
      <div className="war-hero__route" aria-hidden="true">
        <svg viewBox="0 0 1600 940" preserveAspectRatio="none">
          <path d="M-60 820 C210 680 320 752 500 560 C690 358 856 470 1010 264 C1160 62 1380 124 1650 -30" />
        </svg>
      </div>

      <div className="container-shell war-hero__inner">
        <div className="war-hero__copy" data-war-reveal>
          <p className="war-kicker"><span>Campaign 01</span><i /> The Dire War Table</p>
          <h1 id="war-hero-title">Command<br />the climb.</h1>
          <p className="war-hero__lead">Set the route before the first queue.</p>
          <p className="war-hero__body">
            Choose your current medal, target, server, role, and delivery mode. Highground turns the objective into a visible, customer-operated campaign with clear scope from checkout to completion.
          </p>
          <div className="war-hero__actions">
            <Link href="/pricing" className="war-action-button">
              <span>Forge rank route</span><ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/services" className="war-text-link">
              Compare contracts <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="war-hero__console" data-war-reveal>
          <RankRoutePreview />
        </div>

        <div className="war-hero__trust" aria-label="Platform protections" data-war-reveal>
          {trustPoints.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}>
                <Icon aria-hidden="true" />
                <p><strong>{item.title}</strong><span>{item.detail}</span></p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
