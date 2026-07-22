# Highground Design Brief

## Brand

**Name:** Highground Boosting

**Industry:**
Dota 2 rank progression, MMR boosting, assisted queue services, calibration, behavior-score recovery, win packages, and coaching.

**Audience:**
Competitive Dota 2 players who value rank progression but need clearer planning, structured assistance, coaching, accountability, or more efficient improvement.

The audience understands Dota terminology and competitive gaming culture. They are also cautious about trust, account safety, payment security, service legitimacy, delivery transparency, and outcome claims.

**Primary conversion:**
Configure a server-priced rank route and begin checkout.

**Secondary conversions:**

- Explore available services
- Understand how delivery works
- View the verified booster roster
- Read verified reviews
- Sign in to the customer workspace
- Apply to join the booster roster

**Brand personality:**

- Tactical
- Formidable
- Controlled
- Precise
- Competitive
- Premium
- Transparent
- Experienced
- Mythic
- Never childish
- Never reckless
- Never shady

## Desired feeling

The website should feel like entering a tactical command environment before an important ranked campaign.

The experience should communicate:

- Cinematic scale
- Competitive tension
- Strategic control
- Premium execution
- Visible progression
- Trust and transparency
- Energy without chaos
- Dota familiarity without copying the game client

The customer should feel that Highground understands the game, has a structured process, and will not take control away from them.

## Creative territory

### Primary concept

**The Dire War Table**

The website behaves like an evolving campaign map.

Rank, region, role, game mode, service type, and progress are represented as strategic routes rather than generic e-commerce selections.

The experience combines:

- Cinematic battlefield imagery
- Editorial storytelling
- Map and lane geometry
- Campaign markers
- Rank trajectories
- Restrained command-interface details
- Controlled molten energy

### Important distinction

The existing “Dire Forge” identity should evolve rather than disappear.

The new system must move from:

> Everything is made of lava.

Toward:

> The environment is dark and tactical; molten energy appears only where action, rank, risk, or progression is occurring.

## Visual language

### Background

Primary backgrounds:

- Near-black obsidian
- Burnt charcoal
- Deep brown-black
- Desaturated battlefield haze

Secondary surfaces:

- Scorched paper
- Oxidized metal
- Ash-coated stone
- Tactical map overlays

Large sections should not all be placed inside visible containers.

Use open space and environmental transitions between major chapters.

### Accent colors

Primary accents:

- Molten orange
- Ember red
- Warm gold
- Bone white

Functional accents:

- Muted mint or green for verified, secure, and active states
- Muted crimson for risk, Dire energy, and urgent information
- Ash grey for secondary information

Do not use maximum-saturation orange across all interactive elements.

### Typography

Use three intentional layers:

**Narrative display**
A sharp, mythic, editorial display typeface with carved or wedge-like character details.

**Interface typography**
A clean, modern grotesk or condensed sans-serif used for navigation, labels, service controls, and body copy.

**Telemetry typography**
A monospaced or tabular-number face for MMR, rank, prices, regions, percentages, coordinates, and campaign status.

Avoid relying on Palatino as the primary expression of the brand.

Headlines should use scale, line breaks, spacing, and contrast—not excessive bevel, glow, outline, or shadow.

### Textures

Permitted textures:

- Fine grain
- Scorched paper fibres
- Terrain contour lines
- Obsidian fractures
- Brushed dark metal
- Low-opacity smoke
- Heat distortion used sparingly

Avoid applying the same lava-crack texture to every card.

### Shapes

Use:

- Dota lane diagonals
- Map paths
- Tactical cut corners
- Offset frames
- Rune-like notches
- Vertical chapter markers
- Angular crop masks
- Rank trajectory lines
- Irregular but controlled silhouette edges

Avoid:

- Repeated pill shapes
- Excessive rounded cards
- Random organic blobs
- Every section using the same clipped polygon
- Decorative geometry with no connection to content

### Image direction

Use:

- Wide cinematic battlefield compositions
- Strong character silhouettes
- Environmental depth
- Deliberate negative space for typography
- Crops created for each breakpoint
- Atmospheric layers that support text hierarchy
- Original MOBA-inspired artwork where possible

Avoid:

- Several equally dominant heroes in one viewport
- Generic AI fantasy collages
- Images with no designated text-safe area
- Direct imitation of official Dota UI
- Unlicensed third-party artwork
- Adding game footage solely for spectacle

### Motion direction

Use:

- Camera drift with clear start and end states
- Controlled mask reveals
- Route lines that draw as progression advances
- Text transitions tied to scene changes
- Rank markers moving along paths
- Layered depth at low amplitude
- Precise hover responses
- Cinematic cuts rather than endless crossfades

Avoid:

- Constant glow cycles
- Excessive particle systems
- Large blur animations
- Multiple unrelated looping timelines
- Long pinned sections without sufficient payoff
- Animating every word
- Scroll hijacking
- Heavy animation on mobile

## Homepage objectives

The homepage must answer, in order:

1. What is Highground?
2. What can I accomplish?
3. Why should I trust this platform?
4. How does the service work?
5. Which service fits my objective?
6. Who performs the service?
7. How is progress tracked?
8. What does it cost?
9. What should I do next?

## Suggested homepage chapter structure

### Chapter 01 — Command the climb

A cinematic hero that introduces one clear campaign concept and primary CTA.

### Chapter 02 — Define the objective

An interactive but lightweight rank-route preview.

### Chapter 03 — Choose the contract

Services expressed as different tactical objectives rather than identical cards.

### Chapter 04 — Campaign protocol

A clear delivery process focused on customer control, scheduling, communication, and transparency.

### Chapter 05 — Verified execution

Booster profiles and verification evidence.

### Chapter 06 — Proof of victory

Reviews, metrics, and credible service evidence.

### Chapter 07 — Private command channel

Preview of the customer workspace, messages, milestones, and progress.

### Chapter 08 — Final route

A decisive conversion chapter leading into the footer.

## Avoid

- Generic SaaS cards
- Excessive glass
- Cartoon fantasy styling
- Purple gradients
- Identical sections
- Weak mobile layouts
- Molten material everywhere
- Hero copy centered over an image
- Multiple competing hero CTAs
- Too many small interface panels
- Fake live statistics
- Unverifiable claims
- Guarantees of rank or match outcomes
- Overloaded navigation
- Every section using numbered headings in exactly the same way
- Repeated “card plus icon plus paragraph” components

## Technical stack

**Next.js:** 16.2.10, App Router
**React:** 19.2.7
**TypeScript:** Strict TypeScript
**Tailwind:** 4.3.3
**Framer Motion:** Not currently installed
**GSAP:** Not currently installed
**Database and authentication:** Supabase
**Payments:** Stripe
**Email:** Resend
**Validation:** Zod and React Hook Form
**Testing:** Vitest
**Icons:** Lucide React
**Images:** Next Image and local assets

## Dependency policy

Prefer the current stack.

Introduce GSAP, Motion, Lenis, Three.js, React Three Fiber, or another animation dependency only when:

1. A defined interaction genuinely requires it.
2. The native implementation would be less maintainable.
3. The performance cost has been evaluated.
4. Reduced-motion and mobile alternatives are included.
5. The dependency is isolated from non-cinematic pages.

## Constraints

### Performance targets

At the 75th percentile on mobile and desktop:

- LCP ≤ 2.5 seconds
- INP ≤ 200 milliseconds
- CLS ≤ 0.1

Additional targets:

- No unnecessary full-screen eager-loaded images
- No layout movement caused by fonts or image loading
- Avoid full-page client rendering
- Keep portal code out of public marketing bundles
- Lazy-load below-the-fold media
- Disable expensive ambient effects on low-power devices
- Respect reduced motion
- Avoid animation-related long tasks

### Accessibility

- WCAG-conscious contrast
- Keyboard-operable menus and controls
- Visible focus states
- Semantic headings and landmarks
- Skip link preserved
- Touch targets of sufficient size
- Reduced-motion experience
- Screen-reader-friendly labels
- No essential information conveyed only by animation or color

### SEO

Preserve:

- Existing metadata
- Canonical URLs
- Open Graph configuration
- Structured data
- Sitemap
- Service page content
- Server-rendered public pages
- Heading hierarchy
- Internal service links
- Legal disclaimers

### Existing functionality to preserve

- Authentication
- Customer registration boundaries
- Customer portal
- Booster portal
- Admin portal
- Rank and MMR pricing
- Service configurator
- Stripe checkout
- Billing portal
- Refund intake
- Reviews
- Booster directory
- Booster profiles
- Recruitment
- Private order communication
- Voice and media functionality
- Service disclaimers
- Customer-operated service model
- Supabase RLS and authorization boundaries

## Reference breakdown

### Reference 1 — Awwwards Sites of the Year

**Use:**

- Strong visual point of view
- High-contrast hierarchy
- Controlled page pacing
- Intentional typography
- Transitions that connect chapters
- Custom image treatment
- Memorable interaction
- Mobile-specific adaptation
- Confidence to leave space empty

**Do not copy:**

- Any specific site’s layout
- Interaction without a conversion purpose
- Long intro loaders
- Poor accessibility
- Scroll-jacking
- Unnecessary WebGL
- Portfolio-site behavior that obstructs commerce

### Reference 2 — Dota 2 world and competitive language

**Use:**

- Highground and lowground
- Lanes and map routes
- Rank medals
- Roles and regions
- Tactical decision-making
- Campaign progression
- Dire and Radiant contrast
- Competitive tension
- Heroic scale

**Do not copy:**

- Official client UI
- Valve logos
- Direct game HUD reproduction
- Unlicensed hero art
- Shop panels
- Inventory screens
- Tiny game-interface typography
- Visual clutter designed for gameplay rather than marketing

### Reference 3 — Current Highground implementation

**Preserve:**

- Dire Forge atmosphere
- Original battlefield assets
- Rank-route language
- Customer-control message
- Existing service scope
- Strong CTA terminology
- Existing application architecture
- Recognizable orange, gold, ember, and obsidian identity

**Improve:**

- Visual restraint
- Typography
- Hero hierarchy
- Scene pacing
- Image loading strategy
- Mobile composition
- Material consistency
- Section variety
- Navbar clarity
- Footer density
- Performance
