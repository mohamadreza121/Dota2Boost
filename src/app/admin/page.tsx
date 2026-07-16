import {
  AlertTriangle,
  BadgeDollarSign,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  FileClock,
  Headphones,
  Home,
  MessageSquareText,
  ReceiptText,
  RefreshCcw,
  Scale,
  Settings,
  ShieldCheck,
  Star,
  Tags,
  UsersRound,
  WalletCards,
} from "lucide-react";
import {
  PortalShell,
  type PortalNavItem,
} from "@/components/portal/portal-shell";
import { MetricCard } from "@/components/portal/metric-card";
import { requireRole } from "@/lib/auth/require-role";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const nav: PortalNavItem[] = [
  { label: "Overview", href: "/admin", icon: Home, active: true },
  { label: "Orders", href: "/admin#orders", icon: ClipboardList, badge: "6" },
  { label: "Customers", href: "/admin#customers", icon: UsersRound },
  { label: "Boosters", href: "/admin#boosters", icon: ShieldCheck },
  {
    label: "Applications",
    href: "/admin#applications",
    icon: FileClock,
    badge: "4",
  },
  { label: "Messages", href: "/admin#messages", icon: MessageSquareText },
  { label: "Commerce", href: "/admin/commerce", icon: Tags },
  { label: "Payments", href: "/admin#payments", icon: WalletCards },
  { label: "Disputes", href: "/admin#disputes", icon: Scale, badge: "2" },
  { label: "Analytics", href: "/admin#analytics", icon: BarChart3 },
  { label: "Audit logs", href: "/admin#audit", icon: ReceiptText },
  { label: "Settings", href: "/admin#settings", icon: Settings },
];

export default async function AdminDashboardPage() {
  const user = await requireRole(["admin", "owner"]);
  return (
    <PortalShell user={user} label="Admin" navigation={nav}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[0.62rem] font-bold tracking-[0.13em] text-crimson uppercase">
            Platform operations
          </p>
          <h1 className="mt-2 text-3xl font-black">Command center.</h1>
          <p className="mt-2 text-sm text-mist">
            Revenue, boost orders, assignment, risk, and booster quality in one view.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[0.62rem] text-mist">
          <RefreshCcw className="size-3.5" />
          Updated moments ago
        </div>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CircleDollarSign}
          label="Gross revenue"
          value="$18.4k"
          detail="+$2.1k this month"
          tone="gold"
        />
        <MetricCard
          icon={ClipboardList}
          label="Active orders"
          value="42"
          detail="6 need assignment"
          tone="red"
        />
        <MetricCard
          icon={FileClock}
          label="Applications"
          value="14"
          detail="4 ready for review"
          tone="cyan"
        />
        <MetricCard
          icon={Scale}
          label="Open disputes"
          value="2"
          detail="Oldest open 19 hours"
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <section
          id="orders"
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/15"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
            <div>
              <h2 className="text-sm font-black">Orders requiring action</h2>
              <p className="mt-1 text-[0.62rem] text-mist">
                Prioritized by customer impact and deadline
              </p>
            </div>
            <Badge tone="red">6 open</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead className="border-b border-white/[0.07] text-[0.55rem] font-bold tracking-wider text-mist uppercase">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {[
                  ["HG-4281", "Rank boost", "Unassigned", "Today"],
                  ["HG-4278", "Win boost", "Milestone review", "5h"],
                  ["HG-4267", "Duo lane boost", "Reschedule", "Tomorrow"],
                  ["HG-4259", "Stack boost", "Payment review", "2d"],
                ].map(([id, service, status, deadline]) => (
                  <tr key={id}>
                    <td className="px-5 py-4 font-bold">{id}</td>
                    <td className="px-4 py-4 text-mist">{service}</td>
                    <td className="px-4 py-4">
                      <Badge tone={status === "Unassigned" ? "red" : "neutral"}>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-mist">{deadline}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="font-bold text-amber">Open →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-2xl border border-white/[0.08] bg-black/15 p-5">
          <h2 className="text-sm font-black">Operational health</h2>
          <div className="mt-5 space-y-4">
            {[
              [BadgeDollarSign, "Refund rate", "2.4%", "Within guardrail"],
              [Star, "Customer satisfaction", "4.91", "124 completed"],
              [CalendarDays, "Upcoming queues", "18", "Next 24 hours"],
              [Headphones, "Median support reply", "11m", "Last 7 days"],
            ].map(([Icon, label, value, detail]) => {
              const HealthIcon = Icon as typeof Star;
              return (
                <div key={label as string} className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/[0.04]">
                    <HealthIcon className="size-4 text-cyan" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">{label as string}</p>
                    <p className="mt-0.5 text-[0.58rem] text-mist">
                      {detail as string}
                    </p>
                  </div>
                  <strong className="text-sm">{value as string}</strong>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section
          id="applications"
          className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black">Booster application queue</h2>
            <button className="text-[0.62rem] font-bold text-amber">
              View all
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["Orion", "Immortal 1,760", "Skill assessment"],
              ["ClearCut", "Immortal 3,220", "Under review"],
              ["Tempo", "Immortal 820", "Interview"],
            ].map(([name, rank, status]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] p-3"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-crimson/10 text-[0.62rem] font-black text-crimson">
                  {(name ?? "").slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{name}</p>
                  <p className="mt-1 text-[0.58rem] text-mist">{rank}</p>
                </div>
                <Badge>{status}</Badge>
              </div>
            ))}
          </div>
        </section>
        <section
          id="disputes"
          className="rounded-2xl border border-white/[0.08] bg-black/15 p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black">Risk and disputes</h2>
            <AlertTriangle className="size-4 text-amber" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["DSP-028", "Customer awaiting response", "$69 at risk", "19h"],
              ["DSP-031", "Under admin review", "$184 at risk", "4h"],
            ].map(([id, status, amount, age]) => (
              <div
                key={id}
                className="rounded-xl border border-amber/15 bg-amber/[0.035] p-4"
              >
                <div className="flex justify-between">
                  <p className="text-xs font-black">{id}</p>
                  <span className="text-[0.58rem] text-mist">{age}</span>
                </div>
                <p className="mt-2 text-xs">{status}</p>
                <p className="mt-1 text-[0.58rem] text-amber">{amount}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[0.58rem] leading-5 text-mist">
            Refunds, booster adjustments, role changes, and resolutions create
            immutable audit events.
          </p>
        </section>
      </div>
    </PortalShell>
  );
}
