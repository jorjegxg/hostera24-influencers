import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Sitemap URL din aceleași variabile de mediu ca sitemap.ts. */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/coduri/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
