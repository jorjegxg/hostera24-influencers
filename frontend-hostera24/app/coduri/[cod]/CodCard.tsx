"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { CodQrDisplay } from "./CodQrDisplay";

type LimitaInfo = {
  titlu: string;
  detaliu?: string;
  epuizat: boolean;
};

type Props = {
  cod: string;
  qrUrl: string;
  logoSrc: string | null;
  numeFirma: string;
  descriere?: string;
  websiteHref?: string;
  websiteLabel?: string;
  mesajClient?: string;
  beneficiuLabel?: string | null;
  valabilitateLabel?: string | null;
  atentionareLimita?: LimitaInfo | null;
};

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 1 0-1.09-1.03l-2.955 3.129V2.75Z" />
      <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
    </svg>
  );
}

export function CodCard({
  cod,
  qrUrl,
  logoSrc,
  numeFirma,
  descriere,
  websiteHref,
  websiteLabel,
  mesajClient,
  beneficiuLabel,
  valabilitateLabel,
  atentionareLimita,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    const node = cardRef.current;
    if (!node) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: false,
        skipFonts: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `cod-qr-${cod}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // html-to-image poate eșua dacă logo-ul nu e accesibil cross-origin
    } finally {
      setDownloading(false);
    }
  }, [cod]);

  return (
    <article className="w-full max-w-md rounded-2xl border border-[var(--color-placeholder-border)] bg-[var(--color-surface)] p-5 shadow-sm md:p-8">
      <div ref={cardRef} className="bg-[var(--color-surface)] p-2">
        <header className="flex flex-col items-center text-center">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={`Logo ${numeFirma}`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl object-cover"
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
          {websiteHref && websiteLabel ? (
            <p className="mt-4 text-sm">
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                {websiteLabel}
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

        {beneficiuLabel ? (
          <div className="mt-4 text-center">
            <p className="text-base font-semibold text-[var(--color-accent)]">
              {beneficiuLabel}
            </p>
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
          <CodQrDisplay url={qrUrl} />
        </div>

        {valabilitateLabel ? (
          <p className="mt-4 text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {valabilitateLabel}
          </p>
        ) : null}

        <p className="mt-6 text-center text-xs text-[var(--color-text-secondary)]">
          powered by{" "}
          <Link href="/" className="text-[var(--color-accent)] hover:underline">
            hostera24
          </Link>
        </p>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
      >
        <DownloadIcon />
        {downloading ? "Se pregătește…" : "Descarcă poza"}
      </button>
    </article>
  );
}
