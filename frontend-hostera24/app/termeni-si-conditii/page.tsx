import type { Metadata } from "next";
import { LegalPageLayout } from "@/app/components/LegalPageLayout";
import { LEGAL_LAST_UPDATED, TERMS_SECTIONS } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description:
    "Termenii și condițiile de utilizare a platformei HOSTERA24, operate de Luta D.L. Gheorghe PFA.",
  alternates: {
    canonical: "/termeni-si-conditii",
  },
};

export default function TermeniPage() {
  return (
    <LegalPageLayout
      title="Termeni și condiții"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={TERMS_SECTIONS}
    />
  );
}
