# Phased implementation roadmap

## Phase 1 — foundation: delivered

- Project architecture, design tokens, Supabase schema, authentication, roles, RLS, shared layout, navigation, and error handling
- Customer-only public registration with controlled booster/staff role elevation
- Private storage, delivery records, audit schema, development seed data, and deployment configuration

## Phase 2 — public website: delivered

- Boosting-specific homepage and premium command-center visual system
- Services, booster marketplace and profiles, How It Works, pricing, reviews, Work With Us, FAQ, and legal pages
- Original local battlefield art and video, responsive/mobile states, metadata, structured data, sitemap, and accessibility fallbacks
- Compatibility redirects from the former coaching URLs

## Phase 3 — commerce: foundation delivered

- Service configurator and server-authoritative price calculation
- Transactional order and discount reservation, Stripe Checkout, webhook reconciliation, payment confirmation, receipts, Billing Portal, and refund foundation
- Remaining production work: deployed database concurrency tests, Stripe test-mode integration tests, regional/add-on rule evaluation, and tax configuration review

## Phase 4 — customer portal: foundation delivered, operations next

- Existing overview, order workspace, messaging/media controls, schedule, progress, and billing surfaces
- Next: replace demonstration cards with live order queries and complete approvals, reschedules, disputes, notifications, settings, and failure states

## Phase 5 — booster portal: foundation delivered, operations next

- Existing assignment, active boost, schedule, customer, earnings, and performance surfaces
- Next: assignment acceptance, availability, win verification, deliverables, notes, and Connect onboarding status

## Phase 6 — production chat

- Realtime delivery, presence, typing, read receipts, reactions, pagination, search, retries, and moderation
- Attachment finalization, malware scanning, thumbnails, resumable uploads, and signed downloads

## Phase 7 — admin platform

- Complete order, application, booster, customer, payment, dispute, review, analytics, and audit workflows
- Expand the commerce console into fully transactional service/add-on/tier/regional pricing operations

## Phase 8 — production hardening

- RLS/authorization and Stripe integration suites, rate limiting, upload security, observability, accessibility, mobile/performance QA, backups, and incident runbooks
- Legal, tax, privacy, publisher-policy, and payment-marketplace review

Automatic matchmaking, built-in video calls, automated payouts, AI play, community forums, native apps, and large gamification systems remain out of scope until the core workflow is proven.
