export type ReconciledPaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "partially_refunded" | "refunded" | "disputed" | "cancelled";

export interface PaymentEventState {
  status: ReconciledPaymentStatus;
  lastEventCreated: number;
  processedEventIds: readonly string[];
}

export interface IncomingPaymentEvent {
  id: string;
  created: number;
  status: ReconciledPaymentStatus;
}

const settled = new Set<ReconciledPaymentStatus>(["succeeded", "partially_refunded", "refunded", "disputed"]);
const downgrade = new Set<ReconciledPaymentStatus>(["pending", "processing", "failed", "cancelled"]);

export function reconcilePaymentEvent(state: PaymentEventState, event: IncomingPaymentEvent) {
  if (state.processedEventIds.includes(event.id)) return { state, applied: false, reason: "duplicate" as const };
  const processedEventIds = [...state.processedEventIds, event.id];
  if (event.created <= state.lastEventCreated) return { state: { ...state, processedEventIds }, applied: false, reason: "out_of_order" as const };
  if (settled.has(state.status) && downgrade.has(event.status)) return { state: { ...state, processedEventIds }, applied: false, reason: "terminal_downgrade" as const };
  return {
    state: { status: event.status, lastEventCreated: event.created, processedEventIds },
    applied: true,
    reason: "applied" as const
  };
}

export function paymentStatusFromStripeType(type: string): ReconciledPaymentStatus | null {
  if (type === "payment_intent.succeeded") return "succeeded";
  if (type === "payment_intent.processing") return "processing";
  if (type === "payment_intent.payment_failed") return "failed";
  if (type === "payment_intent.canceled") return "cancelled";
  return null;
}
