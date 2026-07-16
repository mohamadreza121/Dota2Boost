# Authentication and authorization

## Roles

| Role | Creation | Core scope |
|---|---|---|
| `customer` | Public email registration | Own profile, orders, conversations, sessions, payments, notifications, reviews, disputes |
| `coach` | Approved application or invitation | Own profile, assigned orders, relevant customers, conversations, sessions, deliverables, notes, earnings |
| `support` | Admin/owner invitation | Assigned operational cases and approved customer/order context |
| `admin` | Owner invitation | Platform operations, assignments, applications, refunds, disputes, pricing, audit reads |
| `owner` | Controlled administrative provisioning | All admin capabilities plus role and platform governance |

## Enforcement layers

1. `src/proxy.ts` refreshes cookie sessions and blocks unauthenticated portal requests.
2. Portal pages call `requireRole` before rendering protected content.
3. Route Handlers authenticate the actor and explicitly check resource membership or ownership.
4. RLS repeats ownership and assignment rules in PostgreSQL.
5. Column grants prevent role, verification, payment, and audit escalation.
6. Service-role functions are revoked from `public`, `anon`, and `authenticated` and called only by server routes.

## Registration rules

The `handle_new_auth_user` trigger ignores requested role metadata and always inserts `customer`. Coach, support, admin, and owner roles must be granted through a controlled server-side invitation or application approval workflow. UI visibility is never treated as authorization.

## Session rules

- Sessions live in secure cookies managed through `@supabase/ssr`.
- Auth callback `next` values must be local absolute paths and cannot begin with `//`.
- Password-reset responses do not reveal whether an email exists.
- Portal access fails closed when Supabase configuration is absent.
