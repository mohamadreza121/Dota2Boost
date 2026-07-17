import { NextResponse } from "next/server";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { getAdminOperationsSnapshot } from "@/lib/admin/operations";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminOperationSchema } from "@/lib/validation/admin-operations";

export const runtime = "nodejs";

async function principal() {
  const actor = await getApiPrincipal();
  return actor && (actor.role === "admin" || actor.role === "owner") ? actor : null;
}

export async function GET() {
  const actor = await principal();
  if (!actor) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  try {
    return NextResponse.json(await getAdminOperationsSnapshot(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("admin_operations_load_failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Admin operations data could not be loaded." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const actor = await principal();
  if (!actor) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const parsed = adminOperationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Review the operation fields and enter a detailed audit reason.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("admin_operate_v7", {
      p_actor_id: actor.user.id,
      p_action: parsed.data.action,
      p_entity_id: parsed.data.entityId,
      p_payload: parsed.data.payload,
      p_reason: parsed.data.reason
    });
    if (error) {
      const conflict = /not found|no longer|cannot|invalid|unavailable|resolved|refunded/i.test(error.message);
      return NextResponse.json({ error: conflict ? error.message : "The admin operation could not be completed." }, { status: conflict ? 409 : 503 });
    }
    return NextResponse.json({ result: data });
  } catch (error) {
    console.error("admin_operation_failed", { action: parsed.data.action, message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "The admin operation could not be completed." }, { status: 503 });
  }
}
