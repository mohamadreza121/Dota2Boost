"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, LoaderCircle, ReceiptText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Confirmation {
  state: "checking" | "processing" | "confirmed" | "failed" | "error";
  paymentStatus?: string;
  orderStatus?: string;
  orderId?: string;
  publicReference?: string;
  amount?: number;
  currency?: string;
  paidAt?: string | null;
  error?: string;
}

export function PaymentConfirmation({ sessionId }: { sessionId?: string }) {
  const [confirmation, setConfirmation] = useState<Confirmation>(sessionId ? { state: "checking" } : { state: "error", error: "This confirmation link is missing its Stripe Checkout session." });

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    let timer: number | undefined;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const response = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId!)}`, { cache: "no-store" });
        const body = (await response.json()) as Confirmation;
        if (!active) return;
        if (!response.ok) {
          setConfirmation({ state: "error", error: body.error ?? "Payment confirmation is temporarily unavailable." });
          return;
        }
        setConfirmation(body);
        if (body.state === "processing" && attempts < 15) timer = window.setTimeout(poll, 2000);
      } catch {
        if (!active) return;
        if (attempts < 15) timer = window.setTimeout(poll, 2000);
        else setConfirmation({ state: "error", error: "Payment confirmation is taking longer than expected. Your dashboard will update after the signed Stripe webhook arrives." });
      }
    }

    void poll();
    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [sessionId]);

  const confirmed = confirmation.state === "confirmed";
  const failed = confirmation.state === "failed" || confirmation.state === "error";
  const Icon = confirmed ? CheckCircle2 : failed ? CircleAlert : LoaderCircle;

  return (
    <section className="container-shell flex min-h-[72vh] flex-col items-center justify-center py-20 text-center">
      <span className={`grid size-16 place-items-center rounded-full border ${confirmed ? "border-cyan/25 bg-cyan/[0.08]" : failed ? "border-crimson/25 bg-crimson/[0.08]" : "border-amber/25 bg-amber/[0.08]"}`}><Icon className={`size-7 ${confirmed ? "text-cyan" : failed ? "text-crimson" : "animate-spin text-amber"}`} /></span>
      <p className="mt-6 text-[0.65rem] font-black tracking-[0.15em] text-mist uppercase">{confirmation.publicReference ?? "Stripe Checkout"}</p>
      <h1 className="mt-3 text-balance text-4xl font-black sm:text-5xl">{confirmed ? "Payment confirmed." : confirmation.state === "failed" ? "Payment was not completed." : confirmation.state === "error" ? "Confirmation needs attention." : "Confirming payment…"}</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-mist">
        {confirmed
          ? `The signed Stripe webhook confirmed ${confirmation.amount ? formatCurrency(confirmation.amount) : "your payment"}. Your MMR service workspace is ready for matching.`
          : confirmation.state === "failed"
            ? "Stripe reported that this payment did not complete. No service delivery will start for an unpaid order."
            : confirmation.error ?? "Checkout returned successfully. We are waiting for the signed Stripe webhook before activating the order."}
      </p>
      {confirmed ? <div className="mt-6 flex items-center gap-2 rounded-full border border-cyan/15 bg-cyan/[0.05] px-4 py-2 text-xs font-bold text-cyan"><ReceiptText className="size-4" />Receipt available in Billing</div> : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={confirmation.orderId ? `/dashboard/orders/${confirmation.orderId}` : "/dashboard"} className="rounded-full bg-crimson px-6 py-3 text-sm font-bold">{confirmed ? "Open MMR order" : "Open dashboard"}</Link>
        <Link href="/dashboard/billing" className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold">Billing & receipts</Link>
        {confirmation.state === "failed" ? <Link href="/pricing" className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold">Try checkout again</Link> : null}
      </div>
      <p className="mt-8 max-w-lg text-[0.65rem] leading-5 text-[#7d8582]">The redirect never marks an order paid. Only a signature-verified Stripe webhook can activate service delivery.</p>
    </section>
  );
}
