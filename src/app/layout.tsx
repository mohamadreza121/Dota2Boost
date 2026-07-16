import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: { default: "Highground — Private Dota 2 Coaching", template: "%s | Highground" },
  description: "Private Dota 2 coaching, replay analysis, role mastery, and guided improvement from verified high-rank coaches.",
  applicationName: "Highground",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Highground — Climb Smarter",
    description: "Private coaching, replay analysis, and improvement plans for Dota 2 players.",
    type: "website",
    url: "/",
    siteName: "Highground"
  },
  twitter: { card: "summary_large_image", title: "Highground — Private Dota 2 Coaching", description: "Climb smarter. Understand Dota. Win more consistently." },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080a0a", colorScheme: "dark" };

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Highground Coaching",
  url: absoluteUrl(),
  description: "A private Dota 2 coaching marketplace and improvement workspace.",
  sameAs: []
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="noise antialiased">
        <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition focus:translate-y-0">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </body>
    </html>
  );
}
