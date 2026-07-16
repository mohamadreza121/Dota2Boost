import type { Coach, Review, ServiceDefinition } from "@/types/domain";

export const services: ServiceDefinition[] = [
  {
    slug: "live-coaching",
    eyebrow: "Live review",
    name: "Live Coaching",
    shortDescription: "Real-time guidance focused on decisions you can repeat—not instructions you forget.",
    description:
      "Work one-to-one with a verified coach while you play, review a live match, or walk through a focused scenario. Every session ends with clear priorities for your next games.",
    priceFrom: 6900,
    duration: "60–120 min",
    highlights: ["Private one-to-one session", "Session notes", "7-day follow-up chat"],
    idealFor: ["Players stuck in repeating patterns", "Role-specific decision making", "Focused live feedback"],
    sessionStructure: ["Pre-session goal check", "Live observation and coaching", "Decision review", "Personal action plan"],
    accent: "crimson"
  },
  {
    slug: "replay-analysis",
    eyebrow: "Deep review",
    name: "Replay Analysis",
    shortDescription: "A structured breakdown of the decisions, timings, and habits shaping your matches.",
    description:
      "Send a match ID and receive a coach-led review that separates isolated mistakes from repeatable patterns. Includes timestamps, priorities, and drills.",
    priceFrom: 4500,
    duration: "1–3 replays",
    highlights: ["Timestamped findings", "Written improvement brief", "Private Q&A"],
    idealFor: ["Understanding recurring losses", "Efficient asynchronous learning", "Preparing for live coaching"],
    sessionStructure: ["Context intake", "Replay review", "Pattern diagnosis", "Prioritized training plan"],
    accent: "cyan"
  },
  {
    slug: "role-mastery",
    eyebrow: "Position program",
    name: "Role Mastery",
    shortDescription: "Build the map-reading, timing, and responsibility framework for one position.",
    description:
      "A multi-session program for carry, mid, offlane, soft support, or hard support players who want a complete role framework.",
    priceFrom: 18900,
    duration: "3 sessions",
    highlights: ["Role-specific curriculum", "Replay assignments", "Weekly progress check"],
    idealFor: ["Role transitions", "Plateaued specialists", "Players seeking consistency"],
    sessionStructure: ["Baseline assessment", "Role framework", "Applied replay work", "Progress review"],
    accent: "amber"
  },
  {
    slug: "hero-mastery",
    eyebrow: "Hero program",
    name: "Hero Mastery",
    shortDescription: "Go beyond builds and learn the lane, timings, matchups, and win conditions.",
    description:
      "A focused program built around one hero or a compact pool, using matchup planning and targeted replay work.",
    priceFrom: 14900,
    duration: "2 sessions",
    highlights: ["Matchup map", "Timing checklist", "Hero-pool plan"],
    idealFor: ["Hero spammers", "New signature picks", "Tournament preparation"],
    sessionStructure: ["Pool audit", "Matchup framework", "Replay application", "Refinement plan"],
    accent: "crimson"
  },
  {
    slug: "guided-rank-improvement",
    eyebrow: "Personal program",
    name: "Guided Rank Improvement",
    shortDescription: "A measured coaching plan connecting sessions, replay work, and weekly goals.",
    description:
      "Your coach builds a personalized improvement plan around your role, time, and current weaknesses. Outcomes are tracked, but rank gains are never guaranteed.",
    priceFrom: 28900,
    duration: "4 weeks",
    highlights: ["Weekly coaching", "Progress workspace", "Ongoing coach support"],
    idealFor: ["Committed improvement", "Accountable practice", "Longer-term coaching"],
    sessionStructure: ["Baseline", "Weekly coaching", "Practice assignments", "Monthly review"],
    accent: "amber"
  },
  {
    slug: "team-coaching",
    eyebrow: "Five-player review",
    name: "Team Coaching",
    shortDescription: "Improve drafts, communication, lanes, and teamfight plans as one unit.",
    description:
      "Structured coaching for stacks and competitive teams, with a shared review and role-specific takeaways.",
    priceFrom: 21900,
    duration: "90 min",
    highlights: ["Full-team session", "Draft and comms review", "Shared playbook"],
    idealFor: ["Five-stacks", "Amateur teams", "Tournament preparation"],
    sessionStructure: ["Team intake", "Replay or scrim review", "Communication framework", "Shared action plan"],
    accent: "cyan"
  },
  {
    slug: "monthly-membership",
    eyebrow: "Ongoing support",
    name: "Monthly Membership",
    shortDescription: "A consistent coaching cadence with private chat and recurring progress reviews.",
    description:
      "Combine live coaching, replay reviews, and a persistent improvement workspace in a monthly plan.",
    priceFrom: 24900,
    duration: "Monthly",
    highlights: ["Recurring sessions", "Replay allowance", "Priority coach chat"],
    idealFor: ["Long-term development", "High-volume players", "Players who value continuity"],
    sessionStructure: ["Monthly plan", "Recurring sessions", "Async reviews", "Progress report"],
    accent: "amber"
  }
];

export const coaches: Coach[] = [
  {
    slug: "northstar",
    displayName: "Northstar",
    initials: "NS",
    currentRank: "Immortal 1,420",
    peakRank: "Immortal 780",
    rating: 4.98,
    reviewCount: 86,
    sessions: 312,
    roles: ["Carry", "Mid"],
    specialties: ["Tempo", "Laning", "Map pressure"],
    coachingTypes: ["Live Coaching", "Replay Analysis", "Role Mastery"],
    languages: ["English", "French"],
    region: "North America",
    timeZone: "America/Toronto",
    availability: "Today",
    startingPrice: 7900,
    tier: "Elite",
    biography: "A calm, systems-first coach who turns difficult matches into a short list of repeatable decisions.",
    coachingStyle: "Direct, analytical, and encouraging. Sessions use questions first, then targeted corrections."
  },
  {
    slug: "aegis",
    displayName: "Aegis",
    initials: "AE",
    currentRank: "Immortal 2,080",
    peakRank: "Immortal 1,105",
    rating: 4.96,
    reviewCount: 64,
    sessions: 227,
    roles: ["Offlane", "Soft Support"],
    specialties: ["Initiation", "Vision", "Teamfights"],
    coachingTypes: ["Live Coaching", "Replay Analysis", "Team Coaching"],
    languages: ["English", "Spanish"],
    region: "Europe West",
    timeZone: "Europe/Madrid",
    availability: "Tomorrow",
    startingPrice: 6900,
    tier: "Master",
    biography: "Specializes in space creation and teamfight clarity for players who feel active but struggle to convert pressure.",
    coachingStyle: "Collaborative and visual, with short checkpoints and specific replay assignments."
  },
  {
    slug: "lantern",
    displayName: "Lantern",
    initials: "LA",
    currentRank: "Immortal 3,410",
    peakRank: "Immortal 1,890",
    rating: 4.94,
    reviewCount: 51,
    sessions: 184,
    roles: ["Hard Support", "Soft Support"],
    specialties: ["Lane equilibrium", "Warding", "Shotcalling"],
    coachingTypes: ["Replay Analysis", "Role Mastery", "Live Coaching"],
    languages: ["English", "Mandarin"],
    region: "Southeast Asia",
    timeZone: "Asia/Singapore",
    availability: "This week",
    startingPrice: 5900,
    tier: "Pro",
    biography: "Helps support players build impact they can measure through lane plans, information, and fight preparation.",
    coachingStyle: "Patient and structured, with an emphasis on decision triggers rather than rigid rules."
  },
  {
    slug: "vector",
    displayName: "Vector",
    initials: "VE",
    currentRank: "Immortal 980",
    peakRank: "Immortal 420",
    rating: 4.99,
    reviewCount: 104,
    sessions: 405,
    roles: ["Mid", "Carry"],
    specialties: ["Matchups", "Mechanics", "Closing games"],
    coachingTypes: ["Live Coaching", "Hero Mastery", "Guided Rank Improvement"],
    languages: ["English", "German"],
    region: "Europe West",
    timeZone: "Europe/Berlin",
    availability: "Limited",
    startingPrice: 9900,
    tier: "Elite",
    biography: "High-intensity specialist for experienced players who want detailed matchup work and cleaner conversions.",
    coachingStyle: "Precise and demanding without being dismissive; best for players who enjoy detailed review."
  }
];

export const reviews: Review[] = [
  {
    id: "review-1",
    customer: "M.K.",
    coach: "Northstar",
    rating: 5,
    service: "Live Coaching",
    role: "Carry",
    rank: "Legend",
    quote: "I stopped treating every loss as a mechanical problem. The three priorities from our session changed how I read the first fifteen minutes.",
    date: "June 2026",
    verified: true
  },
  {
    id: "review-2",
    customer: "Ari P.",
    coach: "Lantern",
    rating: 5,
    service: "Replay Analysis",
    role: "Hard Support",
    rank: "Ancient",
    quote: "The timestamps were useful, but the real value was understanding why the same positioning mistake kept happening before fights.",
    date: "May 2026",
    verified: true
  },
  {
    id: "review-3",
    customer: "Jon C.",
    coach: "Aegis",
    rating: 5,
    service: "Role Mastery",
    role: "Offlane",
    rank: "Divine",
    quote: "Clear, professional, and honest. No promises—just a plan I could actually follow and review each week.",
    date: "May 2026",
    verified: true
  }
];

export const faqs = [
  {
    question: "Do you ever need my Steam password or login code?",
    answer: "No. Highground never asks for, collects, transmits, or stores Steam credentials, authentication codes, or recovery codes. You remain in control of your own account at all times."
  },
  {
    question: "Does coaching guarantee MMR or a specific rank?",
    answer: "No. Coaching can improve your process, understanding, and practice quality, but results depend on many factors and no rank or MMR outcome is guaranteed."
  },
  {
    question: "How is a coach verified?",
    answer: "Applicants complete identity, rank, communication, and coaching-quality checks. Approved coaches remain subject to customer feedback and internal quality review."
  },
  {
    question: "What happens after I pay?",
    answer: "A private workspace is created and our team assigns an eligible coach. You can then message, share a match ID, schedule sessions, and track deliverables in one place."
  },
  {
    question: "Can I reschedule a session?",
    answer: "Yes, subject to the notice window shown during booking. Your workspace keeps both time zones visible and records reschedule requests."
  },
  {
    question: "How do refunds work?",
    answer: "Eligibility depends on service progress, coach work already delivered, and the current Refund Policy. Support reviews each eligible request and can issue full or partial refunds."
  },
  {
    question: "Which regions and languages are supported?",
    answer: "Coach coverage varies by time zone and language. The marketplace shows each coach’s region, languages, and current availability before you book."
  },
  {
    question: "When is coach payment released?",
    answer: "Coach payment is released after the service is completed and the applicable review period has passed. Initial payouts may be handled manually while the platform’s payout program is reviewed."
  }
];
