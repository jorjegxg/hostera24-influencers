import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "HOSTERA24 — Descarcă aplicația și adu-ți clienți noi",
  description:
    "Coduri QR pentru cupoane, postări, marketing affiliat și statistici de scanări. Formular de contact direct pe site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        {children}
      </body>
    </html>
  );
}
