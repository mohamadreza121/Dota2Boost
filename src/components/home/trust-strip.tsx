import { BadgeCheck, ChartNoAxesCombined, CreditCard, Headphones, KeyRound, UserRoundCheck } from "lucide-react";

const items = [
  [UserRoundCheck, "Self-play only", "You play every match"],
  [BadgeCheck, "Verified boosters", "Rank and identity reviewed"],
  [CreditCard, "Secure checkout", "Stripe-hosted payment"],
  [ChartNoAxesCombined, "Live order tracker", "Wins and milestones logged"],
  [Headphones, "Human support", "Help throughout delivery"],
  [KeyRound, "Zero credentials", "No account access requested"]
] as const;

export function TrustStrip() {
  return (
    <section id="trust" aria-label="Platform trust features" className="border-b border-white/[0.07] bg-white/[0.015]">
      <div className="container-shell grid grid-cols-2 py-6 sm:grid-cols-3 lg:grid-cols-6">
        {items.map(([Icon, label, description], index) => <div key={label} className={`px-3 py-4 lg:px-5 ${index ? "border-l border-white/[0.07]" : ""}`} title={description}><Icon className="size-4 text-cyan" aria-hidden="true" /><p className="mt-3 text-[0.68rem] font-bold leading-4 tracking-wide text-white uppercase">{label}</p><p className="mt-1 hidden text-[0.55rem] text-mist xl:block">{description}</p></div>)}
      </div>
    </section>
  );
}
