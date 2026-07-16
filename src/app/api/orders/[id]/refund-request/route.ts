import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { customerRefundRequestSchema } from "@/lib/validation/commerce";

export const runtime = "nodejs";

interface Props { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Props) {
  const principal = await getApiPrincipal();
  if (!principal) return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
  if (principal.role !== "customer") return NextResponse.json({ error: "Customer access required." }, { status: 403 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 8_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const parsed = customerRefundRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid amount and at least 20 characters explaining the request." }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { data: allowed, error: limitError } = await admin.rpc("consume_rate_limit", { p_key: `refund_request:${principal.user.id}`, p_limit: 5, p_window_seconds: 86400 });
    if (limitError) throw limitError;
    if (!allowed) return NextResponse.json({ error: "Too many refund requests. Contact support if an existing request needs an update." }, { status: 429 });
    const { data, error } = await admin.rpc("request_customer_refund_v3", {
      p_customer_id: principal.user.id,
      p_order_id: id,
      p_requested_amount: parsed.data.amount,
      p_reason: parsed.data.reason
    });
    if (error || !data || typeof data !== "object") throw error ?? new Error("Refund request could not be created.");
    const result = data as { request_id?: unknown; status?: unknown };
    if (typeof result.request_id !== "string" || typeof result.status !== "string") throw new Error("Refund request response was invalid.");
    return NextResponse.json({ requestId: result.request_id, status: result.status }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : error && typeof error === "object" && "message" in error ? String(error.message) : "unknown";
    const eligibilityError = /available refundable balance|eligible for a refund request|Paid order not found|Invalid refund amount/i.test(message);
    const clientMessage = eligibilityError
      ? "This order is not currently eligible for that refund amount."
      : "Refund request could not be submitted right now.";
    console.error("customer_refund_request_failed", { orderId: id, message });
    return NextResponse.json({ error: clientMessage }, { status: eligibilityError ? 409 : 503 });
  }
}
