# Security review

## Implemented controls

- Strict TypeScript and shared Zod contracts
- Server-side authentication and role authorization
- RLS on every application table
- Column-level protection for roles, verification, orders, reviews, payments, and audit data
- Read-only, ownership-scoped Checkout confirmation; a success redirect cannot activate an order
- Customer refund intake with rate limits, locked refundable balance, revoked direct inserts, and separate idempotent admin execution
- Private storage buckets and signed upload authorization
- File MIME and size allowlists with server-chosen extensions
- Raw Stripe payload signature verification
- Recoverable idempotent webhook claims, event ordering, terminal-state guards, and amount reconciliation
- Transactional discount reservations with global and per-customer limits
- Refund balance locks, Stripe idempotency keys, and mandatory audit events
- Database-backed application rate limits
- Turnstile production fail-closed behavior
- Secure default headers, CSP, frame denial, referrer policy, and browser permission policy
- React text rendering instead of unsafe HTML for user messages
- Generic authentication and application errors that avoid account enumeration
- Log output limited to event IDs and redacted error messages

## Never log or analyze

- Passwords or authentication codes
- Supabase access/refresh tokens or service keys
- Payment card or bank data
- Private message bodies
- Private signed URLs or upload tokens
- Booster legal names or application samples
- Direct personal identifiers in PostHog or Sentry event properties

## Required hardening before paid production

- Add automated RLS test cases for every role and outsider access.
- Add a durable distributed rate limiter to sign-in and message endpoints.
- Add malware scanning and media thumbnail background jobs before enabling arbitrary document/video delivery.
- Add signed-download issuance and attachment metadata finalization after upload.
- Extend the existing commerce audit actions to assignment, deadline, dispute, role, and booster-status changes.
- Configure Sentry filtering and PostHog property allowlists.
- Review CSP against the exact production analytics, Sentry, Stripe, and Turnstile hosts.
- Perform threat modeling, dependency scanning, secret scanning, and external penetration testing.
- Obtain legal review of privacy, provider, refund, tax, and marketplace payment flows.

These items are production gates, not permission to weaken the existing controls in development.
