import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, GraduationCap, Route, ShieldCheck, Target, Trophy } from "lucide-react";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";

const iconBySlug = {
  "mmr-boost": Route,
  "mmr-calibration": Target,
  "win-boost": Trophy,
  "behavior-score-boost": ShieldCheck,
  coaching: GraduationCap
} as const;

export function ContractLanes() {
  const primary = services.find((service) => service.slug === "mmr-boost");
  const secondary = services.filter((service) => service.slug !== "mmr-boost");

  if (!primary) return null;

  return (
    <section className="war-section war-contracts" aria-labelledby="war-contracts-title">
      <div className="war-contracts__path" aria-hidden="true" />
      <div className="container-shell">
        <header className="war-heading" data-war-reveal>
          <p className="war-kicker"><span>03</span><i /> Choose the contract</p>
          <h2 id="war-contracts-title">Five objectives. One command system.</h2>
          <p>MMR Boost is the primary route. Calibration, assisted wins, conduct recovery, and coaching branch from the same transparent delivery model.</p>
        </header>

        <div className="war-contracts__layout">
          <article className="war-contract-primary" data-war-reveal>
            <div className="war-contract-primary__top">
              <span><Route aria-hidden="true" /> Primary route</span>
              <small>{primary.duration}</small>
            </div>
            <div className="war-contract-primary__body">
              <p>{primary.eyebrow}</p>
              <h3>{primary.name}</h3>
              <span>{primary.shortDescription}</span>
              <ul>
                {primary.idealFor.slice(0, 3).map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div className="war-contract-primary__route" aria-hidden="true"><i /><i /><i /><i /><span /></div>
            <footer>
              <p><small>Starting at</small><strong>{formatCurrency(primary.priceFrom)}</strong><span>CAD</span></p>
              <Link href={`/services/${primary.slug}`} className="war-action-button"><span>Open MMR route</span><ArrowRight /></Link>
            </footer>
          </article>

          <div className="war-contract-index" aria-label="Secondary contracts">
            {secondary.map((service, index) => {
              const Icon = iconBySlug[service.slug];
              return (
                <Link key={service.slug} href={`/services/${service.slug}`} className="war-contract-row" data-war-reveal>
                  <span className="war-contract-row__number">0{index + 2}</span>
                  <span className="war-contract-row__icon"><Icon aria-hidden="true" /></span>
                  <span className="war-contract-row__copy">
                    <small>{service.eyebrow}</small>
                    <strong>{service.name}</strong>
                    <em>{service.idealFor[0]} · {service.duration}</em>
                  </span>
                  <span className="war-contract-row__price"><small>From</small><strong>{formatCurrency(service.priceFrom)}</strong></span>
                  <ArrowUpRight className="war-contract-row__arrow" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
