import type { Booster, Review, ServiceDefinition } from "@/types/domain";

export const services: ServiceDefinition[] = [
  {
    slug: "rank-boost",
    eyebrow: "Most popular",
    name: "Rank Boost",
    shortDescription: "Queue with a verified high-MMR booster and turn a rank target into a tracked self-play plan.",
    description:
      "A structured party-queue boost for customers who stay in control of their own account and play every match. We match region, role, language, rank compatibility, and schedule before delivery begins.",
    priceFrom: 7900,
    duration: "3–20 wins",
    highlights: ["Customer-controlled gameplay", "Verified party teammate", "Live progress tracking"],
    idealFor: ["Breaking a rank plateau", "Reliable party coordination", "A clearly scoped win target"],
    sessionStructure: ["Rank and region check", "Booster assignment", "Scheduled party queue", "Milestone review"],
    accent: "crimson"
  },
  {
    slug: "win-boost",
    eyebrow: "Fixed outcome scope",
    name: "Win Boost",
    shortDescription: "Buy a defined set of assisted party wins with transparent status and no account hand-off.",
    description:
      "Choose a win package and play alongside an eligible booster. Each completed match is logged in your private workspace, with support available throughout the order.",
    priceFrom: 4900,
    duration: "3–20 wins",
    highlights: ["Fixed win package", "Match-by-match updates", "Flexible scheduling"],
    idealFor: ["Short ranked pushes", "Recovering momentum", "Players who prefer a fixed scope"],
    sessionStructure: ["Package selection", "Eligibility check", "Party sessions", "Completion confirmation"],
    accent: "amber"
  },
  {
    slug: "calibration-support",
    eyebrow: "Placement games",
    name: "Calibration Support",
    shortDescription: "A high-focus party plan for calibration or recalibration matches, with every game played by you.",
    description:
      "Prepare and queue calibration games with a compatible high-rank teammate. The service includes draft alignment, role planning, and a private delivery workspace.",
    priceFrom: 11900,
    duration: "5 or 10 games",
    highlights: ["Pre-queue readiness check", "Role and draft alignment", "Priority scheduling"],
    idealFor: ["Fresh calibration", "Returning players", "Recalibration periods"],
    sessionStructure: ["Account-status check without credentials", "Pool and role plan", "Party queue", "Calibration summary"],
    accent: "cyan"
  },
  {
    slug: "duo-lane-boost",
    eyebrow: "Lane pairing",
    name: "Duo Lane Boost",
    shortDescription: "Queue with a specialist whose hero pool and role complement yours from minute zero.",
    description:
      "A coordinated duo service for carry/support or mid/roaming combinations. Booster selection prioritizes lane synergy, region, language, and rank compatibility.",
    priceFrom: 8900,
    duration: "3–15 wins",
    highlights: ["Role-synergy matching", "Shared hero-pool plan", "Voice-ready coordination"],
    idealFor: ["Carry and support pairs", "Lane consistency", "Communication-first players"],
    sessionStructure: ["Role pairing", "Hero-pool check", "Scheduled duo queue", "Progress update"],
    accent: "cyan"
  },
  {
    slug: "mmr-sprint",
    eyebrow: "Time-boxed push",
    name: "MMR Sprint",
    shortDescription: "A concentrated multi-day party-queue plan with daily milestones and priority matching.",
    description:
      "Designed for active players who want a focused ranked push. Your order is split into manageable daily blocks with clear availability and progress checkpoints.",
    priceFrom: 15900,
    duration: "3–7 days",
    highlights: ["Daily queue blocks", "Priority booster continuity", "Milestone alerts"],
    idealFor: ["Focused ranked weekends", "High-volume players", "Time-sensitive goals"],
    sessionStructure: ["Sprint scope", "Daily availability", "Tracked queue blocks", "Final progress report"],
    accent: "crimson"
  },
  {
    slug: "stack-boost",
    eyebrow: "Party service",
    name: "Stack Boost",
    shortDescription: "Add one or more verified players to your stack for organized, role-balanced ranked sessions.",
    description:
      "A flexible service for two-to-five-player parties that need stronger role coverage, leadership, and queue coordination while everyone remains on their own account.",
    priceFrom: 12900,
    duration: "2–5 players",
    highlights: ["Role-balanced roster", "Region-compatible queue", "Shared order workspace"],
    idealFor: ["Friend groups", "Incomplete stacks", "Role coverage gaps"],
    sessionStructure: ["Stack audit", "Role coverage", "Party queue", "Group completion review"],
    accent: "amber"
  },
  {
    slug: "priority-membership",
    eyebrow: "Ongoing access",
    name: "Priority Membership",
    shortDescription: "Recurring access to preferred boosters, priority matching, and lower per-win pricing.",
    description:
      "A monthly plan for regular ranked players who value continuity. Includes reserved queue blocks, a persistent workspace, and member package pricing.",
    priceFrom: 24900,
    duration: "Monthly",
    highlights: ["Preferred booster continuity", "Reserved weekly blocks", "Member package rates"],
    idealFor: ["Regular ranked players", "Longer-term targets", "Players who value continuity"],
    sessionStructure: ["Monthly target", "Reserved queue windows", "Weekly milestones", "Renewal review"],
    accent: "amber"
  }
];

export const boosters: Booster[] = [
  {
    slug: "northstar",
    displayName: "Northstar",
    initials: "NS",
    currentRank: "Immortal 1,420",
    peakRank: "Immortal 780",
    rating: 4.98,
    reviewCount: 86,
    winsDelivered: 684,
    roles: ["Carry", "Mid"],
    specialties: ["Tempo", "Laning", "Closing games"],
    boostingTypes: ["Rank Boost", "Win Boost", "MMR Sprint"],
    languages: ["English", "French"],
    region: "North America",
    timeZone: "America/Toronto",
    availability: "Online now",
    startingPrice: 7900,
    tier: "Elite",
    biography: "A calm, systems-first Immortal player known for stable lanes, disciplined calls, and converting small leads without unnecessary risk.",
    playStyle: "Measured and communication-first. Best for carry and mid players who want a composed party leader."
  },
  {
    slug: "aegis",
    displayName: "Aegis",
    initials: "AE",
    currentRank: "Immortal 2,080",
    peakRank: "Immortal 1,105",
    rating: 4.96,
    reviewCount: 64,
    winsDelivered: 512,
    roles: ["Offlane", "Soft Support"],
    specialties: ["Initiation", "Vision", "Teamfights"],
    boostingTypes: ["Rank Boost", "Stack Boost", "Duo Lane Boost"],
    languages: ["English", "Spanish"],
    region: "Europe West",
    timeZone: "Europe/Madrid",
    availability: "Today",
    startingPrice: 6900,
    tier: "Master",
    biography: "A proactive space-maker who keeps parties organized through clear objectives, early rotations, and reliable initiation.",
    playStyle: "Direct and energetic, with concise voice calls and a strong preference for role-balanced drafts."
  },
  {
    slug: "lantern",
    displayName: "Lantern",
    initials: "LA",
    currentRank: "Immortal 3,410",
    peakRank: "Immortal 1,890",
    rating: 4.94,
    reviewCount: 51,
    winsDelivered: 438,
    roles: ["Hard Support", "Soft Support"],
    specialties: ["Lane equilibrium", "Warding", "Shotcalling"],
    boostingTypes: ["Duo Lane Boost", "Calibration Support", "Stack Boost"],
    languages: ["English", "Mandarin"],
    region: "Southeast Asia",
    timeZone: "Asia/Singapore",
    availability: "This week",
    startingPrice: 5900,
    tier: "Pro",
    biography: "A support specialist who creates clean lanes and turns information into calm, decisive party calls.",
    playStyle: "Patient and structured, ideal for customers who prefer low-noise communication and reliable support play."
  },
  {
    slug: "vector",
    displayName: "Vector",
    initials: "VE",
    currentRank: "Immortal 980",
    peakRank: "Immortal 420",
    rating: 4.99,
    reviewCount: 104,
    winsDelivered: 902,
    roles: ["Mid", "Carry"],
    specialties: ["Matchups", "Mechanics", "Fast tempo"],
    boostingTypes: ["Priority Membership", "MMR Sprint", "Rank Boost"],
    languages: ["English", "German"],
    region: "Europe West",
    timeZone: "Europe/Berlin",
    availability: "Limited",
    startingPrice: 9900,
    tier: "Elite",
    biography: "A top-tier core specialist for difficult brackets and ambitious sprints, with a track record of fast, controlled conversions.",
    playStyle: "Precise and high-tempo. Best for experienced players comfortable with short, decisive voice communication."
  }
];

export const reviews: Review[] = [
  {
    id: "review-1",
    customer: "M.K.",
    booster: "Northstar",
    rating: 5,
    service: "Rank Boost",
    role: "Carry",
    rank: "Legend",
    quote: "Everything was clear before we queued: region, roles, schedule, and the number of wins. The order tracker made the whole push feel controlled.",
    date: "June 2026",
    verified: true
  },
  {
    id: "review-2",
    customer: "Ari P.",
    booster: "Lantern",
    rating: 5,
    service: "Duo Lane Boost",
    role: "Carry",
    rank: "Ancient",
    quote: "Lantern fit my lane pool immediately. We played on our own accounts, stayed in voice, and each completed win appeared in the workspace.",
    date: "May 2026",
    verified: true
  },
  {
    id: "review-3",
    customer: "Jon C.",
    booster: "Aegis",
    rating: 5,
    service: "Stack Boost",
    role: "Offlane",
    rank: "Divine",
    quote: "Professional from assignment to completion. No vague promises—just a compatible player, strong calls, and a clean delivery record.",
    date: "May 2026",
    verified: true
  }
];

export const faqs = [
  {
    question: "Is this account boosting or self-play boosting?",
    answer: "Highground provides customer-controlled self-play services. You play every match on your own account while an eligible booster queues alongside you on theirs."
  },
  {
    question: "Do you ever need my Steam password or Steam Guard code?",
    answer: "No. We never request, collect, transmit, or store Steam credentials, authentication codes, recovery codes, or remote access."
  },
  {
    question: "Is a specific rank or amount of MMR guaranteed?",
    answer: "No. Packages define the service scope, such as assisted wins or scheduled queue blocks. Matchmaking, eligibility, publisher rules, and game outcomes can change, so rank and MMR results are not guaranteed."
  },
  {
    question: "How are boosters verified?",
    answer: "Applicants complete identity, rank-history, region, communication, conduct, and service-quality checks before their profiles become public."
  },
  {
    question: "What happens after checkout?",
    answer: "A private workspace opens and operations assigns a compatible booster. You confirm queue times, communicate, and track every milestone in one place."
  },
  {
    question: "Can I pause or reschedule an order?",
    answer: "Yes, subject to the notice window and progress already delivered. Your workspace records schedule changes and support requests."
  },
  {
    question: "How do refunds work?",
    answer: "Eligibility depends on delivered progress, completed matches, reserved time, and the Refund Policy. Approved full or partial refunds are recorded in the order audit trail."
  },
  {
    question: "Which regions are supported?",
    answer: "Coverage varies with queue population, rank compatibility, party rules, and booster availability. Your region is verified before an order begins."
  },
  {
    question: "Does Highground follow game and platform rules?",
    answer: "Services may be limited, changed, or declined where party eligibility, matchmaking rules, regional requirements, or publisher policies do not permit delivery."
  },
  {
    question: "When is booster payment released?",
    answer: "Booster payment is released after the service is completed and the applicable review period has passed, subject to refunds, disputes, and platform terms."
  }
];
