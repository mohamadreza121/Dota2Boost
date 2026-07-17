import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crown, Radio, ShieldCheck, Star, Swords, Target } from "lucide-react";
import { boosters } from "@/lib/data/content";

const positions = ["Carry / Mid", "Offlane", "Support", "Core specialist"] as const;

export function BoosterDraft() {
  return (
    <section className="war-roster war-section dota-roster">
      <Image src="/media/dota/hero-mosaic.webp" alt="" fill sizes="100vw" className="war-roster__art dota-roster__art" aria-hidden="true" />
      <div className="war-roster__veil dota-roster__veil" aria-hidden="true" />
      <div className="dota-roster__smoke" aria-hidden="true" />
      <div className="dota-roster__spotlights" aria-hidden="true"><i /><i /><i /></div>

      <div className="container-shell">
        <div className="war-section-heading war-section-heading--split dota-heading" data-reveal>
          <div>
            <div className="war-chapter"><span>05</span><i /> Immortal draft</div>
            <h2>Build your party.<br /><em>Draft a specialist.</em></h2>
          </div>
          <div>
            <p>Every public booster is reviewed for rank history, region, communication, role coverage, and completed-service quality before entering the active roster.</p>
            <Link href="/boosters">View the full player pool <ArrowUpRight /></Link>
          </div>
        </div>

        <div className="dota-roster-stage" data-reveal>
          <div className="dota-roster-stage__header">
            <span><Swords /> Ranked lineup</span>
            <strong>4 specialists available</strong>
            <span><Radio /> Live regional coverage</span>
          </div>

          <div className="war-roster-grid dota-roster-grid">
            {boosters.map((booster, index) => (
              <Link
                href={`/boosters/${booster.slug}`}
                key={booster.slug}
                className={`war-booster-card dota-player-card ${index === 0 ? "is-featured" : ""}`}
                data-tilt
              >
                <div className="dota-player-card__portrait" aria-hidden="true">
                  <span>{booster.initials}</span>
                  <i /><b />
                </div>
                <div className="dota-player-card__frame" aria-hidden="true"><i /><i /><i /><i /></div>
                <div className="war-booster-card__top dota-player-card__top">
                  <span className="war-booster-card__slot">P{index + 1} // {positions[index]}</span>
                  <span className="war-booster-card__availability"><Radio /> {booster.availability}</span>
                </div>

                <div className="dota-player-card__identity">
                  <small>{booster.tier} specialist</small>
                  <h3>{booster.displayName}</h3>
                  <p><Crown /> {booster.currentRank}</p>
                </div>

                <div className="dota-player-card__specialties">
                  {booster.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
                </div>

                <div className="war-booster-card__roles dota-player-card__roles">
                  <Swords /> {booster.roles.join(" · ")}
                </div>
                <div className="war-booster-card__stats dota-player-card__stats">
                  <span><small>Rating</small><strong><Star /> {booster.rating}</strong></span>
                  <span><small>Delivered</small><strong>{booster.winsDelivered} wins</strong></span>
                </div>
                <div className="dota-player-card__verification"><ShieldCheck /> Rank history reviewed</div>
                <div className="war-booster-card__foot dota-player-card__foot">
                  <span><Target /> {booster.region}</span><strong>Draft player <ArrowUpRight /></strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
