import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Radio, Star, Swords } from "lucide-react";
import { boosters } from "@/lib/data/content";

export function BoosterDraft() {
  return (
    <section className="war-roster war-section">
      <Image src="/media/dota/hero-mosaic.webp" alt="" fill sizes="100vw" className="war-roster__art" aria-hidden="true" />
      <div className="war-roster__veil" aria-hidden="true" />
      <div className="container-shell">
        <div className="war-section-heading war-section-heading--split" data-reveal>
          <div>
            <div className="war-chapter"><span>05</span><i /> Immortal roster</div>
            <h2>Draft your<br /><em>specialist.</em></h2>
          </div>
          <div>
            <p>Every public booster is reviewed for rank history, region, communication, role coverage, and service quality before entering the roster.</p>
            <Link href="/boosters">View the full roster <ArrowUpRight /></Link>
          </div>
        </div>

        <div className="war-roster-grid">
          {boosters.map((booster, index) => (
            <Link href={`/boosters/${booster.slug}`} key={booster.slug} className={`war-booster-card ${index === 0 ? "is-featured" : ""}`} data-reveal>
              <div className="war-booster-card__top">
                <span className="war-booster-card__slot">P{index + 1}</span>
                <span className="war-booster-card__availability"><Radio /> {booster.availability}</span>
              </div>
              <div className="war-booster-card__identity">
                <span><b>{booster.initials}</b></span>
                <div><small>{booster.tier} specialist</small><h3>{booster.displayName}</h3><p>{booster.currentRank}</p></div>
              </div>
              <div className="war-booster-card__roles">
                <Swords /> {booster.roles.join(" · ")}
              </div>
              <div className="war-booster-card__stats">
                <span><small>Rating</small><strong><Star /> {booster.rating}</strong></span>
                <span><small>Delivered</small><strong>{booster.winsDelivered} wins</strong></span>
              </div>
              <div className="war-booster-card__foot"><span>{booster.region}</span><strong>Inspect profile <ArrowUpRight /></strong></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
