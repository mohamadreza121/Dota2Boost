import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  ["01", "Choose the work", "Select live coaching, replay analysis, or a longer program and tell us what you want to improve."],
  ["02", "Share gameplay context", "Add your role, region, goals, and match IDs. Never send account credentials or authentication codes."],
  ["03", "Meet your coach", "We match you with a verified coach whose role expertise, language, and schedule fit the order."],
  ["04", "Improve in one workspace", "Message, schedule, receive notes, approve deliverables, and track your next priorities privately."]
] as const;

export function HowItWorks() {
  return (
    <section className="section-pad border-y border-white/[0.07] bg-[#0b0d0d]">
      <div className="container-shell">
        <SectionHeading eyebrow="Four clear steps" title="Less friction. More useful feedback." description="The platform handles logistics so your time goes into understanding the match." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.08] lg:grid-cols-4">
          {steps.map(([number, title, body], index) => (
            <article key={number} className="relative min-h-72 bg-panel p-6 lg:p-7">
              <span className="text-xs font-black tracking-[0.16em] text-crimson">{number}</span>
              <h3 className="mt-12 text-xl font-bold">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-mist">{body}</p>
              {index < steps.length - 1 ? <div aria-hidden="true" className="absolute right-0 top-9 hidden h-px w-7 bg-crimson lg:block" /> : <CheckCircle2 aria-hidden="true" className="absolute right-6 top-6 size-5 text-cyan" />}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
