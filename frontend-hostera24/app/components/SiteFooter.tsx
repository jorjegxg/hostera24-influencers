const CONTACT_EMAIL = "georgelutaoff@gmail.com";
const FIRMA = "Luta D.L. Gheorghe PFA";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-[var(--color-surface)] py-8 text-center text-sm text-[var(--color-text-secondary)]">
      <div className="mx-auto max-w-5xl px-4">
        <p>
          Email:{" "}
          <a
            className="text-[var(--color-text-primary)] underline decoration-neutral-400 underline-offset-2 hover:decoration-[var(--color-accent)]"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-2">
          Firmă:{" "}
          <span className="font-medium text-[var(--color-text-primary)]">
            {FIRMA}
          </span>
        </p>
        <p className="mt-4 text-neutral-500">
          © {new Date().getFullYear()} {FIRMA}
        </p>
      </div>
    </footer>
  );
}
