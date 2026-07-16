import { Quote, Star } from "lucide-react";
import { reviews } from "@/lib/data/content";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function ReviewPreview() {
  return (
    <section className="section-pad container-shell">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading eyebrow="Completed orders only" title="Proof attached to real work." description="A verified label appears only when feedback belongs to a completed, paid coaching order." />
        <LinkButton href="/reviews" variant="secondary">Read all reviews</LinkButton>
      </div>
      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="relative flex min-h-80 flex-col rounded-[1.5rem] border border-white/[0.08] bg-panel/70 p-6">
            <Quote className="size-8 text-crimson/50" />
            <div className="mt-6 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="size-3.5 fill-amber text-amber" />)}</div>
            <blockquote className="mt-5 text-base leading-7 text-[#d5d8d5]">“{review.quote}”</blockquote>
            <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/[0.07] pt-5">
              <div><p className="text-sm font-bold">{review.customer}</p><p className="mt-1 text-[0.65rem] text-mist">{review.rank} · {review.role}</p></div>
              {review.verified ? <Badge tone="cyan">Verified order</Badge> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
