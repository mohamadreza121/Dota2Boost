import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";

export function ServiceGrid() {
  return (
    <section className="section-pad container-shell">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading eyebrow="Coaching formats" title="Built for the way you learn." description="Start with one focused review or build an accountable program. Every service stays on your account, under your control." />
        <Link href="/services" className="group inline-flex items-center gap-2 text-sm font-bold text-amber">Explore all services <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 6).map((service, index) => (
          <Link key={service.slug} href={`/services/${service.slug}`} className={`group relative flex min-h-72 flex-col overflow-hidden rounded-[1.6rem] border border-white/[0.08] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 ${index === 0 ? "bg-gradient-to-br from-crimson/[0.14] to-panel md:col-span-2 lg:col-span-1" : "bg-panel/75"}`}>
            <span className="text-[0.62rem] font-black tracking-[0.17em] text-mist uppercase">0{index + 1} · {service.eyebrow}</span>
            <h3 className="mt-6 text-2xl font-bold tracking-tight">{service.name}</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-mist">{service.shortDescription}</p>
            <div className="mt-auto flex items-end justify-between pt-8">
              <div><p className="text-[0.62rem] font-bold tracking-wider text-[#707774] uppercase">Starts at</p><p className="mt-1 text-xl font-black">{formatCurrency(service.priceFrom)}</p></div>
              <span className="flex items-center gap-1.5 text-xs text-mist"><Clock3 className="size-3.5" />{service.duration}</span>
            </div>
            <ArrowUpRight className="absolute right-5 top-5 size-5 text-[#5e6562] transition group-hover:text-white" />
          </Link>
        ))}
      </div>
    </section>
  );
}
