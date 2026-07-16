import Link from "next/link";
import { ArrowUpRight, Check, Target } from "lucide-react";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";

export function ServiceGrid() {
  return (
    <section className="section-pad container-shell">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading eyebrow="MMR boosting first" title="Choose the climb. Configure the scope." description="Start with MMR Boost, Calibration, Behavior Score, or assisted wins. Coaching remains available as a secondary service." />
        <Link href="/services" className="group inline-flex items-center gap-2 text-sm font-bold text-amber">Compare every service <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Link key={service.slug} href={`/services/${service.slug}`} className={`boost-card group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[1.7rem] border p-6 transition duration-300 hover:-translate-y-1 ${index === 0 ? "border-crimson/30 bg-[linear-gradient(145deg,rgb(112_32_36_/_0.3),rgb(18_21_21_/_0.96)_65%)] md:col-span-2 lg:col-span-1" : "border-white/[0.08] bg-panel/75 hover:border-white/20"}`}>
            <div className="flex items-center justify-between"><span className="text-[0.6rem] font-black tracking-[0.17em] text-mist uppercase">0{index + 1} · {service.eyebrow}</span><Target className={`size-4 ${index === 0 ? "text-crimson" : "text-[#5e6562]"}`} /></div>
            <h3 className="mt-7 text-2xl font-black tracking-tight">{service.name}</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-mist">{service.shortDescription}</p>
            <div className="mt-6 space-y-2">{service.highlights.slice(0, 2).map((item) => <p key={item} className="flex items-center gap-2 text-[0.65rem] font-semibold text-[#bfc5c2]"><Check className="size-3 text-cyan" />{item}</p>)}</div>
            <div className="mt-auto flex items-end justify-between border-t border-white/[0.07] pt-6">
              <div><p className="text-[0.58rem] font-bold tracking-wider text-[#747c78] uppercase">Starts at</p><p className="mt-1 text-xl font-black">{formatCurrency(service.priceFrom)}</p></div>
              <div className="text-right"><p className="text-[0.58rem] font-bold tracking-wider text-[#747c78] uppercase">Scope</p><p className="mt-1 text-xs font-bold text-amber">{service.duration}</p></div>
            </div>
            <ArrowUpRight className="absolute right-5 top-1/2 size-5 text-transparent transition group-hover:right-4 group-hover:text-white" />
          </Link>
        ))}
      </div>
    </section>
  );
}
