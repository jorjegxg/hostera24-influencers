import Image from "next/image";
import Link from "next/link";
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

export default async function CodQrPublicPage({ params }: PageProps) {
  const { cod } = await params;
  const data = await fetchPublicCodQr(cod);

  if (!data) {
    notFound();
  }

  const mesajClient = data.numePostareClienti?.trim();
  const pretRedus = data.pretRedus?.trim();
  const { firma } = data;
  const logoUrl = resolveUploadsMediaUrl(firma.logoUrl);
  const numeFirma = resolveFirmaName(firma);
  const descriere = firma.descriere?.trim();
  const website = firma.website?.trim();
  const qrUrl = await resolvePublicCodUrl(data.cod);

  return (
    <main className="flex min-h-full flex-col items-center justify-center px-5 py-12">
      <RecordScan cod={data.cod} />

      <article className="w-full max-w-md rounded-2xl border border-[var(--color-placeholder-border)] bg-[var(--color-surface)] p-8 shadow-sm">
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

        {pretRedus ? (
          <p className="mt-4 text-center text-base font-semibold text-[var(--color-accent)]">
            {pretRedus}
          </p>
        ) : null}

        <div className="mt-8 flex justify-center">
          <CodQrDisplay
            url={qrUrl}
            label="Scanează pentru a accesa oferta"
          />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
          Cod: <span className="font-mono">{data.cod}</span>
        </p>
      </article>

      <p className="mt-8 text-center text-xs text-[var(--color-text-secondary)]">
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
