import { ArrowRight } from "lucide-react";
import { RankMedal } from "@/components/commerce/rank-medal";
import { LinkButton } from "@/components/ui/button";
import { rankOptions } from "@/lib/data/ranks";

export function RankLadder() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#090b0b] py-12 sm:py-16">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgb(214_79_82_/_0.12),transparent_55%)]" />
      <div className="container-shell relative">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">MMR rank ladder</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Herald to Immortal. Pick your climb.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">Choose your current medal, target medal, MMR amount, and Solo or Duo delivery mode in the boost configurator.</p>
          </div>
          <LinkButton href="/pricing" variant="secondary">Build MMR order <ArrowRight className="size-4" /></LinkButton>
        </div>
        <div className="mt-9 overflow-x-auto pb-3">
          <div className="rank-medal-track grid min-w-[760px] grid-cols-8 gap-3">
            {rankOptions.map((rank) => <RankMedal key={rank} rank={rank} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
