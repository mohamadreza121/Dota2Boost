# Phased implementation roadmap

## Delivered foundation

- Architecture, route map, data model, roles, design tokens, public layout, error/empty states
- Public pages and original premium esports visual system
- Customer registration and cookie authentication
- Invitation-only non-customer roles and portal gates
- Customer, coach, and admin dashboard foundations
- Dynamic configurator and server pricing model
- Stripe Checkout and webhook foundation
- Private order workspace, message API, voice recorder, and signed upload authorization
- Coach application and review foundations
- PostgreSQL schema, RLS, indexes, triggers, private buckets, and seed script

## Phase 2 — Complete commerce operations

- Database-backed admin service/package/pricing editor
- Discount redemption with transactional usage limits
- Taxes and Stripe customer reuse
- Receipt links and billing portal
- Refund server actions with Stripe idempotency keys and mandatory audit reasons
- Webhook replay and out-of-order integration tests

## Phase 3 — Complete customer portal

- Live database queries for every dashboard card
- Order list, status timeline, approval, support, dispute, billing, and notification pages
- Progress history and customer-visible/private note rules
- Complete empty, loading, and error states

## Phase 4 — Complete coach operations

- Admin assignment workflow and coach acceptance
- Availability editor, blocked dates, breaks, notice windows, and vacation status
- Deliverable upload, goal editor, notes, earnings ledger, and performance views
- Stripe Connect Express onboarding status without enabling automatic payout

## Phase 5 — Production chat

- Cursor pagination and virtualized message list
- Supabase Realtime channels, presence, typing, read receipts, retries, and reactions
- Attachment finalization, malware scan, thumbnails, signed download URLs, and resumable video upload
- Message edit/delete windows, reporting, moderation, search, and support escalation
- Accessible recording announcements and duration validation from media metadata

## Phase 6 — Admin and background jobs

- Applications, interviews, trials, suspensions, coach warnings, and payout status
- Order moderation, refund/dispute workbench, review moderation with retained originals
- Inngest reminders, message digests, thumbnail jobs, webhook recovery, and stale-order alerts
- Resend templates and per-user notification preferences
- Full audit log viewer and export

## Phase 7 — Production hardening

- RLS, authorization, webhook, upload, and rate-limit test suites
- Sentry and privacy-safe PostHog
- Accessibility and cross-device QA
- Lighthouse/Core Web Vitals budgets
- Database backup/restore drill and incident runbooks
- Legal, tax, privacy, publisher-policy, and Stripe marketplace review

Automatic coach matching, built-in video conferencing, automated payouts, AI coaching, community forums, native mobile apps, and gamification remain intentionally out of scope until the core workflow is stable.
