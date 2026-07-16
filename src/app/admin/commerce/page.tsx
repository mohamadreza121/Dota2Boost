import { BarChart3, ClipboardList, FileClock, Home, MessageSquareText, ReceiptText, Scale, Settings, ShieldCheck, Tags, UsersRound, WalletCards } from "lucide-react";
import { CommerceConsole } from "@/components/admin/commerce-console";
import { PortalShell, type PortalNavItem } from "@/components/portal/portal-shell";
import { requireRole } from "@/lib/auth/require-role";

export const dynamic = "force-dynamic";

const nav: PortalNavItem[] = [
  { label: "Overview", href: "/admin", icon: Home },
  { label: "Orders", href: "/admin#orders", icon: ClipboardList },
  { label: "Customers", href: "/admin#customers", icon: UsersRound },
  { label: "Boosters", href: "/admin#boosters", icon: ShieldCheck },
  { label: "Applications", href: "/admin#applications", icon: FileClock },
  { label: "Messages", href: "/admin#messages", icon: MessageSquareText },
  { label: "Commerce", href: "/admin/commerce", icon: Tags, active: true },
  { label: "Payments", href: "/admin#payments", icon: WalletCards },
  { label: "Disputes", href: "/admin#disputes", icon: Scale },
  { label: "Analytics", href: "/admin#analytics", icon: BarChart3 },
  { label: "Audit logs", href: "/admin#audit", icon: ReceiptText },
  { label: "Settings", href: "/admin#settings", icon: Settings }
];

export default async function AdminCommercePage() {
  const user = await requireRole(["admin", "owner"]);
  return <PortalShell user={user} label="Admin" navigation={nav}><CommerceConsole /></PortalShell>;
}
