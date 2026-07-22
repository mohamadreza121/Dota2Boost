import Link from "next/link";
import { ArrowUpRight, Eye, LockKeyhole, MessageSquare, ShieldCheck } from "lucide-react";
import { reviews } from "@/lib/data/content";
import { WorkspacePreview } from "@/components/home/workspace-preview";

export function DeliveryRecord() {
  const review = reviews[0];

  return (
    <section className="war-section war-record" aria-labelledby="war-record-title">
      <div className="container-shell">
        <header className="war-heading war-heading--split" data-war-reveal>
          <div>
            <p className="war-kicker"><span>06</span><i /> Delivery record</p>
            <h2 id="war-record-title">Proof lives in the order context.</h2>
          </div>
          <p>Messages, scheduling, scope, progress, and completion stay together. The workspace—not decorative statistics—is the evidence model.</p>
        </header>

        <div className="war-record__layout">
          <div className="war-record__workspace" data-war-reveal><WorkspacePreview /></div>

          <aside className="war-record__proof" data-war-reveal>
            <div className="war-record__proof-head"><Eye aria-hidden="true" /><span>Current content record</span><small>Verify against production before launch</small></div>
            {review ? (
              <blockquote>
                <p>“{review.quote}”</p>
                <footer><strong>{review.customer}</strong><span>{review.service} · {review.role} · {review.rank}</span></footer>
              </blockquote>
            ) : null}
            <ul>
              <li><LockKeyhole aria-hidden="true" /><span><strong>Customer control</strong><small>No credentials or remote access.</small></span></li>
              <li><MessageSquare aria-hidden="true" /><span><strong>Attached communication</strong><small>Order messages and schedule changes remain visible.</small></span></li>
              <li><ShieldCheck aria-hidden="true" /><span><strong>No outcome guarantee</strong><small>The paid scope is defined; matchmaking results are not guaranteed.</small></span></li>
            </ul>
            <Link href="/reviews">Review published feedback <ArrowUpRight /></Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
