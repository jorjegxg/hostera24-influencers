import path from "path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

// Încarcă .env din rădăcina monorepo-ului (nu din frontend-hostera24/)
loadEnvConfig(path.resolve(__dirname, ".."));

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
