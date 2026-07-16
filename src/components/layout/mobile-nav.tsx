"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const links = [
  ["Services", "/services"],
  ["Coaches", "/coaches"],
  ["How it works", "/how-it-works"],
  ["Pricing", "/pricing"],
  ["Reviews", "/reviews"],
  ["Work with us", "/work-with-us"]
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04]"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-ink/98 px-5 py-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Logo />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation" className="grid size-11 place-items-center rounded-full border border-white/10">
              <X className="size-5" />
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="mt-14 flex flex-col">
            {links.map(([label, href], index) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-white/10 py-5 text-2xl font-bold">
                {label}<span className="text-xs text-mist">0{index + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <Link href="/auth/sign-in" className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-semibold">Sign in</Link>
            <Link href="/pricing" className="rounded-full bg-crimson px-5 py-3 text-center text-sm font-semibold">Get started</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
