/** Aliniază URL logo /uploads la API public (fix host vechi din DB). */
export function resolveUploadsMediaUrl(
  url: string | null | undefined,
): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  const idx = trimmed.indexOf("/uploads/");
  if (idx < 0) return trimmed;

  const suffix = trimmed.slice(idx + "/uploads".length);
  const api = (
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_BASE_URL ??
    "http://localhost:3022"
  ).replace(/\/+$/, "");

  return `${api}/uploads${suffix}`;
}
