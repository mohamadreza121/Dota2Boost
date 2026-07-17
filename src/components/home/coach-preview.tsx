import { boosters } from "@/lib/data/content";
import { BoosterCard } from "@/components/marketplace/coach-card";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function CoachPreview() {
  return (
    <section className="section-pad container-shell" data-reveal>
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading eyebrow="Verified roster" title="Built for ranked pressure." description="Filter high-MMR boosters by role, region, language, tier, service type, and live availability." />
        <LinkButton href="/boosters" variant="secondary" arrow>View all boosters</LinkButton>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{boosters.map((booster) => <BoosterCard key={booster.slug} booster={booster} />)}</div>
    </section>
  );
}
