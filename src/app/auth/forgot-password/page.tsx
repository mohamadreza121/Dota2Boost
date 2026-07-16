import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { AuthCard } from "@/components/forms/auth-card";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false, follow: false } };
interface Props { searchParams: Promise<{ sent?: string }> }
export default async function ForgotPasswordPage({ searchParams }: Props) { const { sent } = await searchParams; return <AuthCard eyebrow="Account recovery" title={sent ? "Check your inbox." : "Reset your password."} description={sent ? "If an account exists for that address, we sent a secure reset link." : "Enter the email attached to your account. We will send a time-limited recovery link."} footer={<Link href="/auth/sign-in" className="font-bold text-white">Return to sign in</Link>}>{sent ? <div className="rounded-xl border border-cyan/20 bg-cyan/[0.06] p-4 text-sm leading-6 text-[#bcd0cd]">For privacy, the confirmation is the same whether or not the email is registered.</div> : <form action={requestPasswordReset}><label className="block text-xs font-bold">Email<input className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-3.5 text-sm focus:border-cyan/60 focus:outline-none" name="email" type="email" autoComplete="email" required /></label><button className="mt-5 min-h-12 w-full rounded-full bg-crimson px-5 text-sm font-bold">Send reset link</button></form>}</AuthCard>; }
