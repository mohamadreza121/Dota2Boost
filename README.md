# Highground Boosting

Highground is a production-oriented Dota 2 MMR boosting marketplace. MMR Boost is the primary product, with Solo Assist and Duo Queue modes; MMR Calibration, Behavior Score Boost, Win Boost, and secondary Coaching share the same server-priced commerce flow and private delivery workspace.

The service model never asks for Steam credentials: boosters play from their own accounts alongside the customer. Availability and fulfilment remain subject to regional matchmaking, party eligibility, and publisher rules. No MMR, rank, or match outcome is guaranteed.

## Delivered

### Phase 1 — foundation

- Supabase cookie authentication with customer-only public registration and invitation-only staff roles
- Customer, booster, and admin portal foundations
- Private order conversations, message API, voice recorder, signed upload authorization, RLS, and seed data

### Phase 2 — public website

- Cinematic, responsive boosting storefront with original battlefield artwork, a lightweight local video loop, and reduced-motion fallbacks
- MMR-first storefront with MMR Boost, MMR Calibration, Behavior Score Boost, Win Boost, and secondary Coaching
- Herald-through-Immortal rank-medal ladder, Solo/Duo mode selection, and service-specific configuration
- Verified booster directory and profiles, service landing pages, process, pricing, reviews, FAQ, recruitment, and legal pages
- Mobile-first navigation, metadata, structured data, sitemap, accessibility states, and premium esports command-center styling

### Phase 3 — commerce

- Server-authoritative pricing and database-backed catalog/package/rule controls
- Service-aware pricing units for MMR, calibration matches, behavior score, wins, and coaching sessions
- Transactional discount reservation and per-customer/global redemption limits
- Stripe Checkout with customer reuse, automatic tax, invoices, billing portal, and hosted receipts
- Signature-verified webhook processing with replay, stale-claim, out-of-order, and asynchronous-payment handling
- Authenticated payment-confirmation polling that never trusts the success redirect
- Customer full/partial refund intake plus audited admin Stripe execution with idempotency and balance checks
- Admin commerce console and pure webhook ordering tests

See [Commerce foundation](./docs/COMMERCE.md) for the operating model.

## Safety and product boundaries

- Never request, collect, transmit, or store Steam passwords, Steam Guard codes, recovery codes, or authentication cookies.
- Customers remain in control of their own accounts and play in every assisted match.
- Do not promise a rank, MMR amount, win rate, queue time, or match outcome.
- Check current publisher and matchmaking rules before enabling a service in a region.
- Card data stays on Stripe-hosted surfaces and never enters the application.
- Automated booster payouts remain disabled until legal, platform, tax, and payment reviews are complete.

The battlefield visuals in `public/media` are original, generated MOBA-inspired artwork. The rank-medal assets are pinned from OpenDota and remain Valve property; see [media attribution](./docs/MEDIA_ATTRIBUTION.md). The project does not bundle Valve logos, hero portraits, or game footage.

## Stack

- Next.js 16 App Router, React 19, strict TypeScript, and Tailwind CSS 4
- Supabase Auth, PostgreSQL, RLS, Realtime-ready records, and private Storage
- Stripe Checkout, Billing Portal, invoices, tax collection, webhooks, and refunds
- Resend, Cloudflare Turnstile, Zod, React Hook Form, and Vitest

## Local setup

Requirements: Node.js 22+, npm, Docker Desktop, and the Supabase CLI.

```bash
npm install
cp .env.example .env.local
supabase start
supabase db reset
npm run seed
npm run dev
```

Copy the local Supabase URL, publishable key, and service-role key printed by `supabase status` into `.env.local`. The seed script uses synthetic accounts and `Highground-local-2026!` unless `SEED_USER_PASSWORD` is set. Never reuse seed credentials in a public deployment.

## Service configuration

Start from [.env.example](./.env.example). Values prefixed with `NEXT_PUBLIC_` may reach the browser; service-role, Stripe secret, webhook, Resend, and Turnstile secret values are server-only.

### Supabase

1. Link a project with `supabase link --project-ref <ref>`.
2. Apply all versioned migrations with `supabase db push`.
3. Add the production origin and `/auth/callback` to Auth redirect URLs.
4. Confirm `private-chat` and `coach-applications` remain private buckets.
5. Run role-based RLS tests before adding production data.

### Stripe

1. Configure `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the browser publishable key.
2. Register `https://your-domain/api/stripe/webhook` in Stripe Workbench.
3. Subscribe to the Checkout Session, PaymentIntent, Charge, refund-related Charge, dispute, account, transfer, and payout events handled by `src/app/api/stripe/webhook/route.ts`.
4. Enable automatic tax only after the business address, registrations, and product tax codes are reviewed.
5. Create a Billing Portal configuration and test Checkout, expiry, receipt, replay, refund, and portal flows in test mode.

The success page never marks an order paid; only a verified webhook may finalize payment.

### Resend and Turnstile

- Verify the sending domain and configure `EMAIL_FROM`, `SUPPORT_EMAIL`, and `RESEND_API_KEY`.
- Create a Turnstile widget for the production hostname and configure both keys.
- Production booster applications fail closed if Turnstile is absent or invalid.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run check` runs all four. Before a paid release, also validate Supabase RLS, Stripe CLI/Workbench event replay, keyboard and screen-reader navigation, reduced motion, key mobile widths, signed uploads, and database backup/restore.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Commerce foundation](./docs/COMMERCE.md)
- [Route map](./docs/ROUTE_MAP.md)
- [Data model](./docs/DATA_MODEL.md)
- [Authentication and authorization](./docs/AUTHORIZATION.md)
- [Security review](./docs/SECURITY.md)
- [Roadmap](./docs/ROADMAP.md)
- [Media attribution](./docs/MEDIA_ATTRIBUTION.md)

Legal pages are product-safe placeholders, not legal advice. Replace them with jurisdiction-specific, professionally reviewed documents before accepting real customers or payments.
