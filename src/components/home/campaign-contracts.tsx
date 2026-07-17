import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Crosshair, GraduationCap, LockKeyhole, Shield, Sparkles, Swords, TrendingUp } from "lucide-react";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";

const icons = [TrendingUp, Crosshair, Shield, Swords, GraduationCap] as const;
const roles = ["Core campaign", "Fresh season", "Conduct recovery", "Fixed objective", "Skill upgrade"] as const;

export function CampaignContracts() {
  return (
    <section id="contracts" className="war-contracts war-section dota-draft" data-draft>
      <div className="dota-terrain-transition dota-terrain-transition--river" aria-hidden="true" />
      <div className="dota-draft__runes" aria-hidden="true"><span /><span /><span /></div>

      <div className="container-shell">
        <div className="war-section-heading dota-heading" data-reveal>
          <div className="war-chapter"><span>02</span><i /> Draft phase</div>
          <div className="war-section-heading__row">
            <h2>Choose your role.<br /><em>Lock the campaign.</em></h2>
            <div>
              <p>Each contract is a different way to attack the climb. Hover the draft cards, compare the objective, then lock the service that matches your bracket.</p>
              <span className="dota-draft__hint"><Sparkles /> Hover a card to reveal its loadout</span>
            </div>
          </div>
        </div>

        <div className="dota-draft-grid" data-reveal>
          {services.map((service, index) => {
            const Icon = icons[index]!;
            const style = { "--draft-delay": `${index * 90}ms` } as CSSProperties;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={`dota-draft-card dota-draft-card--${service.accent} ${index === 0 ? "is-selected" : ""}`}
                style={style}
                data-tilt
              >
                <div className="dota-draft-card__atmosphere" aria-hidden="true" />
                <div className="dota-draft-card__frame" aria-hidden="true"><i /><i /><i /><i /></div>
                <div className="dota-draft-card__top">
                  <span className="dota-draft-card__slot">0{index + 1}</span>
                  <span className="dota-draft-card__status">{index === 0 ? "Most selected" : roles[index]}</span>
                </div>
                <div className="dota-draft-card__icon"><Icon /></div>
                <div className="dota-draft-card__copy">
                  <p>{service.eyebrow}</p>
                  <h3>{service.name}</h3>
                  <span>{service.shortDescription}</span>
                </div>
                <div className="dota-draft-card__loadout">
                  <span><small>Objective</small><strong>{service.duration}</strong></span>
                  <span><small>Opening bid</small><strong>{formatCurrency(service.priceFrom)}</strong></span>
                </div>
                <div className="dota-draft-card__action">
                  <span><LockKeyhole /> Lock selection</span><ArrowUpRight />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="dota-draft__footer" data-reveal>
          <span><i /> Radiant strategy desk online</span>
          <p>Not sure which mode fits? Start with the live configurator and we will validate region, rank, party rules, and availability before checkout.</p>
          <Link href="/pricing">Open configurator <ArrowUpRight /></Link>
        </div>
      </div>
    </section>
  );
}
