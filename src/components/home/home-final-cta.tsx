import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export function HomeFinalCta() {
  return (
    <section className="war-final" data-reveal>
      <Image src="/media/dota/vengeful-wall.webp" alt="" fill sizes="100vw" className="war-final__art" aria-hidden="true" />
      <div className="war-final__veil" aria-hidden="true" />
      <div className="container-shell war-final__content">
        <div className="war-chapter"><span>07</span><i /> Ready check</div>
        <p className="war-final__eyebrow">Your next medal is waiting</p>
        <h2>Enter the queue<br /><em>with a plan.</em></h2>
        <p>Choose your exact rank route, confirm regional eligibility, and receive a live server-priced contract before checkout.</p>
        <div>
          <Link href="/pricing" className="war-button war-button--primary">Configure MMR boost <ArrowUpRight /></Link>
          <span><ShieldCheck /> Customer-operated Solo and Duo delivery</span>
        </div>
      </div>
    </section>
  );
}
