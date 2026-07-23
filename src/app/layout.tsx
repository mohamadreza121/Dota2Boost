import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "./site-shell-v2.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthModal } from "@/components/auth/auth-modal";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: { default: "Highground — Premium Dota 2 Boosting", template: "%s | Highground" },
  description: "Dota 2 MMR boosting in Solo and Duo modes, MMR calibration, behavior score services, assisted wins, and secondary coaching.",
  applicationName: "Highground",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Highground — Dota 2 MMR Boosting",
    description: "Configure MMR Boost, MMR Calibration, Behavior Score Boost, or assisted Duo Queue wins.",
    type: "website",
    url: "/",
    siteName: "Highground",
    images: [{ url: "/media/dire-forge/dire-forge-poster.webp", width: 1920, height: 1080, alt: "The Dire Forge Dota 2 rank campaign" }]
  },
  twitter: { card: "summary_large_image", title: "Highground — Dota 2 MMR Boosting", description: "MMR first. Solo or Duo. Server-priced commerce.", images: ["/media/dire-forge/dire-forge-poster.webp"] },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#030201", colorScheme: "dark" };

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
        <AuthModal />
        <Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </body>
    </html>
  );
}
