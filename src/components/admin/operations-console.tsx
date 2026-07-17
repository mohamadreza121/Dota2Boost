"use client";

import { useState, type ComponentType } from "react";
import { BadgeDollarSign, BarChart3, Check, CircleDollarSign, ClipboardList, FileClock, LoaderCircle, RefreshCcw, Scale, ShieldCheck, Star, UsersRound, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/portal/metric-card";
import type { AdminApplicationRow, AdminBoosterRow, AdminDisputeRow, AdminOperationsSnapshot, AdminOrderRow, AdminPersonRow, AdminReviewRow } from "@/lib/admin/operations";
import { formatCurrency } from "@/lib/utils";

type Tab = "overview" | "orders" | "people" | "applications" | "finance" | "trust" | "audit";
type Operation = { action: string; entityId: string; payload: Record<string, unknown> };
const field = "min-h-10 rounded-lg border border-white/10 bg-black/25 px-3 text-xs text-white focus:border-cyan/60 focus:outline-none";

function when(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function statusLabel(value: string) { return value.replaceAll("_", " "); }

export function AdminOperationsConsole({ initialData }: { initialData: AdminOperationsSnapshot }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState<Tab>("overview");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ error: boolean; message: string } | null>(null);

  async function refresh() {
    setBusy("refresh"); setNotice(null);
    try {
      const response = await fetch("/api/admin/operations", { cache: "no-store" });
      const payload = await response.json() as AdminOperationsSnapshot & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Operations data could not be refreshed.");
      setData(payload);
    } catch (cause) { setNotice({ error: true, message: cause instanceof Error ? cause.message : "Operations data could not be refreshed." }); }
    finally { setBusy(null); }
  }

  async function mutate(key: string, operation: Operation) {
    if (reason.trim().length < 10) { setNotice({ error: true, message: "Enter an audit reason of at least 10 characters before changing platform data." }); return; }
    setBusy(key); setNotice(null);
    try {
      const response = await fetch("/api/admin/operations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...operation, reason }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "The operation failed.");
      setNotice({ error: false, message: "Operation completed and written to the audit trail." });
      await refresh();
    } catch (cause) { setNotice({ error: true, message: cause instanceof Error ? cause.message : "The operation failed." }); setBusy(null); }
  }

  const tabs: Array<[Tab, ComponentType<{ className?: string }>, string, number | null]> = [
    ["overview", BarChart3, "Overview", null], ["orders", ClipboardList, "Orders", data.metrics.unassignedOrders], ["people", UsersRound, "Customers & boosters", null],
    ["applications", FileClock, "Applications", data.metrics.pendingApplications], ["finance", WalletCards, "Payments & refunds", data.metrics.pendingRefunds],
    ["trust", Scale, "Disputes & reviews", data.metrics.openDisputes], ["audit", ShieldCheck, "Audit", null]
  ];

  return <div>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[0.62rem] font-bold tracking-[0.13em] text-crimson uppercase">Phase 7 · Admin platform</p><h1 className="mt-2 text-3xl font-black">Live operations command center.</h1><p className="mt-2 max-w-3xl text-sm text-mist">Orders, assignment, people, payments, disputes, reviews, analytics, and immutable audit history from production data.</p></div><Button variant="secondary" onClick={() => void refresh()} disabled={busy !== null}><RefreshCcw className={`size-4 ${busy === "refresh" ? "animate-spin" : ""}`} />Refresh</Button></div>

    <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={CircleDollarSign} label="Gross revenue" value={formatCurrency(data.metrics.grossRevenue)} detail={`${formatCurrency(data.metrics.netRevenue)} after refunds`} tone="gold" />
      <MetricCard icon={ClipboardList} label="Active boosts" value={String(data.metrics.activeOrders)} detail={`${data.metrics.unassignedOrders} awaiting assignment`} tone="red" />
      <MetricCard icon={FileClock} label="Applications" value={String(data.metrics.pendingApplications)} detail={`${data.metrics.availableBoosters} verified boosters available`} tone="cyan" />
      <MetricCard icon={Scale} label="Open disputes" value={String(data.metrics.openDisputes)} detail={`${data.metrics.pendingRefunds} refund requests pending`} />
    </div>

    <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08] bg-black/15 p-1"><div className="flex min-w-max gap-1">{tabs.map(([value, Icon, label, count]) => <button key={value} onClick={() => setTab(value)} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${tab === value ? "bg-white/[0.09] text-white" : "text-mist hover:text-white"}`}><Icon className="size-4" />{label}{count ? <span className="rounded-full bg-crimson px-1.5 py-0.5 text-[0.55rem] text-white">{count}</span> : null}</button>)}</div></div>

    <label className="mt-5 block rounded-2xl border border-amber/15 bg-amber/[0.035] p-4"><span className="text-[0.6rem] font-bold tracking-wider text-amber uppercase">Mandatory audit reason</span><input className={`${field} mt-2 w-full`} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} placeholder="Explain the evidence and business reason for the next change…" /></label>
    {notice ? <div role={notice.error ? "alert" : "status"} className={`mt-4 rounded-xl border p-3 text-xs ${notice.error ? "border-crimson/25 bg-crimson/[0.06] text-[#efa0a0]" : "border-cyan/20 bg-cyan/[0.05] text-cyan"}`}>{notice.message}</div> : null}

    {tab === "overview" ? <Overview data={data} /> : null}
    {tab === "orders" ? <Orders rows={data.orders} boosters={data.boosters} busy={busy} mutate={mutate} /> : null}
    {tab === "people" ? <People customers={data.customers} boosters={data.boosters} busy={busy} mutate={mutate} /> : null}
    {tab === "applications" ? <Applications rows={data.applications} busy={busy} mutate={mutate} /> : null}
    {tab === "finance" ? <Finance data={data} /> : null}
    {tab === "trust" ? <Trust disputes={data.disputes} reviews={data.reviews} busy={busy} mutate={mutate} /> : null}
    {tab === "audit" ? <Audit data={data} /> : null}
  </div>;
}

function Overview({ data }: { data: AdminOperationsSnapshot }) {
  const health = [[BadgeDollarSign, "Refund rate", `${data.metrics.refundRate.toFixed(1)}%`, `${data.metrics.pendingRefunds} pending`], [Star, "Customer satisfaction", data.metrics.satisfaction ? data.metrics.satisfaction.toFixed(2) : "—", `${data.reviews.length} reviews`], [UsersRound, "Active customers", String(data.metrics.customers), "Customer accounts"], [ShieldCheck, "Available boosters", String(data.metrics.availableBoosters), "Verified and accepting work"]] as const;
  return <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/15"><div className="flex items-center justify-between border-b border-white/[0.08] p-5"><div><h2 className="text-sm font-black">Orders requiring action</h2><p className="mt-1 text-[0.62rem] text-mist">Paid and matching work is prioritized first.</p></div><Badge tone="red">{data.metrics.unassignedOrders} unassigned</Badge></div><div className="divide-y divide-white/[0.06]">{data.orders.filter((order) => ["paid", "matching", "disputed", "customer_review"].includes(order.status)).slice(0, 8).map((order) => <div key={order.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-xs font-black">{order.reference} · {order.service}</p><p className="mt-1 text-[0.62rem] text-mist">{order.customer} · {statusLabel(order.status)} · {formatCurrency(order.total)}</p></div><Badge tone={order.status === "disputed" ? "red" : "neutral"}>{order.coach ?? "Unassigned"}</Badge></div>)}{!data.orders.length ? <Empty text="No orders have been created yet." /> : null}</div></section><section className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><h2 className="text-sm font-black">Operational health</h2><div className="mt-5 space-y-4">{health.map(([Icon, label, value, detail]) => <div key={label} className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white/[0.04]"><Icon className="size-4 text-cyan" /></span><div className="min-w-0 flex-1"><p className="text-xs font-bold">{label}</p><p className="mt-0.5 text-[0.58rem] text-mist">{detail}</p></div><strong className="text-sm">{value}</strong></div>)}</div></section></div>;
}

function Orders({ rows, boosters, busy, mutate }: { rows: AdminOrderRow[]; boosters: AdminBoosterRow[]; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  return <section className="mt-5 space-y-4">{rows.map((order) => <OrderCard key={order.id} order={order} boosters={boosters} busy={busy} mutate={mutate} />)}{!rows.length ? <Empty text="No orders found." /> : null}</section>;
}

function OrderCard({ order, boosters, busy, mutate }: { order: AdminOrderRow; boosters: AdminBoosterRow[]; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  const [status, setStatus] = useState(order.status); const [coachId, setCoachId] = useState(""); const [compensation, setCompensation] = useState("0"); const [deadline, setDeadline] = useState(order.deadlineAt ? new Date(order.deadlineAt).toISOString().slice(0, 16) : "");
  const activeBoosters = boosters.filter((booster) => booster.available && booster.verification === "verified");
  return <article className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-black">{order.reference}</h2><Badge tone={order.status === "disputed" ? "red" : order.status === "matching" ? "gold" : "cyan"}>{statusLabel(order.status)}</Badge><Badge>{order.priority}</Badge></div><p className="mt-2 text-xs text-mist">{order.service} · {order.customer} · {formatCurrency(order.total)} · created {when(order.createdAt)}</p><p className="mt-1 text-[0.62rem] text-mist">Assigned: {order.coach ?? "Nobody"} · deadline: {when(order.deadlineAt)}</p></div></div><div className="mt-4 grid gap-3 xl:grid-cols-[1fr_auto_1fr_120px_auto_1fr_auto]"><select className={field} value={status} onChange={(event) => setStatus(event.target.value)}>{["paid", "matching", "coach_assigned", "awaiting_customer", "in_progress", "delivery_submitted", "customer_review", "completed", "disputed", "cancelled", "refunded"].map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select><Button variant="secondary" disabled={busy !== null || status === order.status} onClick={() => void mutate(`order-status-${order.id}`, { action: "order.status", entityId: order.id, payload: { status } })}>{busy === `order-status-${order.id}` ? <LoaderCircle className="size-4 animate-spin" /> : "Set status"}</Button><select className={field} value={coachId} onChange={(event) => setCoachId(event.target.value)}><option value="">Choose verified booster</option>{activeBoosters.map((booster) => <option key={booster.id} value={booster.id}>{booster.name} · {booster.rank}</option>)}</select><input className={field} type="number" min="0" step="1" value={compensation} onChange={(event) => setCompensation(event.target.value)} aria-label="Booster compensation in CAD" /><Button variant="secondary" disabled={busy !== null || !coachId} onClick={() => void mutate(`assign-${order.id}`, { action: "order.assign", entityId: order.id, payload: { coachId, compensationAmount: Math.round(Number(compensation) * 100) } })}>{busy === `assign-${order.id}` ? <LoaderCircle className="size-4 animate-spin" /> : order.coach ? "Replace" : "Assign"}</Button><input className={field} type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} aria-label="Order deadline" /><Button variant="secondary" disabled={busy !== null} onClick={() => void mutate(`deadline-${order.id}`, { action: "order.deadline", entityId: order.id, payload: { deadlineAt: deadline ? new Date(deadline).toISOString() : null } })}>Deadline</Button></div></article>;
}

function People({ customers, boosters, busy, mutate }: { customers: AdminPersonRow[]; boosters: AdminBoosterRow[]; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  return <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><h2 className="text-sm font-black">Customers</h2><div className="mt-4 space-y-3">{customers.slice(0, 100).map((person) => <PersonRow key={person.id} person={person} busy={busy} mutate={mutate} />)}{!customers.length ? <Empty text="No customers found." /> : null}</div></section><section className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><h2 className="text-sm font-black">Booster roster</h2><div className="mt-4 space-y-3">{boosters.map((booster) => <div key={booster.id} className="rounded-xl border border-white/[0.07] p-4"><div className="flex justify-between gap-3"><div><p className="text-xs font-black">{booster.name}</p><p className="mt-1 text-[0.62rem] text-mist">{booster.rank} · {booster.tier} · {booster.completed} completed</p></div><Badge tone={booster.available ? "cyan" : "neutral"}>{booster.available ? "Available" : "Paused"}</Badge></div><p className="mt-3 text-[0.6rem] text-mist">{booster.verification} · {booster.public ? "Public profile" : "Hidden profile"} · {booster.rating.toFixed(2)} rating</p></div>)}{!boosters.length ? <Empty text="No boosters found." /> : null}</div></section></div>;
}

function PersonRow({ person, busy, mutate }: { person: AdminPersonRow; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  const [status, setStatus] = useState(person.status);
  return <div className="grid gap-3 rounded-xl border border-white/[0.07] p-3 sm:grid-cols-[1fr_130px_auto] sm:items-center"><div><p className="text-xs font-bold">{person.name}</p><p className="mt-1 text-[0.58rem] text-mist">Joined {when(person.createdAt)} · last seen {when(person.lastSeenAt)}</p></div><select className={field} value={status} onChange={(event) => setStatus(event.target.value)}>{["active", "invited", "suspended", "closed"].map((value) => <option key={value}>{value}</option>)}</select><Button variant="secondary" disabled={busy !== null || status === person.status} onClick={() => void mutate(`profile-${person.id}`, { action: "profile.status", entityId: person.id, payload: { status } })}>{busy === `profile-${person.id}` ? <LoaderCircle className="size-4 animate-spin" /> : "Update"}</Button></div>;
}

function Applications({ rows, busy, mutate }: { rows: AdminApplicationRow[]; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  return <section className="mt-5 rounded-2xl border border-white/[0.08] bg-black/15 p-5"><h2 className="text-sm font-black">Booster application queue</h2><div className="mt-4 space-y-3">{rows.map((application) => <ApplicationRow key={application.id} application={application} busy={busy} mutate={mutate} />)}{!rows.length ? <Empty text="No applications found." /> : null}</div></section>;
}

function ApplicationRow({ application, busy, mutate }: { application: AdminApplicationRow; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  const [status, setStatus] = useState(application.status);
  return <div className="grid gap-3 rounded-xl border border-white/[0.07] p-4 lg:grid-cols-[1fr_220px_auto] lg:items-center"><div><p className="text-xs font-black">{application.name} · {application.rank}</p><p className="mt-1 text-[0.62rem] text-mist">{application.email} · {application.region} · submitted {when(application.createdAt)}</p></div><select className={field} value={status} onChange={(event) => setStatus(event.target.value)}>{["submitted", "under_review", "verification_required", "skill_assessment", "interview", "trial_assignment", "approved", "rejected", "suspended"].map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select><Button variant="secondary" disabled={busy !== null || status === application.status} onClick={() => void mutate(`application-${application.id}`, { action: "application.status", entityId: application.id, payload: { status } })}>{busy === `application-${application.id}` ? <LoaderCircle className="size-4 animate-spin" /> : "Save stage"}</Button></div>;
}

function Finance({ data }: { data: AdminOperationsSnapshot }) {
  return <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><h2 className="text-sm font-black">Recent payments</h2><div className="mt-4 space-y-3">{data.payments.map((payment) => <div key={payment.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] p-3"><div><p className="text-xs font-bold">{payment.reference} · {payment.customer}</p><p className="mt-1 text-[0.58rem] text-mist">{statusLabel(payment.status)} · {when(payment.createdAt)}</p></div><div className="text-right"><p className="text-xs font-black">{formatCurrency(payment.amount, payment.currency.toUpperCase())}</p>{payment.refunded ? <p className="mt-1 text-[0.58rem] text-crimson">{formatCurrency(payment.refunded)} refunded</p> : null}</div></div>)}{!data.payments.length ? <Empty text="No payments found." /> : null}</div></section><section className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-black">Refund queue</h2><a href="/admin/commerce" className="text-xs font-bold text-amber">Open refund processor →</a></div><div className="mt-4 space-y-3">{data.refunds.map((refund) => <div key={refund.id} className="rounded-xl border border-amber/15 bg-amber/[0.025] p-3"><div className="flex justify-between gap-4"><p className="text-xs font-bold">{refund.reference}</p><Badge>{statusLabel(refund.status)}</Badge></div><p className="mt-2 text-[0.62rem] text-mist">{refund.reason}</p><p className="mt-2 text-xs font-black text-amber">{formatCurrency(refund.requested)} requested</p></div>)}{!data.refunds.length ? <Empty text="No refund requests found." /> : null}</div></section></div>;
}

function Trust({ disputes, reviews, busy, mutate }: { disputes: AdminDisputeRow[]; reviews: AdminReviewRow[]; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  return <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><h2 className="text-sm font-black">Disputes</h2><div className="mt-4 space-y-4">{disputes.map((dispute) => <DisputeRow key={dispute.id} dispute={dispute} busy={busy} mutate={mutate} />)}{!disputes.length ? <Empty text="No disputes found." /> : null}</div></section><section className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"><h2 className="text-sm font-black">Review moderation</h2><div className="mt-4 space-y-4">{reviews.map((review) => <ReviewRow key={review.id} review={review} busy={busy} mutate={mutate} />)}{!reviews.length ? <Empty text="No reviews found." /> : null}</div></section></div>;
}

function DisputeRow({ dispute, busy, mutate }: { dispute: AdminDisputeRow; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  const [status, setStatus] = useState(dispute.status); const [decision, setDecision] = useState(dispute.decision ?? "");
  return <div className="rounded-xl border border-amber/15 bg-amber/[0.025] p-4"><div className="flex justify-between gap-3"><div><p className="text-xs font-black">{dispute.reference} · {dispute.reason}</p><p className="mt-1 text-[0.58rem] text-mist">Opened by {dispute.openedBy} · {when(dispute.createdAt)}</p></div><Badge tone="red">{statusLabel(dispute.status)}</Badge></div><p className="mt-3 text-xs leading-5 text-mist">{dispute.description}</p><div className="mt-3 grid gap-2 sm:grid-cols-[180px_1fr_auto]"><select className={field} value={status} onChange={(event) => setStatus(event.target.value)}>{["opened", "awaiting_customer", "awaiting_coach", "under_review", "resolved_customer", "resolved_coach", "partial_refund", "closed"].map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select><input className={field} value={decision} onChange={(event) => setDecision(event.target.value)} placeholder="Resolution decision (required when closing)" /><Button variant="secondary" disabled={busy !== null || (status === dispute.status && decision === (dispute.decision ?? ""))} onClick={() => void mutate(`dispute-${dispute.id}`, { action: "dispute.status", entityId: dispute.id, payload: { status, decision: decision || null } })}>{busy === `dispute-${dispute.id}` ? <LoaderCircle className="size-4 animate-spin" /> : "Update"}</Button></div></div>;
}

function ReviewRow({ review, busy, mutate }: { review: AdminReviewRow; busy: string | null; mutate: (key: string, operation: Operation) => Promise<void> }) {
  return <div className="rounded-xl border border-white/[0.07] p-4"><div className="flex justify-between gap-3"><div><p className="text-xs font-black">{review.reference} · {review.rating}/5</p><p className="mt-1 text-[0.58rem] text-mist">{review.customer} for {review.coach}</p></div><div className="flex gap-2"><Badge tone={review.verified ? "cyan" : "neutral"}>{review.verified ? "Verified" : "Unverified"}</Badge><Badge tone={review.public ? "gold" : "neutral"}>{review.public ? "Public" : "Hidden"}</Badge></div></div><p className="mt-3 text-xs leading-5 text-mist">{review.feedback}</p><div className="mt-3 flex flex-wrap gap-2"><Button variant="secondary" disabled={busy !== null || (review.public && review.verified)} onClick={() => void mutate(`review-publish-${review.id}`, { action: "review.moderate", entityId: review.id, payload: { isPublic: true, isVerified: true, moderatedContent: null } })}>{busy === `review-publish-${review.id}` ? <LoaderCircle className="size-4 animate-spin" /> : <><Check className="size-4" />Verify & publish</>}</Button><Button variant="ghost" disabled={busy !== null || !review.public} onClick={() => void mutate(`review-hide-${review.id}`, { action: "review.moderate", entityId: review.id, payload: { isPublic: false, isVerified: review.verified, moderatedContent: null } })}>Hide</Button></div></div>;
}

function Audit({ data }: { data: AdminOperationsSnapshot }) {
  return <section className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/15"><div className="border-b border-white/[0.08] p-5"><h2 className="text-sm font-black">Immutable audit history</h2><p className="mt-1 text-[0.62rem] text-mist">Latest sensitive operations, catalog changes, refunds, and assignment events.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-white/[0.07] text-[0.55rem] font-bold tracking-wider text-mist uppercase"><tr><th className="px-5 py-3">When</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th><th className="px-5 py-3">Reason</th></tr></thead><tbody className="divide-y divide-white/[0.06] text-xs">{data.audit.map((item) => <tr key={item.id}><td className="px-5 py-4 text-mist">{when(item.createdAt)}</td><td className="px-4 py-4 font-bold">{item.actor}</td><td className="px-4 py-4 text-cyan">{item.action}</td><td className="px-4 py-4 text-mist">{item.entityType}</td><td className="max-w-md px-5 py-4 text-mist">{item.reason ?? "System event"}</td></tr>)}</tbody></table></div>{!data.audit.length ? <Empty text="No audit events found." /> : null}</section>;
}

function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-white/[0.12] p-8 text-center text-xs text-mist">{text}</div>; }
