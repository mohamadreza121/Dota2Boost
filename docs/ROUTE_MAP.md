# Route map

## Public

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Cinematic boosting storefront, trust, services, process, roster, workspace, reviews, and FAQ | Server |
| `/services` | Boost service catalog | Server |
| `/services/[slug]` | SEO service landing page | Static params |
| `/boosters` | Searchable verified booster roster | Server shell + client filters |
| `/boosters/[slug]` | Public verified booster profile | Static params |
| `/coaches`, `/coaches/[slug]` | Permanent compatibility redirects | Server |
| `/how-it-works` | Scope, party queue, tracking, completion, and support flow | Server |
| `/pricing` | Dynamic rank/win configurator and estimate | Server shell + client form |
| `/reviews` | Verified paid-order feedback | Server |
| `/work-with-us` | Booster recruitment and application | Server shell + client form |
| `/faq` | Safety, eligibility, payments, privacy, and support | Server |
| `/legal/[slug]` | Legal placeholders | Static params, noindex |

## Portals

| Route | Allowed roles | Purpose |
|---|---|---|
| `/dashboard` | customer | Boost overview, queue schedule, progress, and actions |
| `/dashboard/orders/[id]` | owning customer | Private timeline, booster chat, media, schedule, and delivery |
| `/dashboard/billing` | customer | Payment history, hosted receipts, and Stripe Billing Portal |
| `/coach` | booster (`coach` database role) | Assignments, active boosts, schedule, earnings, and performance |
| `/admin` | admin, owner | Operations overview |
| `/admin/commerce` | admin, owner | Catalog, pricing rules, discounts, and audited refunds |

## Commerce APIs

| Route | Method | Security boundary |
|---|---|---|
| `/api/pricing` | POST | Shared validation; informational quote/discount preview |
| `/api/checkout` | POST | Customer auth; server pricing; transactional reservation; Stripe Checkout |
| `/api/stripe/webhook` | POST | Raw signature; replay claim; event ordering; amount reconciliation |
| `/api/billing/portal` | POST | Customer auth; Stripe Customer ownership |
| `/api/orders/[id]/receipt` | GET | Customer ownership or authorized staff; Stripe-hosted URL allowlist |
| `/api/admin/catalog` | GET, POST | Admin/owner; Zod; privileged writes with audit reason |
| `/api/admin/discounts` | GET, POST | Admin/owner; limits/windows; audit reason |
| `/api/admin/refunds` | POST | Admin/owner; idempotency key; balance lock; Stripe refund; audit trail |

Other APIs retain authentication, conversation membership, upload allowlists, Turnstile, and database rate-limit boundaries from Phase 1.
