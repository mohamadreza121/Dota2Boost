"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, LogOut, Route, ShieldCheck } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useNavigationAccount } from "@/components/layout/navigation-account";
import { primaryNavigation, serviceGroups } from "@/components/layout/navigation-data";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "HG";
}

export function SiteHeader() {
  const pathname = usePathname();
  const account = useNavigationAccount();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const syncHeader = () => setScrolled(window.scrollY > 24);
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    return () => window.removeEventListener("scroll", syncHeader);
  }, []);

  useEffect(() => {
    setServicesOpen(false);
    setMoreOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!servicesOpen && !moreOpen && !accountOpen) return;

    const closeAll = () => {
      setServicesOpen(false);
      setMoreOpen(false);
      setAccountOpen(false);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeAll();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (accountOpen) accountTriggerRef.current?.focus();
      else if (moreOpen) moreTriggerRef.current?.focus();
      else if (servicesOpen) servicesTriggerRef.current?.focus();
      closeAll();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountOpen, moreOpen, servicesOpen]);

  function isActive(href: string) {
    if (href === "/services") return pathname === "/services" || (pathname.startsWith("/services/") && pathname !== "/services/mmr-boost");
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  function openServices() {
    setServicesOpen((current) => !current);
    setMoreOpen(false);
    setAccountOpen(false);
  }

  function openMore() {
    setMoreOpen((current) => !current);
    setServicesOpen(false);
    setAccountOpen(false);
  }

  function openAccount() {
    setAccountOpen((current) => !current);
    setServicesOpen(false);
    setMoreOpen(false);
  }

  return (
    <header ref={headerRef} className={`hg-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="hg-header__topology" aria-hidden="true" />
      <div className="container-shell hg-header__inner">
        <Logo descriptor={false} className="hg-brand" />

        <nav aria-label="Primary navigation" className="hg-nav">
          {primaryNavigation.map((link) => {
            if (link.disclosure) {
              const active = isActive(link.href);
              return (
                <div key={link.href} className="hg-nav__item hg-nav__services">
                  <button
                    ref={servicesTriggerRef}
                    type="button"
                    className="hg-nav__link hg-nav__disclosure-trigger"
                    data-active={active}
                    aria-expanded={servicesOpen}
                    aria-controls="hg-services-panel"
                    onClick={openServices}
                  >
                    <span className="hg-nav__chapter">{link.chapter}</span>
                    <span>{link.label}</span>
                    <ChevronDown aria-hidden="true" />
                  </button>

                  {servicesOpen ? (
                    <div id="hg-services-panel" className="hg-services-panel" aria-label="Services">
                      <div className="hg-services-panel__featured">
                        <span className="hg-panel-kicker">Primary campaign</span>
                        <Route aria-hidden="true" />
                        <h2>Build an exact rank route.</h2>
                        <p>Choose your current medal, target, region, role and customer-controlled delivery mode before opening the live quote.</p>
                        <Link href="/pricing" onClick={() => setServicesOpen(false)} className="hg-panel-action">
                          Configure rank route <ArrowUpRight aria-hidden="true" />
                        </Link>
                      </div>

                      <div className="hg-services-panel__index">
                        {serviceGroups.slice(1).map((group) => (
                          <section key={group.eyebrow}>
                            <p>{group.eyebrow}</p>
                            <div>
                              {group.services.map((service) => (
                                <Link key={service.href} href={service.href} onClick={() => setServicesOpen(false)} className="hg-service-link">
                                  <span>
                                    <strong>{service.label}</strong>
                                    <small>{service.detail}</small>
                                  </span>
                                  <em>{service.unit}</em>
                                  <ArrowUpRight aria-hidden="true" />
                                </Link>
                              ))}
                            </div>
                          </section>
                        ))}
                        <Link href="/services" onClick={() => setServicesOpen(false)} className="hg-services-panel__all">
                          Compare all services <ArrowUpRight aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hg-nav__link${link.collapsible ? " hg-nav__link--collapsible" : ""}`}
                data-active={isActive(link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                <span className="hg-nav__chapter">{link.chapter}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="hg-nav__item hg-nav__more">
            <button
              ref={moreTriggerRef}
              type="button"
              className="hg-nav__link hg-nav__disclosure-trigger"
              aria-expanded={moreOpen}
              aria-controls="hg-more-panel"
              onClick={openMore}
            >
              <span className="hg-nav__chapter">04—05</span>
              <span>More</span>
              <ChevronDown aria-hidden="true" />
            </button>
            {moreOpen ? (
              <div id="hg-more-panel" className="hg-compact-panel">
                {primaryNavigation.filter((link) => link.collapsible).map((link) => (
                  <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined}>
                    <span>{link.chapter}</span>
                    <strong>{link.label}</strong>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="hg-header__actions">
          {account.status === "authenticated" ? (
            <div className="hg-account">
              <button
                ref={accountTriggerRef}
                type="button"
                className="hg-account__trigger"
                aria-expanded={accountOpen}
                aria-controls="hg-account-panel"
                onClick={openAccount}
              >
                <span className="hg-account__initials">{initials(account.displayName)}</span>
                <span className="hg-account__copy"><small>Workspace</small><strong>{account.displayName}</strong></span>
                <ChevronDown aria-hidden="true" />
              </button>
              {accountOpen ? (
                <div id="hg-account-panel" className="hg-account-panel">
                  <div>
                    <span className="hg-account__initials">{initials(account.displayName)}</span>
                    <p><strong>{account.displayName}</strong><small>{account.email}</small></p>
                  </div>
                  <span className="hg-account-panel__role"><ShieldCheck aria-hidden="true" /> {account.role} account</span>
                  <Link href={account.workspaceHref}>{account.workspaceLabel}<ArrowUpRight aria-hidden="true" /></Link>
                  <form action={signOut}><button type="submit"><LogOut aria-hidden="true" /> Sign out</button></form>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/auth/sign-in" className="hg-sign-in" aria-busy={account.status === "loading"}>
              <small>{account.status === "loading" ? "Account" : "Private workspace"}</small>
              <strong>Sign in</strong>
            </Link>
          )}

          <Link href="/pricing" className="hg-header-cta">
            <span>Forge rank route</span><ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <MobileNav account={account} />
      </div>
    </header>
  );
}
