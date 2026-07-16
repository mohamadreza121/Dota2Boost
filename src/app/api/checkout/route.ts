import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation/pricing";
import { calculateQuote } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/payments/stripe";
import { absoluteUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 32_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Review the plan options and try again." }, { status: 400 });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "customer") return NextResponse.json({ error: "Only customer accounts can place orders." }, { status: 403 });

    const quote = calculateQuote(parsed.data);
    const admin = createAdminClient();
    const { data: orderId, error: orderError } = await admin.rpc("create_pending_order", {
      p_customer_id: user.id,
      p_service_slug: parsed.data.service,
      p_requirements: parsed.data,
      p_subtotal: quote.subtotal,
      p_discount: quote.discount,
      p_total: quote.total,
      p_currency: quote.currency
    });
    if (orderError || typeof orderId !== "string") throw new Error("Order could not be created.");

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      client_reference_id: orderId,
      line_items: [{ quantity: 1, price_data: { currency: quote.currency, unit_amount: quote.total, product_data: { name: "Highground coaching plan", description: `${parsed.data.service.replaceAll("-", " ")} · ${parsed.data.role}` } } }],
      metadata: { order_id: orderId, customer_id: user.id, service: parsed.data.service },
      payment_intent_data: { metadata: { order_id: orderId, customer_id: user.id, service: parsed.data.service } },
      success_url: `${absoluteUrl("/checkout/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: absoluteUrl("/pricing?checkout=cancelled"),
      consent_collection: { terms_of_service: "required" }
    }, { idempotencyKey: `checkout_${orderId}` });

    const { error: paymentError } = await admin.from("payments").insert({ order_id: orderId, customer_id: user.id, checkout_session_id: session.id, currency: quote.currency, gross_amount: quote.total, discount_amount: quote.discount, status: "pending" });
    if (paymentError) throw new Error("Payment record could not be created.");
    return NextResponse.json({ url: session.url }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("checkout_failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Checkout is not available right now. Please try again." }, { status: 503 });
  }
}
