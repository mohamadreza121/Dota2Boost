import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crosshair, Radio, Route, Swords } from "lucide-react";

const objectives = [
  { className: "war-map-node--top", label: "Top lane", title: "Solo Assist", detail: "You play · expert direction", href: "/pricing", icon: Radio },
  { className: "war-map-node--mid", label: "Main objective", title: "MMR Ascent", detail: "Exact medal route", href: "/services/mmr-boost", icon: Route },
  { className: "war-map-node--bottom", label: "Bottom lane", title: "Duo Queue", detail: "Separate accounts · shared party", href: "/pricing", icon: Swords },
  { className: "war-map-node--outpost", label: "Outpost", title: "Calibration", detail: "Five or ten match block", href: "/services/mmr-calibration", icon: Crosshair }
] as const;

export function BattlefieldCampaign() {
  return (
    <section className="war-battlefield war-section">
      <div className="container-shell">
        <div className="war-section-heading war-section-heading--split" data-reveal>
          <div>
            <div className="war-chapter"><span>04</span><i /> The battlefield</div>
            <h2>Plan the route.<br /><em>Control the climb.</em></h2>
          </div>
          <div>
            <p>One battlefield, three distinct ways to move through it. Choose the queue mode that fits your account, schedule, and preferred level of involvement.</p>
            <span className="war-map-key"><i className="is-radiant" /> Your position <i className="is-dire" /> Target territory</span>
          </div>
        </div>

        <div className="war-map-frame" data-reveal>
          <Image src="/media/dota/campaign-map.webp" alt="Original fantasy three-lane campaign battlefield" fill sizes="(max-width: 1180px) 100vw, 1180px" className="war-map-frame__art" />
          <div className="war-map-frame__shade" aria-hidden="true" />
          <span className="war-map-base war-map-base--radiant">Radiant approach</span>
          <span className="war-map-base war-map-base--dire">Dire high ground</span>

          <div className="war-map-objectives">
            {objectives.map((objective) => {
              const Icon = objective.icon;
              return (
                <Link key={objective.title} href={objective.href} className={`war-map-node ${objective.className}`}>
                  <span className="war-map-node__beacon"><Icon /></span>
                  <span><small>{objective.label}</small><strong>{objective.title}</strong><em>{objective.detail}</em></span>
                  <ArrowUpRight />
                </Link>
              );
            })}
          </div>

          <div className="war-map-frame__caption">
            <span>Campaign map // live planning view</span>
            <p>Final eligibility depends on region, rank, party rules, and current matchmaking conditions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
