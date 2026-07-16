import Link from "next/link";
import { ArrowUpRight, Radio, Star } from "lucide-react";
import type { Booster } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function BoosterCard({ booster }: { booster: Booster }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[linear-gradient(155deg,rgb(24_28_28_/_0.96),rgb(12_15_15_/_0.98))] p-5 transition duration-300 hover:-translate-y-1 hover:border-crimson/35 hover:shadow-[0_25px_70px_rgb(0_0_0_/_0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="booster-avatar relative grid size-12 place-items-center rounded-2xl border border-crimson/30 bg-crimson/10 text-sm font-black text-[#f2aaaa]">{booster.initials}<span className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-panel bg-cyan" /></span>
          <div><div className="flex items-center gap-2"><h3 className="font-black">{booster.displayName}</h3><span aria-label="Verified booster" title="Verified booster" className="grid size-4 place-items-center rounded-full bg-cyan text-[0.55rem] font-black text-ink">✓</span></div><p className="mt-1 text-xs text-mist">{booster.currentRank}</p></div>
        </div>
        <Badge tone={booster.tier === "Elite" ? "gold" : "neutral"}>{booster.tier}</Badge>
      </div>
      <p className="mt-5 line-clamp-3 text-sm leading-6 text-mist">{booster.biography}</p>
      <div className="mt-5 flex flex-wrap gap-2">{booster.roles.map((role) => <span key={role} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[0.65rem] font-semibold text-[#c4c9c7]">{role}</span>)}</div>
      <div className="mt-6 grid grid-cols-3 gap-2 border-y border-white/[0.07] py-4 text-center">
        <div><p className="flex items-center justify-center gap-1 text-sm font-black"><Star className="size-3 fill-amber text-amber" />{booster.rating}</p><p className="mt-1 text-[0.55rem] font-bold tracking-wider text-[#747b79] uppercase">Rating</p></div>
        <div><p className="text-sm font-black">{booster.winsDelivered}</p><p className="mt-1 text-[0.55rem] font-bold tracking-wider text-[#747b79] uppercase">Wins</p></div>
        <div><p className="flex items-center justify-center gap-1 text-xs font-black text-cyan"><Radio className="size-3" />{booster.availability}</p><p className="mt-1 text-[0.55rem] font-bold tracking-wider text-[#747b79] uppercase">Status</p></div>
      </div>
      <div className="mt-auto flex items-end justify-between pt-5">
        <div><p className="text-[0.58rem] font-bold tracking-wider text-[#747b79] uppercase">Packages from</p><p className="mt-1 font-black">{formatCurrency(booster.startingPrice)}</p></div>
        <Link href={`/boosters/${booster.slug}`} aria-label={`View ${booster.displayName}'s profile`} className="grid size-10 place-items-center rounded-full border border-white/10 transition group-hover:border-crimson group-hover:bg-crimson"><ArrowUpRight className="size-4" /></Link>
      </div>
    </article>
  );
}
