import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary: "forge-shared-button--primary",
  secondary: "forge-shared-button--secondary",
  ghost: "forge-shared-button--ghost"
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
        "forge-shared-button",
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
        "forge-shared-button",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
