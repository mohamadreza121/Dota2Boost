import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, description, aside }: { eyebrow: string; title: string; description: string; aside?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] py-20 md:py-28">
      <div aria-hidden="true" className="soft-grid absolute inset-0 opacity-35" />
      <div className="container-shell relative grid gap-12 lg:grid-cols-[1fr_.55fr] lg:items-end">
        <div><span className="eyebrow">{eyebrow}</span><h1 className="display-type mt-6 max-w-5xl text-balance text-[clamp(4rem,10vw,8rem)] font-black uppercase">{title}</h1><p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-mist md:text-xl">{description}</p></div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}
