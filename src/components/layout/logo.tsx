import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  compact?: boolean;
  descriptor?: boolean;
  className?: string;
}

export function Logo({ compact = false, descriptor = true, className }: LogoProps) {
  return (
    <Link href="/" aria-label="Highground home" className={cn("inline-flex items-center gap-3", className)}>
      <svg aria-hidden="true" viewBox="0 0 48 48" className="size-9 shrink-0 text-current">
        <path d="M7 12 18 5h18l5 8v23l-11 7H12l-5-8V12Z" fill="currentColor" opacity=".08" />
        <path d="M7 12 18 5h18l5 8v23l-11 7H12l-5-8V12Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15 14v20M33 14v20M15 24h18" fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="3.2" />
        <path d="m10 36 9-7 8-10 11-8" fill="none" stroke="currentColor" strokeWidth="1.25" opacity=".72" />
        <circle cx="19" cy="29" r="1.6" fill="currentColor" />
        <circle cx="27" cy="19" r="1.6" fill="currentColor" />
      </svg>
      {!compact ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="text-sm font-black tracking-[0.16em] text-white">HIGHGROUND</span>
          {descriptor ? <span className="mt-1 text-[0.54rem] font-bold tracking-[0.25em] text-mist">DOTA 2 BOOSTING</span> : null}
        </span>
      ) : null}
    </Link>
  );
}
