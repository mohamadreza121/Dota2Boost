import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, CircleDot } from "lucide-react";
import { services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return { title: service.name, description: service.description, alternates: { canonical: `/services/${service.slug}` } };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.description, provider: { "@type": "Organization", name: "Highground Boosting" }, offers: { "@type": "Offer", priceCurrency: "CAD", price: service.priceFrom / 100 } };

  return (
    <><section className="relative overflow-hidden border-b border-white/[0.07] py-20 md:py-28"><div aria-hidden="true" className="hero-poster absolute inset-0 opacity-20" /><div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#070909_20%,rgb(7_9_9_/_0.72),#070909)]" /><div className="container-shell relative grid gap-12 lg:grid-cols-[1fr_380px] lg:items-end"><div><Badge tone={service.accent === "amber" ? "gold" : service.accent === "cyan" ? "cyan" : "red"}>{service.eyebrow}</Badge><h1 className="display-type mt-6 text-balance text-[clamp(4.1rem,10vw,8rem)] font-black uppercase">{service.name}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-mist">{service.description}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><LinkButton href="/pricing" arrow>Configure this boost</LinkButton><LinkButton href="/boosters" variant="secondary">Browse boosters</LinkButton></div></div><div className="surface rounded-2xl p-6"><p className="text-[0.62rem] font-bold tracking-wider text-mist uppercase">Packages from</p><p className="mt-2 text-4xl font-black">{formatCurrency(service.priceFrom)}<span className="ml-2 text-sm font-normal text-mist">CAD</span></p><p className="mt-4 text-sm text-mist">Typical scope · {service.duration}</p><div className="mt-5 border-t border-white/[0.08] pt-5 text-xs leading-5 text-[#9fa7a4]">Final price, tax, rank compatibility, and booster availability are verified securely before delivery.</div></div></div></section>
      <section className="section-pad container-shell grid gap-12 lg:grid-cols-2">
        <div><span className="eyebrow">Who it is for</span><h2 className="mt-6 text-3xl font-black">A scoped queue service, not a mystery order.</h2><ul className="mt-7 space-y-4">{service.idealFor.map((item) => <li key={item} className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-panel/50 p-4 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-cyan" />{item}</li>)}</ul></div>
        <div><span className="eyebrow">Delivery structure</span><h2 className="mt-6 text-3xl font-black">A clear target, assignment, queue, and review.</h2><ol className="mt-7 space-y-4">{service.sessionStructure.map((item, index) => <li key={item} className="flex items-center gap-4 border-b border-white/[0.08] pb-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-crimson/10 text-xs font-black text-crimson">{index + 1}</span><span className="text-sm font-semibold">{item}</span></li>)}</ol></div>
      </section>
      <section className="border-y border-white/[0.07] bg-[#0b0d0d] py-20"><div className="container-shell grid gap-10 lg:grid-cols-[1fr_.8fr]"><div><span className="eyebrow">What is included</span><h2 className="display-type mt-6 text-5xl font-black uppercase md:text-7xl">A boost you can actually track.</h2></div><div className="space-y-4">{service.highlights.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-panel/60 p-4"><CircleDot className="size-4 text-amber" /><span className="text-sm font-semibold">{item}</span></div>)}<p className="pt-3 text-xs leading-5 text-mist">You play every match on your own account. Matchmaking outcomes vary, and Highground does not guarantee MMR, rank, win rate, or a specific result.</p></div></div></section>
      <section className="container-shell py-20 text-center"><p className="eyebrow before:hidden">Ready to make it specific?</p><h2 className="display-type mx-auto mt-5 max-w-4xl text-balance text-5xl font-black uppercase md:text-7xl">Build the boost that fits your queue.</h2><LinkButton href="/pricing" className="mt-8" arrow>Open configurator</LinkButton></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></>
  );
}
