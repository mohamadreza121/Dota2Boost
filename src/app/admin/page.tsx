import { BarChart3, ClipboardList, FileClock, Home, ReceiptText, Scale, ShieldCheck, Tags, UsersRound, WalletCards } from "lucide-react";
import { AdminOperationsConsole } from "@/components/admin/operations-console";
import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { getAdminOperationsSnapshot } from "@/lib/admin/operations";
import { requireRole } from "@/lib/auth/require-role";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await requireRole(["admin", "owner"]);
  const data = await getAdminOperationsSnapshot();
  const nav: PortalNavItem[] = [
    { label: "Operations", href: "/admin", icon: Home, active: true },
    { label: "Orders", href: "/admin#orders", icon: ClipboardList, badge: data.metrics.unassignedOrders ? String(data.metrics.unassignedOrders) : undefined },
    { label: "Customers", href: "/admin#people", icon: UsersRound },
    { label: "Boosters", href: "/admin#people", icon: ShieldCheck },
    { label: "Applications", href: "/admin#applications", icon: FileClock, badge: data.metrics.pendingApplications ? String(data.metrics.pendingApplications) : undefined },
    { label: "Commerce", href: "/admin/commerce", icon: Tags },
    { label: "Payments", href: "/admin#finance", icon: WalletCards },
    { label: "Trust & safety", href: "/admin#trust", icon: Scale, badge: data.metrics.openDisputes ? String(data.metrics.openDisputes) : undefined },
    { label: "Analytics", href: "/admin#overview", icon: BarChart3 },
    { label: "Audit logs", href: "/admin#audit", icon: ReceiptText }
  ];
  return <PortalShell user={user} label="Admin" navigation={nav}><AdminOperationsConsole initialData={data} /></PortalShell>;
}
