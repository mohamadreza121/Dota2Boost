import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Check,
  ClipboardCheck,
  Crosshair,
  Eye,
  Gamepad2,
  GraduationCap,
  Layers3,
  Map,
  MessageSquare,
  MousePointer2,
  PlayCircle,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Video,
  Waves
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { boosters, services } from "@/lib/data/content";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Radiant Academy — Private Dota 2 Coaching",
  description:
    "Build a personalized Dota 2 improvement plan through replay analysis, live coaching, role mastery, hero-pool development, and measurable practice missions.",
  alternates: { canonical: "/services/coaching" },
  openGraph: {
    title: "Radiant Academy — Private Dota 2 Coaching",
    description:
      "Your rank is the symptom. Radiant Academy finds the habits, decisions, and knowledge gaps holding back your climb."
  }
};

const coachingService = services.find((service) => service.slug === "coaching")!;
const coachingProfiles = boosters.filter((booster) =>
  booster.boostingTypes.includes("Dota 2 Coaching")
);

const diagnosticAreas = [
  {
    icon: Crosshair,
    title: "Laning",
    body: "Trading, creep control, matchup plans, lane equilibrium, and the decisions that shape your first ten minutes."
  },
  {
    icon: MousePointer2,
    title: "Mechanics",
    body: "Spell usage, camera control, movement, targeting, item execution, and repeatable mechanical habits."
  },
  {
    icon: Waves,
    title: "Farming efficiency",
    body: "Last hits, lane-to-jungle routes, dangerous farm, recovery patterns, and converting space into net worth."
  },
  {
    icon: Map,
    title: "Map awareness",
    body: "Information gathering, missing-hero reads, objective timing, vision use, and predicting where pressure moves next."
  },
  {
    icon: Brain,
    title: "Decision-making",
    body: "When to fight, farm, rotate, pressure, disengage, buy back, or trade an objective instead of forcing a bad play."
  },
  {
    icon: Route,
    title: "Positioning",
    body: "Where you stand before, during, and after engagements—and how positioning changes by role, hero, and threat."
  },
  {
    icon: Layers3,
    title: "Draft and hero pool",
    body: "Hero identity, matchup coverage, role flexibility, reliable comfort picks, and removing unnecessary complexity."
  },
  {
    icon: ShieldCheck,
    title: "Mental discipline",
    body: "Tilt control, communication, decision reset, queue preparation, and separating controllable mistakes from noise."
  }
] as const;

const coachingPrograms = [
  {
    icon: Video,
    label: "See the pattern",
    title: "Replay Analysis",
    description:
      "A coach reviews one or more matches, isolates the mistakes that repeat, and explains the stronger decision available at each turning point.",
    bestFor: "Players who know something is wrong but cannot identify the cause.",
    includes: ["Timestamped review", "Priority mistake list", "Written practice plan"]
  },
  {
    icon: MessageSquare,
    label: "Think in real time",
    title: "Live Coaching",
    description:
      "Play on your own account while a coach observes your information, choices, communication, and execution as the match develops.",
    bestFor: "Players who understand concepts but struggle to apply them under pressure.",
    includes: ["Live observation", "Decision checkpoints", "Post-match debrief"]
  },
  {
    icon: Gamepad2,
    label: "Own your position",
    title: "Role Mastery",
    description:
      "Build a role-specific system for lane priorities, map movement, timings, teamfight responsibilities, and late-game execution.",
    bestFor: "Players committed to improving in Position 1, 2, 3, 4, or 5.",
    includes: ["Role checklist", "Timing framework", "Matchup priorities"]
  },
  {
    icon: Sparkles,
    label: "Refine the pool",
    title: "Hero Mastery",
    description:
      "Turn a scattered hero pool into a focused set of picks with clear jobs, matchup coverage, build logic, and repeatable game plans.",
    bestFor: "One-hero specialists and players who constantly change picks without progressing.",
    includes: ["Hero-pool audit", "Matchup notes", "Build and timing guide"]
  },
  {
    icon: Trophy,
    label: "Break the plateau",
    title: "Rank Breakthrough",
    description:
      "Target the specific habits keeping you inside one medal bracket and build a short improvement cycle around the highest-impact corrections.",
    bestFor: "Players stuck at the same medal despite playing consistently.",
    includes: ["Plateau diagnosis", "Focused match missions", "Checkpoint review"]
  },
  {
    icon: Users,
    label: "Play as one unit",
    title: "Team Coordination Review",
    description:
      "Review a party or amateur team through drafting, lane structure, communication, objective calls, fight setup, and responsibility clarity.",
    bestFor: "Stacks preparing for leagues, tournaments, or more disciplined ranked play.",
    includes: ["Team replay review", "Communication map", "Role responsibility plan"]
  }
] as const;

const skillBranches = [
  {
    icon: MousePointer2,
    title: "Mechanics",
    body: "Execution that stays reliable when the game becomes fast.",
    drills: ["Spell and item sequencing", "Camera and targeting", "Last-hit consistency"]
  },
  {
    icon: Waves,
    title: "Lane Control",
    body: "Create advantages before the map fully opens.",
    drills: ["Aggro and equilibrium", "Trading windows", "Power-spike planning"]
  },
  {
    icon: Eye,
    title: "Game Sense",
    body: "Read what is likely to happen before it appears on screen.",
    drills: ["Threat tracking", "Missing-hero logic", "Cooldown awareness"]
  },
  {
    icon: Map,
    title: "Map Control",
    body: "Turn information and movement into safe pressure.",
    drills: ["Farm routes", "Objective setup", "Vision and lane pressure"]
  },
  {
    icon: Swords,
    title: "Teamfights",
    body: "Understand your job before committing to the fight.",
    drills: ["Target priority", "Positioning layers", "Entry and disengage timing"]
  },
  {
    icon: Brain,
    title: "Mental Game",
    body: "Keep decision quality stable across difficult matches.",
    drills: ["Tilt interruption", "Communication discipline", "Post-loss reset"]
  }
] as const;

const sessionJourney = [
  {
    title: "Define the objective",
    body: "Tell us your role, medal or MMR, hero pool, recurring problem, and what you want to understand better."
  },
  {
    title: "Build the player diagnosis",
    body: "A replay, match ID, or live observation is used to separate surface mistakes from the habits causing them."
  },
  {
    title: "Match the coach",
    body: "We compare role, heroes, region, language, schedule, rank, and preferred teaching style before assignment."
  },
  {
    title: "Run the session",
    body: "Your coach explains the strongest corrections, demonstrates the underlying concept, and tests your understanding."
  },
  {
    title: "Assign practice missions",
    body: "You leave with a small set of measurable match objectives instead of an overwhelming list of general advice."
  },
  {
    title: "Review the next checkpoint",
    body: "Multi-session plans compare new replays against the original diagnosis and update the next training priority."
  }
] as const;

const progressSignals = [
  {
    title: "Lane conversion",
    body: "Track whether lane advantages become useful farm, pressure, objectives, or rotations instead of disappearing."
  },
  {
    title: "Farm efficiency",
    body: "Compare last hits, downtime, route safety, recovery speed, and how often farm choices match the game state."
  },
  {
    title: "Avoidable deaths",
    body: "Separate necessary risk from deaths caused by missing information, greed, positioning, or late decisions."
  },
  {
    title: "Objective timing",
    body: "Review when your team could pressure towers, Roshan, Tormentors, runes, or map control after a successful play."
  },
  {
    title: "Fight responsibility",
    body: "Measure whether you identify the correct target, threat, position, spell timing, and exit condition for your role."
  },
  {
    title: "Repeated mistakes",
    body: "The clearest progress signal: mistakes identified in the first diagnosis appear less often in later replays."
  }
] as const;

const coachingFaqs = [
  {
    question: "Should I choose replay analysis or live coaching?",
    answer:
      "Replay analysis is best for finding patterns across completed games. Live coaching is best for seeing how you process information and make decisions under real match pressure. A development plan may use both."
  },
  {
    question: "Can beginners use Radiant Academy?",
    answer:
      "Yes. Coaching can begin with fundamentals, role selection, basic lane structure, camera habits, item logic, and a manageable hero pool. The plan should match your current understanding—not assume advanced knowledge."
  },
  {
    question: "Can I request a specific coach?",
    answer:
      "You can state a preference. Final matching also depends on role expertise, hero knowledge, language, region, schedule, teaching style, and availability."
  },
  {
    question: "What should I prepare before a session?",
    answer:
      "Bring your current medal or MMR, main role, preferred heroes, one or more recent match IDs or replay files, and a short description of what feels hardest during your games."
  },
  {
    question: "Do you need access to my Steam account?",
    answer:
      "No. You play on your own account. Radiant Academy does not request passwords, Steam Guard codes, recovery codes, authentication cookies, or remote access."
  },
  {
    question: "Will coaching guarantee a higher rank?",
    answer:
      "No. Coaching provides diagnosis, instruction, practice structure, and progress review. Matchmaking and results vary, and improvement depends on how consistently the plan is applied."
  }
] as const;

function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display-type mt-6 text-balance text-5xl font-black uppercase md:text-7xl">
        {title}
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-8 text-mist">{description}</p>
    </div>
  );
}

export default function CoachingPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Radiant Academy Dota 2 Coaching",
    description:
      "Private Dota 2 coaching with player diagnosis, replay analysis, live coaching, role mastery, practice missions, and progress reviews.",
    provider: { "@type": "Organization", name: "Highground Boosting" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: coachingService.priceFrom / 100
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: coachingFaqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/[0.07] py-20 md:py-28">
        <div aria-hidden="true" className="hero-poster absolute inset-0 opacity-15" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,#070909_20%,rgb(7_9_9_/_0.78),#070909)]"
        />

        <div className="container-shell relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <Badge tone="cyan">
              <GraduationCap className="mr-1.5 size-3.5" /> Radiant Academy
            </Badge>
            <h1 className="display-type mt-6 max-w-5xl text-balance text-[clamp(4.2rem,10vw,8.7rem)] font-black uppercase leading-[0.86]">
              Your rank is the symptom. We find the cause.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-mist">
              Private Dota 2 coaching built around diagnosis, deliberate practice, and repeatable decision-making—not generic tips or someone else playing the game for you.
            </p>
            <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-[#cfd8d4]">
              We do not play the game for you. We teach you how to control it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/pricing" arrow>
                Book a coaching plan
              </LinkButton>
              <LinkButton href="#academy-programs" variant="secondary">
                Explore programs
              </LinkButton>
            </div>
          </div>

          <aside className="surface rounded-[1.8rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-bold tracking-[0.14em] text-mist uppercase">
                  Academy intake
                </p>
                <p className="mt-2 text-3xl font-black">
                  {formatCurrency(coachingService.priceFrom)}
                  <span className="ml-2 text-sm font-normal text-mist">CAD</span>
                </p>
              </div>
              <Badge tone="gold">From</Badge>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                ["Session scope", "1–8 private sessions"],
                ["Primary formats", "Replay or live coaching"],
                ["Matching", "Role, region, language, style"],
                ["Takeaway", "Written improvement plan"]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-5 border-b border-white/[0.08] pb-3 text-sm"
                >
                  <span className="text-mist">{label}</span>
                  <strong className="text-right text-xs">{value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-cyan/15 bg-cyan/[0.05] p-4 text-xs leading-5 text-[#aeb9b7]">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-cyan" />
              <p>Your account stays under your control. No credentials or remote access are needed.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-[#0b0d0d] py-8">
        <div className="container-shell grid gap-4 md:grid-cols-3">
          {[
            [Search, "Diagnose the real bottleneck"],
            [Target, "Train one priority at a time"],
            [ClipboardCheck, "Measure the next checkpoint"]
          ].map(([Icon, label]) => {
            const ItemIcon = Icon as typeof Search;
            return (
              <div key={label as string} className="flex items-center gap-3 text-sm font-bold">
                <span className="grid size-10 place-items-center rounded-full border border-cyan/20 bg-cyan/[0.06]">
                  <ItemIcon className="size-4 text-cyan" />
                </span>
                {label as string}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-pad container-shell">
        <SectionHeading
          eyebrow="Player diagnosis"
          title="Understand why the same games keep happening."
          description="Your medal only reports the outcome. The diagnosis examines the decisions, habits, mechanics, and knowledge gaps producing that outcome."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {diagnosticAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article key={area.title} className="surface rounded-2xl p-5">
                <Icon className="size-5 text-cyan" />
                <h3 className="mt-6 text-lg font-black">{area.title}</h3>
                <p className="mt-3 text-sm leading-6 text-mist">{area.body}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 rounded-[1.8rem] border border-white/[0.08] bg-black/20 p-6 lg:grid-cols-[.8fr_1.2fr] lg:p-8">
          <div>
            <p className="text-[0.62rem] font-bold tracking-[0.14em] text-cyan uppercase">
              The output
            </p>
            <h3 className="mt-3 text-3xl font-black">Your personal improvement map.</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "The highest-impact weakness to fix first",
              "Mistakes to stop repeating",
              "Practice drills for your role and heroes",
              "Match objectives for the next queue block",
              "A focused hero-pool recommendation",
              "The next replay checkpoint to review"
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm leading-6 text-[#cbd2cf]">
                <Check className="mt-1 size-4 shrink-0 text-cyan" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="academy-programs" className="border-y border-white/[0.07] bg-[#0b0d0d] py-20 md:py-28">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Coaching programs"
            title="Choose the training format that matches the problem."
            description="A player stuck because of replay blindness needs a different session from a player who knows the theory but loses clarity during live matches."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {coachingPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <article key={program.title} className="surface rounded-[1.8rem] p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <span className="grid size-12 place-items-center rounded-xl border border-cyan/20 bg-cyan/[0.06]">
                      <Icon className="size-5 text-cyan" />
                    </span>
                    <span className="text-[0.58rem] font-bold tracking-[0.14em] text-mist uppercase">
                      {program.label}
                    </span>
                  </div>
                  <h3 className="mt-7 text-3xl font-black">{program.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-mist">{program.description}</p>
                  <p className="mt-5 border-l-2 border-cyan/30 pl-4 text-xs font-semibold leading-6 text-[#cdd5d1]">
                    Best for: {program.bestFor}
                  </p>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                    {program.includes.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl border border-white/[0.08] bg-black/20 p-3 text-xs font-semibold"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad container-shell">
        <SectionHeading
          eyebrow="Radiant skill tree"
          title="Build the player, not only the current rank."
          description="Every plan draws from six connected branches. Your coach prioritizes the branches producing the largest improvement instead of trying to train everything at once."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skillBranches.map((branch, index) => {
            const Icon = branch.icon;
            return (
              <article key={branch.title} className="surface rounded-[1.8rem] p-6">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-full border border-white/[0.1] bg-black/20">
                    <Icon className="size-5 text-cyan" />
                  </span>
                  <span className="text-xs font-black text-mist">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-2xl font-black">{branch.title}</h3>
                <p className="mt-3 text-sm leading-6 text-mist">{branch.body}</p>
                <ul className="mt-6 space-y-3 border-t border-white/[0.08] pt-5">
                  {branch.drills.map((drill) => (
                    <li key={drill} className="flex items-center gap-3 text-xs font-semibold">
                      <span className="size-1.5 rounded-full bg-cyan" />
                      {drill}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0b0d0d] py-20 md:py-28">
        <div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <SectionHeading
              eyebrow="Session journey"
              title="Observe. Diagnose. Train. Apply. Review."
              description="Every stage should answer one question: what does the player need to do differently in the next match?"
            />
            <LinkButton href="/pricing" className="mt-8" arrow>
              Configure sessions
            </LinkButton>
          </div>

          <ol className="space-y-4">
            {sessionJourney.map((step, index) => (
              <li
                key={step.title}
                className="surface grid gap-4 rounded-2xl p-5 sm:grid-cols-[52px_1fr_auto] sm:items-center"
              >
                <span className="grid size-11 place-items-center rounded-full border border-cyan/20 bg-cyan/[0.06] text-xs font-black text-cyan">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-black">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-mist">{step.body}</p>
                </div>
                <ArrowRight className="hidden size-4 text-mist sm:block" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad container-shell">
        <SectionHeading
          eyebrow="Coach matching"
          title="Learn from someone who understands your battlefield."
          description="The best coach is not simply the highest-ranked player. The match must fit your role, heroes, communication needs, region, schedule, and current learning objective."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
          <div className="surface rounded-[1.8rem] p-6">
            <p className="text-xs font-black tracking-[0.12em] text-cyan uppercase">
              Matching considers
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Primary and secondary role",
                "Hero pool and matchup needs",
                "Current and peak rank",
                "Region and time zone",
                "Language and communication style",
                "Replay, live, or team-review format"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/[0.08] pb-3 text-sm">
                  <Check className="size-4 shrink-0 text-cyan" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {coachingProfiles.length > 0 ? (
              coachingProfiles.map((coach) => (
                <article key={coach.slug} className="surface rounded-[1.8rem] p-6 sm:p-7">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="grid size-20 shrink-0 place-items-center rounded-2xl border border-cyan/20 bg-cyan/[0.06] text-xl font-black text-cyan">
                      {coach.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.58rem] font-bold tracking-[0.13em] text-cyan uppercase">
                            {coach.tier} coaching profile
                          </p>
                          <h3 className="mt-2 text-3xl font-black">{coach.displayName}</h3>
                          <p className="mt-1 text-xs text-mist">
                            {coach.currentRank} · Peak {coach.peakRank}
                          </p>
                        </div>
                        <Badge tone="cyan">{coach.availability}</Badge>
                      </div>

                      <p className="mt-5 text-sm leading-7 text-mist">{coach.biography}</p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {[...coach.roles, ...coach.specialties].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/[0.09] bg-black/20 px-3 py-1.5 text-[0.62rem] font-bold"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
                        <p className="text-xs text-mist">
                          {coach.region} · {coach.languages.join(" / ")}
                        </p>
                        <Link
                          href={`/boosters/${coach.slug}`}
                          className="inline-flex items-center gap-2 text-xs font-black text-cyan"
                        >
                          Open full profile <ArrowUpRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="surface rounded-[1.8rem] p-8">
                <p className="text-sm leading-7 text-mist">
                  Coaching profiles are matched after the intake is reviewed. Available options depend on role, region, language, and schedule.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0b0d0d] py-20 md:py-28">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Student results"
            title="Progress evidence, not miracle claims."
            description="Radiant Academy tracks changes visible in your own matches and replays. Rank may follow improvement, but the coaching record focuses on decisions and habits you can actually control."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {progressSignals.map((signal) => (
              <article key={signal.title} className="surface rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-black">{signal.title}</h3>
                  <PlayCircle className="size-4 text-cyan" />
                </div>
                <p className="mt-4 text-sm leading-6 text-mist">{signal.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 rounded-[1.8rem] border border-cyan/15 bg-cyan/[0.04] p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
            <div>
              <p className="text-[0.62rem] font-bold tracking-[0.14em] text-cyan uppercase">
                Every completed plan
              </p>
              <h3 className="mt-3 text-2xl font-black">Leaves you knowing what to practice next.</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-mist">
                Your report records the diagnosis, session focus, assigned missions, and next checkpoint so the work continues after the call ends.
              </p>
            </div>
            <ClipboardCheck className="size-12 text-cyan" />
          </div>
        </div>
      </section>

      <section className="section-pad container-shell">
        <SectionHeading
          eyebrow="Choose your path"
          title="One diagnosis or a complete development cycle."
          description="Start with a single focused session or use a multi-session block to apply the plan, submit new replays, and refine the next priority."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            {
              label: "01 session",
              title: "Diagnostic Session",
              body: "Identify the central problem and leave with a clear correction plan.",
              items: ["Goal and replay intake", "Focused private session", "Written action plan"]
            },
            {
              label: "02–04 sessions",
              title: "Development Sprint",
              body: "Diagnose, apply the plan across real matches, and review the first checkpoint.",
              items: ["Initial diagnosis", "Practice missions", "Follow-up replay review"]
            },
            {
              label: "06–08 sessions",
              title: "Mastery Path",
              body: "Build a longer role, hero, or rank-breakthrough program with repeated checkpoints.",
              items: ["Full skill-tree plan", "Multiple review cycles", "Updated progression report"]
            }
          ].map((path, index) => (
            <article
              key={path.title}
              className={`surface rounded-[1.8rem] p-6 ${index === 1 ? "border-cyan/25" : ""}`}
            >
              <Badge tone={index === 1 ? "cyan" : "neutral"}>{path.label}</Badge>
              <h3 className="mt-6 text-3xl font-black">{path.title}</h3>
              <p className="mt-4 text-sm leading-7 text-mist">{path.body}</p>
              <ul className="mt-7 space-y-3 border-t border-white/[0.08] pt-6">
                {path.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-semibold">
                    <Check className="size-4 text-cyan" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-[1.8rem] border border-white/[0.08] bg-black/20 p-6 sm:flex-row sm:items-center lg:p-8">
          <div>
            <p className="text-sm text-mist">Private coaching packages start at</p>
            <p className="mt-2 text-4xl font-black">
              {formatCurrency(coachingService.priceFrom)}
              <span className="ml-2 text-sm font-normal text-mist">CAD</span>
            </p>
          </div>
          <LinkButton href="/pricing" arrow>
            Configure coaching
          </LinkButton>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0b0d0d] py-20 md:py-28">
        <div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <SectionHeading
            eyebrow="Coaching FAQ"
            title="Know the plan before the first session."
            description="The intake should make the format, expectations, preparation, and account boundaries clear before a coach is assigned."
          />

          <div className="space-y-3">
            {coachingFaqs.map((item, index) => (
              <details key={item.question} className="surface group rounded-2xl p-5">
                <summary className="flex cursor-pointer list-none items-center gap-4">
                  <span className="text-xs font-black text-cyan">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="flex-1 text-sm sm:text-base">{item.question}</strong>
                  <span className="grid size-7 place-items-center rounded-full border border-white/[0.1] text-lg text-mist transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-5 border-t border-white/[0.08] pt-5 text-sm leading-7 text-mist">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-20 text-center md:py-28">
        <Badge tone="cyan">Radiant Academy intake</Badge>
        <h2 className="display-type mx-auto mt-6 max-w-5xl text-balance text-5xl font-black uppercase md:text-8xl">
          Stop repeating matches. Start building the player.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-mist">
          Choose your session count, role, region, language, coach tier, and preferred heroes. Your exact training objective is confirmed before assignment.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/pricing" arrow>
            Book Radiant Academy
          </LinkButton>
          <LinkButton href="/boosters" variant="secondary">
            Browse specialists
          </LinkButton>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
