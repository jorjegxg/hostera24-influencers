import Link from "next/link";
import { AgentiiSection } from "../components/AgentiiSection";
import { SiteFooter } from "../components/SiteFooter";

export const metadata = {
  title: "HOSTERA24 — Pentru agenții de marketing",
  description:
    "Parteneriat pe rezultate: urmărire clienți prin cod QR, comision clar per client adus.",
};

export default function AgentiiPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[var(--color-surface)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
          >
            HOSTERA24
          </Link>
          <a
            href="#cta-agentii"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-accent-hover)] sm:px-6 sm:py-3 sm:text-base"
          >
            Începe acum
          </a>
        </div>
      </header>
      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-5xl px-4">
          <AgentiiSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
