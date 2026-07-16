import Link from "next/link";
import { Logo } from "@/components/layout/logo";

const footerLinks = {
  Explore: [["Boost services", "/services"], ["Boosters", "/boosters"], ["Pricing", "/pricing"], ["Reviews", "/reviews"]],
  Company: [["How it works", "/how-it-works"], ["Work with us", "/work-with-us"], ["FAQ", "/faq"], ["Support", "/legal/community-guidelines"]],
  Legal: [["Terms", "/legal/terms"], ["Privacy", "/legal/privacy"], ["Refund policy", "/legal/refunds"], ["Service disclaimer", "/legal/disclaimer"]]
} as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#060707]">
      <div className="container-shell grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-6 text-mist">Premium, customer-controlled Dota 2 rank boosting with verified party teammates and transparent delivery.</p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/[0.06] px-3 py-2 text-[0.68rem] font-bold tracking-wider text-cyan uppercase">
            <span className="size-1.5 rounded-full bg-cyan" /> No credentials required
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-bold tracking-[0.14em] text-white uppercase">{group}</p>
              <div className="mt-5 flex flex-col gap-3.5">
                {links.map(([label, href]) => <Link key={href} href={href} className="text-sm text-mist transition hover:text-white">{label}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container-shell flex flex-col gap-3 border-t border-white/[0.07] py-6 text-xs leading-5 text-[#737b78] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Highground Boosting. All rights reserved.</p>
        <p>Not affiliated with or endorsed by Valve Corporation. Dota and Steam are trademarks of their respective owner.</p>
      </div>
    </footer>
  );
}
