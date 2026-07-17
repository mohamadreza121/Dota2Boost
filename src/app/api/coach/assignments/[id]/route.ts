import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/auth/api-user";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ action: z.enum(["accept", "decline"]) });
interface Props { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Props) {
  const principal = await getApiPrincipal();
  if (!principal) return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
  if (principal.role !== "coach") return NextResponse.json({ error: "Booster access required." }, { status: 403 });
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid assignment." }, { status: 400 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose accept or decline." }, { status: 400 });
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("respond_to_assignment_v1", { p_coach_id: principal.user.id, p_assignment_id: id, p_accept: parsed.data.action === "accept" });
  if (error) { const conflict = /no longer awaiting|not found/i.test(error.message); return NextResponse.json({ error: conflict ? "This assignment is no longer available." : "Assignment could not be updated." }, { status: conflict ? 409 : 503 }); }
  return NextResponse.json(data);
}
