import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  ["01", "Set the MMR scope", "Choose MMR Boost, Calibration, Behavior Score, or Win Boost; then set Solo or Duo, medals, amount, role, and region."],
  ["02", "We verify compatibility", "Operations checks rank range, server, language, party rules, and schedule—never your account password."],
  ["03", "Meet your booster", "A verified high-MMR player joins the private workspace and confirms the first queue window with you."],
  ["04", "Queue and track", "Play every match, see completed wins and milestones, message support, and review delivery in one place."]
] as const;

export function HowItWorks() {
  return (
    <section className="section-pad bg-[#090b0b]">
      <div className="container-shell" data-reveal>
        <SectionHeading eyebrow="Four clear steps" title="From MMR target to tracked delivery." description="The mode, medal, scope, and price are clear before Stripe Checkout; the paid order stays visible through every milestone." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-white/[0.08] lg:grid-cols-4">
          {steps.map(([number, title, body], index) => <article key={number} className="quest-log-card relative min-h-72 bg-panel p-6 lg:p-7"><span className="font-serif text-xs font-black tracking-[0.16em] text-amber">QUEST {number}</span><h3 className="mt-12 font-serif text-xl font-black text-[#eee5d4]">{title}</h3><p className="mt-4 text-sm leading-6 text-mist">{body}</p>{index < steps.length - 1 ? <div aria-hidden="true" className="absolute right-0 top-9 hidden h-px w-7 bg-amber lg:block" /> : <CheckCircle2 aria-hidden="true" className="absolute right-6 top-6 size-5 text-cyan" />}</article>)}
        </div>
      </div>
    </section>
  );
}
