"use client";

import { useState } from "react";
import { ExternalLink, LoaderCircle, ReceiptText, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export interface BillingPayment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
}

export function BillingPanel({ payments }: { payments: BillingPayment[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openUrl(endpoint: string, method: "GET" | "POST", key: string, redirect = false) {
    setBusy(key); setError(null);
    try {
      const response = await fetch(endpoint, { method });
      const body = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !body.url) throw new Error(body.error ?? "Billing link could not be opened.");
      if (redirect) window.location.assign(body.url); else window.open(body.url, "_blank", "noopener,noreferrer");
    } catch (billingError) {
      setError(billingError instanceof Error ? billingError.message : "Billing link could not be opened.");
    } finally { setBusy(null); }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[0.62rem] font-bold tracking-[0.13em] text-cyan uppercase">Stripe billing</p><h1 className="mt-2 text-3xl font-black">Receipts and payment methods.</h1><p className="mt-2 text-sm text-mist">Open hosted receipts or manage reusable billing details through Stripe.</p></div><Button variant="secondary" onClick={() => openUrl("/api/billing/portal", "POST", "portal", true)} disabled={busy !== null}>{busy === "portal" ? <LoaderCircle className="size-4 animate-spin" /> : <WalletCards className="size-4" />}Billing portal</Button></div>
      {error ? <p role="alert" className="mt-5 rounded-xl border border-crimson/20 bg-crimson/[0.06] p-4 text-xs text-[#f0a1a1]">{error}</p> : null}
      <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/15">
        <div className="border-b border-white/[0.08] p-5"><h2 className="text-sm font-black">Payment history</h2></div>
        {payments.length ? <div className="divide-y divide-white/[0.07]">{payments.map((payment) => <article key={payment.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black">Order {payment.orderId.slice(0, 8).toUpperCase()}</p><Badge tone={payment.status === "succeeded" ? "cyan" : payment.status.includes("refund") ? "gold" : "neutral"}>{payment.status.replaceAll("_", " ")}</Badge></div><p className="mt-2 text-sm font-black">{formatCurrency(payment.amount)} <span className="text-[0.58rem] font-bold text-mist uppercase">{payment.currency}</span></p><p className="mt-1 text-[0.6rem] text-mist">{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "Awaiting payment"}</p></div><Button variant="secondary" className="rounded-xl" disabled={busy !== null || !payment.paidAt} onClick={() => openUrl(`/api/orders/${payment.orderId}/receipt`, "GET", payment.id)}>{busy === payment.id ? <LoaderCircle className="size-4 animate-spin" /> : <ReceiptText className="size-4" />}Receipt <ExternalLink className="size-3" /></Button></article>)}</div> : <div className="p-12 text-center"><ReceiptText className="mx-auto size-6 text-mist" /><p className="mt-4 text-sm font-bold">No payments yet.</p><p className="mt-2 text-xs text-mist">Completed Stripe payments will appear here.</p></div>}
      </section>
    </div>
  );
}
