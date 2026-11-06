import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const PATHS = [
  "/",
  "/industries",
  "/marketplace",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy",
  "/legal/security-policy",
  "/legal/acceptable-use-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));
}
