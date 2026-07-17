import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";

const links = [
  ["MMR Boost", "/services/mmr-boost"],
  ["Boosters", "/boosters"],
  ["How it works", "/how-it-works"],
  ["Pricing", "/pricing"],
  ["Reviews", "/reviews"],
  ["Work with us", "/work-with-us"]
] as const;

export function SiteHeader() {
  return (
    <header className="legacy-site-header sticky top-0 z-40 border-b border-amber/15 bg-ink/90 shadow-[0_10px_40px_rgb(0_0_0_/_0.35)] backdrop-blur-xl">
      <div className="container-shell flex h-[76px] items-center justify-between gap-5">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden items-center gap-5 lg:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="legacy-nav-link text-xs font-semibold text-mist transition hover:text-white">{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/auth/sign-in" className="rounded-full px-4 py-2.5 text-xs font-semibold text-mist transition hover:text-white">Sign in</Link>
          <Link href="/pricing" className="legacy-header-cta bg-crimson px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_30px_rgb(214_79_82_/_0.2)] transition hover:bg-[#e05c5c]">Start a boost</Link>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
