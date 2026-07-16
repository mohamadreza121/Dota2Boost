import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const sessionSchema = z.string().trim().min(12).max(255).regex(/^cs_[A-Za-z0-9_]+$/);

export async function GET(request: Request) {
  const principal = await getApiPrincipal();
  if (!principal) return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
  if (principal.role !== "customer") return NextResponse.json({ error: "Customer access required." }, { status: 403 });

  const parsed = sessionSchema.safeParse(new URL(request.url).searchParams.get("session_id"));
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout session." }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { data: payment, error: paymentError } = await admin
      .from("payments")
      .select("order_id, status, gross_amount, currency, paid_at")
      .eq("checkout_session_id", parsed.data)
      .eq("customer_id", principal.user.id)
      .maybeSingle();
    if (paymentError) throw paymentError;
    if (!payment) return NextResponse.json({ state: "processing" }, { headers: { "Cache-Control": "no-store" } });

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id, public_reference, status")
      .eq("id", payment.order_id)
      .eq("customer_id", principal.user.id)
      .single();
    if (orderError || !order) throw orderError ?? new Error("Order not found.");

    const confirmed = ["succeeded", "partially_refunded", "refunded"].includes(payment.status);
    const failed = ["failed", "cancelled"].includes(payment.status) || order.status === "cancelled";
    return NextResponse.json({
      state: confirmed ? "confirmed" : failed ? "failed" : "processing",
      paymentStatus: payment.status,
      orderStatus: order.status,
      orderId: order.id,
      publicReference: order.public_reference,
      amount: payment.gross_amount,
      currency: payment.currency,
      paidAt: payment.paid_at,
      receiptAvailable: confirmed
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("checkout_status_failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Payment confirmation is temporarily unavailable." }, { status: 503 });
  }
}
