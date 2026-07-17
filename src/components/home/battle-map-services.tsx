import Link from "next/link";
import { ArrowUpRight, Castle, Crosshair, Crown, Shield, Sparkles, Swords } from "lucide-react";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";

const iconByService = { "mmr-boost": Crown, "mmr-calibration": Crosshair, "behavior-score-boost": Shield, "win-boost": Swords, coaching: Sparkles } as const;
const positionByService: Record<string, string> = {
  "mmr-boost": "map-node-mmr",
  "mmr-calibration": "map-node-calibration",
  "behavior-score-boost": "map-node-behavior",
  "win-boost": "map-node-wins",
  coaching: "map-node-coaching"
};

export function BattleMapServices() {
  return (
    <section id="battle-map" className="battle-map-section relative overflow-hidden border-y border-amber/15 py-20 sm:py-28">
      <div aria-hidden="true" className="battle-map-backdrop absolute inset-0" />
      <div className="container-shell relative" data-reveal>
        <div className="mx-auto max-w-4xl text-center">
          <p className="legacy-kicker">Choose your lane</p>
          <h2 className="legacy-section-title mt-4 text-balance text-[clamp(3.4rem,7vw,7rem)] font-black uppercase">The boosting battlefield.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#c2bcae] sm:text-base">Every service occupies a place on the map. MMR Boost controls the center lane; calibration, wins, behavior score, and coaching support the climb around it.</p>
        </div>

        <div className="battle-map mt-14" aria-label="Dota 2 boosting service map">
          <div aria-hidden="true" className="map-terrain" />
          <div aria-hidden="true" className="map-river" />
          <div aria-hidden="true" className="map-lane map-lane-top" />
          <div aria-hidden="true" className="map-lane map-lane-mid" />
          <div aria-hidden="true" className="map-lane map-lane-bottom" />
          <div aria-hidden="true" className="map-base map-base-radiant"><Castle className="size-5" /><span>Radiant</span></div>
          <div aria-hidden="true" className="map-base map-base-dire"><Castle className="size-5" /><span>Dire</span></div>
          {["tower-1", "tower-2", "tower-3", "tower-4", "tower-5", "tower-6"].map((tower) => <span key={tower} aria-hidden="true" className={`map-tower ${tower}`} />)}
          <div className="map-service-grid">
            {services.map((service, index) => {
              const Icon = iconByService[service.slug as keyof typeof iconByService] ?? Swords;
              return <Link key={service.slug} href={`/services/${service.slug}`} className={`map-service-node group ${positionByService[service.slug] ?? ""} ${index === 0 ? "map-service-primary" : ""}`}>
                <span className="map-node-icon"><Icon className="size-4" /></span>
                <span className="map-node-copy"><span className="block text-[0.53rem] font-black tracking-[0.17em] text-amber uppercase">{index === 0 ? "Main objective" : service.eyebrow}</span><strong className="mt-1 block text-sm leading-4">{service.name}</strong><span className="mt-1 block text-[0.56rem] text-mist">From {formatCurrency(service.priceFrom)}</span></span>
                <ArrowUpRight className="map-node-arrow size-3.5" />
              </Link>;
            })}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.6rem] font-bold tracking-wider text-[#9e9789] uppercase"><span>Top · Calibration</span><span>Mid · MMR Boost</span><span>Jungle · Behavior</span><span>Bottom · Assisted Wins</span><span>Highground · Coaching</span></div>
      </div>
    </section>
  );
}
