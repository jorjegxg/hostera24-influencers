import type { MetadataRoute } from "next";

const SITEMAP_BASE = "https://hostera24.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITEMAP_BASE;
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
