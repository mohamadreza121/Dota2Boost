import { ArrowDown, Check, Headphones, ShieldCheck, Swords, Zap } from "lucide-react";
import { RankMedal } from "@/components/commerce/rank-medal";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

const orderRows = [
  ["Current rank", "Legend III"],
  ["Target rank", "Ancient I"],
  ["Boost mode", "Duo Queue"],
  ["MMR scope", "+500 MMR"],
] as const;

export function Hero() {
  return (
    <section className="hero-stage relative min-h-[calc(100svh-76px)] overflow-hidden border-b border-white/[0.07]">
      <div className="hero-poster absolute inset-0" aria-hidden="true" />
      <video className="hero-video absolute inset-0 size-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="/media/highground-battlefield.webp" aria-hidden="true" tabIndex={-1}>
        <source src="/media/highground-battlefield.webm" type="video/webm" />
        <source src="/media/highground-battlefield.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#070909_0%,rgb(7_9_9_/_0.96)_30%,rgb(7_9_9_/_0.5)_65%,rgb(7_9_9_/_0.12)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(8_10_10_/_0.5),transparent_35%,#080a0a_100%)]" />
      <div aria-hidden="true" className="soft-grid absolute inset-0 opacity-20" />

      <div className="container-shell relative grid min-h-[calc(100svh-76px)] items-center gap-14 py-20 lg:grid-cols-[1.08fr_.72fr] lg:py-16">
        <div className="max-w-4xl">
          <Badge tone="gold"><span className="mr-2 size-1.5 animate-pulse rounded-full bg-amber" />Dota 2 Ranked · MMR Boost · Calibration</Badge>
          <h1 className="display-type mt-7 text-balance text-[clamp(4.4rem,9.5vw,8.8rem)] font-black uppercase">
            Queue the<br /><span className="text-crimson">climb.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-[#c4cac7] md:text-xl">
            A Dota 2-first MMR service for Solo Assist and Duo Queue. Set your medal, role, hero pool, and MMR scope—then track every milestone from checkout to completion.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/pricing" arrow className="sm:min-w-48">Configure my boost</LinkButton>
            <LinkButton href="/boosters" variant="secondary" className="sm:min-w-44">Browse boosters</LinkButton>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#b3bbb7]">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-cyan" />Role-aware party matching</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-cyan" />Hero-pool compatibility</span>
            <span className="flex items-center gap-2"><Headphones className="size-4 text-cyan" />Human support</span>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-[430px] lg:block lg:justify-self-end">
          <div aria-hidden="true" className="absolute -inset-16 bg-[radial-gradient(circle,rgb(210_72_72_/_0.2),transparent_66%)] blur-2xl" />
          <div className="command-card relative overflow-hidden rounded-[1.8rem] border border-white/[0.13] bg-[#0b0e0e]/80 shadow-[0_30px_100px_rgb(0_0_0_/_0.55)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div><p className="text-[0.58rem] font-bold tracking-[0.17em] text-mist uppercase">Live order</p><p className="mt-1 text-sm font-black">HG-4281 · MMR Boost</p></div>
              <Badge tone="cyan"><span className="mr-1.5 size-1.5 rounded-full bg-cyan" />Matching</Badge>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-4 gap-2">
                {(["Crusader", "Archon", "Legend", "Ancient"] as const).map((rank) => <RankMedal key={rank} rank={rank} size="sm" selected={rank === "Legend" || rank === "Ancient"} />)}
              </div>
              <div className="mt-6 divide-y divide-white/[0.07] rounded-xl border border-white/[0.08] bg-black/20 px-4">
                {orderRows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-5 py-3 text-xs"><span className="text-mist">{label}</span><span className="font-bold">{value}</span></div>)}
              </div>
              <div className="mt-4 rounded-xl border border-amber/15 bg-amber/[0.06] p-4">
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[0.62rem] font-bold tracking-wider text-amber uppercase"><Zap className="size-3.5" />Match readiness</span><strong className="text-sm">92%</strong></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full w-[92%] rounded-full bg-gradient-to-r from-crimson via-amber to-cyan" /></div>
                <p className="mt-3 text-[0.58rem] text-mist">Duo Queue · 3 compatible boosters · live milestone tracking</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-9 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#101313]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <span className="grid size-9 place-items-center rounded-xl bg-crimson/12"><Swords className="size-4 text-crimson" /></span>
            <div><p className="text-[0.55rem] font-bold tracking-wider text-mist uppercase">Last 24 hours</p><p className="text-xs font-black">184 assisted wins delivered</p></div>
          </div>
        </div>

        <a href="#trust" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[0.62rem] font-bold tracking-[0.16em] text-[#8a928f] uppercase xl:flex">See how it works <ArrowDown className="size-3" /></a>
      </div>

      <div className="container-shell relative grid grid-cols-2 gap-px border-x border-t border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
        {[["4.96/5", "Verified rating"], ["24/7", "Queue coverage"], ["28", "Regions & languages"], ["0", "Credentials requested"]].map(([value, label]) => <div key={label} className="bg-[#090b0b]/85 px-5 py-4 backdrop-blur"><p className="text-xl font-black text-white">{value}</p><p className="mt-1 text-[0.58rem] font-bold tracking-wider text-mist uppercase">{label}</p></div>)}
      </div>
    </section>
  );
}
