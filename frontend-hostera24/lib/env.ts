/** URL API backend — din .env la rădăcina monorepo-ului. */
export function apiBaseUrlFromEnv(): string {
  const url =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.API_BASE_URL?.trim() ||
    "http://localhost:3022";
  return url.replace(/\/+$/, "");
}
