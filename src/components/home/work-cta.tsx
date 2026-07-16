import { ArrowUpRight, BadgeCheck, CalendarCheck, CircleDollarSign } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function WorkCta() {
  return (
    <section className="container-shell py-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-crimson/25 bg-[linear-gradient(125deg,rgb(93_28_32_/_0.72),rgb(20_22_22_/_0.96)_58%)] p-7 sm:p-10 lg:p-14">
        <div aria-hidden="true" className="absolute -right-24 -top-28 size-96 rounded-full border border-amber/15" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_.75fr] lg:items-end">
          <div><span className="eyebrow">Work with us</span><h2 className="display-type mt-5 max-w-3xl text-balance text-[clamp(3.2rem,7vw,6.2rem)] font-black uppercase">Turn game knowledge into useful coaching.</h2><p className="mt-6 max-w-xl text-base leading-7 text-[#c4c8c5]">We are building a small, high-standard roster of skilled players who communicate clearly, show up prepared, and care about how people learn.</p></div>
          <div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[[BadgeCheck, "Verified profile"], [CalendarCheck, "Choose availability"], [CircleDollarSign, "Transparent earnings"]].map(([Icon, label]) => { const CtaIcon = Icon as typeof BadgeCheck; return <div key={label as string} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm font-semibold"><CtaIcon className="size-4 text-amber" />{label as string}</div>; })}
            </div>
            <LinkButton href="/work-with-us" className="mt-5 w-full justify-between px-6">View coach applications <ArrowUpRight className="size-4" /></LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
