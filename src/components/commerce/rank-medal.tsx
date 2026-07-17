import Image from "next/image";
import type { CSSProperties } from "react";
import { rankFamilyOf, rankMedals, type RankFamily, type RankName } from "@/lib/data/ranks";
import { cn } from "@/lib/utils";

export function RankMedal({
  rank,
  size = "md",
  label = true,
  selected = false,
  className
}: {
  rank: RankName | RankFamily;
  size?: "sm" | "md" | "lg";
  label?: boolean;
  selected?: boolean;
  className?: string;
}) {
  const medal = rankMedals[rankFamilyOf(rank)];
  const dimensions = size === "lg" ? 128 : size === "sm" ? 56 : 88;

  return (
    <div className={cn("group flex min-w-0 flex-col items-center", className)}>
      <div
        className={cn(
          "relative grid aspect-square place-items-center rounded-2xl border bg-[radial-gradient(circle,rgb(255_255_255_/_0.08),transparent_68%)] transition",
          size === "lg" ? "w-28 sm:w-32" : size === "sm" ? "w-14" : "w-20 sm:w-[5.5rem]",
          selected ? "border-white/35 shadow-[0_0_35px_var(--rank-glow)]" : "border-white/[0.07]"
        )}
        style={{ "--rank-glow": `${medal.tone}44` } as CSSProperties}
      >
        <Image
          src={medal.image}
          alt={`${rank} Dota 2 rank medal`}
          width={dimensions}
          height={dimensions}
          className="size-[92%] object-contain drop-shadow-[0_12px_20px_rgb(0_0_0_/_0.55)]"
          sizes={size === "lg" ? "128px" : size === "sm" ? "56px" : "88px"}
        />
      </div>
      {label ? <span className={cn("mt-2 truncate text-center font-bold", size === "sm" ? "text-[0.55rem]" : "text-[0.62rem] tracking-wide uppercase", selected ? "text-white" : "text-mist")}>{rank}</span> : null}
    </div>
  );
}
