import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob: https://*.supabase.co https://cdn.cloudflare.steamstatic.com",
      "media-src 'self' blob: https://*.supabase.co",
      "font-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com https://checkout.stripe.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://challenges.cloudflare.com https://*.sentry.io",
      "upgrade-insecure-requests"
    ].join("; ")
  }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.cloudflare.steamstatic.com", pathname: "/apps/dota2/images/**" }
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  }
};

export default nextConfig;
