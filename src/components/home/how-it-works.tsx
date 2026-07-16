import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  ["01", "Set the target", "Choose a rank or win package, current bracket, role, region, and the queue format you prefer."],
  ["02", "We verify compatibility", "Operations checks rank range, server, language, party rules, and schedule—never your account password."],
  ["03", "Meet your booster", "A verified high-MMR player joins the private workspace and confirms the first queue window with you."],
  ["04", "Queue and track", "Play every match, see completed wins and milestones, message support, and review delivery in one place."]
] as const;

export function HowItWorks() {
  return (
    <section className="section-pad bg-[#090b0b]">
      <div className="container-shell">
        <SectionHeading eyebrow="Four clear steps" title="From target to party queue—without the mystery." description="The service is scoped before payment and tracked after it. You stay informed and stay on your own account." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-white/[0.08] lg:grid-cols-4">
          {steps.map(([number, title, body], index) => <article key={number} className="relative min-h-72 bg-panel p-6 lg:p-7"><span className="text-xs font-black tracking-[0.16em] text-crimson">{number}</span><h3 className="mt-12 text-xl font-black">{title}</h3><p className="mt-4 text-sm leading-6 text-mist">{body}</p>{index < steps.length - 1 ? <div aria-hidden="true" className="absolute right-0 top-9 hidden h-px w-7 bg-crimson lg:block" /> : <CheckCircle2 aria-hidden="true" className="absolute right-6 top-6 size-5 text-cyan" />}</article>)}
        </div>
      </div>
    </section>
  );
}
