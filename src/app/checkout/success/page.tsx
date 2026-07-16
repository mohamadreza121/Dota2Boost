import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Checkout Complete", robots: { index: false, follow: false } };
export default function CheckoutSuccessPage() { return <section className="container-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center"><span className="grid size-16 place-items-center rounded-full border border-cyan/25 bg-cyan/[0.08]"><CheckCircle2 className="size-7 text-cyan" /></span><h1 className="mt-7 text-4xl font-black">Payment submitted.</h1><p className="mt-4 max-w-lg text-sm leading-6 text-mist">Stripe will confirm payment and tax securely. Your boost workspace appears only after our signed webhook validates the final amount.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/dashboard" className="rounded-full bg-crimson px-6 py-3 text-sm font-bold">Open boost dashboard</Link><Link href="/dashboard/billing" className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold">Billing & receipts</Link></div></section>; }
