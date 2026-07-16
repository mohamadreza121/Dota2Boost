import { NextResponse } from "next/server";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/payments/stripe";
import { refundMutationSchema } from "@/lib/validation/commerce";

export const runtime = "nodejs";

interface PreparedRefund {
  request_id: string;
  payment_intent_id: string;
  stripe_refund_id: string | null;
  status: string;
  amount: number;
}

export async function POST(request: Request) {
  const principal = await getApiPrincipal();
  if (!principal || (principal.role !== "admin" && principal.role !== "owner")) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,120}$/.test(idempotencyKey)) return NextResponse.json({ error: "A valid Idempotency-Key header is required." }, { status: 400 });
  const parsed = refundMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "A valid amount and detailed audit reason are required." }, { status: 400 });
  const admin = createAdminClient();
  let requestId: string | null = null;
  try {
    const { data: allowed, error: limitError } = await admin.rpc("consume_rate_limit", { p_key: `admin_refund:${principal.user.id}`, p_limit: 20, p_window_seconds: 3600 });
    if (limitError) throw limitError;
    if (!allowed) return NextResponse.json({ error: "Too many refund attempts. Review existing requests before retrying." }, { status: 429 });
    const { data, error } = await admin.rpc("prepare_refund_v2", { p_order_id: parsed.data.orderId, p_actor_id: principal.user.id, p_amount: parsed.data.amount, p_reason: parsed.data.reason, p_idempotency_key: idempotencyKey });
    if (error || !data || typeof data !== "object") throw new Error("Refund could not be prepared.");
    const prepared = data as unknown as PreparedRefund;
    requestId = prepared.request_id;
    if (prepared.status === "processed" && prepared.stripe_refund_id) return NextResponse.json({ refundId: prepared.stripe_refund_id, duplicate: true });
    const refund = await getStripe().refunds.create({ payment_intent: prepared.payment_intent_id, amount: prepared.amount, reason: "requested_by_customer", metadata: { order_id: parsed.data.orderId, refund_request_id: prepared.request_id, audit_reason: parsed.data.reason.slice(0, 500), actor_id: principal.user.id } }, { idempotencyKey });
    const { error: completeError } = await admin.rpc("complete_refund_v2", { p_request_id: prepared.request_id, p_actor_id: principal.user.id, p_stripe_refund_id: refund.id });
    if (completeError) throw completeError;
    return NextResponse.json({ refundId: refund.id, status: refund.status });
  } catch (error) {
    if (requestId) {
      const { error: failureRecordError } = await admin.rpc("fail_refund_v2", { p_request_id: requestId, p_actor_id: principal.user.id, p_error: error instanceof Error ? error.message : "Unknown refund error" });
      if (failureRecordError) console.error("refund_failure_record_failed", { requestId, message: failureRecordError.message });
    }
    console.error("refund_failed", { requestId, message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Refund processing failed. Review the audit record before retrying with the same key." }, { status: 500 });
  }
}
