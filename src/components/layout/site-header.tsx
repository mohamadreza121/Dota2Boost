import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";

const links = [
  ["01", "MMR Boost", "/services/mmr-boost"],
  ["02", "Services", "/services"],
  ["03", "Roster", "/boosters"],
  ["04", "How it works", "/how-it-works"],
  ["05", "Reviews", "/reviews"]
] as const;

export function SiteHeader() {
  return (
    <header className="citadel-header sticky top-0 z-40">
      <div className="container-shell citadel-header__inner">
        <Logo />
        <nav aria-label="Primary navigation" className="citadel-header__nav">
          {links.map(([number, label, href]) => (
            <Link key={href} href={href}><small>{number}</small>{label}</Link>
          ))}
        </nav>
        <div className="citadel-header__actions">
          <Link href="/auth/sign-in">Sign in</Link>
          <Link href="/pricing">Configure boost <ArrowUpRight /></Link>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
