import Link from "next/link";
import type { LegalSection } from "@/lib/legal-content";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type LegalPageLayoutProps = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPageLayout({
  title,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="w-full flex-1">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <Link
              href="/"
              className="text-[var(--color-accent)] hover:underline"
            >
              ← Înapoi la pagina principală
            </Link>
          </p>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Ultima actualizare: {lastUpdated}
          </p>
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
