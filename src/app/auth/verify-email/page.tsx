import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
export const metadata: Metadata = { title: "Verify Your Email", robots: { index: false, follow: false } };
export default function VerifyEmailPage() { return <section className="container-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center"><span className="grid size-16 place-items-center rounded-2xl border border-cyan/20 bg-cyan/[0.08]"><MailCheck className="size-7 text-cyan" /></span><h1 className="mt-7 text-4xl font-black">Verify your email.</h1><p className="mt-4 max-w-md text-sm leading-6 text-mist">Open the confirmation email to activate your customer account. The link returns you securely to Highground.</p><Link href="/auth/sign-in" className="mt-7 rounded-full border border-white/15 px-5 py-3 text-sm font-bold">Back to sign in</Link></section>; }
