export type PublicCodQr = {
  cod: string;
  numePostareClienti: string | null;
  pretRedus: string | null;
  firma: {
    email: string;
    logoUrl: string | null;
  };
};

function apiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL lipsește — setează în .env la rădăcina proiectului",
    );
  }
  return url.replace(/\/+$/, "");
}

function normalizeBaseUrl(url: string): string {
  const withProtocol = url.startsWith("http") ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

function isLocalhostUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

/** URL public al site-ului Next.js (pentru link-uri QR). */
export function publicSiteUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  const web = process.env.WEB_BASE_URL;
  const vercel = process.env.VERCEL_URL;

  const candidates = [site, web, vercel, "http://localhost:3001"].filter(
    (v): v is string => Boolean(v?.trim()),
  );

  for (const raw of candidates) {
    const url = normalizeBaseUrl(raw);
    if (!isLocalhostUrl(url)) return url;
  }

  return normalizeBaseUrl(candidates[0] ?? "http://localhost:3001");
}

/** URL encodat în codul QR (același format ca în app Flutter). */
export function publicCodUrl(cod: string): string {
  return `${publicSiteUrl()}/coduri/${encodeURIComponent(cod)}`;
}

/**
 * Rezolvă URL-ul QR fără localhost când e posibil:
 * 1. env (NEXT_PUBLIC_SITE_URL / WEB_BASE_URL) dacă nu e localhost
 * 2. host-ul cererii (ex. 192.168.1.12 când deschizi pagina de pe rețea)
 */
export async function resolvePublicCodUrl(cod: string): Promise<string> {
  const fromEnv = publicSiteUrl();
  if (!isLocalhostUrl(fromEnv)) {
    return `${fromEnv}/coduri/${encodeURIComponent(cod)}`;
  }

  const { headers } = await import("next/headers");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) {
    const hostname = host.split(":")[0] ?? host;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `${proto}://${host}/coduri/${encodeURIComponent(cod)}`;
    }
  }

  return publicCodUrl(cod);
}

export async function fetchPublicCodQr(
  cod: string,
): Promise<PublicCodQr | null> {
  const res = await fetch(
    `${apiBaseUrl()}/coduri-qr/public/${encodeURIComponent(cod)}`,
    { cache: "no-store" },
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<PublicCodQr>;
}

export async function recordPublicScan(cod: string): Promise<void> {
  await fetch(
    `${apiBaseUrl()}/coduri-qr/public/${encodeURIComponent(cod)}/scan`,
    { method: "POST" },
  );
}
