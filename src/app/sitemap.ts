import type { MetadataRoute } from "next";
import { services, coaches } from "@/lib/data/content";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/coaches", "/how-it-works", "/pricing", "/reviews", "/work-with-us", "/faq"];
  const serviceRoutes = services.map((service) => `/services/${service.slug}`);
  const coachRoutes = coaches.map((coach) => `/coaches/${coach.slug}`);
  return [...routes, ...serviceRoutes, ...coachRoutes].map((route) => ({ url: absoluteUrl(route), lastModified: new Date(), changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : 0.7 }));
}
