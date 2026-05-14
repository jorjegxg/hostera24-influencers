export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-[var(--color-surface)] py-8 text-center text-sm text-[var(--color-text-secondary)]">
      <div className="mx-auto max-w-5xl px-4">
        <p>
          Contact:{" "}
          <a
            className="text-[var(--color-text-primary)] underline decoration-neutral-400 underline-offset-2 hover:decoration-[var(--color-accent)]"
            href="mailto:georgelutaoff@gmail.com"
          >
            georgelutaoff@gmail.com
          </a>{" "}
          | Telefon:{" "}
          <a
            className="text-[var(--color-text-primary)] underline decoration-neutral-400 underline-offset-2 hover:decoration-[var(--color-accent)]"
            href="tel:+40753570440"
          >
            0753570440
          </a>
        </p>
        <p className="mt-2 text-neutral-500">© 2025 HOSTERA24</p>
      </div>
    </footer>
  );
}
