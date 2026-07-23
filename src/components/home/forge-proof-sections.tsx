import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Eye,
  LockKeyhole,
  Medal,
  MessageSquare,
  Radio,
  Route,
  ShieldCheck,
  Swords,
  Target,
  Trophy,
  Users
} from "lucide-react";
import { ForgeSectionHeading } from "@/components/home/forge-section-heading";
import { MoltenEdge } from "@/components/ui/molten-edge";
import { boosters, faqs, reviews } from "@/lib/data/content";
import { rankMedals } from "@/lib/data/ranks";
import { formatCurrency } from "@/lib/utils";

const whyItems = [
  {
    icon: LockKeyhole,
    title: "Account stays yours",
    body: "Solo Assist and Duo Queue are customer-operated. No passwords, Steam Guard codes, recovery codes, or remote access."
  },
  {
    icon: Route,
    title: "Scope before payment",
    body: "The service, route, region, role, mode, and configurable amount are visible before checkout."
  },
  {
    icon: MessageSquare,
    title: "One private workspace",
    body: "Scheduling, assigned-specialist messages, progress updates, and support stay attached to the order."
  },
  {
    icon: Medal,
    title: "Roster with context",
    body: "Profiles expose rank, roles, region, languages, specialties, service fit, and availability."
  }
] as const;

export function VictoryProof() {
  return (
    <section className="forge-section victory-proof">
      <div className="container-shell">
        <ForgeSectionHeading
          chapter="04"
          eyebrow="Proof of victory"
          title={<>Proof lives in the <em>delivery record.</em></>}
          description="Trust is built from visible scope, attached milestones, direct communication, and reviews connected to a real service—not from oversized marketing claims."
          href="/reviews"
          linkLabel="Open all reviews"
        />

        <div className="victory-proof__grid">
          <article className="victory-quote forged-panel" data-forge-reveal>
            <div className="victory-quote__top">
              <span><Trophy /> Verified match report</span>
              <p><i /> Verified order</p>
            </div>
            <blockquote>“{reviews[0]?.quote}”</blockquote>
            <footer>
              <div className="victory-quote__avatar"><span>{reviews[0]?.customer}</span></div>
              <div>
                <strong>{reviews[0]?.service}</strong>
                <small>{reviews[0]?.role} · {reviews[0]?.rank} · {reviews[0]?.date}</small>
              </div>
              <span aria-label="5 out of 5 stars">★★★★★</span>
            </footer>
          </article>

          <div className="victory-ledger forged-panel" data-forge-reveal>
            <div className="victory-ledger__head">
              <span><Eye /> Delivery ledger</span><small>Example workspace view</small>
            </div>
            <div className="victory-ledger__route">
              <div><small>Objective</small><strong>Defined scope</strong></div>
              <i><span /></i>
              <div><small>Completion</small><strong>Customer review</strong></div>
            </div>
            <ul>
              <li><span><Check /></span><p><strong>Quote confirmed</strong><small>Mode, region, and scope attached</small></p></li>
              <li><span><Check /></span><p><strong>Schedule recorded</strong><small>Updates remain in the workspace</small></p></li>
              <li><span><Swords /></span><p><strong>Milestones visible</strong><small>Progress tied to the order</small></p></li>
            </ul>
          </div>

          <div className="victory-reviews" data-forge-reveal>
            {reviews.slice(1, 3).map((review) => (
              <article key={review.id} className="victory-mini-review forged-panel">
                <div><span aria-label="5 out of 5 stars">★★★★★</span><small>{review.date}</small></div>
                <p>“{review.quote}”</p>
                <footer><strong>{review.customer}</strong><small>{review.service} · {review.role}</small></footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RosterPreview() {
  return (
    <section className="forge-section roster-preview">
      <div className="container-shell">
        <ForgeSectionHeading
          chapter="05"
          eyebrow="Verified roster"
          title={<>Choose specialists by <em>fit, not mystery.</em></>}
          description="Compare public profile details before a campaign begins. Operations then confirms compatibility for the selected rank, role, region, language, and delivery type."
          href="/boosters"
          linkLabel="Inspect the full roster"
        />

        <div className="roster-preview__grid">
          {boosters.slice(0, 3).map((booster, index) => (
            <Link
              key={booster.slug}
              href={`/boosters/${booster.slug}`}
              className="roster-card forged-card"
              data-forge-reveal
            >
              <div className="roster-card__top">
                <div className="roster-card__avatar">
                  <span>{booster.initials}</span>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                </div>
                <div>
                  <p><i /> {booster.availability}</p>
                  <h3>{booster.displayName}</h3>
                  <small>{booster.tier} specialist</small>
                </div>
                <ArrowUpRight />
              </div>

              <div className="roster-card__rank">
                <span><Medal /><small>Current rank</small><strong>{booster.currentRank}</strong></span>
                <span><Trophy /><small>Peak rank</small><strong>{booster.peakRank}</strong></span>
              </div>

              <div className="roster-card__roles">
                {booster.roles.map((role) => <span key={role}>{role}</span>)}
              </div>

              <p className="roster-card__bio">{booster.biography}</p>

              <div className="roster-card__footer">
                <span><small>Region</small><strong>{booster.region}</strong></span>
                <span><small>From</small><strong>{formatCurrency(booster.startingPrice)}</strong></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyHighground() {
  return (
    <section className="forge-section why-highground">
      <div className="container-shell why-highground__layout">
        <div className="why-highground__intro" data-forge-reveal>
          <p className="forge-kicker"><span>06</span><i /> Why Highground</p>
          <h2>A serious platform for a <em>high-risk category.</em></h2>
          <p>Clear boundaries, explicit scope, and a visible delivery system are product requirements—not decorative trust badges.</p>
          <Link href="/how-it-works" className="molten-button molten-button--secondary">
            <span>Review the platform</span><i><ArrowUpRight /></i><MoltenEdge />
          </Link>
        </div>

        <div className="why-highground__grid">
          {whyItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="why-card forged-panel" data-forge-reveal>
                <div><span>{String(index + 1).padStart(2, "0")}</span><Icon /></div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ForgeFaq() {
  return (
    <section className="forge-section forge-faq">
      <div className="container-shell forge-faq__layout">
        <div className="forge-faq__intro" data-forge-reveal>
          <p className="forge-kicker"><span>07</span><i /> Campaign intelligence</p>
          <h2>Know the rules <em>before ready check.</em></h2>
          <p>These are the questions that change eligibility, privacy, delivery, and expectations.</p>
          <div><Radio /><span><strong>Support route open</strong><small>More answers are available in the full FAQ.</small></span></div>
          <Link href="/faq">Open complete FAQ <ArrowUpRight /></Link>
        </div>

        <div className="forge-faq__list">
          {faqs.slice(0, 6).map((item, index) => (
            <details key={item.question} className="forge-faq__item" data-forge-reveal>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.question}</strong>
                <i aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiegeCta() {
  return (
    <section className="siege-cta" aria-labelledby="siege-title">
      <div className="siege-cta__terrain" aria-hidden="true" />
      <Image
        src="/media/dire-forge/heroes/ember-spirit.webp"
        alt=""
        fill
        sizes="(max-width: 760px) 100vw, 52vw"
        className="siege-cta__hero"
      />
      <div className="siege-cta__shade" aria-hidden="true" />

      <div className="container-shell siege-cta__inner">
        <div className="siege-cta__copy" data-forge-reveal>
          <p><Swords /> Final ready check</p>
          <h2 id="siege-title">Siege the Ancient.<br /> <em>Start with the route.</em></h2>
          <span>Choose the objective and let the configurator define the scope, eligibility, and live server-priced quote.</span>
          <div>
            <Link href="/pricing" className="molten-button"><span>Forge my campaign</span><i><ArrowRight /></i><MoltenEdge /></Link>
            <Link href="/services" className="molten-button molten-button--secondary"><span>Compare services</span><i><ArrowUpRight /></i><MoltenEdge /></Link>
          </div>
        </div>

        <aside className="siege-route forged-panel" data-forge-reveal aria-label="Example rank route">
          <div className="siege-route__head">
            <span><Target /> Example objective</span>
            <p><i /> Route ready</p>
          </div>
          <div className="siege-route__ranks">
            <div>
              <Image src={rankMedals.Legend.image} alt="Legend rank medal" width={86} height={86} />
              <span><small>Current</small><strong>Legend III</strong></span>
            </div>
            <i><Route /></i>
            <div>
              <Image src={rankMedals.Ancient.image} alt="Ancient rank medal" width={86} height={86} />
              <span><small>Target</small><strong>Ancient II</strong></span>
            </div>
          </div>
          <div className="siege-route__health">
            <span><small>Campaign path</small><strong>Configure to activate</strong></span>
            <i><b /></i>
          </div>
          <ul>
            <li><ShieldCheck /> Customer-operated</li>
            <li><Eye /> Progress visible</li>
            <li><Users /> Specialist matched</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
