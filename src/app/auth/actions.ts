"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/utils";

const safeLocalPath = z.string().refine((path) => path.startsWith("/") && !path.startsWith("//") && !path.includes("\\"), "Invalid redirect path");
const signInSchema = z.object({ email: z.email(), password: z.string().min(8).max(128), next: safeLocalPath.optional() });
const signUpSchema = z.object({ displayName: z.string().trim().min(2).max(60), email: z.email(), password: z.string().min(10).max(128), agree: z.literal("on") });

export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({ email: formData.get("email"), password: formData.get("password"), next: formData.get("next") || undefined });
  if (!parsed.success) redirect("/auth/sign-in?error=Check%20your%20email%20and%20password.");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) redirect("/auth/sign-in?error=Sign-in%20failed.%20Check%20your%20details%20and%20try%20again.");
  redirect(parsed.data.next ?? "/dashboard");
}

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({ displayName: formData.get("displayName"), email: formData.get("email"), password: formData.get("password"), agree: formData.get("agree") });
  if (!parsed.success) redirect("/auth/sign-up?error=Please%20complete%20every%20required%20field.");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { emailRedirectTo: absoluteUrl("/auth/callback"), data: { display_name: parsed.data.displayName } } });
  if (error) redirect("/auth/sign-up?error=Account%20creation%20failed.%20Please%20try%20again.");
  redirect("/auth/verify-email");
}

export async function requestPasswordReset(formData: FormData) {
  const email = z.email().safeParse(formData.get("email"));
  if (email.success) { const supabase = await createClient(); await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: absoluteUrl("/auth/callback?next=/auth/reset-password") }); }
  redirect("/auth/forgot-password?sent=true");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updatePassword(formData: FormData) {
  const password = z.string().min(10).max(128).safeParse(formData.get("password"));
  if (!password.success) redirect("/auth/reset-password?error=Use%20at%20least%2010%20characters.");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) redirect("/auth/reset-password?error=Your%20reset%20link%20may%20have%20expired.");
  redirect("/dashboard");
}
