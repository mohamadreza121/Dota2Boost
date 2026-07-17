import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crosshair, Eye, Radio, Route, ScanLine, Swords } from "lucide-react";

const objectives = [
  { className: "war-map-node--top", label: "Safe lane", title: "Solo Assist", detail: "You play · expert direction", href: "/pricing", icon: Radio, hotkey: "Q" },
  { className: "war-map-node--mid", label: "Main objective", title: "MMR Ascent", detail: "Exact medal route", href: "/services/mmr-boost", icon: Route, hotkey: "W" },
  { className: "war-map-node--bottom", label: "Offlane path", title: "Duo Queue", detail: "Separate accounts · shared party", href: "/pricing", icon: Swords, hotkey: "E" },
  { className: "war-map-node--outpost", label: "Outpost", title: "Calibration", detail: "Five or ten match block", href: "/services/mmr-calibration", icon: Crosshair, hotkey: "R" }
] as const;

export function BattlefieldCampaign() {
  return (
    <section className="war-battlefield war-section dota-battlefield" data-battlefield>
      <div className="dota-terrain-transition dota-terrain-transition--dire" aria-hidden="true" />
      <div className="dota-battlefield__smoke" aria-hidden="true" />

      <div className="container-shell">
        <div className="war-section-heading war-section-heading--split dota-heading" data-reveal>
          <div>
            <div className="war-chapter"><span>04</span><i /> Tactical map</div>
            <h2>Plan the route.<br /><em>Control the climb.</em></h2>
          </div>
          <div>
            <p>The campaign map turns every service into a real objective. Reveal the lanes, inspect each route, and choose how involved you want to be in every match.</p>
            <span className="war-map-key"><i className="is-radiant" /> Your position <i className="is-dire" /> Target territory</span>
          </div>
        </div>

        <div className="war-map-frame dota-map-frame" data-reveal data-map-frame>
          <Image src="/media/dota/campaign-map.webp" alt="Original fantasy three-lane campaign battlefield" fill sizes="(max-width: 1180px) 100vw, 1180px" className="war-map-frame__art dota-map-frame__art" />
          <div className="war-map-frame__shade dota-map-frame__shade" aria-hidden="true" />
          <div className="dota-map-frame__fog" aria-hidden="true" />
          <div className="dota-map-frame__scan" aria-hidden="true"><ScanLine /></div>
          <div className="dota-map-frame__roshan" aria-hidden="true"><span /></div>

          <svg className="dota-map-route" viewBox="0 0 1200 680" preserveAspectRatio="none" aria-hidden="true">
            <path d="M105 585 C275 520 240 392 430 365 S700 305 785 205 S1020 110 1110 78" />
            <circle cx="105" cy="585" r="7" />
            <circle cx="1110" cy="78" r="7" />
          </svg>

          <span className="war-map-base war-map-base--radiant">Radiant fountain</span>
          <span className="war-map-base war-map-base--dire">Dire high ground</span>

          <div className="war-map-objectives">
            {objectives.map((objective) => {
              const Icon = objective.icon;
              return (
                <Link key={objective.title} href={objective.href} className={`war-map-node dota-map-node ${objective.className}`} data-tilt>
                  <span className="dota-map-node__hotkey">{objective.hotkey}</span>
                  <span className="war-map-node__beacon"><Icon /></span>
                  <span><small>{objective.label}</small><strong>{objective.title}</strong><em>{objective.detail}</em></span>
                  <ArrowUpRight />
                </Link>
              );
            })}
          </div>

          <div className="dota-map-frame__legend">
            <span><Eye /> Fog clears around active objectives</span>
            <span><i /> Live route</span>
            <span><b /> Target Ancient</span>
          </div>

          <div className="war-map-frame__caption dota-map-frame__caption">
            <span>Campaign map // live planning view</span>
            <p>Final eligibility depends on region, rank, party rules, and current matchmaking conditions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
