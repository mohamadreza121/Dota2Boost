import type { MetadataRoute } from "next";
import { services, boosters } from "@/lib/data/content";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/boosters", "/how-it-works", "/pricing", "/reviews", "/work-with-us", "/faq"];
  const serviceRoutes = services.map((service) => `/services/${service.slug}`);
  const boosterRoutes = boosters.map((booster) => `/boosters/${booster.slug}`);
  return [...routes, ...serviceRoutes, ...boosterRoutes].map((route) => ({ url: absoluteUrl(route), lastModified: new Date(), changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : 0.7 }));
}
