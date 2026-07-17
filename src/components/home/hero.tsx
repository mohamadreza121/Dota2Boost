import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Radio, ShieldCheck, Swords, UsersRound } from "lucide-react";
import { RankedContractPanel } from "@/components/home/ranked-contract-panel";

export function Hero() {
  return (
    <section className="war-hero dota-hero" data-hero>
      <Image
        src="/media/dota/legacy-battle.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="war-hero__art dota-hero__art"
        aria-hidden="true"
      />
      <div className="war-hero__veil dota-hero__veil" aria-hidden="true" />
      <div className="dota-hero__river" aria-hidden="true" />
      <div className="dota-hero__route" aria-hidden="true"><i /><b /><span /></div>
      <div className="war-hero__embers dota-hero__embers" aria-hidden="true" />
      <div className="dota-hero__fog dota-hero__fog--one" aria-hidden="true" />
      <div className="dota-hero__fog dota-hero__fog--two" aria-hidden="true" />
      <div className="dota-hero__scan" aria-hidden="true" />

      <div className="container-shell war-hero__layout dota-hero__layout">
        <div className="war-hero__copy dota-hero__copy" data-reveal>
          <div className="dota-match-found">
            <span className="dota-match-found__pulse"><Radio /></span>
            <span><small>Match found</small><strong>Your ranked campaign is ready</strong></span>
            <b>00:10</b>
          </div>

          <div className="war-chapter"><span>01</span><i /> Path to the Ancient</div>
          <p className="war-hero__pretitle">Dota 2 ranked operations // Solo Assist &amp; Duo Queue</p>
          <h1>
            Your bracket is only<br />
            <span>the first tower.</span>
            <em>Take the path to Immortal.</em>
          </h1>
          <p className="war-hero__lead">
            Choose an exact medal route, select your queue plan, and climb with a verified Immortal specialist beside you—without handing over your account.
          </p>

          <div className="war-hero__actions">
            <Link href="/pricing" className="war-button war-button--primary dota-core-button">
              <span>Build my rank route</span><ArrowUpRight />
            </Link>
            <Link href="/boosters" className="war-button war-button--ghost dota-rune-button">
              <span>Draft a specialist</span><Swords />
            </Link>
          </div>

          <div className="dota-hero__objectives">
            <span><b>01</b><small>Choose medal</small><strong>Exact I–V targeting</strong></span>
            <span><b>02</b><small>Choose mode</small><strong>Solo or Duo</strong></span>
            <span><b>03</b><small>Enter queue</small><strong>Live workspace</strong></span>
          </div>

          <div className="war-hero__assurances">
            <span><ShieldCheck /> No credentials</span>
            <span><UsersRound /> Separate accounts</span>
            <span><Check /> Exact medal scope</span>
          </div>
        </div>

        <div className="dota-loadout" data-reveal="right">
          <div className="dota-loadout__sigil" aria-hidden="true"><span /><i /></div>
          <p className="dota-loadout__label">Campaign loadout</p>
          <RankedContractPanel />
        </div>
      </div>

      <div className="container-shell war-hero__ledger dota-hero__ledger">
        <div><strong>4.96</strong><span>Verified order rating</span></div>
        <div><strong>24/7</strong><span>Regional queue coverage</span></div>
        <div><strong>36</strong><span>Exact medal divisions</span></div>
        <div><strong>0</strong><span>Credentials requested</span></div>
      </div>

      <a href="#contracts" className="war-scroll-cue dota-scroll-cue">Enter the draft <ArrowDown /></a>
    </section>
  );
}
