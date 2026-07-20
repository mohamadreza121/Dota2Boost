import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Crosshair,
  Eye,
  Medal,
  Radio,
  Route,
  ScrollText,
  ShieldCheck,
  Swords
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { rankMedals } from "@/lib/data/ranks";

const laneGroups = [
  {
    lane: "Safe lane",
    title: "Services",
    icon: Route,
    links: [
      ["MMR Boost", "/services/mmr-boost"],
      ["Calibration", "/services/mmr-calibration"],
      ["Win Boost", "/services/win-boost"],
      ["Coaching", "/services/coaching"]
    ]
  },
  {
    lane: "Mid lane",
    title: "Platform",
    icon: Crosshair,
    links: [
      ["How it works", "/how-it-works"],
      ["Boosters", "/boosters"],
      ["Reviews", "/reviews"],
      ["Pricing", "/pricing"]
    ]
  },
  {
    lane: "Offlane",
    title: "Company",
    icon: Swords,
    links: [
      ["Work with us", "/work-with-us"],
      ["FAQ", "/faq"],
      ["Community guidelines", "/legal/community-guidelines"],
      ["Service disclaimer", "/legal/disclaimer"]
    ]
  }
] as const;

const trustItems = [
  { title: "No credentials", detail: "No passwords, Steam Guard codes, or remote access.", icon: ShieldCheck, secure: true },
  { title: "Transparent tracking", detail: "Milestones and updates stay attached to the order.", icon: Eye, secure: false },
  { title: "Clear service scope", detail: "Exact modes, match blocks, and route selection.", icon: ScrollText, secure: false },
  { title: "Verified roster", detail: "Rank, role, region, and quality checks before approval.", icon: Medal, secure: true }
] as const;

const legalLinks = [
  ["Terms", "/legal/terms"],
  ["Privacy", "/legal/privacy"],
  ["Refunds", "/legal/refunds"],
  ["Disclaimer", "/legal/disclaimer"]
] as const;

export function SiteFooter() {
  return (
    <footer className="dota-command-footer">
      <div className="dota-command-footer__terrain" aria-hidden="true" />
      <div className="dota-command-footer__embers" aria-hidden="true" />

      <div className="container-shell">
        <div className="dota-command-footer__main">
          <section className="dota-command-footer__brand" aria-label="Highground summary">
            <Logo />
            <p>
              Dota 2 ranked campaigns built around exact medals, clear scope,
              customer-operated delivery, and a private progress workspace.
            </p>
            <span className="dota-command-footer__status"><Radio /> Regional coverage active</span>
            <div className="dota-command-footer__regions" aria-label="Supported regions">
              <span>North America</span><span>Europe</span><span>SEA</span><span>South America</span><span>Australia</span>
            </div>
          </section>

          <div className="dota-command-footer__lanes" aria-label="Footer navigation">
            {laneGroups.map((group) => {
              const Icon = group.icon;
              return (
                <section key={group.lane} className="dota-footer-lane">
                  <div className="dota-footer-lane__head">
                    <span><Icon /></span>
                    <div><small>{group.lane}</small><strong>{group.title}</strong></div>
                  </div>
                  <nav aria-label={`${group.title} links`}>
                    {group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
                  </nav>
                </section>
              );
            })}
          </div>

          <div className="dota-command-footer__mobile-lanes" aria-label="Footer navigation">
            {laneGroups.map((group) => {
              const Icon = group.icon;
              return (
                <details key={group.lane} className="dota-footer-accordion">
                  <summary><span><Icon /> {group.lane} {"//"} {group.title}</span></summary>
                  <nav aria-label={`${group.title} links`}>
                    {group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
                  </nav>
                </details>
              );
            })}
          </div>

          <aside className="dota-command-footer__ready">
            <div>
              <small>Your next campaign · example route</small>
              <h2>Your next campaign is waiting.</h2>
              <p>Choose an exact medal route and receive a live server-priced quote before checkout.</p>
              <div className="dota-command-footer__route">
                <span><Image src={rankMedals.Legend.image} alt="Legend rank medal" width={42} height={42} /><i><small>Current</small><strong>Legend III</strong></i></span>
                <i aria-hidden="true" />
                <span><Image src={rankMedals.Ancient.image} alt="Ancient rank medal" width={42} height={42} /><i><small>Target</small><strong>Ancient I</strong></i></span>
              </div>
            </div>
            <Link href="/pricing">Forge rank route <ArrowUpRight /></Link>
          </aside>
        </div>

        <section className="dota-command-footer__inventory" aria-label="Service protections">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`dota-footer-item${item.secure ? " is-secure" : ""}`}>
                <span><Icon /></span>
                <div><strong>{item.title}</strong><small>{item.detail}</small></div>
              </div>
            );
          })}
        </section>

        <div className="dota-command-footer__bottom">
          <strong>© {new Date().getFullYear()} Highground Boosting</strong>
          <nav aria-label="Legal navigation" className="dota-command-footer__legal">
            {legalLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <p>Not affiliated with or endorsed by Valve Corporation. Dota and Steam are trademarks of their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
