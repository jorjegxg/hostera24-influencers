import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "HOSTERA24 — Clienți în zilele moarte, măsurați la casă",
  description:
    "Creezi coduri în aplicație, postezi pe social, scanezi la casă. Vezi câți clienți aduce fiecare postare și la ce oră vin.",
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
