import { ArrowDown, Check, MessageSquareText, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

const planRows = [
  ["Current rank", "Legend III"],
  ["Target", "Stronger decisions"],
  ["Main role", "Position 1 · Carry"],
  ["Format", "Live + replay"],
] as const;

export function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-76px)] overflow-hidden border-b border-white/[0.07]">
      <div aria-hidden="true" className="soft-grid absolute inset-0 opacity-40" />
      <div aria-hidden="true" className="absolute left-1/2 top-[-19rem] size-[46rem] -translate-x-1/2 rounded-full border border-crimson/15" />
      <div aria-hidden="true" className="hero-orbit absolute left-1/2 top-[-10rem] size-[28rem] -translate-x-1/2 rounded-full border border-dashed border-amber/20" />
      <div className="container-shell relative grid min-h-[calc(100svh-76px)] items-center gap-14 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-16">
        <div>
          <Badge tone="gold"><span className="mr-2 size-1.5 rounded-full bg-amber" />Private coaching · Built around you</Badge>
          <h1 className="display-type mt-7 max-w-4xl text-balance text-[clamp(4.2rem,10.4vw,8.7rem)] font-black uppercase">
            Climb smarter.<br /><span className="text-crimson">Understand</span> Dota.
          </h1>
          <p className="mt-7 max-w-xl text-balance text-lg leading-8 text-mist md:text-xl">Work privately with verified high-rank Dota 2 coaches through live sessions, replay analysis, personalized plans, and ongoing support.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/coaches" arrow className="sm:min-w-44">Find my coach</LinkButton>
            <LinkButton href="/pricing" variant="secondary" className="sm:min-w-44">Build my plan</LinkButton>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-mist">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-cyan" />No account credentials</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-cyan" />Secure checkout</span>
            <span className="flex items-center gap-2"><MessageSquareText className="size-4 text-cyan" />Private workspace</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[530px] lg:mx-0 lg:justify-self-end">
          <div aria-hidden="true" className="absolute -inset-12 bg-[radial-gradient(circle,rgb(210_83_83_/_0.16),transparent_65%)] blur-2xl" />
          <div className="surface relative overflow-hidden rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist uppercase">Plan builder</p>
                <p className="mt-1 text-sm font-semibold">Your improvement brief</p>
              </div>
              <Badge tone="cyan">Live estimate</Badge>
            </div>
            <div className="p-6">
              <div className="rank-track grid grid-cols-4 gap-2 text-center">
                {["Crusader", "Archon", "Legend", "Ancient"].map((rank, index) => (
                  <div key={rank} className="relative">
                    <span className={`relative z-10 mx-auto grid size-7 place-items-center rounded-full border text-[0.6rem] font-black ${index === 2 ? "border-crimson bg-crimson text-white" : "border-white/15 bg-panel text-mist"}`}>{index + 1}</span>
                    <p className={`mt-2 text-[0.62rem] font-bold ${index === 2 ? "text-white" : "text-[#747b79]"}`}>{rank}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 divide-y divide-white/[0.07] rounded-2xl border border-white/[0.08] bg-black/15 px-4">
                {planRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-5 py-3.5 text-sm">
                    <span className="text-mist">{label}</span><span className="text-right font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-5 rounded-2xl border border-amber/15 bg-amber/[0.06] p-4">
                <div>
                  <p className="text-[0.62rem] font-bold tracking-[0.12em] text-amber uppercase">Recommended start</p>
                  <p className="mt-1 text-sm font-semibold">2 live sessions + 1 replay</p>
                </div>
                <p className="text-2xl font-black">$170<span className="text-xs font-semibold text-mist"> CAD</span></p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#121515] px-4 py-3 shadow-2xl sm:-left-8">
            <span className="grid size-8 place-items-center rounded-full bg-cyan/10"><Check className="size-4 text-cyan" /></span>
            <div><p className="text-[0.62rem] font-bold tracking-wider text-mist uppercase">Coach match</p><p className="text-xs font-semibold">3 eligible · 2 available</p></div>
          </div>
        </div>

        <a href="#trust" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[0.62rem] font-bold tracking-[0.16em] text-[#737a78] uppercase xl:flex">Explore the system <ArrowDown className="size-3" /></a>
      </div>
    </section>
  );
}
