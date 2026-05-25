import path from "path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// Încarcă .env din rădăcina monorepo-ului (nu din frontend-hostera24/)
const repoRoot = path.resolve(__dirname, "..");
const { combinedEnv } = loadEnvConfig(repoRoot);

const apiUrl =
  combinedEnv.NEXT_PUBLIC_API_URL ??
  combinedEnv.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_BASE_URL ??
  "http://localhost:3022";

const siteUrl =
  combinedEnv.NEXT_PUBLIC_SITE_URL ??
  combinedEnv.WEB_BASE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.WEB_BASE_URL ??
  "http://localhost:3023";

/** Host-uri permise la acces dev de pe telefon / LAN (Next.js allowedDevOrigins). */
function allowedDevOrigins(): string[] {
  const hosts = new Set<string>(["localhost", "127.0.0.1", "192.168.1.100"]);
  for (const key of ["WEB_BASE_URL", "NEXT_PUBLIC_SITE_URL"] as const) {
    const raw = process.env[key];
    if (!raw) continue;
    try {
      const hostname = new URL(raw).hostname;
      if (hostname) hosts.add(hostname);
    } catch {
      /* ignore invalid URL */
    }
  }
  return [...hosts];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: allowedDevOrigins(),
  env: {
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    WEB_BASE_URL: combinedEnv.WEB_BASE_URL ?? process.env.WEB_BASE_URL ?? siteUrl,
    API_BASE_URL: combinedEnv.API_BASE_URL ?? process.env.API_BASE_URL ?? apiUrl,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "api.hostera24.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
