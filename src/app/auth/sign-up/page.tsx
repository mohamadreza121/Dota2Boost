import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { AuthCard } from "@/components/forms/auth-card";

export const metadata: Metadata = { title: "Create Customer Account", robots: { index: false, follow: false } };
interface Props { searchParams: Promise<{ error?: string }> }
const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-3.5 text-sm focus:border-cyan/60 focus:outline-none";

export default async function SignUpPage({ searchParams }: Props) { const query = await searchParams; return <AuthCard eyebrow="Customer registration" title="Build your workspace." description="Public registration creates customer accounts only. Boosters apply separately and staff accounts are invitation-only." footer={<>Already have an account? <Link href="/auth/sign-in" className="font-bold text-white">Sign in</Link></>}>
  {query.error ? <p role="alert" className="mb-5 rounded-xl border border-crimson/20 bg-crimson/[0.08] p-3 text-xs text-[#ef9a9a]">{query.error}</p> : null}
  <form action={signUp} className="space-y-4"><label className="block text-xs font-bold">Display name<input className={fieldClass} name="displayName" autoComplete="name" maxLength={60} required /></label><label className="block text-xs font-bold">Email<input className={fieldClass} name="email" type="email" autoComplete="email" required /></label><label className="block text-xs font-bold">Password<input className={fieldClass} name="password" type="password" autoComplete="new-password" minLength={10} required /><span className="mt-2 block font-normal text-mist">At least 10 characters.</span></label><label className="flex items-start gap-3 rounded-xl border border-white/[0.08] p-3 text-xs leading-5 text-mist"><input className="mt-1 accent-[#d25353]" type="checkbox" name="agree" required />I agree to the Terms, Privacy Policy, Acceptable Use Policy, and the rule that account credentials must never be shared.</label><button className="min-h-12 w-full rounded-full bg-crimson px-5 text-sm font-bold transition hover:bg-[#e05c5c]">Create customer account</button></form>
  <p className="mt-5 text-center text-[0.65rem] leading-5 text-mist">Are you a high-rank player? <Link href="/work-with-us" className="font-bold text-cyan">Apply as a booster</Link>.</p>
  </AuthCard>; }
