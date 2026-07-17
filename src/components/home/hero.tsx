import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, ShieldCheck, UsersRound } from "lucide-react";
import { RankedContractPanel } from "@/components/home/ranked-contract-panel";

export function Hero() {
  return (
    <section className="war-hero">
      <Image
        src="/media/dota/legacy-battle.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="war-hero__art"
        aria-hidden="true"
      />
      <div className="war-hero__veil" aria-hidden="true" />
      <div className="war-hero__embers" aria-hidden="true" />

      <div className="container-shell war-hero__layout">
        <div className="war-hero__copy" data-reveal>
          <div className="war-chapter"><span>01</span><i /> Ranked operations</div>
          <p className="war-hero__pretitle">Dota 2 MMR services // Solo &amp; Duo</p>
          <h1>Escape your bracket.<br /><em>Take the high ground.</em></h1>
          <p className="war-hero__lead">
            Build an exact medal route, choose how you want to queue, and enter the climb with a verified Immortal specialist beside you.
          </p>

          <div className="war-hero__actions">
            <Link href="/pricing" className="war-button war-button--primary">Build my ascent <ArrowUpRight /></Link>
            <Link href="/boosters" className="war-button war-button--ghost">Inspect the roster</Link>
          </div>

          <div className="war-hero__assurances">
            <span><ShieldCheck /> No credentials</span>
            <span><UsersRound /> Separate accounts</span>
            <span><Check /> Exact I–V medals</span>
          </div>
        </div>

        <RankedContractPanel />
      </div>

      <div className="container-shell war-hero__ledger">
        <div><strong>4.96</strong><span>Verified order rating</span></div>
        <div><strong>24/7</strong><span>Regional queue coverage</span></div>
        <div><strong>36</strong><span>Exact medal divisions</span></div>
        <div><strong>0</strong><span>Credentials requested</span></div>
      </div>

      <a href="#contracts" className="war-scroll-cue">Choose your campaign <ArrowDown /></a>
    </section>
  );
}
