import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Quote, Star } from "lucide-react";
import { reviews } from "@/lib/data/content";

export function VictoryLedger() {
  return (
    <section className="war-ledger war-section">
      <div className="container-shell">
        <div className="war-section-heading war-section-heading--split" data-reveal>
          <div>
            <div className="war-chapter"><span>06</span><i /> Proof of victory</div>
            <h2>Completed orders.<br /><em>Recorded outcomes.</em></h2>
          </div>
          <div>
            <p>Reviews earn a verified marker only after they are attached to a completed, paid order in the delivery system.</p>
            <Link href="/reviews">Open match history <ArrowUpRight /></Link>
          </div>
        </div>

        <div className="war-ledger-board" data-reveal>
          <div className="war-ledger-board__head">
            <span>Order record</span><span>Contract</span><span>Field report</span><span>Result</span>
          </div>
          {reviews.map((review, index) => (
            <article key={review.id} className="war-ledger-row">
              <div className="war-ledger-row__customer">
                <span>HG-{4281 - index * 13}</span>
                <strong>{review.customer}</strong>
                <small>{review.date}</small>
              </div>
              <div className="war-ledger-row__contract">
                <strong>{review.service}</strong>
                <span>{review.rank} · {review.role}</span>
              </div>
              <blockquote><Quote /> “{review.quote}”</blockquote>
              <div className="war-ledger-row__result">
                <span>{Array.from({ length: review.rating }).map((_, star) => <Star key={star} />)}</span>
                <strong><BadgeCheck /> Verified</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
