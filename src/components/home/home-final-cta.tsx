import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles, Swords } from "lucide-react";

export function HomeFinalCta() {
  return (
    <section className="war-final dota-final" data-reveal>
      <Image src="/media/dota/vengeful-wall.webp" alt="" fill sizes="100vw" className="war-final__art dota-final__art" aria-hidden="true" />
      <div className="war-final__veil dota-final__veil" aria-hidden="true" />
      <div className="dota-final__gate dota-final__gate--left" aria-hidden="true" />
      <div className="dota-final__gate dota-final__gate--right" aria-hidden="true" />
      <div className="dota-final__ancient" aria-hidden="true"><i /><b /><span /></div>
      <div className="dota-final__projectile" aria-hidden="true"><span /></div>
      <div className="dota-final__embers" aria-hidden="true" />

      <div className="container-shell war-final__content dota-final__content">
        <div className="war-chapter"><span>07</span><i /> High-ground siege</div>
        <p className="war-final__eyebrow"><Sparkles /> Your next medal is waiting</p>
        <h2>One tower left.<br /><em>Finish the ascent.</em></h2>
        <p>Choose the exact route, confirm your region and queue mode, then receive a live server-priced campaign before checkout.</p>
        <div className="dota-final__actions">
          <Link href="/pricing" className="war-button war-button--primary dota-core-button">Begin campaign <ArrowUpRight /></Link>
          <Link href="/boosters" className="war-button war-button--ghost dota-rune-button">Inspect roster <Swords /></Link>
        </div>
        <span className="dota-final__safety"><ShieldCheck /> Customer-operated Solo and Duo delivery · no Steam credentials</span>
      </div>
    </section>
  );
}
