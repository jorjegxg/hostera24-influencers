type Audience = "firme" | "agentii";

type SiteHeaderProps = {
  audience: Audience;
  onAudienceChange: (audience: Audience) => void;
};

export function SiteHeader({ audience, onAudienceChange }: SiteHeaderProps) {
  const ctaHref = audience === "firme" ? "#cta-firme" : "#cta-agentii";
  const ctaLabel = audience === "firme" ? "Vreau clienți noi" : "Începe acum";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[var(--color-surface)]/95 backdrop-blur-sm">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-x-3 gap-y-3 px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-rows-1 sm:items-center">
        <span className="col-start-1 row-start-1 self-center text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
          HOSTERA24
        </span>
        <div
          className="col-span-2 row-start-2 flex justify-center gap-2 sm:col-span-1 sm:col-start-2 sm:row-start-1"
          role="tablist"
          aria-label="Alege publicul"
        >
          <button
            type="button"
            role="tab"
            aria-selected={audience === "firme"}
            aria-controls="panel-firme"
            id="tab-firme"
            onClick={() => onAudienceChange("firme")}
            className={
              audience === "firme"
                ? "min-w-0 flex-1 rounded-lg bg-[var(--color-accent)] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-accent-hover)] sm:flex-none sm:min-w-[140px] sm:px-4"
                : "min-w-0 flex-1 rounded-lg bg-[var(--color-inactive-bg)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-neutral-300 sm:flex-none sm:min-w-[140px] sm:px-4"
            }
          >
            Pentru Firme
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={audience === "agentii"}
            aria-controls="panel-agentii"
            id="tab-agentii"
            onClick={() => onAudienceChange("agentii")}
            className={
              audience === "agentii"
                ? "min-w-0 flex-1 rounded-lg bg-[var(--color-accent)] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-accent-hover)] sm:flex-none sm:min-w-[140px] sm:px-4"
                : "min-w-0 flex-1 rounded-lg bg-[var(--color-inactive-bg)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-neutral-300 sm:flex-none sm:min-w-[140px] sm:px-4"
            }
          >
            Pentru Agenții
          </button>
        </div>
        <a
          href={ctaHref}
          className="col-start-2 row-start-1 inline-flex items-center justify-center self-center justify-self-end rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-accent-hover)] sm:col-start-3 sm:px-6 sm:py-3 sm:text-base"
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
