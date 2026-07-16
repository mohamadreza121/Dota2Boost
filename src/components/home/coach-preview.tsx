import { coaches } from "@/lib/data/content";
import { CoachCard } from "@/components/marketplace/coach-card";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function CoachPreview() {
  return (
    <section className="section-pad container-shell">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading eyebrow="Verified specialists" title="Find someone who sees your game clearly." description="Filter by role, region, language, approach, and availability. Public profiles never reveal a coach’s private information." />
        <LinkButton href="/coaches" variant="secondary" arrow>View all coaches</LinkButton>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {coaches.map((coach) => <CoachCard key={coach.slug} coach={coach} />)}
      </div>
    </section>
  );
}
