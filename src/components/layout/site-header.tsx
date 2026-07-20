"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Crosshair,
  GraduationCap,
  Route,
  Shield,
  Swords,
  Trophy
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";

const links = [
  { number: "01", label: "MMR Boost", href: "/services/mmr-boost", panel: false },
  { number: "02", label: "Services", href: "/services", panel: true },
  { number: "03", label: "Roster", href: "/boosters", panel: false },
  { number: "04", label: "How it works", href: "/how-it-works", panel: false },
  { number: "05", label: "Reviews", href: "/reviews", panel: false }
] as const;

const serviceLinks = [
  { label: "MMR Boost", detail: "Exact medal and MMR routes", unit: "MMR route", href: "/services/mmr-boost", icon: Route },
  { label: "Calibration", detail: "Fresh or returning ranked players", unit: "5 / 10 matches", href: "/services/mmr-calibration", icon: Crosshair },
  { label: "Behavior Score", detail: "Structured conduct recovery", unit: "500–6,000 score", href: "/services/behavior-score-boost", icon: Shield },
  { label: "Win Boost", detail: "Fixed assisted-win packages", unit: "3–20 wins", href: "/services/win-boost", icon: Trophy },
  { label: "Coaching", detail: "Replay and role development", unit: "1–8 sessions", href: "/services/coaching", icon: GraduationCap }
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const syncHeader = () => setCondensed(window.scrollY > 32);
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    return () => window.removeEventListener("scroll", syncHeader);
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 680px)").matches;
    document.documentElement.style.setProperty("--header-height", mobile ? "68px" : condensed ? "66px" : "78px");
  }, [condensed]);

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  return (
    <header className={`dota-command-header${condensed ? " is-condensed" : ""}`}>
      <div className="dota-command-header__ambient" aria-hidden="true" />

      <div className="container-shell dota-command-header__inner">
        <Logo className="dota-command-logo" />

        <nav aria-label="Primary navigation" className="dota-command-nav">
          {links.map((link) => (
            <div key={link.href} className={`dota-command-nav__item${link.panel ? " has-panel" : ""}`}>
              <Link
                href={link.href}
                className="dota-command-nav__link"
                data-active={isActive(link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                <small>{link.number}</small>
                <span>{link.label}</span>
              </Link>

              {link.panel ? (
                <div className="dota-command-nav__panel">
                  <div className="dota-command-nav__panel-head">
                    <span>Available contracts</span>
                    <small>Choose an objective</small>
                  </div>
                  <div className="dota-command-nav__services">
                    {serviceLinks.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link key={service.href} href={service.href} className="dota-command-nav__service">
                          <span><Icon /></span>
                          <div><strong>{service.label}</strong><small>{service.detail}</small><em>{service.unit}</em></div>
                          <ArrowUpRight />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="dota-command-header__actions">
          <Link href="/auth/sign-in" className="dota-player-slot">
            <span className="dota-player-slot__dot" />
            <span><small>Guest profile</small><strong>Sign in</strong></span>
          </Link>
          <Link href="/pricing" className="dota-header-core-button">
            <span>Forge rank route</span><Swords /><ArrowUpRight />
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
