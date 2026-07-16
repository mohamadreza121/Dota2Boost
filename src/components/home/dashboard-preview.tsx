import { CalendarDays, Check, Circle, FileText, MessageSquareText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";

export function DashboardPreview() {
  return (
    <section className="section-pad overflow-hidden border-y border-white/[0.07] bg-[#0b0d0d]">
      <div className="container-shell">
        <SectionHeading eyebrow="Your private workspace" title="Every useful detail, still in context." description="The plan, coach chat, session time, deliverables, and next action stay connected to the order—not scattered across apps." />
        <div className="surface mt-14 overflow-hidden rounded-[1.8rem] lg:grid lg:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-white/[0.08] bg-black/15 p-5 lg:block">
            <p className="text-xs font-black tracking-[0.13em]">HIGHGROUND</p>
            <nav className="mt-9 space-y-1" aria-label="Dashboard preview navigation">
              {["Overview", "My orders", "Messages", "Sessions", "Progress", "Billing"].map((item, index) => <span key={item} className={`block rounded-xl px-3 py-2.5 text-xs font-semibold ${index === 0 ? "bg-white/[0.07] text-white" : "text-mist"}`}>{item}</span>)}
            </nav>
          </aside>
          <div className="p-5 sm:p-7 lg:p-9">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div><p className="text-[0.65rem] font-bold tracking-[0.14em] text-mist uppercase">Thursday · Week 2</p><h3 className="mt-2 text-2xl font-bold">Good afternoon, Reza.</h3></div>
              <Badge tone="cyan"><span className="mr-2 size-1.5 rounded-full bg-cyan" />Coaching active</Badge>
            </div>
            <div className="mt-7 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
              <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-5">
                <div className="flex items-start justify-between"><div><p className="text-[0.62rem] font-bold tracking-wider text-amber uppercase">Active plan</p><h4 className="mt-2 font-bold">Carry decision framework</h4></div><Badge>HG-2084</Badge></div>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full w-[58%] rounded-full bg-gradient-to-r from-crimson to-amber" /></div>
                <div className="mt-2 flex justify-between text-[0.62rem] font-semibold text-mist"><span>2 of 4 milestones</span><span>58%</span></div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><CalendarDays className="size-4 text-cyan" /><p className="mt-3 text-[0.62rem] font-bold text-mist uppercase">Next session</p><p className="mt-1 text-sm font-semibold">Fri, 7:30 PM EDT</p></div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><TrendingUp className="size-4 text-amber" /><p className="mt-3 text-[0.62rem] font-bold text-mist uppercase">Weekly focus</p><p className="mt-1 text-sm font-semibold">Farm-to-fight timing</p></div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-5">
                <div className="flex items-center justify-between"><p className="text-sm font-bold">Coach message</p><MessageSquareText className="size-4 text-cyan" /></div>
                <div className="mt-5 rounded-xl rounded-tl-sm bg-white/[0.06] p-4 text-sm leading-6 text-[#c7cdca]">Your lane plan is improving. For the next two replays, tag the moment you decide to leave the safe lane.</div>
                <p className="mt-2 text-right text-[0.58rem] text-[#6f7774]">Northstar · 8 min ago</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[[Check, "Goal completed", "Pre-game matchup notes"], [FileText, "Replay ready", "Match 8401274961"], [Circle, "Next action", "Confirm Friday session"]].map(([Icon, label, value]) => {
                const ItemIcon = Icon as typeof Check;
                return <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/10 p-4"><span className="grid size-9 place-items-center rounded-full bg-white/[0.04]"><ItemIcon className="size-4 text-mist" /></span><div><p className="text-[0.58rem] font-bold tracking-wider text-mist uppercase">{label as string}</p><p className="mt-1 text-xs font-semibold">{value as string}</p></div></div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
