import type { Metadata } from "next";
import { LegalPageLayout } from "@/app/components/LegalPageLayout";
import { LEGAL_LAST_UPDATED, PRIVACY_SECTIONS } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Politica de confidențialitate HOSTERA24 — prelucrarea datelor personale conform GDPR.",
  alternates: {
    canonical: "/politica-de-confidentialitate",
  },
};

export default function ConfidentialitatePage() {
  return (
    <LegalPageLayout
      title="Politica de confidențialitate"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={PRIVACY_SECTIONS}
    />
  );
}
