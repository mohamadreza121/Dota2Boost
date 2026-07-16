import { NextResponse } from "next/server";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/payments/stripe";
import { absoluteUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST() {
  const principal = await getApiPrincipal();
  if (!principal || principal.role !== "customer") return NextResponse.json({ error: "Customer sign-in required." }, { status: 401 });
  try {
    const admin = createAdminClient();
    const { data: allowed } = await admin.rpc("consume_rate_limit", { p_key: `billing_portal:${principal.user.id}`, p_limit: 10, p_window_seconds: 600 });
    if (!allowed) return NextResponse.json({ error: "Too many billing portal requests. Try again shortly." }, { status: 429 });
    const { data, error } = await admin.from("stripe_customers").select("stripe_customer_id").eq("profile_id", principal.user.id).maybeSingle();
    if (error) throw error;
    if (!data?.stripe_customer_id) return NextResponse.json({ error: "No billing customer exists yet." }, { status: 404 });
    const session = await getStripe().billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: absoluteUrl("/dashboard/billing") });
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("billing_portal_failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "The billing portal is unavailable right now." }, { status: 503 });
  }
}
