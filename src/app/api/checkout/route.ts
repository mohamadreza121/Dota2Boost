import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation/pricing";
import { calculateQuote } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/payments/stripe";
import { absoluteUrl } from "@/lib/utils";

export const runtime = "nodejs";

interface CheckoutOrderResult {
  order_id: string;
  public_reference: string;
  discount_amount: number;
  promotion_amount: number;
  checkout_amount: number;
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 32_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Review the boost options and try again." }, { status: 400 });

  let orderId: string | null = null;
  let checkoutSessionId: string | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });
    const { data: profile } = await supabase.from("profiles").select("role, display_name").eq("id", user.id).single();
    if (profile?.role !== "customer") return NextResponse.json({ error: "Only customer accounts can place orders." }, { status: 403 });

    const admin = createAdminClient();
    const { data: allowed, error: limitError } = await admin.rpc("consume_rate_limit", { p_key: `checkout:${user.id}`, p_limit: 10, p_window_seconds: 600 });
    if (limitError) throw limitError;
    if (!allowed) return NextResponse.json({ error: "Too many checkout attempts. Try again shortly." }, { status: 429 });

    const quote = calculateQuote(parsed.data);
    const { data: created, error: orderError } = await admin.rpc("create_checkout_order_v2", {
      p_customer_id: user.id,
      p_service_slug: parsed.data.service,
      p_requirements: parsed.data,
      p_subtotal: quote.subtotal,
      p_package_discount: quote.discount,
      p_pre_discount_total: quote.total,
      p_currency: quote.currency,
      p_discount_code: parsed.data.discountCode ?? null
    });
    if (orderError || !created || typeof created !== "object") throw new Error("Order could not be created.");
    const order = created as unknown as CheckoutOrderResult;
    if (typeof order.order_id !== "string" || typeof order.checkout_amount !== "number") throw new Error("Order response was invalid.");
    orderId = order.order_id;

    const stripe = getStripe();
    const { data: savedCustomer } = await admin.from("stripe_customers").select("stripe_customer_id").eq("profile_id", user.id).maybeSingle();
    let stripeCustomerId = savedCustomer?.stripe_customer_id as string | undefined;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile.display_name,
        metadata: { profile_id: user.id }
      }, { idempotencyKey: `customer_profile_${user.id}` });
      stripeCustomerId = customer.id;
      const { error: customerError } = await admin.from("stripe_customers").upsert({ profile_id: user.id, stripe_customer_id: stripeCustomerId, updated_at: new Date().toISOString() }, { onConflict: "profile_id" });
      if (customerError) throw new Error("Billing customer could not be saved.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: stripeCustomerId,
      customer_update: { address: "auto", name: "auto" },
      client_reference_id: orderId,
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      invoice_creation: { enabled: true },
      line_items: [{ quantity: 1, price_data: { currency: quote.currency, unit_amount: order.checkout_amount, product_data: { name: "Highground self-play boost", description: `${parsed.data.service.replaceAll("-", " ")} · ${parsed.data.currentRank} to ${parsed.data.targetRank} · ${parsed.data.winCount} wins` } } }],
      metadata: { order_id: orderId, customer_id: user.id, service: parsed.data.service, public_reference: order.public_reference },
      payment_intent_data: { receipt_email: user.email, metadata: { order_id: orderId, customer_id: user.id, service: parsed.data.service } },
      success_url: `${absoluteUrl("/checkout/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: absoluteUrl("/pricing?checkout=cancelled"),
      consent_collection: { terms_of_service: "required" },
      custom_text: { submit: { message: "You will play every match on your own account. Highground never requests Steam credentials." } },
      expires_at: Math.floor(Date.now() / 1000) + 2 * 60 * 60
    }, { idempotencyKey: `checkout_${orderId}` });
    checkoutSessionId = session.id;
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");

    const { error: paymentError } = await admin.from("payments").insert({
      order_id: orderId,
      customer_id: user.id,
      stripe_customer_id: stripeCustomerId,
      checkout_session_id: session.id,
      currency: quote.currency,
      gross_amount: order.checkout_amount,
      discount_amount: order.discount_amount,
      status: "pending"
    });
    if (paymentError) {
      await stripe.checkout.sessions.expire(session.id).catch(() => undefined);
      throw new Error("Payment record could not be created.");
    }
    return NextResponse.json({ url: session.url }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (orderId) {
      try {
        const admin = createAdminClient();
        await admin.rpc("release_checkout_order_v2", { p_order_id: orderId, p_reason: checkoutSessionId ? "Checkout setup failed" : "Stripe session creation failed" });
      } catch { /* the webhook recovery path will reconcile an existing Stripe session */ }
    }
    console.error("checkout_failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Checkout is not available right now. Please try again." }, { status: 503 });
  }
}
