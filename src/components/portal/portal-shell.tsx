import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { signOut } from "@/app/auth/actions";
import type { PortalUser } from "@/types/domain";

export interface PortalNavItem { label: string; href: string; icon: LucideIcon; active?: boolean; badge?: string }

export function PortalShell({ user, label, navigation, children }: { user: PortalUser; label: string; navigation: PortalNavItem[]; children: React.ReactNode }) {
  return (
    <div className="container-shell py-8">
      <div className="surface min-h-[760px] overflow-hidden rounded-[1.7rem] lg:grid lg:grid-cols-[235px_1fr]">
        <aside className="border-b border-white/[0.08] bg-black/15 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between lg:block"><Logo compact /><span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.58rem] font-bold tracking-wider text-mist uppercase">{label}</span></div>
          <nav aria-label={`${label} navigation`} className="mt-7 flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {navigation.map(({ label: itemLabel, href, icon: Icon, active, badge }) => <Link key={href} href={href} className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${active ? "bg-white/[0.08] text-white" : "text-mist hover:bg-white/[0.04] hover:text-white"}`}><Icon className={`size-4 ${active ? "text-crimson" : ""}`} />{itemLabel}{badge ? <span className="ml-auto rounded-full bg-crimson px-1.5 py-0.5 text-[0.55rem] text-white">{badge}</span> : null}</Link>)}
          </nav>
          <div className="mt-7 hidden border-t border-white/[0.08] pt-5 lg:block"><form action={signOut}><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-mist hover:bg-white/[0.04] hover:text-white"><LogOut className="size-4" />Sign out</button></form></div>
        </aside>
        <div>
          <header className="flex min-h-16 items-center justify-between border-b border-white/[0.08] px-5 sm:px-7"><div><p className="text-[0.58rem] font-bold tracking-[0.13em] text-mist uppercase">{label} workspace</p></div><div className="flex items-center gap-2"><button aria-label="Notifications" className="relative grid size-9 place-items-center rounded-full border border-white/10"><Bell className="size-4" /><span className="absolute right-1 top-1 size-1.5 rounded-full bg-crimson" /></button><button className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1.5"><span className="grid size-6 place-items-center rounded-full bg-crimson/15 text-[0.58rem] font-black text-[#ef9a9a]">{user.displayName.slice(0, 2).toUpperCase()}</span><span className="hidden text-xs font-semibold sm:block">{user.displayName}</span><ChevronDown className="size-3 text-mist" /></button></div></header>
          <div className="p-5 sm:p-7 lg:p-9">{children}</div>
        </div>
      </div>
    </div>
  );
}
