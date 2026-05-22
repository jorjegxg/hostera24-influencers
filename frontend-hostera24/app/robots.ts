import type { MetadataRoute } from "next";

const SITEMAP_BASE = "https://hostera24.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/coduri/",
    },
    sitemap: `${SITEMAP_BASE}/sitemap.xml`,
  };
}
