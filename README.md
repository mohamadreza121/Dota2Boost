# Highground

Highground is a production-oriented Dota 2 coaching marketplace and private delivery workspace. It connects customers, verified coaches, support staff, and administrators without ever collecting Steam credentials or taking control of a customer account.

This repository contains the first complete platform foundation:

- Premium, responsive public marketing site
- Service catalog, detail pages, coach marketplace, pricing configurator, reviews, FAQ, recruitment, and legal placeholders
- Cookie-based Supabase authentication with customer-only public registration
- Invitation-only coach, support, admin, and owner roles
- Customer, coach, and admin portal foundations
- Server-authoritative pricing and Stripe Checkout
- Signature-verified, idempotent Stripe webhook processing
- Private order conversations, realtime-ready message schema, voice-recording UI, and signed upload authorization
- Coach application flow with Zod validation, Turnstile support, database rate limits, and Resend receipt email
- Normalized PostgreSQL schema, constraints, indexes, triggers, RLS policies, storage buckets, and development seeding
- Metadata, structured data, sitemap, robots controls, security headers, reduced-motion support, and accessible navigation

The interface uses original abstract graphics and no Valve artwork, Dota 2 logos, hero portraits, or other copyrighted game assets.

## Safety and product boundaries

- Never request, collect, transmit, or store Steam usernames/password pairs, Steam Guard codes, recovery codes, or other authentication credentials.
- Customers remain in control of their own accounts and gameplay.
- Coaching does not guarantee MMR, rank, win rate, or match outcomes.
- Card data is handled by Stripe-hosted surfaces; it is never stored in this application.
- Coach payment language is completion-and-review based and avoids regulated payment terminology the platform is not authorized to use.
- Automated Stripe Connect payouts stay disabled until the business and payment workflow have completed review.

## Stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4 with a custom design system
- Supabase Auth, PostgreSQL, RLS, Realtime, and private Storage
- Stripe Checkout and Connect-ready financial records
- Resend, Cloudflare Turnstile, Zod, React Hook Form, and Vitest
- Vercel-ready runtime and security headers

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

Copy the local Supabase URL, publishable key, and service-role key printed by `supabase status` into `.env.local`. The seed script prints development account addresses and uses `Highground-local-2026!` unless `SEED_USER_PASSWORD` is set.

Never reuse seed accounts, passwords, or `.local` addresses in a public deployment.

## Environment variables

Start from [.env.example](./.env.example). Browser-safe values are explicitly prefixed with `NEXT_PUBLIC_`. `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, and `TURNSTILE_SECRET_KEY` are server-only.

The application intentionally fails closed when private services are missing:

- protected portals redirect to sign-in;
- checkout returns an unavailable response;
- coach applications work without Turnstile only outside production;
- no secret has a browser fallback.

## External service configuration

### Supabase

1. Create a project and link it with `supabase link --project-ref <ref>`.
2. Apply migrations with `supabase db push`.
3. Add the production URL and `/auth/callback` to Auth redirect URLs.
4. Keep email confirmation enabled.
5. Confirm both `private-chat` and `coach-applications` buckets are private.
6. Run RLS tests before production data is added.

The browser uses Supabase’s publishable key. Only Route Handlers and background processes may use the service-role key.

### Stripe

1. Add a restricted server key as `STRIPE_SECRET_KEY` and a browser publishable key.
2. Register `https://your-domain/api/stripe/webhook` in Stripe Workbench.
3. Subscribe to the events handled in `src/app/api/stripe/webhook/route.ts`.
4. Save the endpoint signing secret as `STRIPE_WEBHOOK_SECRET`.
5. Test Checkout in test mode and confirm that the success page alone never changes order state.
6. Leave Connect transfers and automated payouts disabled until platform review and end-to-end reconciliation are complete.

### Resend

1. Verify a sending domain.
2. Create a server API key.
3. Set `EMAIL_FROM`, `SUPPORT_EMAIL`, and `RESEND_API_KEY`.
4. Test application receipts and ensure private application content is not copied into email.

### Cloudflare Turnstile

1. Create a widget for the production hostname.
2. Set the public site key and server secret.
3. Verify that production submissions fail closed when the widget is absent or invalid.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run check` executes all four in order. Before a production release, also run:

- Supabase RLS tests against customer, coach, support, admin, and outsider sessions
- Stripe CLI/Workbench webhook replay and out-of-order event tests
- keyboard and screen-reader review
- mobile testing at 320 px, 375 px, 768 px, and desktop widths
- Lighthouse on `/`, `/services`, `/coaches`, and `/pricing`
- signed upload MIME, extension, size, and membership tests

## Architecture documents

- [Architecture](./docs/ARCHITECTURE.md)
- [Route map](./docs/ROUTE_MAP.md)
- [Data model](./docs/DATA_MODEL.md)
- [Authentication and authorization](./docs/AUTHORIZATION.md)
- [Security review](./docs/SECURITY.md)
- [Phased roadmap](./docs/ROADMAP.md)

## Deployment

1. Create a Vercel project connected to this repository.
2. Add the environment variables separately for Preview and Production.
3. Set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin.
4. Apply the database migration before routing production traffic.
5. deploy a Preview and run `npm run check` plus the external integration tests.
6. Register the production Stripe webhook and Supabase redirect URLs only after the canonical domain is live.

Legal pages are product-safe placeholders, not legal advice. Replace them with professionally reviewed, jurisdiction-specific documents before accepting real users or payments.
