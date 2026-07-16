# Commerce foundation

The commerce foundation moves pricing and payment operations behind transactional server boundaries. The browser can request estimates and start actions, but it cannot choose a trusted total, consume a discount, finalize an order, or issue a refund.

## Checkout

1. The customer submits validated boost options.
2. `create_checkout_order_v2` locks the selected service, calculates the discount, reserves one redemption, and creates the pending order atomically.
3. The server reuses or creates a Stripe Customer and creates Checkout with automatic tax, billing address collection, invoice creation, and locked order metadata.
4. Creation failure calls `release_checkout_order_v2`, cancelling the pending order and releasing the reservation.
5. Checkout completion is informational until the signed webhook reconciles currency and totals.

## Webhooks

`claim_webhook_event_v2` owns each Stripe event once while allowing a stale processing claim to be recovered. `record_payment_status_v2` stores event timestamps and prevents an older event from downgrading a newer payment state. Terminal paid/refunded states cannot be replaced by delayed pending or failed events.

`finalize_paid_order_v2` records subtotal, discount, tax, total, payment, invoice references, the private conversation, and the committed discount redemption in one transaction. Checkout expiry releases only reservations that were never committed.

## Discounts

Discount codes support fixed or percentage adjustments, minimum order values, maximum percentage caps, active windows, global limits, and per-customer limits. Reservations count toward limits so simultaneous checkout attempts cannot oversubscribe a code.

## Refunds

`prepare_refund_v2` locks the order/payment, rejects over-refunds, and creates or returns an idempotent request. Stripe receives the same key from the admin request. Failed attempts can safely resume with the same key; conflicting order/amount reuse is rejected. Completion or failure is written with actor, reason, amount, and Stripe reference in the audit trail.

Never retry an uncertain refund with a different key. Inspect the existing request and Stripe first.

## Deployment checklist

- Apply `202607160002_phase2_commerce.sql` after the foundation migration.
- Configure Stripe automatic tax, invoice settings, portal configuration, and webhook events in test mode.
- Exercise completed and expired checkout, duplicate delivery, out-of-order delivery, stale claim recovery, full/partial refund, and refund retry.
- Verify discount concurrency and per-customer limits against the deployed database.
- Confirm receipt/portal access is denied across customers and allowed to authorized support roles.
