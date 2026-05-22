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

function siteUrlCandidates(): string[] {
  const vercel = process.env.VERCEL_URL?.trim();
  return [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.WEB_BASE_URL,
    vercel ? normalizeBaseUrl(vercel) : undefined,
  ].filter((v): v is string => Boolean(v?.trim()));
}

/**
 * URL canonic al site-ului (SEO, sitemap, robots, metadata).
 * Citește din .env la rădăcina monorepo-ului: NEXT_PUBLIC_SITE_URL, WEB_BASE_URL, VERCEL_URL.
 */
export function siteUrl(): string {
  const candidates = siteUrlCandidates();
  if (candidates.length === 0) {
    return DEFAULT_SITE_URL;
  }

  for (const raw of candidates) {
    const url = normalizeBaseUrl(raw);
    if (!isLocalhostUrl(url)) {
      return url;
    }
  }

  return normalizeBaseUrl(candidates[0]);
}

/** URL public al site-ului Next.js (link-uri QR, pagini cod). */
export function publicSiteUrl(): string {
  return siteUrl();
}

export const DEFAULT_DESCRIPTION =
  "Coduri QR pentru cupoane, postări, marketing affiliat și statistici de scanări. Formular de contact direct pe site.";

export const DEFAULT_TITLE =
  "HOSTERA24 — Descarcă aplicația și adu-ți clienți noi";
