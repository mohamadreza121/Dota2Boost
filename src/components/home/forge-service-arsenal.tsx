import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Crosshair,
  GraduationCap,
  Radio,
  Route,
  ShieldCheck,
  Swords,
  Target,
  Trophy
} from "lucide-react";
import { ForgeSectionHeading } from "@/components/home/forge-section-heading";
import { services } from "@/lib/data/content";
import { rankMedals } from "@/lib/data/ranks";
import { formatCurrency } from "@/lib/utils";

const serviceBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service])
);

function ServicePrice({ slug }: { slug: string }) {
  const service = serviceBySlug[slug];
  if (!service) return null;

  return (
    <span className="arsenal-card__price">
      <small>Starting at</small>
      <strong>{formatCurrency(service.priceFrom)}</strong>
      <i>CAD</i>
    </span>
  );
}

export function ServiceArsenal() {
  const mmr = serviceBySlug["mmr-boost"];
  const calibration = serviceBySlug["mmr-calibration"];
  const coaching = serviceBySlug.coaching;
  const wins = serviceBySlug["win-boost"];
  const behavior = serviceBySlug["behavior-score-boost"];

  return (
    <section className="forge-section service-arsenal">
      <div className="container-shell lava-section-shell lava-section-shell--arsenal">
        <ForgeSectionHeading
          chapter="02"
          eyebrow="Service Arsenal"
          title={<>Five contracts. <em>One command system.</em></>}
          description="MMR Boost remains the primary route, supported by calibration, fixed assisted wins, behavior-score recovery, and focused coaching. Every card reflects the actual configurable scope."
          href="/services"
          linkLabel="Compare every contract"
        />

        <div className="service-arsenal__grid">
          <Link
            href="/services/mmr-boost"
            className="arsenal-card arsenal-card--mmr forged-card"
            data-forge-reveal
          >
            <Image
              src="/media/dire-forge/heroes/doom.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 100vw, 58vw"
              className="arsenal-card__hero"
            />
            <div className="arsenal-card__shade" />

            <div className="arsenal-card__topline">
              <p><span>01</span><Route /> Primary contract</p>
              <span className="arsenal-card__status"><i /> Route available</span>
            </div>

            <div className="arsenal-card__content">
              <p className="arsenal-card__unit">Exact medal and MMR route</p>
              <h3>{mmr?.name ?? "MMR Boost"}</h3>
              <p>{mmr?.shortDescription}</p>

              <div className="arsenal-card__rank-route">
                <div>
                  <Image src={rankMedals.Legend.image} alt="Legend rank medal" width={72} height={72} />
                  <span><small>Current rank</small><strong>Legend III</strong></span>
                </div>
                <i><span /><span /><span /><ArrowUpRight /></i>
                <div>
                  <Image src={rankMedals.Ancient.image} alt="Ancient rank medal" width={72} height={72} />
                  <span><small>Target rank</small><strong>Ancient II</strong></span>
                </div>
              </div>

              <div className="arsenal-card__settings">
                <span><small>Region</small><strong>Selectable</strong></span>
                <span><small>Mode</small><strong>Solo / Duo</strong></span>
                <span><small>Role</small><strong>Selectable</strong></span>
              </div>
            </div>

            <div className="arsenal-card__footer">
              <ServicePrice slug="mmr-boost" />
              <span className="arsenal-card__open">Forge MMR route <ArrowUpRight /></span>
            </div>
          </Link>

          <Link
            href="/services/mmr-calibration"
            className="arsenal-card arsenal-card--calibration forged-card"
            data-forge-reveal
          >
            <Image
              src="/media/dire-forge/heroes/shadow-fiend.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 100vw, 42vw"
              className="arsenal-card__hero"
            />
            <div className="arsenal-card__shade" />

            <div className="arsenal-card__topline">
              <p><span>02</span><Crosshair /> Calibration block</p>
              <Radio />
            </div>
            <div className="arsenal-card__content">
              <p className="arsenal-card__unit">Fresh or returning ranked players</p>
              <h3>{calibration?.name ?? "MMR Calibration"}</h3>
              <p>{calibration?.shortDescription}</p>
              <div className="calibration-blocks">
                <span><strong>5</strong><small>matches</small></span>
                <i>or</i>
                <span><strong>10</strong><small>matches</small></span>
              </div>
            </div>
            <div className="arsenal-card__footer">
              <ServicePrice slug="mmr-calibration" />
              <span className="arsenal-card__open">Open block <ArrowUpRight /></span>
            </div>
          </Link>

          <Link
            href="/services/coaching"
            className="arsenal-card arsenal-card--coaching forged-card"
            data-forge-reveal
          >
            <Image
              src="/media/dire-forge/heroes/lina.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 100vw, 42vw"
              className="arsenal-card__hero"
            />
            <div className="arsenal-card__shade" />

            <div className="arsenal-card__topline">
              <p><span>03</span><GraduationCap /> Tactical training</p>
              <Target />
            </div>
            <div className="arsenal-card__content">
              <p className="arsenal-card__unit">Replay, role, hero pool, or decisions</p>
              <h3>{coaching?.name ?? "Dota 2 Coaching"}</h3>
              <p>{coaching?.shortDescription}</p>
              <div className="coaching-board" aria-hidden="true">
                <div><i /><i /><i /><i /></div>
                <span><small>Replay timeline</small><i><b /></i></span>
              </div>
            </div>
            <div className="arsenal-card__footer">
              <ServicePrice slug="coaching" />
              <span className="arsenal-card__open">Book a session <ArrowUpRight /></span>
            </div>
          </Link>

          <Link
            href="/services/win-boost"
            className="arsenal-card arsenal-card--wins forged-card"
            data-forge-reveal
          >
            <Image
              src="/media/dire-forge/heroes/dragon-knight.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              className="arsenal-card__hero"
            />
            <div className="arsenal-card__shade" />
            <div className="arsenal-card__topline">
              <p><span>04</span><Trophy /> Fixed-win contract</p>
            </div>
            <div className="arsenal-card__compact-content">
              <div><small>Package scope</small><strong>3–20 assisted wins</strong></div>
              <h3>{wins?.name ?? "Win Boost"}</h3>
              <ul><li><Check /> Duo Queue</li><li><Check /> Match updates</li></ul>
            </div>
            <div className="arsenal-card__footer">
              <ServicePrice slug="win-boost" />
              <span className="arsenal-card__open">Select wins <ArrowUpRight /></span>
            </div>
          </Link>

          <Link
            href="/services/behavior-score-boost"
            className="arsenal-card arsenal-card--behavior forged-card"
            data-forge-reveal
          >
            <Image
              src="/media/dire-forge/heroes/ember-spirit.webp"
              alt=""
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              className="arsenal-card__hero"
            />
            <div className="arsenal-card__shade" />
            <div className="arsenal-card__topline">
              <p><span>05</span><ShieldCheck /> Conduct recovery</p>
            </div>
            <div className="arsenal-card__compact-content">
              <div><small>Recovery scope</small><strong>500–6,000 score</strong></div>
              <h3>{behavior?.name ?? "Behavior Score Boost"}</h3>
              <ul><li><Check /> Queue plan</li><li><Check /> Score checkpoints</li></ul>
            </div>
            <div className="arsenal-card__footer">
              <ServicePrice slug="behavior-score-boost" />
              <span className="arsenal-card__open">Build recovery <ArrowUpRight /></span>
            </div>
          </Link>
        </div>

        <div className="service-arsenal__note" data-forge-reveal>
          <Swords />
          <p><strong>Customer-operated delivery.</strong> Solo Assist and Duo Queue keep you at the controls. No Steam credentials or remote access are requested.</p>
          <Link href="/legal/disclaimer">Review service disclaimer <ArrowUpRight /></Link>
        </div>
      </div>
    </section>
  );
}
