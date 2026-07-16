import { NextResponse } from "next/server";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { catalogMutationSchema } from "@/lib/validation/commerce";

export const runtime = "nodejs";

async function adminPrincipal() {
  const principal = await getApiPrincipal();
  return principal && (principal.role === "admin" || principal.role === "owner") ? principal : null;
}

export async function GET() {
  const principal = await adminPrincipal();
  if (!principal) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const admin = createAdminClient();
  const { data, error } = await admin.from("services").select("id, slug, name, description, service_type, is_active, sort_order, service_packages(id, name, description, base_price, currency, included_sessions, is_active, sort_order), pricing_rules(id, rule_key, conditions, adjustment_type, adjustment_value, priority, is_active, valid_from, valid_until)").is("deleted_at", null).order("sort_order");
  if (error) return NextResponse.json({ error: "Catalog could not be loaded." }, { status: 500 });
  return NextResponse.json({ services: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const principal = await adminPrincipal();
  if (!principal) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const parsed = catalogMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Review the catalog fields and audit reason.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const admin = createAdminClient();
  const input = parsed.data;
  let entityType = "service";
  let entityId: string | null = null;
  let beforeState: unknown = null;
  let afterState: unknown = null;

  try {
    if (input.action === "service.create") {
      const { data, error } = await admin.from("services").insert({ slug: input.slug, name: input.name, description: input.description, service_type: input.serviceType, sort_order: input.sortOrder, is_active: input.isActive, created_by: principal.user.id }).select().single();
      if (error) throw error;
      entityId = data.id; afterState = data;
    } else if (input.action === "service.update") {
      const { data: before, error: readError } = await admin.from("services").select().eq("id", input.id).single();
      if (readError) throw readError;
      const { data, error } = await admin.from("services").update({ name: input.name, description: input.description, service_type: input.serviceType, sort_order: input.sortOrder, is_active: input.isActive, updated_at: new Date().toISOString() }).eq("id", input.id).select().single();
      if (error) throw error;
      entityId = input.id; beforeState = before; afterState = data;
    } else if (input.action === "package.create") {
      entityType = "service_package";
      const { data, error } = await admin.from("service_packages").insert({ service_id: input.serviceId, name: input.name, description: input.description, base_price: input.basePrice, currency: input.currency, included_sessions: input.includedWins, included_replays: 0, sort_order: input.sortOrder, is_active: input.isActive }).select().single();
      if (error) throw error;
      entityId = data.id; afterState = data;
    } else if (input.action === "package.update") {
      entityType = "service_package";
      const { data: before, error: readError } = await admin.from("service_packages").select().eq("id", input.id).single();
      if (readError) throw readError;
      const { data, error } = await admin.from("service_packages").update({ name: input.name, description: input.description, base_price: input.basePrice, included_sessions: input.includedWins, sort_order: input.sortOrder, is_active: input.isActive, updated_at: new Date().toISOString() }).eq("id", input.id).select().single();
      if (error) throw error;
      entityId = input.id; beforeState = before; afterState = data;
    } else {
      entityType = "pricing_rule";
      if (input.id) {
        const { data: before, error: readError } = await admin.from("pricing_rules").select().eq("id", input.id).single();
        if (readError) throw readError;
        beforeState = before;
      }
      const record = { service_id: input.serviceId, rule_key: input.ruleKey, conditions: input.conditions, adjustment_type: input.adjustmentType, adjustment_value: input.adjustmentValue, priority: input.priority, is_active: input.isActive, created_by: principal.user.id, updated_at: new Date().toISOString() };
      const query = input.id ? admin.from("pricing_rules").update(record).eq("id", input.id) : admin.from("pricing_rules").insert(record);
      const { data, error } = await query.select().single();
      if (error) throw error;
      entityId = data.id; afterState = data;
    }
    const { error: auditError } = await admin.from("audit_logs").insert({ actor_id: principal.user.id, actor_role: principal.role, action: input.action, entity_type: entityType, entity_id: entityId, before_state: beforeState, after_state: afterState, reason: input.reason });
    if (auditError) throw auditError;
    return NextResponse.json({ item: afterState }, { status: input.action.endsWith("create") ? 201 : 200 });
  } catch (error) {
    console.error("catalog_mutation_failed", { action: input.action, message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Catalog change could not be saved." }, { status: 500 });
  }
}
