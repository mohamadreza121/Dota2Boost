import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Swords, Trophy } from "lucide-react";

export function HomeFinalCta() {
  return (
    <section className="war-final dota-final dota-final-v3" data-reveal>
      <Image
        src="/media/highground-battlefield.webp"
        alt=""
        fill
        sizes="100vw"
        className="war-final__art dota-final__art"
        aria-hidden="true"
      />

      <div className="war-final__veil dota-final__veil" aria-hidden="true" />
      <div className="dota-final__embers" aria-hidden="true" />
      <div className="dota-final-v3__flare" aria-hidden="true" />

      <div className="container-shell war-final__content dota-final__content">
        <div className="dota-final-v3__copy">
          <div className="war-chapter"><span>07</span><i /> Final objective</div>
          <p className="war-final__eyebrow">The high ground is open</p>
          <h2>Your next medal<br /><em>starts here.</em></h2>
          <p className="dota-final-v3__lead">
            Lock the exact route, confirm your region and queue mode, and receive a
            live server-priced campaign before checkout.
          </p>

          <div className="dota-final__actions">
            <Link href="/pricing" className="war-button war-button--primary dota-core-button">
              Configure boost <ArrowUpRight />
            </Link>
            <Link href="/boosters" className="war-button war-button--ghost dota-rune-button">
              Inspect roster <Swords />
            </Link>
          </div>

          <div className="dota-final-v3__trust">
            <span><ShieldCheck /> No account handoff</span>
            <span><CheckCircle2 /> Exact medal targeting</span>
            <span><Trophy /> Verified Immortal roster</span>
          </div>
        </div>

        <aside className="dota-final-v3__panel" aria-label="Example victory route">
          <div className="dota-final-v3__panel-head">
            <span>Victory route</span>
            <b>Ready check</b>
          </div>

          <div className="dota-final-v3__route">
            <div><small>Current medal</small><strong>Legend III</strong></div>
            <i aria-hidden="true"><span /></i>
            <div><small>Target medal</small><strong>Ancient I</strong></div>
          </div>

          <ul>
            <li>Choose Solo Assist or Duo Queue</li>
            <li>Confirm region and eligibility</li>
            <li>Receive a live quote before checkout</li>
          </ul>

          <Link href="/pricing">
            Open campaign configurator <ArrowUpRight />
          </Link>
        </aside>
      </div>
    </section>
  );
}
