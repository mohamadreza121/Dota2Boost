import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/payments/stripe";

interface Props { params: Promise<{ id: string }> }

function isStripeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "stripe.com" || url.hostname.endsWith(".stripe.com"));
  } catch { return false; }
}

export async function GET(_: Request, { params }: Props) {
  const principal = await getApiPrincipal();
  if (!principal) return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data: order, error: orderError } = await admin.from("orders").select("id, customer_id").eq("id", id).single();
    if (orderError || !order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const staff = ["support", "admin", "owner"].includes(principal.role);
    if (order.customer_id !== principal.user.id && !staff) return NextResponse.json({ error: "Receipt access denied." }, { status: 403 });
    const { data: payment, error } = await admin.from("payments").select("id, receipt_url, hosted_invoice_url, invoice_pdf_url, stripe_invoice_id, charge_id, payment_intent_id").eq("order_id", id).single();
    if (error || !payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

    let url = payment.hosted_invoice_url ?? payment.receipt_url ?? payment.invoice_pdf_url;
    if (!url && payment.stripe_invoice_id) {
      const invoice = await getStripe().invoices.retrieve(payment.stripe_invoice_id);
      url = invoice.hosted_invoice_url ?? invoice.invoice_pdf ?? null;
      await admin.from("payments").update({ hosted_invoice_url: invoice.hosted_invoice_url, invoice_pdf_url: invoice.invoice_pdf, updated_at: new Date().toISOString() }).eq("id", payment.id);
    }
    if (!url && payment.charge_id) {
      const charge = await getStripe().charges.retrieve(payment.charge_id);
      url = charge.receipt_url;
    }
    if (!url && payment.payment_intent_id) {
      const intent = await getStripe().paymentIntents.retrieve(payment.payment_intent_id, { expand: ["latest_charge"] });
      const charge = intent.latest_charge as Stripe.Charge | string | null;
      if (charge && typeof charge !== "string") url = charge.receipt_url;
    }
    if (!url || !isStripeUrl(url)) return NextResponse.json({ error: "A hosted receipt is not available yet." }, { status: 404 });
    await admin.from("payments").update({ receipt_url: url, updated_at: new Date().toISOString() }).eq("id", payment.id);
    return NextResponse.json({ url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("receipt_lookup_failed", { orderId: id, message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Receipt lookup is unavailable right now." }, { status: 503 });
  }
}
