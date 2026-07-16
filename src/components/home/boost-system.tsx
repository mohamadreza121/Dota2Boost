import Image from "next/image";
import { Activity, BadgeCheck, Crosshair, KeyRound, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

const features = [
  [BadgeCheck, "Verified high-MMR roster", "Rank history, conduct, communication, and region checks before a profile goes live."],
  [Crosshair, "Compatibility-first matching", "Role, server, rank range, language, hero pool, and queue window all shape assignment."],
  [Activity, "Match-level progress", "Completed wins, schedule changes, messages, receipts, and support actions stay attached to the order."],
  [KeyRound, "No account hand-off", "You play every game. We never ask for a password, Steam Guard code, or remote access."],
] as const;

export function BoostSystem() {
  return (
    <section className="section-pad overflow-hidden border-y border-white/[0.07] bg-[#0a0c0c]">
      <div className="container-shell grid gap-14 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
        <div className="relative">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] border border-white/[0.1] shadow-[0_32px_100px_rgb(0_0_0_/_0.45)]">
            <Image src="/media/highground-war-room.webp" alt="Original fantasy MOBA command table showing a three-lane battlefield and rank progression markers" fill sizes="(max-width: 1280px) 100vw, 54vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgb(7_9_9_/_0.94)_100%)]" />
            <div className="absolute left-5 top-5"><Badge tone="cyan"><Radio className="mr-1.5 size-3" />Operations online</Badge></div>
            <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2">
              {[["11m", "Median match"], ["98%", "Orders covered"], ["4.9", "Service score"]].map(([value, label]) => <div key={label} className="rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-md"><p className="text-lg font-black">{value}</p><p className="mt-1 text-[0.52rem] font-bold tracking-wider text-mist uppercase">{label}</p></div>)}
            </div>
          </div>
          <div aria-hidden="true" className="absolute -bottom-16 -left-16 -z-10 size-72 rounded-full bg-crimson/10 blur-3xl" />
        </div>
        <div>
          <span className="eyebrow">The boost system</span>
          <h2 className="display-type mt-6 max-w-3xl text-balance text-[clamp(3.5rem,6vw,6.4rem)] font-black uppercase">A real service operation behind every queue.</h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-mist">Highground combines a verified booster marketplace with a private delivery workspace. You always know who is assigned, what is complete, and what happens next.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map(([Icon, title, body]) => <div key={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><Icon className="size-4 text-cyan" /><h3 className="mt-4 text-sm font-black">{title}</h3><p className="mt-2 text-xs leading-5 text-mist">{body}</p></div>)}
          </div>
          <LinkButton href="/how-it-works" variant="secondary" arrow className="mt-7">See the delivery flow</LinkButton>
        </div>
      </div>
    </section>
  );
}
