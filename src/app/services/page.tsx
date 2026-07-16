import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Dota 2 Coaching Services", description: "Compare live coaching, replay analysis, role mastery, hero mastery, guided improvement, and team coaching.", alternates: { canonical: "/services" } };

export default function ServicesPage() {
  return (
    <><PageHero eyebrow="Coaching services" title="Choose the format. Keep the control." description="One focused replay or a structured month of work—every plan is delivered with you on your own account." aside={<div className="rounded-2xl border border-cyan/20 bg-cyan/[0.06] p-5 text-sm leading-6 text-[#c0cdca]"><strong className="text-cyan">Account safety:</strong> We never request Steam passwords, login codes, or recovery codes.</div>} />
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
        <div className="mt-16 flex flex-col items-center rounded-[1.8rem] border border-white/[0.09] bg-panel/60 px-6 py-12 text-center"><p className="eyebrow before:hidden">Not sure where to start?</p><h2 className="mt-5 text-3xl font-black">Build a brief first. Choose a coach second.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-mist">The configurator turns your role, goals, schedule, and preferred format into a clear starting plan.</p><LinkButton href="/pricing" className="mt-7" arrow>Build my plan</LinkButton></div>
      </section>
    </>
  );
}
