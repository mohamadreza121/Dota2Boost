import { BadgeCheck, CalendarClock, CreditCard, Headphones, KeyRound, MessagesSquare } from "lucide-react";

const items = [
  [BadgeCheck, "Verified coaches", "Reviewed for skill and communication"],
  [CreditCard, "Secure payments", "Card details stay with Stripe"],
  [MessagesSquare, "Private workspace", "One place for every session"],
  [CalendarClock, "Flexible scheduling", "Both time zones, always visible"],
  [Headphones, "Human support", "Help throughout the order"],
  [KeyRound, "No credentials", "Your account stays in your control"]
] as const;

export function TrustStrip() {
  return (
    <section id="trust" aria-label="Platform trust features" className="border-b border-white/[0.07] bg-white/[0.015]">
      <div className="container-shell grid grid-cols-2 py-7 sm:grid-cols-3 lg:grid-cols-6">
        {items.map(([Icon, label, description], index) => (
          <div key={label} className={`px-3 py-4 lg:px-5 ${index ? "border-l border-white/[0.07]" : ""}`} title={description}>
            <Icon className="size-4 text-cyan" aria-hidden="true" />
            <p className="mt-3 text-[0.68rem] font-bold leading-4 tracking-wide text-white uppercase">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
