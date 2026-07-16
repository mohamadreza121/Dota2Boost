import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const requestSchema = z.object({ conversationId: z.uuid(), fileName: z.string().min(1).max(180), mimeType: z.string().min(3).max(120), fileSize: z.number().int().positive().max(100 * 1024 * 1024) });
const limits: Record<string, number> = { "image/jpeg": 10 * 1024 * 1024, "image/png": 10 * 1024 * 1024, "image/webp": 10 * 1024 * 1024, "audio/webm": 20 * 1024 * 1024, "audio/ogg": 20 * 1024 * 1024, "audio/mpeg": 20 * 1024 * 1024, "video/mp4": 100 * 1024 * 1024, "video/webm": 100 * 1024 * 1024, "application/pdf": 20 * 1024 * 1024, "text/plain": 2 * 1024 * 1024 };
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "audio/webm": "webm", "audio/ogg": "ogg", "audio/mpeg": "mp3", "video/mp4": "mp4", "video/webm": "webm", "application/pdf": "pdf", "text/plain": "txt" };

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Upload request is invalid." }, { status: 400 });
  const limit = limits[parsed.data.mimeType];
  if (!limit || parsed.data.fileSize > limit) return NextResponse.json({ error: "File type or size is not allowed." }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: member } = await supabase.from("conversation_members").select("conversation_id").eq("conversation_id", parsed.data.conversationId).eq("user_id", user.id).is("removed_at", null).maybeSingle();
  if (!member) return NextResponse.json({ error: "Conversation access denied." }, { status: 403 });
  const path = `${parsed.data.conversationId}/${user.id}/${randomUUID()}.${extensions[parsed.data.mimeType]}`;
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("private-chat").createSignedUploadUrl(path);
  if (error) return NextResponse.json({ error: "Upload could not be authorized." }, { status: 503 });
  return NextResponse.json({ path, token: data.token, signedUrl: data.signedUrl, maxBytes: limit, mimeType: parsed.data.mimeType }, { headers: { "Cache-Control": "no-store" } });
}
