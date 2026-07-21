import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Crosshair,
  Eye,
  LockKeyhole,
  Medal,
  Radio,
  Route,
  ShieldCheck,
  Swords,
  Target,
  Trophy
} from "lucide-react";
import { ForgeSectionHeading } from "@/components/home/forge-section-heading";
import { rankMedals } from "@/lib/data/ranks";

const trustItems = [
  {
    icon: LockKeyhole,
    label: "Account control",
    detail: "No credentials or remote access",
    secure: true
  },
  {
    icon: Route,
    label: "Exact scope",
    detail: "Medal, MMR, wins, or sessions",
    secure: false
  },
  {
    icon: Eye,
    label: "Visible progress",
    detail: "Messages and milestones attached",
    secure: false
  },
  {
    icon: Medal,
    label: "Verified roster",
    detail: "Rank, role, region, and quality checks",
    secure: true
  }
] as const;

const campaignSteps = [
  {
    number: "01",
    icon: Target,
    title: "Configure the objective",
    body: "Choose the service, current position, target scope, region, role, and delivery mode."
  },
  {
    number: "02",
    icon: Medal,
    title: "Match the specialist",
    body: "Operations checks rank, role, language, region, schedule, and party compatibility."
  },
  {
    number: "03",
    icon: Swords,
    title: "Run the campaign",
    body: "Queue on your own account, coordinate privately, and keep the scope visible from start to finish."
  },
  {
    number: "04",
    icon: Check,
    title: "Confirm each checkpoint",
    body: "Completed matches, schedule changes, messages, and delivery status remain attached to the order."
  }
] as const;

export function ForgeAtmosphere() {
  return (
    <div className="forge-atmosphere" aria-hidden="true">
      <div className="forge-atmosphere__stone" />
      <div className="forge-atmosphere__smoke" />
      <div className="forge-atmosphere__embers" />
      <svg
        className="forge-midline"
        viewBox="0 0 1000 6200"
        preserveAspectRatio="none"
        role="presentation"
      >
        <path
          className="forge-midline__bed"
          d="M490 0 C520 280 360 480 430 760 C500 1040 690 1110 625 1470 C575 1760 330 1790 390 2140 C440 2420 690 2490 655 2830 C620 3150 370 3210 430 3560 C485 3880 720 3900 650 4290 C600 4560 365 4700 430 5020 C490 5320 635 5480 520 6200"
        />
        <path
          className="forge-midline__heat"
          pathLength="1"
          d="M490 0 C520 280 360 480 430 760 C500 1040 690 1110 625 1470 C575 1760 330 1790 390 2140 C440 2420 690 2490 655 2830 C620 3150 370 3210 430 3560 C485 3880 720 3900 650 4290 C600 4560 365 4700 430 5020 C490 5320 635 5480 520 6200"
        />
        <path className="forge-midline__branch" d="M625 1470 C760 1580 805 1770 900 1910" />
        <path className="forge-midline__branch" d="M390 2140 C245 2260 210 2460 110 2570" />
        <path className="forge-midline__branch" d="M650 4290 C785 4390 820 4580 910 4720" />
      </svg>
      <span className="forge-rune forge-rune--one" />
      <span className="forge-rune forge-rune--two" />
      <span className="forge-rune forge-rune--three" />
      <span className="forge-rune forge-rune--four" />
    </div>
  );
}

export function ForgeTrustRail() {
  return (
    <section className="forge-trust-rail" aria-label="Platform protections">
      <div className="container-shell forge-trust-rail__inner">
        <p className="forge-trust-rail__label"><Radio /> Forge status <span>Ready</span></p>
        <div className="forge-trust-rail__items">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={item.secure ? "is-secure" : undefined}>
                <span><Icon /></span>
                <p><strong>{item.label}</strong><small>{item.detail}</small></p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function RankForge() {
  return (
    <section className="forge-section rank-forge" data-rank-forge>
      <div className="container-shell lava-section-shell lava-section-shell--rank">
        <ForgeSectionHeading
          chapter="01"
          eyebrow="Rank Forge"
          title={<>From current medal to <em>target territory.</em></>}
          description="Build the exact route before checkout. The configurator uses your selected medal, MMR scope, region, role, and Solo Assist or Duo Queue mode to produce the live quote."
          href="/pricing"
          linkLabel="Open full configurator"
        />

        <div className="rank-forge__grid">
          <div className="rank-forge__brief forged-panel" data-forge-reveal>
            <div className="rank-forge__brief-top">
              <span><Crosshair /> Campaign brief</span>
              <small>Configurator preview</small>
            </div>
            <h3>No vague medal package. Define every checkpoint.</h3>
            <p>
              Move by exact division or MMR amount, then confirm the queue conditions that shape eligibility and delivery.
            </p>

            <div className="rank-forge__specs">
              <div><small>Region</small><strong>EU West</strong></div>
              <div><small>Delivery</small><strong>Solo Assist</strong></div>
              <div><small>Preferred role</small><strong>Mid</strong></div>
              <div><small>Quote</small><strong>Live at checkout</strong></div>
            </div>

            <ul>
              <li><Check /> Exact medal and MMR targeting</li>
              <li><Check /> Server-aware pricing and eligibility</li>
              <li><Check /> Scope visible before payment</li>
            </ul>
          </div>

          <div className="rank-forge__console forged-panel" data-forge-reveal>
            <div className="rank-forge__console-head">
              <div>
                <span><Route /> Route 05-A</span>
                <small>Example configuration</small>
              </div>
              <p><i /> Route available</p>
            </div>

            <div className="rank-forge__medals">
              <div className="rank-forge__medal">
                <small>Current rank</small>
                <Image
                  src={rankMedals.Legend.image}
                  alt="Legend rank medal"
                  width={128}
                  height={128}
                />
                <strong>Legend III</strong>
              </div>

              <div className="rank-forge__route-line" aria-hidden="true">
                <span /><span /><span /><span /><span />
                <i><ArrowRight /></i>
              </div>

              <div className="rank-forge__medal is-target">
                <small>Target objective</small>
                <Image
                  src={rankMedals.Ancient.image}
                  alt="Ancient rank medal"
                  width={128}
                  height={128}
                />
                <strong>Ancient II</strong>
              </div>
            </div>

            <div className="rank-forge__progress">
              <div><span>Route progress</span><small>Preview only</small></div>
              <i><span /></i>
            </div>

            <Link href="/pricing" className="molten-button rank-forge__cta">
              <span>Configure my route</span><i><ArrowRight /></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CampaignFlow() {
  return (
    <section className="forge-section campaign-flow">
      <div className="container-shell lava-section-shell lava-section-shell--campaign">
        <ForgeSectionHeading
          chapter="03"
          eyebrow="Campaign protocol"
          title={<>A clear route from <em>ready check to completion.</em></>}
          description="Every stage has a defined owner, visible status, and next action. The process is built to remove the uncertainty common to informal boosting arrangements."
          href="/how-it-works"
          linkLabel="Inspect the full process"
        />

        <div className="campaign-flow__layout">
          <ol className="campaign-flow__steps">
            {campaignSteps.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.number} className="campaign-step" data-forge-reveal>
                  <div className="campaign-step__number"><span>{step.number}</span><i /></div>
                  <span className="campaign-step__icon"><Icon /></span>
                  <div><h3>{step.title}</h3><p>{step.body}</p></div>
                  <ArrowUpRight />
                </li>
              );
            })}
          </ol>

          <aside className="campaign-console forged-panel" data-forge-reveal aria-label="Example campaign workspace">
            <div className="campaign-console__top">
              <div><span><Trophy /> Campaign workspace</span><small>Example order timeline</small></div>
              <p><i /> Online</p>
            </div>

            <div className="campaign-console__route">
              <div><small>Service</small><strong>MMR Boost</strong></div>
              <div><small>Mode</small><strong>Duo Queue</strong></div>
              <div><small>Region</small><strong>North America</strong></div>
            </div>

            <div className="campaign-console__timeline">
              <div className="is-done"><span><Check /></span><p><strong>Scope confirmed</strong><small>Route and eligibility recorded</small></p></div>
              <div className="is-done"><span><Check /></span><p><strong>Specialist matched</strong><small>Role and region compatible</small></p></div>
              <div className="is-active"><span><Swords /></span><p><strong>Delivery active</strong><small>Messages and milestones visible</small></p></div>
              <div><span><ShieldCheck /></span><p><strong>Completion review</strong><small>Final progress confirmation</small></p></div>
            </div>

            <Link href="/how-it-works">View delivery protocol <ArrowUpRight /></Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
