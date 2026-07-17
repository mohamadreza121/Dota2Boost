"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronRight, Menu, ShieldCheck, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const links = [
  { number: "01", label: "MMR Boost", detail: "Exact medal and MMR route", href: "/services/mmr-boost" },
  { number: "02", label: "Services", detail: "Select a ranked contract", href: "/services" },
  { number: "03", label: "Roster", detail: "Inspect Immortal specialists", href: "/boosters" },
  { number: "04", label: "How it works", detail: "Review the campaign flow", href: "/how-it-works" },
  { number: "05", label: "Pricing", detail: "Build a live server quote", href: "/pricing" },
  { number: "06", label: "Reviews", detail: "Open verified match history", href: "/reviews" },
  { number: "07", label: "Work with us", detail: "Apply to join the roster", href: "/work-with-us" }
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  return (
    <div className="dota-mobile-nav">
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="dota-mobile-menu"
        onClick={() => setOpen((current) => !current)}
        className="dota-mobile-trigger"
      >
        {open ? <X /> : <Menu />}
      </button>

      {open ? (
        <div id="dota-mobile-menu" className="dota-mobile-menu" role="dialog" aria-modal="true" aria-label="Site navigation">
          <button type="button" aria-label="Close navigation" className="dota-mobile-menu__scrim" onClick={() => setOpen(false)} />

          <aside className="dota-mobile-menu__drawer">
            <div className="dota-mobile-menu__top">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation" className="dota-mobile-close">
                <X />
              </button>
            </div>

            <div className="dota-mobile-menu__status"><i /> Command menu // regional coverage active</div>

            <nav aria-label="Mobile navigation" className="dota-mobile-menu__nav">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="dota-mobile-menu__link"
                  data-active={isActive(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  <span className="dota-mobile-menu__number">{link.number}</span>
                  <span><strong>{link.label}</strong><small>{link.detail}</small></span>
                  <ChevronRight />
                </Link>
              ))}
            </nav>

            <div className="dota-mobile-menu__bottom">
              <div className="dota-mobile-menu__actions">
                <Link href="/auth/sign-in" onClick={() => setOpen(false)} className="dota-mobile-menu__sign-in">Sign in</Link>
                <Link href="/pricing" onClick={() => setOpen(false)} className="dota-mobile-menu__cta">Build rank route <ArrowUpRight /></Link>
              </div>
              <p className="dota-mobile-menu__disclaimer"><ShieldCheck /> Customer-operated Solo and Duo delivery. No Steam credentials or remote access.</p>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
