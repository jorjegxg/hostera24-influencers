import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchPublicCodQr,
  resolvePublicCodUrl,
  type PublicCodQr,
} from "@/lib/api";
import { fetchImageDataUrl } from "@/lib/image-data-url";
import { resolveUploadsMediaUrl } from "@/lib/media-url";
import { formatBeneficiuCuponLabel } from "@/lib/price-format";
import { formatValabilitateLabel } from "@/lib/qr-schedule";
import { CodCard } from "./CodCard";
import { RecordScan } from "./RecordScan";

type PageProps = {
  params: Promise<{ cod: string }>;
};

function firmaDisplayName(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveFirmaName(firma: PublicCodQr["firma"]): string {
  const nume = firma.nume?.trim();
  if (nume) return nume;
  return firmaDisplayName(firma.email);
}

function websiteHref(website: string): string {
  const trimmed = website.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function websiteLabel(website: string): string {
  return website.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

function limitaReducereMesaj(
  limita: number,
  ramase: number | null,
): {
  titlu: string;
  detaliu?: string;
  epuizat: boolean;
} {
  const titlu =
    limita === 1
      ? "Doar prima persoană care vine cu acest cod beneficiază de reducere."
      : `Doar primele ${limita} persoane care vin cu acest cod beneficiază de reducere.`;

  if (ramase === 0) {
    return {
      titlu,
      detaliu:
        "Toate locurile disponibile au fost ocupate. Este posibil ca reducerea să nu mai fie valabilă la casă.",
      epuizat: true,
    };
  }

  if (ramase != null && ramase > 0 && ramase <= limita) {
    const locuri =
      ramase === 1
        ? "Mai este disponibil 1 loc."
        : `Mai sunt disponibile ${ramase} locuri.`;
    return { titlu, detaliu: locuri, epuizat: false };
  }

  return { titlu, epuizat: false };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { cod } = await params;
  const data = await fetchPublicCodQr(cod);
  const title = data ? resolveFirmaName(data.firma) : "Cod QR";

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CodQrPublicPage({ params }: PageProps) {
  const { cod } = await params;
  const data = await fetchPublicCodQr(cod);

  if (!data) {
    notFound();
  }

  const mesajClient = data.numePostareClienti?.trim();
  const beneficiuLabel = formatBeneficiuCuponLabel(data.pret, data.reducere);
  const valabilitateLabel = formatValabilitateLabel(data);
  const limitaScanari = data.limitaScanari;
  const atentionareLimita =
    limitaScanari != null && limitaScanari > 0
      ? limitaReducereMesaj(limitaScanari, data.scanariRamase)
      : null;
  const { firma } = data;
  const logoUrl = resolveUploadsMediaUrl(firma.logoUrl);
  const logoSrc = (await fetchImageDataUrl(logoUrl)) ?? logoUrl;
  const numeFirma = resolveFirmaName(firma);
  const descriere = firma.descriere?.trim();
  const website = firma.website?.trim();
  const qrUrl = await resolvePublicCodUrl(data.cod);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-5 md:min-h-full md:py-12">
      <RecordScan cod={data.cod} />

      <CodCard
        cod={data.cod}
        qrUrl={qrUrl}
        logoSrc={logoSrc}
        numeFirma={numeFirma}
        descriere={descriere}
        websiteHref={website ? websiteHref(website) : undefined}
        websiteLabel={website ? websiteLabel(website) : undefined}
        mesajClient={mesajClient}
        beneficiuLabel={beneficiuLabel}
        valabilitateLabel={valabilitateLabel}
        atentionareLimita={atentionareLimita}
      />
    </main>
  );
}
