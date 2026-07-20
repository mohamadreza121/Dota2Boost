import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function ForgeSectionHeading({
  chapter,
  eyebrow,
  title,
  description,
  href,
  linkLabel
}: {
  chapter: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <header className="forge-section-heading" data-forge-reveal>
      <div className="forge-section-heading__title">
        <p><span>{chapter}</span><i />{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="forge-section-heading__copy">
        <p>{description}</p>
        {href && linkLabel ? (
          <Link href={href}>{linkLabel}<ArrowUpRight /></Link>
        ) : null}
      </div>
    </header>
  );
}
