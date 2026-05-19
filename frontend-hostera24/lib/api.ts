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
    throw new Error("NEXT_PUBLIC_API_URL lipsește din .env");
  }
  return url.replace(/\/+$/, "");
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
