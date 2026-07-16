import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";

export function AuthCard({ eyebrow, title, description, children, footer }: { eyebrow: string; title: string; description: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <section className="container-shell grid min-h-[calc(100svh-76px)] place-items-center py-16">
      <div className="surface w-full max-w-md rounded-[1.7rem] p-6 sm:p-8">
        <Logo />
        <p className="mt-9 text-[0.62rem] font-bold tracking-[0.15em] text-amber uppercase">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-mist">{description}</p>
        <div className="mt-7">{children}</div>
        {footer ? <div className="mt-6 border-t border-white/[0.08] pt-5 text-center text-xs text-mist">{footer}</div> : null}
      </div>
    </section>
  );
}
