export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[var(--color-surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
          HOSTERA24
        </span>
        <a
          href="#cta-firme"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-accent-hover)] sm:px-6 sm:py-3 sm:text-base"
        >
          Vreau clienți noi
        </a>
      </div>
    </header>
  );
}
