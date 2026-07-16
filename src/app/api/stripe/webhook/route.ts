import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "Webhook configuration is missing." }, { status: 400 });
  const payload = await request.text();
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(payload, signature, secret); }
  catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }

  const admin = createAdminClient();
  const { data: claimed, error: claimError } = await admin.rpc("claim_webhook_event", { p_event_id: event.id, p_event_type: event.type, p_payload: event as unknown as Record<string, unknown> });
  if (claimError) return NextResponse.json({ error: "Webhook could not be claimed." }, { status: 500 });
  if (!claimed) return NextResponse.json({ received: true, duplicate: true });

  try {
    await handleStripeEvent(event);
    await admin.from("webhook_events").update({ status: "processed", processed_at: new Date().toISOString(), error_message: null }).eq("id", event.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Unknown webhook error";
    await admin.from("webhook_events").update({ status: "failed", error_message: message }).eq("id", event.id);
    console.error("stripe_webhook_failed", { eventId: event.id, type: event.type, message });
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  const admin = createAdminClient();
  if ((event.type as string) === "transfer.failed") {
    const transfer = event.data.object as Stripe.Transfer;
    const { error } = await admin.from("transfers").upsert({ stripe_transfer_id: transfer.id, amount: transfer.amount, currency: transfer.currency, status: "failed", destination_account_id: typeof transfer.destination === "string" ? transfer.destination : null, updated_at: new Date().toISOString() }, { onConflict: "stripe_transfer_id" });
    if (error) throw error;
    return;
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.order_id ?? session.client_reference_id;
      if (!orderId || session.payment_status !== "paid") return;
      const { error } = await admin.rpc("finalize_paid_order", { p_order_id: orderId, p_checkout_session_id: session.id, p_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null, p_amount_total: session.amount_total ?? 0 });
      if (error) throw error;
      break;
    }
    case "payment_intent.succeeded": {
      const intent = event.data.object;
      const { error } = await admin.from("payments").update({ status: "succeeded", payment_intent_id: intent.id, paid_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("order_id", intent.metadata.order_id ?? "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      const { error } = await admin.from("payments").update({ status: "failed", payment_intent_id: intent.id, failure_code: intent.last_payment_error?.code ?? null, updated_at: new Date().toISOString() }).eq("order_id", intent.metadata.order_id ?? "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object;
      const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (paymentIntentId) { const { error } = await admin.from("payments").update({ status: charge.refunded ? "refunded" : "partially_refunded", charge_id: charge.id, refunded_amount: charge.amount_refunded, updated_at: new Date().toISOString() }).eq("payment_intent_id", paymentIntentId); if (error) throw error; }
      break;
    }
    case "charge.dispute.created":
    case "charge.dispute.updated": {
      const dispute = event.data.object;
      const { error } = await admin.from("payment_disputes").upsert({ stripe_dispute_id: dispute.id, charge_id: typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id, amount: dispute.amount, currency: dispute.currency, reason: dispute.reason, status: dispute.status, evidence_due_at: dispute.evidence_details?.due_by ? new Date(dispute.evidence_details.due_by * 1000).toISOString() : null, updated_at: new Date().toISOString() }, { onConflict: "stripe_dispute_id" });
      if (error) throw error;
      break;
    }
    case "account.updated": {
      const account = event.data.object;
      const { error } = await admin.from("stripe_connected_accounts").update({ charges_enabled: account.charges_enabled, payouts_enabled: account.payouts_enabled, details_submitted: account.details_submitted, requirements: account.requirements, updated_at: new Date().toISOString() }).eq("stripe_account_id", account.id);
      if (error) throw error;
      break;
    }
    case "transfer.created": {
      const transfer = event.data.object;
      const { error } = await admin.from("transfers").upsert({ stripe_transfer_id: transfer.id, amount: transfer.amount, currency: transfer.currency, status: "created", destination_account_id: typeof transfer.destination === "string" ? transfer.destination : null, updated_at: new Date().toISOString() }, { onConflict: "stripe_transfer_id" });
      if (error) throw error;
      break;
    }
    case "payout.paid":
    case "payout.failed": {
      const payout = event.data.object;
      const { error } = await admin.from("payouts").upsert({ stripe_payout_id: payout.id, amount: payout.amount, currency: payout.currency, status: event.type === "payout.paid" ? "paid" : "failed", arrival_date: new Date(payout.arrival_date * 1000).toISOString(), updated_at: new Date().toISOString() }, { onConflict: "stripe_payout_id" });
      if (error) throw error;
      break;
    }
    default:
      break;
  }
}
