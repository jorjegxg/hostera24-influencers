import { SectionNav } from "./SectionNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[var(--color-surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:gap-6 sm:py-4">
        <a
          href="#top"
          className="shrink-0 font-sans text-lg font-black tracking-tight text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)] sm:text-xl"
        >
          HOSTERA24
        </a>
        <SectionNav />
      </div>
    </header>
  );
}
