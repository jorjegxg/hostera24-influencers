import path from "path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// Încarcă .env din rădăcina monorepo-ului (nu din frontend-hostera24/)
const repoRoot = path.resolve(__dirname, "..");
loadEnvConfig(repoRoot);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    WEB_BASE_URL: process.env.WEB_BASE_URL,
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
