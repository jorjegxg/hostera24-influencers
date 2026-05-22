import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Bază din .env: NEXT_PUBLIC_SITE_URL, WEB_BASE_URL (vezi next.config.ts → loadEnvConfig). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/termeni-si-conditii`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/politica-de-confidentialitate`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
