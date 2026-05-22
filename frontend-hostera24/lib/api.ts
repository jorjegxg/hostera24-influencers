import { isLocalhostUrl, publicSiteUrl } from "@/lib/site";

export type PublicCodQr = {
  cod: string;
  numePostareClienti: string | null;
  pretRedus: string | null;
  limitaScanari: number | null;
  scanariRamase: number | null;
  firma: {
    email: string;
    nume: string | null;
    telefon: string | null;
    descriere: string | null;
    website: string | null;
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

export { publicSiteUrl };

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

export type ContactMessagePayload = {
  tip: "contact";
  nume: string;
  email: string;
  telefon: string;
  mesaj: string;
};

export async function submitContactMessage(
  payload: ContactMessagePayload,
): Promise<{ ok: true; id: number }> {
  const res = await fetch(`${apiBaseUrl()}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = `Eroare ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) detail = body.message.join(", ");
      else if (body.message) detail = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  return res.json() as Promise<{ ok: true; id: number }>;
}

export type AdminContactMessage = {
  id: number;
  tip: string;
  nume: string;
  email: string;
  telefon: string;
  agentie: string | null;
  mesaj: string | null;
  creatLa: string;
};

async function parseApiError(res: Response): Promise<string> {
  let detail = `Eroare ${res.status}`;
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) detail = body.message.join(", ");
    else if (body.message) detail = body.message;
  } catch {
    /* ignore */
  }
  return detail;
}

export async function adminLogin(
  parola: string,
): Promise<{ accessToken: string }> {
  const res = await fetch(`${apiBaseUrl()}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parola }),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  return res.json() as Promise<{ accessToken: string }>;
}

export async function fetchAdminContactMessages(
  accessToken: string,
): Promise<AdminContactMessage[]> {
  const res = await fetch(`${apiBaseUrl()}/admin/mesaje-contact`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  return res.json() as Promise<AdminContactMessage[]>;
}
