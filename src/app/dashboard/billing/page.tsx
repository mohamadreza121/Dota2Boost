import { CalendarDays, Home, MessageSquareText, PackageCheck, Settings, TrendingUp, UserRound, WalletCards } from "lucide-react";
import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { BillingPanel, type BillingPayment } from "@/components/portal/billing-panel";
import { requireRole } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const nav: PortalNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "My boosts", href: "/dashboard/orders/demo-order", icon: PackageCheck },
  { label: "Messages", href: "/dashboard/orders/demo-order#messages", icon: MessageSquareText },
  { label: "Queue schedule", href: "/dashboard#sessions", icon: CalendarDays },
  { label: "Progress", href: "/dashboard#progress", icon: TrendingUp },
  { label: "Boosters", href: "/boosters", icon: UserRound },
  { label: "Billing", href: "/dashboard/billing", icon: WalletCards, active: true },
  { label: "Settings", href: "/dashboard#settings", icon: Settings }
];

export default async function BillingPage() {
  const user = await requireRole(["customer"]);
  const supabase = await createClient();
  const { data } = await supabase.from("payments").select("id, order_id, gross_amount, currency, status, paid_at").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(25);
  const payments: BillingPayment[] = (data ?? []).map((payment) => ({ id: payment.id as string, orderId: payment.order_id as string, amount: payment.gross_amount as number, currency: payment.currency as string, status: payment.status as string, paidAt: payment.paid_at as string | null }));
  return <PortalShell user={user} label="Customer" navigation={nav}><BillingPanel payments={payments} /></PortalShell>;
}
