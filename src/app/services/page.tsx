import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Dota 2 MMR Boosting Services", description: "Compare MMR Boost in Solo and Duo modes, MMR Calibration, Behavior Score Boost, assisted wins, and secondary coaching.", alternates: { canonical: "/services" } };

export default function ServicesPage() {
  return (
    <><PageHero eyebrow="MMR boosting services" title="MMR first. Coaching second." description="Configure an exact MMR climb, calibration block, behavior-score recovery scope, or assisted-win package. Solo and Duo modes stay customer-operated and trackable." aside={<div className="rounded-2xl border border-cyan/20 bg-cyan/[0.06] p-5 text-sm leading-6 text-[#c0cdca]"><strong className="text-cyan">Account-safety standard:</strong> We never request Steam passwords, login codes, authentication cookies, or remote access.</div>} />
      <section className="section-pad container-shell">
        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <article key={service.slug} className="surface group relative overflow-hidden rounded-[1.7rem] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4"><div><Badge tone={service.accent === "amber" ? "gold" : service.accent === "cyan" ? "cyan" : "red"}>{service.eyebrow}</Badge><h2 className="mt-5 text-3xl font-black tracking-tight">{service.name}</h2></div><span className="text-xs font-black tracking-widest text-[#5f6663]">0{index + 1}</span></div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-mist">{service.description}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">{service.highlights.map((item) => <li key={item} className="flex items-center gap-2 text-xs font-semibold text-[#d1d5d2]"><Check className="size-3.5 text-cyan" />{item}</li>)}</ul>
              <div className="mt-8 flex items-end justify-between border-t border-white/[0.08] pt-5"><div><p className="text-[0.6rem] font-bold tracking-wider text-mist uppercase">From</p><p className="mt-1 text-2xl font-black">{formatCurrency(service.priceFrom)}</p></div><Link href={`/services/${service.slug}`} className="flex items-center gap-2 text-sm font-bold text-amber">View service <ArrowUpRight className="size-4" /></Link></div>
            </article>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center rounded-[1.8rem] border border-white/[0.09] bg-panel/60 px-6 py-12 text-center"><p className="eyebrow before:hidden">Start with MMR</p><h2 className="mt-5 text-3xl font-black">Pick Solo or Duo. Set the medal and MMR target.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-mist">The configurator turns service, mode, medal, scope, region, role, tier, and priority into a fresh server-side quote.</p><LinkButton href="/pricing" className="mt-7" arrow>Configure MMR boost</LinkButton></div>
      </section>
    </>
  );
}
