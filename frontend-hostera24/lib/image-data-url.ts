/** Încarcă o imagine ca data URL (server-side, fără CORS în browser). */
export async function fetchImageDataUrl(
  url: string | null | undefined,
): Promise<string | null> {
  if (!url?.trim()) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const mime = response.headers.get("content-type") ?? "image/jpeg";
    return `data:${mime};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch {
    return null;
  }
}
