"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
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
import { AuthModal } from "@/components/auth/auth-modal";

const links = [
  { number: "01", label: "MMR Boost", href: "/services/mmr-boost", panel: false },
  { number: "02", label: "Services", href: "/services", panel: true },
  { number: "03", label: "Roster", href: "/boosters", panel: false },
  { number: "04", label: "How it works", href: "/how-it-works", panel: false },
  { number: "05", label: "Reviews", href: "/reviews", panel: false }
] as const;

const serviceLinks = [
  { label: "MMR Boost", detail: "Exact medal and MMR routes", unit: "MMR route", href: "/services/mmr-boost", icon: Route },
  { label: "Calibration", detail: "Recalibration and Rank Confidence", unit: "1–30 games", href: "/services/mmr-calibration", icon: Crosshair },
  { label: "Low Priority", detail: "Customer-operated Single Draft recovery", unit: "1–10 wins", href: "/services/low-priority-recovery", icon: AlertTriangle },
  { label: "Behavior Score", detail: "Structured conduct recovery", unit: "500–6,000 score", href: "/services/behavior-score-boost", icon: Shield },
  { label: "Win Boost", detail: "Fixed assisted-win packages", unit: "3–20 wins", href: "/services/win-boost", icon: Trophy },
  { label: "Coaching", detail: "Replay and role development", unit: "1–8 sessions", href: "/services/coaching", icon: GraduationCap }
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

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

  useEffect(() => {
    function closeServices(event: PointerEvent) {
      if (!servicesRef.current?.contains(event.target as Node)) setServicesOpen(false);
    }
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("pointerdown", closeServices);
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeServices);
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

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
            <div key={link.href} ref={link.panel ? servicesRef : undefined} className={`dota-command-nav__item${link.panel ? " has-panel" : ""}`} data-open={link.panel && servicesOpen}>
              {link.panel ? <button
                type="button"
                className="dota-command-nav__link"
                data-active={isActive(link.href)}
                aria-expanded={servicesOpen}
                aria-controls="desktop-services-panel"
                onClick={() => setServicesOpen((current) => !current)}
              >
                <small>{link.number}</small>
                <span>{link.label}</span>
              </button> : <Link
                href={link.href}
                className="dota-command-nav__link"
                data-active={isActive(link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                <small>{link.number}</small>
                <span>{link.label}</span>
              </Link>}

              {link.panel ? (
                <div id="desktop-services-panel" className="dota-command-nav__panel">
                  <div className="dota-command-nav__panel-head">
                    <span>Available contracts</span>
                    <Link href="/services" onClick={() => setServicesOpen(false)}>View all services <ArrowUpRight /></Link>
                  </div>
                  <div className="dota-command-nav__services">
                    {serviceLinks.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link key={service.href} href={service.href} onClick={() => setServicesOpen(false)} className="dota-command-nav__service">
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
          <button type="button" className="dota-player-slot" onClick={() => setAuthOpen(true)}>
            <span className="dota-player-slot__dot" />
            <span><small>Guest profile</small><strong>Sign in</strong></span>
          </button>
          <Link href="/pricing" className="dota-header-core-button">
            <span>Forge rank route</span><Swords /><ArrowUpRight />
          </Link>
        </div>

        <MobileNav onSignIn={() => setAuthOpen(true)} />
      </div>
      <AuthModal open={authOpen} onClose={closeAuth} />
    </header>
  );
}
