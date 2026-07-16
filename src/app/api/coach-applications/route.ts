import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { coachApplicationSchema } from "@/lib/validation/coach-application";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendApplicationReceipt } from "@/lib/email/resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 80_000) return NextResponse.json({ error: "Application is too large." }, { status: 413 });
  const parsed = coachApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Review the highlighted application fields." }, { status: 400 });

  try {
    if (!(await verifyTurnstile(parsed.data.turnstileToken, request))) return NextResponse.json({ error: "Bot verification failed. Refresh and try again." }, { status: 400 });
    const admin = createAdminClient();
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const key = createHash("sha256").update(`${process.env.TURNSTILE_SECRET_KEY ?? "highground"}:${forwarded}`).digest("hex");
    const { data: allowed, error: limitError } = await admin.rpc("consume_rate_limit", { p_key: `booster_application:${key}`, p_limit: 5, p_window_seconds: 3600 });
    if (limitError) throw limitError;
    if (!allowed) return NextResponse.json({ error: "Too many applications from this connection. Try again later." }, { status: 429 });

    const input = parsed.data;
    const { data: application, error } = await admin.from("coach_applications").insert({ legal_name: input.legalName, display_name: input.displayName, email: input.email.toLowerCase(), country: input.country, time_zone: input.timeZone, languages: input.languages.split(",").map((item) => item.trim()).filter(Boolean), current_rank: input.currentRank, peak_rank: input.peakRank, main_roles: input.mainRoles.split(",").map((item) => item.trim()).filter(Boolean), best_heroes: input.bestHeroes.split(",").map((item) => item.trim()).filter(Boolean), public_gameplay_profile: input.gameplayProfile, coaching_experience: input.coachingExperience, weekly_availability: input.weeklyAvailability, preferred_compensation: input.preferredCompensation, biography: input.biography, sample_replay_analysis: input.sampleReplayAnalysis, sample_coaching_video_url: input.sampleCoachingVideoUrl || null, why_join: input.whyJoin, agreement_accepted_at: new Date().toISOString(), status: "submitted" }).select("id").single();
    if (error || !application) throw error ?? new Error("Application insert failed.");
    await sendApplicationReceipt({ to: input.email, displayName: input.displayName, applicationId: application.id }).catch((emailError) => console.error("application_email_failed", { applicationId: application.id, message: emailError instanceof Error ? emailError.message : "unknown" }));
    return NextResponse.json({ accepted: true, applicationId: application.id }, { status: 201 });
  } catch (error) {
    console.error("booster_application_failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "Applications are temporarily unavailable. Please try again." }, { status: 503 });
  }
}

async function verifyTurnstile(token: string | undefined, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret, response: token, remoteip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "" }), signal: AbortSignal.timeout(5000) });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean };
  return result.success === true;
}
