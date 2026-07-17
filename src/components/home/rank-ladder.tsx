import { ArrowRight } from "lucide-react";
import { RankMedal } from "@/components/commerce/rank-medal";
import { LinkButton } from "@/components/ui/button";
import { rankFamilies } from "@/lib/data/ranks";

export function RankLadder() {
  return (
    <section className="legacy-rank-section relative overflow-hidden border-b border-amber/15 bg-[#090b0b] py-14 sm:py-20">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgb(214_79_82_/_0.12),transparent_55%)]" />
      <div className="container-shell relative" data-reveal>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="legacy-kicker">The medal vault</p>
            <h2 className="mt-4 max-w-3xl font-serif text-3xl font-black tracking-tight text-[#eee4d1] sm:text-5xl">Herald I to Immortal. Every division matters.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bcb5a7]">Choose the exact I–V medal route, your MMR scope, and Solo or Duo delivery mode before the queue begins.</p>
          </div>
          <LinkButton href="/pricing" variant="secondary">Build MMR order <ArrowRight className="size-4" /></LinkButton>
        </div>
        <div className="mt-9 overflow-x-auto pb-3">
          <div className="rank-medal-track grid min-w-[760px] grid-cols-8 gap-3">
            {rankFamilies.map((rank) => <RankMedal key={rank} rank={rank} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
