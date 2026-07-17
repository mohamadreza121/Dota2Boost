import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock3, Quote, Star, Trophy } from "lucide-react";
import { reviews } from "@/lib/data/content";

const routes = ["Legend III → Ancient I", "Ancient I → Ancient IV", "Divine II → Divine IV"] as const;
const times = ["4 days", "10 matches", "3 days"] as const;

export function VictoryLedger() {
  return (
    <section className="war-ledger war-section dota-victories">
      <div className="dota-victories__embers" aria-hidden="true" />
      <div className="container-shell">
        <div className="war-section-heading war-section-heading--split dota-heading" data-reveal>
          <div>
            <div className="war-chapter"><span>06</span><i /> Match history</div>
            <h2>Completed orders.<br /><em>Recorded victories.</em></h2>
          </div>
          <div>
            <p>Every verified report is attached to a completed, paid order. No anonymous quote wall—just the service, route, field report, and result.</p>
            <Link href="/reviews">Open full match history <ArrowUpRight /></Link>
          </div>
        </div>

        <div className="dota-victory-feed" data-reveal>
          <div className="dota-victory-feed__header">
            <span><Trophy /> Recent victories</span>
            <p>Live delivery ledger</p>
            <strong>4.96 average rating</strong>
          </div>

          <div className="dota-victory-feed__cards">
            {reviews.map((review, index) => (
              <article key={review.id} className="dota-victory-card" data-tilt>
                <div className="dota-victory-card__result">
                  <span>Victory</span>
                  <strong>HG-{4281 - index * 13}</strong>
                </div>
                <div className="dota-victory-card__route">
                  <small>{review.service}</small>
                  <strong>{routes[index]}</strong>
                  <span>{review.rank} · {review.role}</span>
                </div>
                <blockquote><Quote /> “{review.quote}”</blockquote>
                <div className="dota-victory-card__meta">
                  <span><Clock3 /> {times[index]}</span>
                  <span>{Array.from({ length: review.rating }).map((_, star) => <Star key={star} />)}</span>
                </div>
                <div className="dota-victory-card__customer">
                  <span>{review.customer.slice(0, 1)}</span>
                  <div><strong>{review.customer}</strong><small>{review.date}</small></div>
                  <b><BadgeCheck /> Verified order</b>
                </div>
              </article>
            ))}
          </div>

          <div className="dota-victory-feed__ticker" aria-hidden="true">
            <span>Legend III</span><i /><b>+500 MMR delivered</b><i /><span>Ancient I</span><i /><b>North America</b><i /><span>Duo Queue</span>
          </div>
        </div>
      </div>
    </section>
  );
}
