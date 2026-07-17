import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crosshair, GraduationCap, Radio, Route, Swords } from "lucide-react";

const objectives = [
  {
    className: "dota-objective--solo",
    label: "Safe lane",
    title: "Solo Assist",
    detail: "You play · expert direction",
    href: "/pricing",
    icon: Radio,
    hotkey: "Q"
  },
  {
    className: "dota-objective--main",
    label: "Main objective",
    title: "MMR Ascent",
    detail: "Exact medal route",
    href: "/services/mmr-boost",
    icon: Route,
    hotkey: "W"
  },
  {
    className: "dota-objective--duo",
    label: "Offlane path",
    title: "Duo Queue",
    detail: "Separate accounts · shared party",
    href: "/pricing",
    icon: Swords,
    hotkey: "E"
  },
  {
    className: "dota-objective--calibration",
    label: "Outpost",
    title: "Calibration",
    detail: "Five or ten match block",
    href: "/services/mmr-calibration",
    icon: Crosshair,
    hotkey: "R"
  },
  {
    className: "dota-objective--coaching",
    label: "Training camp",
    title: "Coaching",
    detail: "Replay review · live session",
    href: "/services/coaching",
    icon: GraduationCap,
    hotkey: "T"
  }
] as const;

export function BattlefieldCampaign() {
  return (
    <section className="war-battlefield war-section dota-battlefield dota-strategy-board" data-battlefield>
      <div className="dota-terrain-transition dota-terrain-transition--dire" aria-hidden="true" />
      <div className="dota-battlefield__smoke" aria-hidden="true" />

      <div className="container-shell">
        <div className="war-section-heading war-section-heading--split dota-heading" data-reveal>
          <div>
            <div className="war-chapter"><span>04</span><i /> Operations board</div>
            <h2>Choose the route.<br /><em>Push the objective.</em></h2>
          </div>
          <div>
            <p>
              A strategic operations board built around your climb. Start from Radiant territory,
              inspect each service path, and choose the contract that matches how you want to play.
            </p>
            <span className="war-map-key">
              <i className="is-radiant" /> Starting territory
              <i className="is-dire" /> Target high ground
            </span>
          </div>
        </div>

        <div className="war-map-frame dota-map-frame dota-strategy-map" data-reveal data-map-frame>
          <Image
            src="/media/dota/campaign-map.webp"
            alt="Dota-inspired strategic operations board"
            fill
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="war-map-frame__art dota-map-frame__art"
          />

          <div className="war-map-frame__shade dota-map-frame__shade" aria-hidden="true" />
          <div className="dota-strategy-map__grid" aria-hidden="true" />

          <svg className="dota-strategy-map__routes" viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden="true">
            <path
              className="dota-strategy-map__primary-route"
              d="M105 620 C205 585 260 505 345 438 S520 335 618 324 S790 250 864 170 S1034 92 1110 74"
            />
            <path className="dota-strategy-map__lane" d="M185 182 C285 145 382 170 462 230" />
            <path className="dota-strategy-map__lane" d="M330 440 C470 375 560 330 684 278" />
            <path className="dota-strategy-map__lane" d="M620 560 C770 580 875 548 997 492" />
            <circle className="is-radiant" cx="105" cy="620" r="8" />
            <circle className="is-dire" cx="1110" cy="74" r="8" />
          </svg>

          <span className="war-map-base war-map-base--radiant">Radiant staging ground</span>
          <span className="war-map-base war-map-base--dire">Dire high ground</span>

          <div className="war-map-objectives dota-strategy-map__objectives">
            {objectives.map((objective) => {
              const Icon = objective.icon;

              return (
                <Link
                  key={objective.title}
                  href={objective.href}
                  className={`war-map-node dota-map-node dota-strategy-node ${objective.className}`}
                  data-tilt
                  aria-label={`${objective.title}: ${objective.detail}`}
                >
                  <span className="dota-map-node__hotkey">{objective.hotkey}</span>
                  <span className="war-map-node__beacon"><Icon /></span>
                  <span className="dota-strategy-node__copy">
                    <small>{objective.label}</small>
                    <strong>{objective.title}</strong>
                    <em>{objective.detail}</em>
                  </span>
                  <span className="dota-strategy-node__action"><ArrowUpRight /></span>
                </Link>
              );
            })}
          </div>

          <div className="war-map-frame__caption dota-map-frame__caption dota-strategy-map__caption">
            <span>Operations board // service route selection</span>
            <p>
              Final eligibility still depends on rank, region, party rules, scheduling,
              and current matchmaking conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
