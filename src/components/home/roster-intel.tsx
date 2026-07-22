import Link from "next/link";
import { ArrowUpRight, Check, Medal, ShieldCheck } from "lucide-react";
import { boosters } from "@/lib/data/content";

const verificationPoints = ["Rank history", "Role and region fit", "Language and communication", "Conduct and service quality"] as const;

export function RosterIntel() {
  const [featured, ...alternatives] = boosters.slice(0, 3);
  if (!featured) return null;

  return (
    <section className="war-section war-roster" aria-labelledby="war-roster-title">
      <div className="war-roster__terrain" aria-hidden="true" />
      <div className="container-shell">
        <header className="war-heading" data-war-reveal>
          <p className="war-kicker"><span>05</span><i /> Verified execution</p>
          <h2 id="war-roster-title">Match the specialist to the fight.</h2>
          <p>Profiles provide context before a campaign begins. Operations then confirms compatibility for the selected objective, role, region, language, and delivery type.</p>
        </header>

        <div className="war-roster__layout">
          <article className="war-featured-specialist" data-war-reveal>
            <div className="war-featured-specialist__identity">
              <span className="war-specialist-mark" aria-hidden="true">{featured.initials}</span>
              <div><small>Featured roster profile</small><h3>{featured.displayName}</h3><p>{featured.tier} specialist</p></div>
              <Medal aria-hidden="true" />
            </div>
            <p className="war-featured-specialist__bio">{featured.biography}</p>
            <dl>
              <div><dt>Current rank</dt><dd>{featured.currentRank}</dd></div>
              <div><dt>Roles</dt><dd>{featured.roles.join(" · ")}</dd></div>
              <div><dt>Region</dt><dd>{featured.region}</dd></div>
              <div><dt>Languages</dt><dd>{featured.languages.join(" · ")}</dd></div>
              <div><dt>Specialties</dt><dd>{featured.specialties.join(" · ")}</dd></div>
            </dl>
            <Link href={`/boosters/${featured.slug}`}>Open profile <ArrowUpRight /></Link>
          </article>

          <aside className="war-verification" data-war-reveal>
            <div className="war-verification__head"><ShieldCheck aria-hidden="true" /><span><small>Verification means</small><strong>Context, not a badge.</strong></span></div>
            <ul>{verificationPoints.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul>
            <p>Availability, assignment, and compatibility are confirmed for the selected order rather than implied by a decorative live status.</p>
          </aside>

          <div className="war-roster-alternatives" aria-label="Additional roster profiles">
            {alternatives.map((booster) => (
              <Link key={booster.slug} href={`/boosters/${booster.slug}`} data-war-reveal>
                <span className="war-specialist-mark" aria-hidden="true">{booster.initials}</span>
                <span><small>{booster.tier} specialist</small><strong>{booster.displayName}</strong><em>{booster.roles.join(" · ")} / {booster.region}</em></span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
            <Link href="/boosters" className="war-roster-all" data-war-reveal>Inspect the full roster <ArrowUpRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
