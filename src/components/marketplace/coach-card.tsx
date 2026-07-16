import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Coach } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-white/[0.09] bg-panel/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl border border-crimson/25 bg-crimson/10 text-sm font-black text-[#ee9a9a]">{coach.initials}</span>
          <div><div className="flex items-center gap-2"><h3 className="font-bold">{coach.displayName}</h3><span aria-label="Verified coach" title="Verified coach" className="grid size-4 place-items-center rounded-full bg-cyan text-[0.55rem] font-black text-ink">✓</span></div><p className="mt-1 text-xs text-mist">{coach.currentRank}</p></div>
        </div>
        <Badge tone={coach.tier === "Elite" ? "gold" : "neutral"}>{coach.tier}</Badge>
      </div>
      <p className="mt-5 line-clamp-3 text-sm leading-6 text-mist">{coach.biography}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {coach.roles.map((role) => <span key={role} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[0.65rem] font-semibold text-[#c4c9c7]">{role}</span>)}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 border-y border-white/[0.07] py-4 text-center">
        <div><p className="flex items-center justify-center gap-1 text-sm font-black"><Star className="size-3 fill-amber text-amber" />{coach.rating}</p><p className="mt-1 text-[0.57rem] font-bold tracking-wider text-[#747b79] uppercase">Rating</p></div>
        <div><p className="text-sm font-black">{coach.sessions}</p><p className="mt-1 text-[0.57rem] font-bold tracking-wider text-[#747b79] uppercase">Sessions</p></div>
        <div><p className="text-sm font-black text-cyan">{coach.availability}</p><p className="mt-1 text-[0.57rem] font-bold tracking-wider text-[#747b79] uppercase">Next slot</p></div>
      </div>
      <div className="mt-auto flex items-end justify-between pt-5">
        <div><p className="text-[0.58rem] font-bold tracking-wider text-[#747b79] uppercase">From</p><p className="mt-1 font-black">{formatCurrency(coach.startingPrice)}<span className="ml-1 text-xs font-normal text-mist">/ session</span></p></div>
        <Link href={`/coaches/${coach.slug}`} aria-label={`View ${coach.displayName}'s profile`} className="grid size-10 place-items-center rounded-full border border-white/10 transition group-hover:border-crimson group-hover:bg-crimson"><ArrowUpRight className="size-4" /></Link>
      </div>
    </article>
  );
}
