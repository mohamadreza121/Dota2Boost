import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { paymentStatusFromStripeType } from "@/lib/payments/event-ordering";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 1_000_000) return NextResponse.json({ error: "Webhook payload is too large." }, { status: 413 });
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "Webhook configuration is missing." }, { status: 400 });
  const payload = await request.text();
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(payload, signature, secret); }
  catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }

  const admin = createAdminClient();
  const { data: claimed, error: claimError } = await admin.rpc("claim_webhook_event_v2", { p_event_id: event.id, p_event_type: event.type, p_payload: event as unknown as Record<string, unknown> });
  if (claimError) return NextResponse.json({ error: "Webhook could not be claimed." }, { status: 500 });
  if (!claimed) return NextResponse.json({ received: true, duplicate: true });

  try {
    await handleStripeEvent(event);
    await admin.from("webhook_events").update({ status: "processed", processed_at: new Date().toISOString(), error_message: null, updated_at: new Date().toISOString() }).eq("id", event.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Unknown webhook error";
    await admin.from("webhook_events").update({ status: "failed", error_message: message, updated_at: new Date().toISOString() }).eq("id", event.id);
    console.error("stripe_webhook_failed", { eventId: event.id, type: event.type, message });
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

async function handleStripeEvent(event: Stripe.Event) {
  const admin = createAdminClient();
  const status = paymentStatusFromStripeType(event.type);
  if (status) {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata.order_id;
    if (!orderId) return;
    const { error } = await admin.rpc("record_payment_status_v2", {
      p_order_id: orderId,
      p_payment_intent_id: intent.id,
      p_status: status,
      p_failure_code: intent.last_payment_error?.code ?? null,
      p_event_created: event.created
    });
    if (error) throw error;
    return;
  }

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
      const tax = session.total_details?.amount_tax ?? 0;
      const { error } = await admin.rpc("finalize_paid_order_v2", {
        p_order_id: orderId,
        p_checkout_session_id: session.id,
        p_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
        p_stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
        p_amount_subtotal: session.amount_subtotal ?? 0,
        p_tax_amount: tax,
        p_amount_total: session.amount_total ?? 0,
        p_event_created: event.created
      });
      if (error) throw error;
      if (typeof session.invoice === "string") {
        const invoice = await getStripe().invoices.retrieve(session.invoice);
        const { error: invoiceError } = await admin.from("payments").update({ stripe_invoice_id: invoice.id, hosted_invoice_url: invoice.hosted_invoice_url, invoice_pdf_url: invoice.invoice_pdf, updated_at: new Date().toISOString() }).eq("order_id", orderId);
        if (invoiceError) throw invoiceError;
      }
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      const orderId = session.metadata?.order_id ?? session.client_reference_id;
      if (orderId) {
        const { error } = await admin.rpc("release_checkout_order_v2", { p_order_id: orderId, p_reason: "Stripe Checkout session expired" });
        if (error) throw error;
      }
      break;
    }
    case "charge.succeeded": {
      const charge = event.data.object;
      const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (paymentIntentId) {
        const { error } = await admin.from("payments").update({ charge_id: charge.id, receipt_url: charge.receipt_url, updated_at: new Date().toISOString() }).eq("payment_intent_id", paymentIntentId);
        if (error) throw error;
      }
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object;
      const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (!paymentIntentId) break;
      const { data: payment, error: paymentReadError } = await admin.from("payments").select("id, order_id, gross_amount, last_stripe_event_created").eq("payment_intent_id", paymentIntentId).maybeSingle();
      if (paymentReadError) throw paymentReadError;
      if (!payment || event.created <= payment.last_stripe_event_created) break;
      const statusValue = charge.refunded ? "refunded" : "partially_refunded";
      const { error: paymentError } = await admin.from("payments").update({ status: statusValue, charge_id: charge.id, receipt_url: charge.receipt_url, refunded_amount: charge.amount_refunded, last_stripe_event_created: event.created, updated_at: new Date().toISOString() }).eq("id", payment.id);
      if (paymentError) throw paymentError;
      const { error: orderError } = await admin.from("orders").update({ refunded_amount: charge.amount_refunded, ...(charge.refunded ? { status: "refunded" } : {}), last_stripe_event_created: event.created, updated_at: new Date().toISOString() }).eq("id", payment.order_id).lt("last_stripe_event_created", event.created);
      if (orderError) throw orderError;
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
