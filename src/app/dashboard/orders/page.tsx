import { CalendarDays, Home, MessageSquareText, PackageCheck, Settings, TrendingUp, UserRound, WalletCards } from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { LinkButton } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/require-role";
import { getCustomerOrders } from "@/lib/portal/customer-orders";

export const dynamic = "force-dynamic";

const nav: PortalNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "My boosts", href: "/dashboard/orders", icon: PackageCheck, active: true },
  { label: "Messages", href: "/dashboard/orders", icon: MessageSquareText },
  { label: "Queue schedule", href: "/dashboard/orders", icon: CalendarDays },
  { label: "Progress", href: "/dashboard/orders", icon: TrendingUp },
  { label: "Boosters", href: "/boosters", icon: UserRound },
  { label: "Billing", href: "/dashboard/billing", icon: WalletCards },
  { label: "Settings", href: "/dashboard#settings", icon: Settings }
];

const statusLabel: Record<string, string> = {
  payment_pending: "Awaiting payment",
  paid: "Paid",
  matching: "Matching",
  coach_assigned: "Booster assigned",
  awaiting_customer: "Your action needed",
  in_progress: "In progress",
  delivery_submitted: "Delivery submitted",
  customer_review: "Ready for review",
  completed: "Completed",
  disputed: "Under review",
  cancelled: "Cancelled",
  refunded: "Refunded",
  draft: "Draft"
};

export default async function CustomerOrdersPage() {
  const user = await requireRole(["customer"]);
  const orders = await getCustomerOrders(user.id);
  return (
    <PortalShell user={user} label="Customer" navigation={nav}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[0.62rem] font-bold tracking-[0.13em] text-amber uppercase">Your delivery board</p><h1 className="mt-2 text-3xl font-black">My boosts</h1><p className="mt-2 text-sm text-mist">Every paid Dota 2 order, milestone, and current delivery state in one place.</p></div><LinkButton href="/pricing">Start a new boost</LinkButton></div>
      {orders.length ? <div className="mt-8 grid gap-3">{orders.map((order) => <a key={order.id} href={`/dashboard/orders/${order.id}`} className="group rounded-2xl border border-white/[0.08] bg-black/15 p-5 transition hover:border-amber/35 hover:bg-white/[0.035]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><span className="text-[0.6rem] font-black tracking-[0.15em] text-amber uppercase">{order.publicReference}</span><span className="rounded-full border border-cyan/20 bg-cyan/[0.06] px-2 py-1 text-[0.55rem] font-bold text-cyan uppercase">{statusLabel[order.status]}</span></div><h2 className="mt-3 text-lg font-black group-hover:text-amber">{order.serviceName}</h2><p className="mt-1 text-xs text-mist">{order.scope}</p></div><div className="w-full sm:w-52"><div className="flex justify-between text-[0.6rem] font-bold text-mist"><span>Milestones</span><span>{order.totalMilestones ? `${order.progressPercent}%` : "Pending setup"}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-gradient-to-r from-crimson via-amber to-cyan" style={{ width: `${order.progressPercent}%` }} /></div><p className="mt-2 text-[0.58rem] text-mist">{order.totalMilestones ? `${order.completedMilestones} of ${order.totalMilestones} complete` : "Operations will add your milestones after matching."}</p></div></div></a>)}</div> : <section className="mt-8 rounded-[1.7rem] border border-dashed border-white/[0.16] bg-black/15 px-6 py-14 text-center"><PackageCheck className="mx-auto size-8 text-amber" /><h2 className="mt-5 text-xl font-black">Your Dota 2 delivery board is clear.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-mist">When a payment is confirmed, your MMR Boost, Calibration, Behavior Score, or Win Boost appears here with live milestones.</p><LinkButton href="/pricing" className="mt-7">Configure an MMR boost</LinkButton></section>}
    </PortalShell>
  );
}
