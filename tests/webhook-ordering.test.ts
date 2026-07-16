import { describe, expect, it } from "vitest";
import { reconcilePaymentEvent, type PaymentEventState } from "@/lib/payments/event-ordering";

const initial: PaymentEventState = { status: "pending", lastEventCreated: 0, processedEventIds: [] };

describe("Stripe webhook event ordering", () => {
  it("ignores an exact replay", () => {
    const first = reconcilePaymentEvent(initial, { id: "evt_paid", created: 200, status: "succeeded" });
    const replay = reconcilePaymentEvent(first.state, { id: "evt_paid", created: 200, status: "succeeded" });
    expect(first.applied).toBe(true);
    expect(replay.applied).toBe(false);
    expect(replay.reason).toBe("duplicate");
  });

  it("ignores an older event delivered after a newer event", () => {
    const paid = reconcilePaymentEvent(initial, { id: "evt_paid", created: 300, status: "succeeded" });
    const lateFailure = reconcilePaymentEvent(paid.state, { id: "evt_failed", created: 250, status: "failed" });
    expect(lateFailure.applied).toBe(false);
    expect(lateFailure.reason).toBe("out_of_order");
    expect(lateFailure.state.status).toBe("succeeded");
  });

  it("does not downgrade a settled payment even when a failure has a newer timestamp", () => {
    const paid = reconcilePaymentEvent(initial, { id: "evt_paid", created: 300, status: "succeeded" });
    const impossibleFailure = reconcilePaymentEvent(paid.state, { id: "evt_failed", created: 310, status: "failed" });
    expect(impossibleFailure.applied).toBe(false);
    expect(impossibleFailure.reason).toBe("terminal_downgrade");
    expect(impossibleFailure.state.status).toBe("succeeded");
  });

  it("accepts a later partial refund after payment succeeds", () => {
    const paid = reconcilePaymentEvent(initial, { id: "evt_paid", created: 300, status: "succeeded" });
    const refunded = reconcilePaymentEvent(paid.state, { id: "evt_refund", created: 500, status: "partially_refunded" });
    expect(refunded.applied).toBe(true);
    expect(refunded.state.status).toBe("partially_refunded");
  });
});
