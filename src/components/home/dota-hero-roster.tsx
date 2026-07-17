import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Crosshair, ShieldCheck, Swords } from "lucide-react";

const heroes = [
  {
    name: "Anti-Mage",
    role: "Carry",
    queue: "Farm patterns · late-game conversion",
    image: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png",
    tone: "violet"
  },
  {
    name: "Invoker",
    role: "Mid",
    queue: "Lane pressure · tempo calls",
    image: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png",
    tone: "gold"
  },
  {
    name: "Axe",
    role: "Offlane",
    queue: "Initiation · map pressure",
    image: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/axe.png",
    tone: "crimson"
  },
  {
    name: "Crystal Maiden",
    role: "Support",
    queue: "Lane control · vision routes",
    image: "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/crystal_maiden.png",
    tone: "cyan"
  }
] as const;

export function DotaHeroRoster() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#090c0d] py-16 sm:py-24">
      <div aria-hidden="true" className="rune-field absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/55 to-transparent" />
      <div className="container-shell relative" data-reveal>
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="legacy-kicker">The hero draft</p>
            <h2 className="display-type mt-5 text-balance text-[clamp(3.25rem,6vw,6.4rem)] font-black uppercase">Your role is the first pick.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-mist sm:text-base">We match a queue plan around the role, hero pool, server, and communication style you actually play. MMR is the destination; the draft is how you get there.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-[0.66rem] font-bold tracking-wide text-[#c6cdca] uppercase">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-3 py-2"><Crosshair className="size-3.5 text-amber" />Role-aware matching</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-3 py-2"><ShieldCheck className="size-3.5 text-cyan" />Customer-operated queues</span>
            </div>
            <Link href="/pricing" className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-amber">Configure your MMR climb <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
          </div>

          <div className="hero-roster-grid grid gap-3 sm:grid-cols-2">
            {heroes.map((hero, index) => (
              <article key={hero.name} className={`dota-hero-card dota-hero-${hero.tone} group relative min-h-52 overflow-hidden rounded-[1.5rem] border border-white/[0.11] p-5 ${index === 0 ? "sm:translate-y-7" : ""}`}>
                <Image src={hero.image} alt={`${hero.name} from Dota 2`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 310px" className="dota-hero-portrait object-cover" priority={index < 2} />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_7_8_/_0.94)_0%,rgb(5_7_8_/_0.62)_48%,rgb(5_7_8_/_0.12)_100%)]" />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgb(5_7_8_/_0.9),transparent)]" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.14] bg-black/20 px-2.5 py-1 text-[0.56rem] font-black tracking-[0.16em] text-white uppercase"><Swords className="size-3" />{hero.role}</span>
                  <div><p className="text-xl font-black tracking-tight text-white">{hero.name}</p><p className="mt-1 text-[0.67rem] font-semibold text-[#d6dbd8]">{hero.queue}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
