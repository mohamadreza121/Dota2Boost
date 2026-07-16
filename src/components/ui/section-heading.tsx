import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, align = "left", className }: { eyebrow: string; title: string; description?: string; align?: "left" | "center"; className?: string }) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <span className={cn("eyebrow", align === "center" && "justify-center before:hidden")}>{eyebrow}</span>
      <h2 className="display-type mt-5 text-balance text-[clamp(2.7rem,7vw,5.8rem)] font-black uppercase">{title}</h2>
      {description ? <p className="mt-6 max-w-2xl text-base leading-7 text-mist md:text-lg">{description}</p> : null}
    </div>
  );
}
