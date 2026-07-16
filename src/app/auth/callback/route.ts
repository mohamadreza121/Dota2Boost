import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next");
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.includes("\\") ? requestedNext : "/dashboard";
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(absoluteUrl(next));
  }
  return NextResponse.redirect(absoluteUrl("/auth/sign-in?error=The%20confirmation%20link%20is%20invalid%20or%20expired."));
}
