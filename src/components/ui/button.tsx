import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary: "bg-crimson text-white border-crimson hover:bg-[#e05c5c] hover:border-[#e05c5c] shadow-[0_12px_36px_rgb(210_83_83_/_0.18)]",
  secondary: "bg-white/[0.04] text-ivory border-white/15 hover:bg-white/[0.08] hover:border-white/25",
  ghost: "bg-transparent text-mist border-transparent hover:text-white hover:bg-white/[0.05]"
};

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}

export function LinkButton({ href, children, variant = "primary", className, arrow = false }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-200",
        styles[variant],
        className
      )}
    >
      {children}
      {arrow ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
    </Link>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:opacity-50",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
