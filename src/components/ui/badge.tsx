import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "red" | "gold" | "cyan"; className?: string }) {
  const tones = {
    neutral: "border-white/10 bg-white/[0.04] text-mist",
    red: "border-crimson/25 bg-crimson/10 text-[#ef9696]",
    gold: "border-amber/25 bg-amber/10 text-[#e4bf7c]",
    cyan: "border-cyan/25 bg-cyan/10 text-cyan"
  };

  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.1em] uppercase", tones[tone], className)}>{children}</span>;
}
