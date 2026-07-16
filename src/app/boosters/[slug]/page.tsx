import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Check, Clock3, Globe2, Languages, Radio, Star, Trophy } from "lucide-react";
import { boosters, reviews } from "@/lib/data/content";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() { return boosters.map((booster) => ({ slug: booster.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const booster = boosters.find((item) => item.slug === slug);
  return booster ? { title: `${booster.displayName} — Verified Dota 2 Booster`, description: booster.biography, alternates: { canonical: `/boosters/${booster.slug}` } } : {};
}

export default async function BoosterProfilePage({ params }: Props) {
  const { slug } = await params;
  const booster = boosters.find((item) => item.slug === slug);
  if (!booster) notFound();
  const boosterReviews = reviews.filter((review) => review.booster === booster.displayName);
  return <>
    <section className="relative overflow-hidden border-b border-white/[0.07] py-16 md:py-24"><div aria-hidden="true" className="soft-grid absolute inset-0 opacity-25" /><div className="container-shell relative grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end"><div className="flex flex-col gap-6 sm:flex-row sm:items-start"><span className="booster-avatar relative grid size-28 shrink-0 place-items-center rounded-[2rem] border border-crimson/30 bg-crimson/10 text-3xl font-black text-[#ef9a9a]">{booster.initials}<span className="absolute -bottom-1 -right-1 size-5 rounded-full border-4 border-ink bg-cyan" /></span><div><div className="flex flex-wrap items-center gap-3"><Badge tone="cyan">✓ Verified booster</Badge><Badge tone={booster.tier === "Elite" ? "gold" : "neutral"}>{booster.tier}</Badge></div><h1 className="display-type mt-5 text-6xl font-black uppercase md:text-8xl">{booster.displayName}</h1><p className="mt-3 text-base text-mist">{booster.currentRank} · Peak {booster.peakRank}</p></div></div><aside className="surface rounded-2xl p-6"><div className="flex items-center justify-between"><span className="text-xs text-mist">Packages from</span><strong className="text-2xl">{formatCurrency(booster.startingPrice)}</strong></div><LinkButton href={`/pricing?booster=${booster.slug}`} className="mt-5 w-full" arrow>Build a boost</LinkButton><p className="mt-3 text-center text-[0.62rem] text-mist">Rank compatibility confirmed before assignment</p></aside></div></section>
    <section className="section-pad container-shell grid gap-14 lg:grid-cols-[1fr_360px]"><div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[[Star, `${booster.rating} rating`], [Trophy, `${booster.winsDelivered} wins`], [Globe2, booster.region], [Radio, booster.availability]].map(([Icon, label]) => { const ProfileIcon = Icon as typeof Star; return <div key={label as string} className="rounded-xl border border-white/[0.08] bg-panel/50 p-4"><ProfileIcon className="size-4 text-cyan" /><p className="mt-3 text-xs font-bold">{label as string}</p></div>; })}</div><div className="mt-12"><span className="eyebrow">About the booster</span><h2 className="mt-6 text-3xl font-black">Composed in queue. Clear in comms.</h2><p className="mt-5 max-w-3xl text-base leading-7 text-mist">{booster.biography}</p><p className="mt-4 max-w-3xl text-base leading-7 text-mist">{booster.playStyle}</p></div><div className="mt-12 grid gap-8 sm:grid-cols-2"><div><p className="text-xs font-bold tracking-wider text-amber uppercase">Role coverage</p><div className="mt-4 flex flex-wrap gap-2">{booster.roles.map((item) => <Badge key={item}>{item}</Badge>)}</div></div><div><p className="text-xs font-bold tracking-wider text-amber uppercase">Boost services</p><div className="mt-4 flex flex-wrap gap-2">{booster.boostingTypes.map((item) => <Badge key={item}>{item}</Badge>)}</div></div></div>{boosterReviews.length ? <div className="mt-14"><span className="eyebrow">Verified feedback</span>{boosterReviews.map((review) => <blockquote key={review.id} className="mt-6 rounded-2xl border border-white/[0.08] bg-panel/60 p-6 text-base leading-7">“{review.quote}”<footer className="mt-4 text-xs text-mist">{review.customer} · {review.service} · Verified paid order</footer></blockquote>)}</div> : null}</div>
      <aside className="space-y-4"><div className="surface rounded-2xl p-5"><p className="text-xs font-bold tracking-wider text-amber uppercase">Profile details</p><div className="mt-5 space-y-4 text-sm"><div className="flex gap-3"><Languages className="size-4 text-cyan" /><span>{booster.languages.join(" · ")}</span></div><div className="flex gap-3"><Globe2 className="size-4 text-cyan" /><span>{booster.region}<br /><small className="text-mist">{booster.timeZone}</small></span></div><div className="flex gap-3"><CalendarDays className="size-4 text-cyan" /><span>Next availability: {booster.availability}</span></div><div className="flex gap-3"><Clock3 className="size-4 text-cyan" /><span>Schedule confirmed in your local time</span></div></div></div><div className="rounded-2xl border border-white/[0.08] p-5"><p className="text-xs font-bold tracking-wider uppercase">Every order includes</p><ul className="mt-4 space-y-3 text-xs text-mist">{["Private order workspace", "Customer-controlled play", "Match progress tracking", "Support access"].map((item) => <li key={item} className="flex gap-2"><Check className="size-3.5 text-cyan" />{item}</li>)}</ul></div></aside>
    </section>
  </>;
}
