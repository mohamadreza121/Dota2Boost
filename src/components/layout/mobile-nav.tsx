"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/layout/logo";
import { primaryNavigation, serviceGroups, type NavigationAccount } from "@/components/layout/navigation-data";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "HG";
}

export function MobileNav({ account }: { account: NavigationAccount }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = drawerRef.current
        ? Array.from(
            drawerRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      (previousFocus ?? trigger)?.focus();
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/services") return pathname === "/services" || (pathname.startsWith("/services/") && pathname !== "/services/mmr-boost");
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  function closeMenu() {
    setOpen(false);
    setServicesOpen(false);
  }

  return (
    <div className="hg-mobile-nav">
      <button
        ref={triggerRef}
        type="button"
        className="hg-mobile-trigger"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="hg-mobile-menu"
        onClick={() => setOpen(true)}
      >
        <span>Menu</span><Menu aria-hidden="true" />
      </button>

      {open ? (
        <div id="hg-mobile-menu" className="hg-mobile-menu" role="dialog" aria-modal="true" aria-labelledby="hg-mobile-menu-title">
          <button type="button" className="hg-mobile-menu__scrim" aria-label="Close navigation" onClick={closeMenu} />
          <aside ref={drawerRef} className="hg-mobile-menu__drawer">
            <div className="hg-mobile-menu__top">
              <Logo descriptor={false} className="hg-mobile-brand" />
              <p id="hg-mobile-menu-title">Campaign index</p>
              <button ref={closeRef} type="button" className="hg-mobile-close" aria-label="Close navigation" onClick={closeMenu}>
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="hg-mobile-menu__body">
              <Link href="/pricing" onClick={closeMenu} className="hg-mobile-campaign">
                <span><small>Primary action</small><strong>Forge rank route</strong></span>
                <ArrowUpRight aria-hidden="true" />
              </Link>

              <section className="hg-mobile-section" aria-labelledby="hg-mobile-explore-title">
                <div className="hg-mobile-section__head">
                  <p id="hg-mobile-explore-title">Explore</p><span>Public routes</span>
                </div>
                <nav aria-label="Mobile primary navigation" className="hg-mobile-links">
                  {primaryNavigation.filter((link) => !link.disclosure).map((link) => (
                    <Link key={link.href} href={link.href} onClick={closeMenu} data-active={isActive(link.href)} aria-current={isActive(link.href) ? "page" : undefined}>
                      <span>{link.chapter}</span><strong>{link.label}</strong><ArrowUpRight aria-hidden="true" />
                    </Link>
                  ))}
                </nav>
              </section>

              <section className="hg-mobile-section" aria-labelledby="hg-mobile-services-title">
                <button
                  type="button"
                  className="hg-mobile-services-trigger"
                  aria-expanded={servicesOpen}
                  aria-controls="hg-mobile-services"
                  onClick={() => setServicesOpen((current) => !current)}
                >
                  <span><small>Choose a service</small><strong id="hg-mobile-services-title">Campaign contracts</strong></span>
                  <ChevronDown aria-hidden="true" />
                </button>

                {servicesOpen ? (
                  <div id="hg-mobile-services" className="hg-mobile-services">
                    {serviceGroups.map((group) => (
                      <div key={group.eyebrow}>
                        <p>{group.eyebrow}</p>
                        {group.services.map((service) => (
                          <Link key={service.href} href={service.href} onClick={closeMenu}>
                            <span><strong>{service.label}</strong><small>{service.detail}</small></span>
                            <em>{service.unit}</em>
                          </Link>
                        ))}
                      </div>
                    ))}
                    <Link href="/services" onClick={closeMenu} className="hg-mobile-services__all">Compare all services <ArrowUpRight aria-hidden="true" /></Link>
                  </div>
                ) : null}
              </section>
            </div>

            <div className="hg-mobile-menu__account">
              {account.status === "authenticated" ? (
                <>
                  <div className="hg-mobile-identity">
                    <span>{initials(account.displayName)}</span>
                    <p><small>{account.role} account</small><strong>{account.displayName}</strong></p>
                    <ShieldCheck aria-hidden="true" />
                  </div>
                  <div className="hg-mobile-account-actions">
                    <Link href={account.workspaceHref} onClick={closeMenu}>{account.workspaceLabel}<ArrowUpRight aria-hidden="true" /></Link>
                    <form action={signOut}><button type="submit"><LogOut aria-hidden="true" /> Sign out</button></form>
                  </div>
                </>
              ) : (
                <div className="hg-mobile-guest">
                  <p><small>Private workspace</small><strong>Track milestones, messages and receipts.</strong></p>
                  <Link href="/auth/sign-in" onClick={closeMenu}>Sign in <ArrowUpRight aria-hidden="true" /></Link>
                </div>
              )}
              <p className="hg-mobile-reassurance"><ShieldCheck aria-hidden="true" /> Customer-operated Solo and Duo delivery. No Steam credentials or remote access.</p>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
