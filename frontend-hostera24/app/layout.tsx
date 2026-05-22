import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { JsonLdOrganization } from "./components/JsonLdOrganization";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const site = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "HOSTERA24",
    "coduri QR",
    "cupoane",
    "marketing affiliat",
    "influenceri",
    "firme",
    "scanări QR",
    "România",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: site,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/cod_campanie.jpeg",
        width: 1200,
        height: 630,
        alt: "HOSTERA24 — coduri QR pentru campanii",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/cod_campanie.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      id="top"
      lang="ro"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <JsonLdOrganization />
        {children}
      </body>
    </html>
  );
}
