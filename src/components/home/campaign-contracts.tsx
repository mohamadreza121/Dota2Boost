import Link from "next/link";
import { ArrowUpRight, Crosshair, GraduationCap, Shield, Swords, TrendingUp } from "lucide-react";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";

const icons = [TrendingUp, Crosshair, Shield, Swords] as const;

export function CampaignContracts() {
  const primaryServices = services.slice(0, 4);
  const coaching = services[4]!;

  return (
    <section id="contracts" className="war-contracts war-section">
      <div className="container-shell">
        <div className="war-section-heading" data-reveal>
          <div className="war-chapter"><span>02</span><i /> Select objective</div>
          <div className="war-section-heading__row">
            <h2>Choose your<br /><em>campaign.</em></h2>
            <p>Four ranked services. One clear scope. MMR Boost leads the operation; every other contract supports a specific part of the climb.</p>
          </div>
        </div>

        <div className="war-contract-grid">
          {primaryServices.map((service, index) => {
            const Icon = icons[index]!;
            return (
              <Link key={service.slug} href={`/services/${service.slug}`} className={`war-service-contract ${index === 0 ? "war-service-contract--primary" : ""}`} data-reveal>
                <div className="war-service-contract__number">0{index + 1}</div>
                <div className="war-service-contract__icon"><Icon /></div>
                <div className="war-service-contract__copy">
                  <p>{service.eyebrow}</p>
                  <h3>{service.name}</h3>
                  <span>{service.shortDescription}</span>
                </div>
                <div className="war-service-contract__foot">
                  <span>From <strong>{formatCurrency(service.priceFrom)}</strong></span>
                  <span>View contract <ArrowUpRight /></span>
                </div>
              </Link>
            );
          })}
        </div>

        <Link href="/services/coaching" className="war-coaching-ribbon" data-reveal>
          <span className="war-coaching-ribbon__icon"><GraduationCap /></span>
          <span><small>Secondary service</small><strong>Train with an Immortal</strong></span>
          <p>{coaching.shortDescription}</p>
          <span className="war-coaching-ribbon__action">Explore coaching <ArrowUpRight /></span>
        </Link>
      </div>
    </section>
  );
}
