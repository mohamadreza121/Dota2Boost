# Route map

## Public

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Marketing, trust, services, coaches, workspace preview, reviews, recruitment, FAQ | Server |
| `/services` | Service catalog | Server |
| `/services/[slug]` | SEO service landing page | Static params |
| `/coaches` | Searchable coach marketplace | Server shell + client filters |
| `/coaches/[slug]` | Public verified coach profile | Static params |
| `/how-it-works` | Payment, matching, delivery, approval, and support flow | Server |
| `/pricing` | Dynamic service configurator and sticky estimate | Server shell + client form |
| `/reviews` | Verified paid-order feedback | Server |
| `/work-with-us` | Coach recruitment and application | Server shell + client form |
| `/faq` | Account safety, scheduling, payment, privacy, and support | Server |
| `/legal/[slug]` | Legal placeholders | Static params, noindex |

## Authentication

| Route | Audience |
|---|---|
| `/auth/sign-up` | Customer registration only |
| `/auth/sign-in` | Customer, invited coach, and invited staff accounts |
| `/auth/forgot-password` | Password recovery request |
| `/auth/reset-password` | Authenticated recovery session |
| `/auth/callback` | Supabase PKCE code exchange |
| `/auth/verify-email` | Confirmation instructions |
| `/auth/unauthorized` | Role mismatch |

## Portals

| Route | Allowed roles | Foundation features |
|---|---|---|
| `/dashboard` | customer | Overview, active plan, session, goals, pending actions |
| `/dashboard/orders/[id]` | owning customer | Workspace, timeline, coach chat, voice recorder, session, deliverable |
| `/coach` | coach | Assignments, active work, schedule, earnings, performance |
| `/admin` | admin, owner | Orders, applications, revenue, disputes, quality, audit entry points |

## APIs

| Route | Method | Security boundary |
|---|---|---|
| `/api/pricing` | POST | Zod validated; informational quote only |
| `/api/checkout` | POST | Authenticated customer; price recalculated; service-role atomic order creation |
| `/api/stripe/webhook` | POST | Raw body signature verification; event claim; amount check; idempotent finalization |
| `/api/coach-applications` | POST | Zod, Turnstile, content cap, database rate limit, private insert |
| `/api/conversations/[id]/messages` | POST | Auth + active conversation membership + RLS |
| `/api/uploads/sign` | POST | Auth + membership + MIME/size allowlist + private signed URL |
| `/api/health` | GET | Non-sensitive liveness only |
