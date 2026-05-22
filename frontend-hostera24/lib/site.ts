export const SITE_NAME = "HOSTERA24";
export const OPERATOR_NAME = "Luta D.L. Gheorghe PFA";
export const CONTACT_EMAIL = "georgelutaoff@gmail.com";

const DEFAULT_SITE_URL = "http://localhost:3023";

function normalizeBaseUrl(url: string): string {
  const withProtocol = url.startsWith("http") ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

export function isLocalhostUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

/** URL canonic al site-ului (SEO, sitemap, metadata). */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return normalizeBaseUrl(raw);
  return DEFAULT_SITE_URL;
}

/** URL public al site-ului Next.js (link-uri QR, preferă host non-localhost). */
export function publicSiteUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  const web = process.env.WEB_BASE_URL;
  const vercel = process.env.VERCEL_URL;

  const candidates = [site, web, vercel, DEFAULT_SITE_URL].filter(
    (v): v is string => Boolean(v?.trim()),
  );

  for (const raw of candidates) {
    const url = normalizeBaseUrl(raw);
    if (!isLocalhostUrl(url)) return url;
  }

  return normalizeBaseUrl(candidates[0] ?? DEFAULT_SITE_URL);
}

export const DEFAULT_DESCRIPTION =
  "Coduri QR pentru cupoane, postări, marketing affiliat și statistici de scanări. Formular de contact direct pe site.";

export const DEFAULT_TITLE =
  "HOSTERA24 — Descarcă aplicația și adu-ți clienți noi";
