import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const messageSchema = z.object({ body: z.string().trim().min(1).max(4000), clientId: z.uuid(), replyTo: z.uuid().nullable().optional(), kind: z.enum(["text", "match_id", "support_request"]).default("text") });
interface Context { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: member } = await supabase.from("conversation_members").select("conversation_id").eq("conversation_id", id).eq("user_id", user.id).is("removed_at", null).maybeSingle();
  if (!member) return NextResponse.json({ error: "Conversation access denied." }, { status: 403 });
  const cursor = new URL(request.url).searchParams.get("before");
  const query = supabase.from("messages").select("id, client_id, sender_id, body, kind, created_at").eq("conversation_id", id).is("deleted_at", null).order("created_at", { ascending: false }).limit(50);
  if (cursor && z.iso.datetime().safeParse(cursor).success) query.lt("created_at", cursor);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Messages could not be loaded." }, { status: 400 });
  return NextResponse.json({ messages: (data ?? []).reverse() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  const parsed = messageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Message is invalid." }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: member } = await supabase.from("conversation_members").select("conversation_id").eq("conversation_id", id).eq("user_id", user.id).is("removed_at", null).maybeSingle();
  if (!member) return NextResponse.json({ error: "Conversation access denied." }, { status: 403 });
  const { data, error } = await supabase.from("messages").insert({ conversation_id: id, sender_id: user.id, client_id: parsed.data.clientId, body: parsed.data.body, kind: parsed.data.kind, reply_to_id: parsed.data.replyTo ?? null }).select("id, client_id, sender_id, body, kind, created_at").single();
  if (error) return NextResponse.json({ error: "Message could not be sent." }, { status: 400 });
  return NextResponse.json({ message: data }, { status: 201 });
}
