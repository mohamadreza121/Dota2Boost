import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import { AuthCard } from "@/components/forms/auth-card";

export const metadata: Metadata = { title: "Sign In", robots: { index: false, follow: false } };
interface Props { searchParams: Promise<{ error?: string; next?: string; type?: string }> }
const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-3.5 text-sm focus:border-cyan/60 focus:outline-none";

export default async function SignInPage({ searchParams }: Props) {
  const query = await searchParams;
  const audience = query.type === "coach" ? "Booster" : query.type === "admin" ? "Admin" : "Customer";
  return <AuthCard eyebrow={`${audience} access`} title="Welcome back." description="Continue to your private boost workspace.">
    <div className="mb-6 grid grid-cols-3 gap-1 rounded-xl border border-white/[0.08] bg-black/15 p-1">{[["Customer", ""], ["Booster", "coach"], ["Admin", "admin"]].map(([label, type]) => <Link key={label} href={`/auth/sign-in${type ? `?type=${type}` : ""}`} className={`rounded-lg px-2 py-2 text-center text-[0.65rem] font-bold ${audience === label ? "bg-white/[0.09] text-white" : "text-mist"}`}>{label}</Link>)}</div>
    {query.error ? <p role="alert" className="mb-5 rounded-xl border border-crimson/20 bg-crimson/[0.08] p-3 text-xs leading-5 text-[#ef9a9a]">{query.error}</p> : null}
    <form action={signIn} className="space-y-4"><input type="hidden" name="next" value={query.next ?? (audience === "Booster" ? "/coach" : audience === "Admin" ? "/admin" : "/dashboard")} /><label className="block text-xs font-bold">Email<input className={fieldClass} name="email" type="email" autoComplete="email" required /></label><label className="block text-xs font-bold">Password<input className={fieldClass} name="password" type="password" autoComplete="current-password" minLength={8} required /></label><div className="flex justify-end"><Link href="/auth/forgot-password" className="text-xs text-cyan hover:underline">Forgot password?</Link></div><button className="min-h-12 w-full rounded-full bg-crimson px-5 text-sm font-bold transition hover:bg-[#e05c5c]">Sign in securely</button></form>
    {audience === "Customer" ? <p className="mt-6 text-center text-xs text-mist">New here? <Link href="/auth/sign-up" className="font-bold text-white hover:underline">Create a customer account</Link></p> : <p className="mt-6 text-center text-[0.68rem] leading-5 text-mist">{audience} accounts are invitation-only and cannot be registered publicly.</p>}
  </AuthCard>;
}
