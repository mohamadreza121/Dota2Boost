# Phased implementation roadmap

## Phase 1 — foundation: delivered

- Project architecture, design tokens, Supabase schema, authentication, roles, RLS, shared layout, navigation, and error handling
- Customer-only public registration with controlled booster/staff role elevation
- Private storage, delivery records, audit schema, development seed data, and deployment configuration

## Phase 2 — public website: delivered

- Boosting-specific homepage and premium command-center visual system
- MMR-first services, booster marketplace and profiles, How It Works, pricing, reviews, Work With Us, FAQ, and legal pages
- MMR Boost in Solo/Duo modes, MMR Calibration, Behavior Score Boost, Win Boost, secondary Coaching, and a Herald-to-Immortal medal ladder
- Original local battlefield art and video, responsive/mobile states, metadata, structured data, sitemap, and accessibility fallbacks
- Compatibility redirects from the former coaching URLs

## Phase 3 — commerce: delivered

- Service-aware configurator and debounced server-authoritative pricing for MMR, calibration, behavior score, wins, and coaching
- Transactional order and discount reservation, Stripe Checkout, replay-safe webhook reconciliation, asynchronous payment handling, and authenticated payment confirmation
- Hosted receipts, Billing Portal, customer refund intake, and idempotent audited admin refund execution
- Production gate: deployed database concurrency tests, Stripe test-mode integration tests, regional/add-on rule evaluation, tax review, and publisher-policy review

## Phase 4 — customer portal: foundation delivered, operations next

- Existing overview, order workspace, messaging/media controls, schedule, progress, and billing surfaces
- Next: replace demonstration cards with live order queries and complete approvals, reschedules, disputes, notifications, settings, and failure states

## Phase 5 — booster portal: foundation delivered, operations next

- Existing assignment, active boost, schedule, customer, earnings, and performance surfaces
- Next: assignment acceptance, availability, win verification, deliverables, notes, and Connect onboarding status

## Phase 6 — production chat

- Realtime delivery, presence, typing, read receipts, reactions, pagination, search, retries, and moderation
- Attachment finalization, malware scanning, thumbnails, resumable uploads, and signed downloads

## Phase 7 — admin platform: operations foundation delivered

- Live order, customer, booster, application, payment, refund, dispute, review, analytics, and audit views
- Transactional assignment/replacement, order status/deadline, account status, application stage, dispute resolution, and review moderation controls
- Every sensitive mutation repeats admin/owner authorization in the service-role transaction and writes before/after audit state atomically
- Existing commerce console covers transactional service/package/rule, discount, and Stripe refund operations
- Next: deeper order detail, bulk operations, export/reporting, application evidence review, support inbox, and configurable regional/add-on/tier rule builders

## Phase 8 — production hardening

- RLS/authorization and Stripe integration suites, rate limiting, upload security, observability, accessibility, mobile/performance QA, backups, and incident runbooks
- Legal, tax, privacy, publisher-policy, and payment-marketplace review

Automatic matchmaking, built-in video calls, automated payouts, AI play, community forums, native apps, and large gamification systems remain out of scope until the core workflow is proven.
