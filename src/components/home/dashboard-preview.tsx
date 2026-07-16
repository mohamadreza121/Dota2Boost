import { CalendarDays, Check, Circle, MessageSquareText, Swords, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";

export function DashboardPreview() {
  return (
    <section className="section-pad overflow-hidden border-y border-white/[0.07] bg-[#090b0b]">
      <div className="container-shell">
        <SectionHeading eyebrow="Private delivery workspace" title="Every win. Every message. One order timeline." description="Track assignment, queue windows, completed matches, billing, support, and your next milestone without chasing updates across apps." />
        <div className="surface mt-14 overflow-hidden rounded-[1.9rem] lg:grid lg:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-white/[0.08] bg-black/15 p-5 lg:block">
            <p className="text-xs font-black tracking-[0.13em]">HIGHGROUND</p>
            <nav className="mt-9 space-y-1" aria-label="Dashboard preview navigation">{["Overview", "My boosts", "Messages", "Queue schedule", "Progress", "Billing"].map((item, index) => <span key={item} className={`block rounded-xl px-3 py-2.5 text-xs font-semibold ${index === 0 ? "bg-white/[0.07] text-white" : "text-mist"}`}>{item}</span>)}</nav>
          </aside>
          <div className="p-5 sm:p-7 lg:p-9">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[0.62rem] font-bold tracking-[0.14em] text-mist uppercase">Thursday · Order HG-4281</p><h3 className="mt-2 text-2xl font-black">Good afternoon, Reza.</h3></div><Badge tone="cyan"><span className="mr-2 size-1.5 rounded-full bg-cyan" />Boost active</Badge></div>
            <div className="mt-7 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
              <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-5">
                <div className="flex items-start justify-between"><div><p className="text-[0.62rem] font-bold tracking-wider text-amber uppercase">Rank boost · Duo lane</p><h4 className="mt-2 font-black">Legend III → Ancient I</h4></div><Badge tone="gold">7 / 10 wins</Badge></div>
                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full w-[70%] rounded-full bg-gradient-to-r from-crimson via-amber to-cyan" /></div>
                <div className="mt-2 flex justify-between text-[0.62rem] font-semibold text-mist"><span>3 wins remaining</span><span>70%</span></div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><CalendarDays className="size-4 text-cyan" /><p className="mt-3 text-[0.58rem] font-bold text-mist uppercase">Next queue block</p><p className="mt-1 text-sm font-semibold">Fri, 7:30 PM EDT</p></div><div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><Trophy className="size-4 text-amber" /><p className="mt-3 text-[0.58rem] font-bold text-mist uppercase">Current streak</p><p className="mt-1 text-sm font-semibold">4 assisted wins</p></div></div>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><div className="flex items-center justify-between"><p className="text-sm font-bold">Booster message</p><MessageSquareText className="size-4 text-cyan" /></div><div className="mt-5 rounded-xl rounded-tl-sm bg-white/[0.06] p-4 text-sm leading-6 text-[#c7cdca]">I can cover your lane again Friday. I added two hero pairings to the queue plan—pick the one you prefer before we start.</div><p className="mt-2 text-right text-[0.58rem] text-[#6f7774]">Northstar · 8 min ago</p></div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">{[[Check, "Match verified", "Win 7 logged at 21:42"], [Swords, "Booster assigned", "Northstar · Elite"], [Circle, "Next action", "Confirm Friday queue"]].map(([Icon, label, value]) => { const ItemIcon = Icon as typeof Check; return <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/10 p-4"><span className="grid size-9 place-items-center rounded-full bg-white/[0.04]"><ItemIcon className="size-4 text-mist" /></span><div><p className="text-[0.55rem] font-bold tracking-wider text-mist uppercase">{label as string}</p><p className="mt-1 text-xs font-semibold">{value as string}</p></div></div>; })}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
