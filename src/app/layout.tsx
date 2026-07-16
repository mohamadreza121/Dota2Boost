import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: { default: "Highground — Premium Dota 2 Boosting", template: "%s | Highground" },
  description: "Customer-controlled Dota 2 rank boosting, assisted win packages, calibration support, and verified high-MMR party teammates.",
  applicationName: "Highground",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Highground — Boost Your Rank. Keep Control.",
    description: "Self-play Dota 2 rank boosts and assisted win packages from verified high-MMR party teammates.",
    type: "website",
    url: "/",
    siteName: "Highground",
    images: [{ url: "/media/highground-battlefield.webp", width: 1600, height: 900, alt: "Highground original MOBA battlefield artwork" }]
  },
  twitter: { card: "summary_large_image", title: "Highground — Premium Dota 2 Boosting", description: "Boost your rank. Keep control.", images: ["/media/highground-battlefield.webp"] },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080a0a", colorScheme: "dark" };

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Highground Boosting",
  url: absoluteUrl(),
  description: "A customer-controlled Dota 2 boosting marketplace and private delivery workspace.",
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
