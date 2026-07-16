import { NextResponse } from "next/server";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { discountMutationSchema } from "@/lib/validation/commerce";

export const runtime = "nodejs";

async function adminPrincipal() {
  const principal = await getApiPrincipal();
  return principal && (principal.role === "admin" || principal.role === "owner") ? principal : null;
}

export async function GET() {
  const principal = await adminPrincipal();
  if (!principal) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const { data, error } = await createAdminClient().from("discount_codes").select("id, code, discount_type, discount_value, max_redemptions, redemption_count, currency, minimum_amount, maximum_discount, per_customer_limit, active_from, active_until, is_active, created_at").is("archived_at", null).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Discounts could not be loaded." }, { status: 500 });
  return NextResponse.json({ discounts: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const principal = await adminPrincipal();
  if (!principal) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const parsed = discountMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Review the discount fields and audit reason.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const input = parsed.data;
  const admin = createAdminClient();
  try {
    let beforeState: unknown = null;
    if (input.id) {
      const { data, error } = await admin.from("discount_codes").select().eq("id", input.id).single();
      if (error) throw error;
      beforeState = data;
    }
    const record = { code: input.code, discount_type: input.discountType, discount_value: input.discountValue, max_redemptions: input.maxRedemptions, currency: "cad", minimum_amount: input.minimumAmount, maximum_discount: input.maximumDiscount, per_customer_limit: input.perCustomerLimit, active_from: input.activeFrom, active_until: input.activeUntil, is_active: input.isActive, created_by: principal.user.id, updated_at: new Date().toISOString() };
    const query = input.id ? admin.from("discount_codes").update(record).eq("id", input.id) : admin.from("discount_codes").insert(record);
    const { data, error } = await query.select().single();
    if (error) throw error;
    const { error: auditError } = await admin.from("audit_logs").insert({ actor_id: principal.user.id, actor_role: principal.role, action: input.id ? "discount.updated" : "discount.created", entity_type: "discount_code", entity_id: data.id, before_state: beforeState, after_state: data, reason: input.reason });
    if (auditError) throw auditError;
    return NextResponse.json({ discount: data }, { status: input.id ? 200 : 201 });
  } catch (error) {
    console.error("discount_mutation_failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Discount change could not be saved." }, { status: 500 });
  }
}
