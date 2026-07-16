import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing";
import { pricingInputSchema } from "@/lib/validation/pricing";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 32_000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  const parsed = pricingInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "The boost contains invalid options.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });

  const quote = calculateQuote(parsed.data);
  if (!parsed.data.discountCode) {
    return NextResponse.json({ quote, calculatedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const admin = createAdminClient();
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const visitor = user?.id ?? createHash("sha256").update(`${process.env.STRIPE_WEBHOOK_SECRET ?? "highground-pricing"}:${forwarded}`).digest("hex");
    const { data: allowed, error: limitError } = await admin.rpc("consume_rate_limit", { p_key: `discount_preview:${visitor}`, p_limit: 30, p_window_seconds: 600 });
    if (limitError) throw limitError;
    if (!allowed) return NextResponse.json({ error: "Too many discount attempts. Try again shortly." }, { status: 429 });
    const { data, error } = await admin.rpc("preview_discount_code_v2", {
      p_code: parsed.data.discountCode,
      p_amount: quote.total,
      p_currency: quote.currency,
      p_customer_id: user?.id ?? null
    });
    if (error || !data || typeof data !== "object") {
      return NextResponse.json({ error: "That discount code is invalid, expired, or unavailable." }, { status: 422 });
    }
    const result = data as { code?: unknown; amount?: unknown };
    if (typeof result.code !== "string" || typeof result.amount !== "number") {
      return NextResponse.json({ error: "That discount code could not be applied." }, { status: 422 });
    }
    return NextResponse.json({
      quote: { ...quote, total: quote.total - result.amount },
      promotion: { code: result.code, amount: result.amount },
      calculatedAt: new Date().toISOString()
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Discount validation is temporarily unavailable." }, { status: 503 });
  }
}
