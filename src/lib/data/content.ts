import type { Booster, Review, ServiceDefinition } from "@/types/domain";

export const services: ServiceDefinition[] = [
  {
    slug: "mmr-boost",
    eyebrow: "Most popular",
    name: "MMR Boost",
    shortDescription: "Choose an exact MMR climb with Solo Assist or Duo Queue delivery and a private progress tracker.",
    description:
      "Set your current medal, target medal, and MMR amount, then pick Solo Assist or Duo Queue. Solo Assist keeps you at the controls with live expert direction; Duo Queue pairs you with a compatible high-MMR teammate. Neither mode requires an account hand-off.",
    priceFrom: 4900,
    duration: "100–3,000 MMR scope",
    highlights: ["Solo Assist and Duo Queue", "Herald-to-Immortal medal targeting", "MMR milestone workspace"],
    idealFor: ["A defined MMR target", "Breaking a ranked plateau", "Players who want a tracked climb"],
    sessionStructure: ["Rank and MMR scope", "Mode and eligibility check", "Booster assignment", "Milestone tracking"],
    accent: "crimson"
  },
  {
    slug: "mmr-calibration",
    eyebrow: "Calibration",
    name: "MMR Calibration",
    shortDescription: "Configure a five- or ten-match calibration block with bracket-aware matching and live tracking.",
    description:
      "A high-focus service for calibration or recalibration matches. Select Solo Assist or Duo Queue, your role, region, and match count; every game stays attached to a private order timeline.",
    priceFrom: 9900,
    duration: "5 or 10 matches",
    highlights: ["Five- and ten-match packages", "Solo or Duo mode", "Match-by-match calibration log"],
    idealFor: ["Fresh calibration", "Returning ranked players", "Recalibration windows"],
    sessionStructure: ["Calibration status check", "Role and hero plan", "Scheduled match blocks", "Completion summary"],
    accent: "amber"
  },
  {
    slug: "behavior-score-boost",
    eyebrow: "Conduct recovery",
    name: "Behavior Score Boost",
    shortDescription: "Set a behavior-score recovery amount and receive a structured, customer-operated match plan.",
    description:
      "A scoped behavior-score recovery service built around queue planning, communication standards, match reviews, and progress checkpoints. You continue playing on your own account and no outcome is guaranteed.",
    priceFrom: 3900,
    duration: "500–6,000 score scope",
    highlights: ["Score-based package sizing", "Conduct and queue checklist", "Private progress checkpoints"],
    idealFor: ["Behavior-score recovery", "Communication reset", "A structured return to ranked play"],
    sessionStructure: ["Current-score snapshot", "Recovery scope", "Match conduct plan", "Score checkpoints"],
    accent: "cyan"
  },
  {
    slug: "win-boost",
    eyebrow: "Fixed package",
    name: "Win Boost",
    shortDescription: "Buy a defined set of assisted Duo Queue wins with transparent order status and scheduling.",
    description:
      "Choose a three-to-twenty win package and queue with a compatible booster on separate accounts. Completed games, schedule changes, and support notes appear in the order workspace.",
    priceFrom: 4900,
    duration: "3–20 assisted wins",
    highlights: ["Fixed win package", "Duo Queue matching", "Match-by-match updates"],
    idealFor: ["Short ranked pushes", "A fixed delivery scope", "Role-synergy queueing"],
    sessionStructure: ["Win package", "Eligibility check", "Duo sessions", "Completion confirmation"],
    accent: "amber"
  },
  {
    slug: "coaching",
    eyebrow: "Secondary service",
    name: "Dota 2 Coaching",
    shortDescription: "Book a focused private session for role, hero-pool, replay, or decision-making improvement.",
    description:
      "Coaching remains available as an add-on or standalone service, but it sits behind MMR boosting, calibration, behavior score, and assisted-win products in the storefront.",
    priceFrom: 6900,
    duration: "1–8 sessions",
    highlights: ["Live private session", "Replay or role focus", "Written action plan"],
    idealFor: ["Mechanical improvement", "Replay diagnosis", "Long-term skill development"],
    sessionStructure: ["Goal selection", "Coach matching", "Live session", "Action plan"],
    accent: "cyan"
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
    boostingTypes: ["MMR Boost", "Win Boost", "MMR Calibration"],
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
    boostingTypes: ["MMR Boost", "Win Boost", "Behavior Score Boost"],
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
    boostingTypes: ["MMR Calibration", "MMR Boost", "Dota 2 Coaching"],
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
    boostingTypes: ["MMR Boost", "MMR Calibration", "Win Boost"],
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
    service: "MMR Boost · Duo",
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
    service: "MMR Calibration · Duo",
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
    service: "MMR Boost · Solo Assist",
    role: "Offlane",
    rank: "Divine",
    quote: "Professional from assignment to completion. No vague promises—just a compatible player, strong calls, and a clean delivery record.",
    date: "May 2026",
    verified: true
  }
];

export const faqs = [
  {
    question: "What is the difference between Solo and Duo MMR Boost?",
    answer: "Solo Assist keeps you at the controls while a verified expert directs the live plan. Duo Queue pairs you with a compatible booster playing on a separate account. Neither mode requires account credentials or an account hand-off."
  },
  {
    question: "Do you ever need my Steam password or Steam Guard code?",
    answer: "No. We never request, collect, transmit, or store Steam credentials, authentication codes, recovery codes, or remote access."
  },
  {
    question: "Is a specific rank or amount of MMR guaranteed?",
    answer: "No. The configurator defines a paid service scope—such as an MMR amount, calibration matches, behavior-score amount, assisted wins, or sessions. Matchmaking, publisher rules, conduct systems, and game outcomes can change, so a result is not guaranteed."
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
    answer: "Customers can submit a full or partial request from Billing. Eligibility depends on delivered progress, completed matches, reserved time, and the Refund Policy; approval and Stripe processing are recorded in the order audit trail."
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
