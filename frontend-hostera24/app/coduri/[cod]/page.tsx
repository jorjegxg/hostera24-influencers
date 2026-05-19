import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPublicCodQr } from "@/lib/api";
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

export default async function CodQrPublicPage({ params }: PageProps) {
  const { cod } = await params;
  const data = await fetchPublicCodQr(cod);

  if (!data) {
    notFound();
  }

  const mesajClient = data.numePostareClienti?.trim();
  const pretRedus = data.pretRedus?.trim();
  const logoUrl = data.firma.logoUrl;
  const numeFirma = firmaDisplayName(data.firma.email);

  return (
    <main className="flex min-h-full flex-col items-center justify-center px-5 py-12">
      <RecordScan cod={data.cod} />

      <article className="w-full max-w-md rounded-2xl border border-[var(--color-placeholder-border)] bg-[var(--color-surface)] p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
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
          <p className="mt-4 text-sm font-medium text-[var(--color-text-secondary)]">
            {numeFirma}
          </p>
        </div>

        {mesajClient ? (
          <p className="mt-8 text-center text-lg leading-relaxed font-medium">
            {mesajClient}
          </p>
        ) : (
          <p className="mt-8 text-center text-[var(--color-text-secondary)] italic">
            Mesaj indisponibil.
          </p>
        )}

        {pretRedus ? (
          <p className="mt-4 text-center text-base font-semibold text-[var(--color-accent)]">
            {pretRedus}
          </p>
        ) : null}

        <p className="mt-8 text-center text-xs text-[var(--color-text-secondary)]">
          Cod: <span className="font-mono">{data.cod}</span>
        </p>
      </article>

      <Link
        href="/"
        className="mt-8 text-sm text-[var(--color-accent)] hover:underline"
      >
        hostera24
      </Link>
    </main>
  );
}
