import type { Metadata } from "next";
import { updatePassword } from "@/app/auth/actions";
import { AuthCard } from "@/components/forms/auth-card";
export const metadata: Metadata = { title: "Choose New Password", robots: { index: false, follow: false } };
interface Props { searchParams: Promise<{ error?: string }> }
export default async function ResetPasswordPage({ searchParams }: Props) { const { error } = await searchParams; return <AuthCard eyebrow="Secure reset" title="Choose a new password." description="Use at least 10 characters and avoid reusing a password from another service.">{error ? <p className="mb-4 rounded-xl border border-crimson/20 bg-crimson/[0.08] p-3 text-xs text-[#ef9a9a]">{error}</p> : null}<form action={updatePassword}><label className="block text-xs font-bold">New password<input className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-3.5 text-sm focus:border-cyan/60 focus:outline-none" name="password" type="password" autoComplete="new-password" minLength={10} required /></label><button className="mt-5 min-h-12 w-full rounded-full bg-crimson px-5 text-sm font-bold">Update password</button></form></AuthCard>; }
