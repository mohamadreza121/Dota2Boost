import { faqs } from "@/lib/data/content";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function FaqPreview() {
  return (
    <section className="section-pad border-t border-white/[0.07] bg-[#0b0d0d]">
      <div className="container-shell grid gap-14 lg:grid-cols-[.75fr_1.25fr]">
        <div><SectionHeading eyebrow="Straight answers" title="Know exactly what a boost means here." description="Self-play only. No credential sharing. No rank guarantees. No vague delivery process." /><LinkButton href="/faq" variant="secondary" className="mt-8">View every question</LinkButton></div>
        <div className="divide-y divide-white/[0.09] border-y border-white/[0.09]">
          {faqs.slice(0, 5).map((faq, index) => (
            <details key={faq.question} className="group py-5" open={index === 0}>
              <summary className="flex list-none items-center justify-between gap-6 text-base font-semibold marker:hidden"><span>{faq.question}</span><span aria-hidden="true" className="text-xl font-light text-crimson transition group-open:rotate-45">+</span></summary>
              <p className="max-w-2xl pt-4 text-sm leading-6 text-mist">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
