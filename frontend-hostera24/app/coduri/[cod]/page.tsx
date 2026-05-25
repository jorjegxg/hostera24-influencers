import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchPublicCodQr,
  resolvePublicCodUrl,
  type PublicCodQr,
} from "@/lib/api";
import { resolveUploadsMediaUrl } from "@/lib/media-url";
import { CodQrDisplay } from "./CodQrDisplay";
import { RecordScan } from "./RecordScan";

type PageProps = {
  params: Promise<{ cod: string }>;
};

function firmaDisplayName(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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

function limitaReducereMesaj(limita: number, ramase: number | null): {
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
  const pret = data.pret?.trim();
  const pretRedus = data.pretRedus?.trim();
  const limitaScanari = data.limitaScanari;
  const atentionareLimita =
    limitaScanari != null && limitaScanari > 0
      ? limitaReducereMesaj(limitaScanari, data.scanariRamase)
      : null;
  const { firma } = data;
  const logoUrl = resolveUploadsMediaUrl(firma.logoUrl);
  const numeFirma = resolveFirmaName(firma);
  const descriere = firma.descriere?.trim();
  const website = firma.website?.trim();
  const qrUrl = await resolvePublicCodUrl(data.cod);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-5 md:min-h-full md:py-12">
      <RecordScan cod={data.cod} />

      <article className="w-full max-w-md rounded-2xl border border-[var(--color-placeholder-border)] bg-[var(--color-surface)] p-5 md:p-8 shadow-sm">
        <header className="flex flex-col items-center text-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`Logo ${numeFirma}`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-2xl font-bold text-[var(--color-accent)]">
              {numeFirma.charAt(0)}
            </div>
          )}
          <h1 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">
            {numeFirma}
          </h1>
          {descriere ? (
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {descriere}
            </p>
          ) : null}
          {website ? (
            <p className="mt-4 text-sm">
              <a
                href={websiteHref(website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                {websiteLabel(website)}
              </a>
            </p>
          ) : null}
        </header>

        <div
          className="my-8 h-px w-full bg-[var(--color-placeholder-border)]"
          aria-hidden
        />

        {mesajClient ? (
          <p className="text-center text-lg leading-relaxed font-medium">
            {mesajClient}
          </p>
        ) : null}

        {pret || pretRedus ? (
          <div className="mt-4 space-y-2 text-center">
            {pret ? (
              <p
                className={`text-base ${
                  pretRedus
                    ? "text-[var(--color-text-secondary)] line-through"
                    : "font-semibold text-[var(--color-accent)]"
                }`}
              >
                {pret}
              </p>
            ) : null}
            {pretRedus ? (
              <p className="text-base font-semibold text-[var(--color-accent)]">
                {pretRedus}
              </p>
            ) : null}
          </div>
        ) : null}

        {atentionareLimita ? (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
              atentionareLimita.epuizat
                ? "border-amber-300 bg-amber-50 text-amber-950"
                : "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/8 text-[var(--color-text-primary)]"
            }`}
            role="note"
          >
            <p className="flex gap-2 font-semibold">
              <span className="shrink-0" aria-hidden>
                ⚠
              </span>
              <span>{atentionareLimita.titlu}</span>
            </p>
            {atentionareLimita.detaliu ? (
              <p
                className={`mt-2 pl-7 ${
                  atentionareLimita.epuizat
                    ? "text-amber-900/90"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {atentionareLimita.detaliu}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center">
          <CodQrDisplay
            url={qrUrl}
            label="Dacă folosești codul acesta când cumperi serviciul, ți se aplică reducerea"
          />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
          Cod: <span className="font-mono">{data.cod}</span>
        </p>
      </article>

      <p className="mt-4 text-center text-xs text-[var(--color-text-secondary)] md:mt-8">
        powered by{" "}
        <Link
          href="/"
          className="text-[var(--color-accent)] hover:underline"
        >
          hostera24
        </Link>
      </p>
    </main>
  );
}
