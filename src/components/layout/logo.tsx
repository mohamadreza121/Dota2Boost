import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Highground Boosting home" className={cn("inline-flex items-center gap-3", className)}>
      <svg aria-hidden="true" viewBox="0 0 44 44" className="size-9 text-crimson">
        <path d="M22 2 40 12v20L22 42 4 32V12L22 2Z" fill="currentColor" opacity=".16" />
        <path d="m22 7 13 7.2v14.5L22 36l-13-7.3V14.2L22 7Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m14 17 8-4 8 4-8 4-8-4Zm0 7 8 4 8-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
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
