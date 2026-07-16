"use client";

import { useState } from "react";
import { ExternalLink, LoaderCircle, ReceiptText, RotateCcw, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export interface BillingPayment {
  id: string;
  orderId: string;
  amount: number;
  refundedAmount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  refundStatus: string | null;
}

export function BillingPanel({ payments }: { payments: BillingPayment[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refundOrder, setRefundOrder] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundStatuses, setRefundStatuses] = useState<Record<string, string | null>>(() => Object.fromEntries(payments.map((payment) => [payment.orderId, payment.refundStatus])));

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

  function openRefund(payment: BillingPayment) {
    setRefundOrder(payment.orderId);
    setRefundAmount(((payment.amount - payment.refundedAmount) / 100).toFixed(2));
    setRefundReason("");
    setError(null);
  }

  async function submitRefundRequest() {
    if (!refundOrder) return;
    const amount = Math.round(Number(refundAmount) * 100);
    if (!Number.isFinite(amount) || amount < 100) {
      setError("Enter a refund amount of at least $1.00.");
      return;
    }
    setBusy(`refund-${refundOrder}`);
    setError(null);
    try {
      const response = await fetch(`/api/orders/${refundOrder}/refund-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason: refundReason })
      });
      const body = (await response.json()) as { status?: string; error?: string };
      if (!response.ok || !body.status) throw new Error(body.error ?? "Refund request could not be submitted.");
      setRefundStatuses((current) => ({ ...current, [refundOrder]: body.status! }));
      setRefundOrder(null);
      setRefundAmount("");
      setRefundReason("");
    } catch (refundError) {
      setError(refundError instanceof Error ? refundError.message : "Refund request could not be submitted.");
    } finally { setBusy(null); }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-[0.62rem] font-bold tracking-[0.13em] text-cyan uppercase">Stripe billing</p><h1 className="mt-2 text-3xl font-black">Payments, receipts, and refunds.</h1><p className="mt-2 text-sm text-mist">Open Stripe-hosted receipts, manage billing details, or submit a refund request for review.</p></div><Button variant="secondary" onClick={() => openUrl("/api/billing/portal", "POST", "portal", true)} disabled={busy !== null}>{busy === "portal" ? <LoaderCircle className="size-4 animate-spin" /> : <WalletCards className="size-4" />}Billing portal</Button></div>
      {error ? <p role="alert" className="mt-5 rounded-xl border border-crimson/20 bg-crimson/[0.06] p-4 text-xs text-[#f0a1a1]">{error}</p> : null}
      <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/15">
        <div className="border-b border-white/[0.08] p-5"><h2 className="text-sm font-black">Payment history</h2></div>
        {payments.length ? <div className="divide-y divide-white/[0.07]">{payments.map((payment) => {
          const refundStatus = refundStatuses[payment.orderId];
          const available = payment.amount - payment.refundedAmount;
          const canRequest = ["succeeded", "partially_refunded"].includes(payment.status) && available > 0 && !["requested", "under_review", "approved", "partially_approved"].includes(refundStatus ?? "");
          return <article key={payment.id} className="p-5"><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black">Order {payment.orderId.slice(0, 8).toUpperCase()}</p><Badge tone={payment.status === "succeeded" ? "cyan" : payment.status.includes("refund") ? "gold" : "neutral"}>{payment.status.replaceAll("_", " ")}</Badge>{refundStatus ? <Badge tone="gold">refund {refundStatus.replaceAll("_", " ")}</Badge> : null}</div><p className="mt-2 text-sm font-black">{formatCurrency(payment.amount)} <span className="text-[0.58rem] font-bold text-mist uppercase">{payment.currency}</span></p><p className="mt-1 text-[0.6rem] text-mist">{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "Awaiting payment"}{payment.refundedAmount ? ` · ${formatCurrency(payment.refundedAmount)} refunded` : ""}</p></div><div className="flex flex-wrap gap-2"><Button variant="secondary" className="rounded-xl" disabled={busy !== null || !payment.paidAt} onClick={() => openUrl(`/api/orders/${payment.orderId}/receipt`, "GET", payment.id)}>{busy === payment.id ? <LoaderCircle className="size-4 animate-spin" /> : <ReceiptText className="size-4" />}Receipt <ExternalLink className="size-3" /></Button>{canRequest ? <Button variant="secondary" className="rounded-xl" disabled={busy !== null} onClick={() => openRefund(payment)}><RotateCcw className="size-4" />Request refund</Button> : null}</div></div>
            {refundOrder === payment.orderId ? <div className="mt-5 rounded-xl border border-amber/20 bg-amber/[0.05] p-4"><div className="grid gap-4 sm:grid-cols-[160px_1fr]"><label className="text-xs font-bold">Amount (CAD)<input inputMode="decimal" value={refundAmount} onChange={(event) => setRefundAmount(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm focus:border-cyan/60 focus:outline-none" /></label><label className="text-xs font-bold">Reason for review<textarea value={refundReason} onChange={(event) => setRefundReason(event.target.value)} minLength={20} maxLength={500} rows={3} placeholder="Explain what was not delivered and the resolution you are requesting." className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm leading-5 focus:border-cyan/60 focus:outline-none" /></label></div><p className="mt-3 text-[0.65rem] leading-5 text-mist">Submitting creates an auditable request; it does not issue money automatically. Approved refunds return through Stripe to the original payment method.</p><div className="mt-4 flex gap-2"><Button onClick={submitRefundRequest} disabled={busy !== null || refundReason.trim().length < 20}>{busy === `refund-${payment.orderId}` ? <LoaderCircle className="size-4 animate-spin" /> : null}Submit for review</Button><Button variant="secondary" onClick={() => setRefundOrder(null)} disabled={busy !== null}>Cancel</Button></div></div> : null}
          </article>;
        })}</div> : <div className="p-12 text-center"><ReceiptText className="mx-auto size-6 text-mist" /><p className="mt-4 text-sm font-bold">No payments yet.</p><p className="mt-2 text-xs text-mist">Completed Stripe payments will appear here.</p></div>}
      </section>
    </div>
  );
}
