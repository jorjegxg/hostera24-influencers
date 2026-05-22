const SECTION_LINKS = [
  { id: "motto", label: "Acasă" },
  { id: "beneficii", label: "Beneficii" },
  { id: "statistici", label: "Statistici" },
  { id: "contact", label: "Contact" },
] as const;

export function SectionNav() {
  return (
    <nav
      aria-label="Secțiuni pagină"
      className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-4 overflow-x-auto sm:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {SECTION_LINKS.map(({ id, label }) => (
        <a
          key={id}
          href={`/#${id}`}
          className="shrink-0 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)] sm:text-base"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
