import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Highground Boosting home" className={cn("inline-flex items-center gap-3", className)}>
      <svg aria-hidden="true" viewBox="0 0 44 44" className="size-9 text-crimson">
        <path d="M5 5h25l9 9v25H14l-9-9V5Z" fill="currentColor" opacity=".13" />
        <path d="M5 5h25l9 9v25H14l-9-9V5Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M13 13v18m0-9h18m0-9v18" fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="3" />
        <path d="m7 34 8-8m14-14 8-8" fill="none" stroke="currentColor" strokeWidth="1" opacity=".75" />
      </svg>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-black tracking-[0.16em] text-white">HIGHGROUND</span>
          <span className="mt-1 text-[0.54rem] font-bold tracking-[0.25em] text-mist">DOTA 2 BOOSTING</span>
        </span>
      ) : null}
    </Link>
  );
}
