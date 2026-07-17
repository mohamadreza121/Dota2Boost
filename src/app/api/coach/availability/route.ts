import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ isAvailable: z.boolean() });

export async function PATCH(request: Request) {
  const principal = await getApiPrincipal();
  if (!principal) return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
  if (principal.role !== "coach") return NextResponse.json({ error: "Booster access required." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid availability value." }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("set_coach_availability_v1", { p_coach_id: principal.user.id, p_is_available: parsed.data.isAvailable });
  if (error) { console.error("coach_availability_failed", { coachId: principal.user.id, message: error.message }); return NextResponse.json({ error: "Availability could not be updated." }, { status: 503 }); }
  return NextResponse.json(data);
}
