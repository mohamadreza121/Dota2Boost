import Image from "next/image";
import { ArrowDown, Check, Crown, Headphones, ShieldCheck, Swords, Zap } from "lucide-react";
import { RankMedal } from "@/components/commerce/rank-medal";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

const orderRows = [
  ["Current medal", "Legend III"],
  ["Target medal", "Ancient I"],
  ["Battle plan", "Duo Queue"],
  ["Ranked scope", "+500 MMR"],
] as const;

export function Hero() {
  return (
    <section className="legacy-hero relative min-h-[calc(100svh-76px)] overflow-hidden border-b border-amber/20">
      <Image src="/media/dota/legacy-battle.webp" alt="" fill priority sizes="100vw" className="legacy-hero-art object-cover" aria-hidden="true" />
      <div aria-hidden="true" className="legacy-hero-shade absolute inset-0" />
      <div aria-hidden="true" className="legacy-runes absolute inset-0" />
      <div aria-hidden="true" className="legacy-corner legacy-corner-left absolute left-0 top-0" />
      <div aria-hidden="true" className="legacy-corner legacy-corner-right absolute right-0 top-0" />

      <div className="container-shell relative grid min-h-[calc(100svh-76px)] items-center gap-14 py-20 lg:grid-cols-[1.08fr_.72fr] lg:py-16">
        <div className="max-w-4xl" data-reveal>
          <Badge tone="gold"><span className="mr-2 size-1.5 animate-pulse rounded-full bg-amber" />The ranked ascent · Solo & Duo</Badge>
          <p className="legacy-kicker mt-7">Dota 2 MMR Service</p>
          <h1 className="legacy-title mt-3 text-balance text-[clamp(4.2rem,9.6vw,9.4rem)] font-black uppercase">
            Take the<br /><span>highground.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-[#d4d0c4] md:text-xl">
            Choose your exact medal, role, server, and hero pool. Enter Solo Assist or queue beside a verified Immortal—and watch the climb unfold match by match.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/pricing" arrow className="legacy-cta sm:min-w-52">Build my MMR climb</LinkButton>
            <LinkButton href="/boosters" variant="secondary" className="legacy-cta legacy-cta-secondary sm:min-w-44">Inspect the roster</LinkButton>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#c9c3b5]">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-cyan" />You keep account control</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-cyan" />Exact I–V medal routes</span>
            <span className="flex items-center gap-2"><Headphones className="size-4 text-cyan" />Real human operations</span>
          </div>
        </div>

        <div className="legacy-ready-wrap relative mx-auto hidden w-full max-w-[440px] lg:block lg:justify-self-end" data-reveal="right">
          <div aria-hidden="true" className="legacy-ready-aura absolute -inset-20" />
          <div className="legacy-ready-card relative overflow-hidden">
            <div className="legacy-panel-cap flex items-center justify-between px-5 py-4">
              <div><p className="text-[0.56rem] font-bold tracking-[0.2em] text-amber uppercase">Ranked contract</p><p className="mt-1 text-sm font-black">HG-4281 · MMR ASCENT</p></div>
              <Badge tone="cyan"><span className="mr-1.5 size-1.5 rounded-full bg-cyan" />Ready</Badge>
            </div>
            <div className="relative p-5">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgb(216_173_96_/_0.08),transparent_42%)]" />
              <div className="relative grid grid-cols-4 gap-2">
                {(["Crusader", "Archon", "Legend", "Ancient"] as const).map((rank) => <RankMedal key={rank} rank={rank} size="sm" selected={rank === "Legend" || rank === "Ancient"} />)}
              </div>
              <div className="legacy-order-table relative mt-6 divide-y divide-amber/[0.11] px-4">
                {orderRows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-5 py-3 text-xs"><span className="text-[#8f8a7f]">{label}</span><span className="font-bold text-[#ece4d4]">{value}</span></div>)}
              </div>
              <div className="legacy-ready-check relative mt-4 p-4">
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[0.62rem] font-bold tracking-wider text-amber uppercase"><Zap className="size-3.5" />Party readiness</span><strong className="text-sm">92%</strong></div>
                <div className="legacy-progress mt-3 h-2 overflow-hidden"><div className="h-full w-[92%] bg-gradient-to-r from-crimson via-amber to-cyan" /></div>
                <p className="mt-3 text-[0.58rem] text-mist">3 compatible Immortal boosters online now</p>
              </div>
            </div>
          </div>
          <div className="legacy-floating-seal absolute -bottom-7 -left-10 flex items-center gap-3 px-4 py-3">
            <span className="grid size-10 place-items-center bg-crimson/15"><Crown className="size-4 text-amber" /></span>
            <div><p className="text-[0.54rem] font-bold tracking-wider text-mist uppercase">Battle record</p><p className="text-xs font-black">184 assisted wins · 24h</p></div>
          </div>
        </div>

        <a href="#battle-map" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[0.62rem] font-bold tracking-[0.18em] text-[#a69c88] uppercase xl:flex">Enter the battlefield <ArrowDown className="size-3" /></a>
      </div>

      <div className="legacy-stats container-shell relative grid grid-cols-2 gap-px border-x border-t border-amber/15 sm:grid-cols-4">
        {[["4.96/5", "Verified rating"], ["24/7", "Queue coverage"], ["36", "Medal divisions"], ["0", "Credentials requested"]].map(([value, label], index) => <div key={label} className="legacy-stat px-5 py-4"><div className="flex items-center gap-3"><Swords className={`size-3.5 ${index === 2 ? "text-amber" : "text-crimson"}`} /><p className="text-xl font-black text-white">{value}</p></div><p className="mt-1 text-[0.58rem] font-bold tracking-wider text-mist uppercase">{label}</p></div>)}
      </div>
    </section>
  );
}
