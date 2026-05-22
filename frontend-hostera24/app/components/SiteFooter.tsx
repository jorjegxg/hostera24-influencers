import Link from "next/link";
import { CONTACT_EMAIL, OPERATOR_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-[var(--color-surface)] py-8 text-center text-sm text-[var(--color-text-secondary)]">
      <div className="mx-auto max-w-5xl px-4">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          aria-label="Informații legale"
        >
          <Link
            href="/termeni-si-conditii"
            className="text-[var(--color-text-primary)] underline decoration-neutral-400 underline-offset-2 hover:decoration-[var(--color-accent)]"
          >
            Termeni și condiții
          </Link>
          <span className="text-neutral-300" aria-hidden>
            ·
          </span>
          <Link
            href="/politica-de-confidentialitate"
            className="text-[var(--color-text-primary)] underline decoration-neutral-400 underline-offset-2 hover:decoration-[var(--color-accent)]"
          >
            Politica de confidențialitate
          </Link>
        </nav>
        <p className="mt-6">
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
            {OPERATOR_NAME}
          </span>
        </p>
        <p className="mt-4 text-neutral-500">
          © {new Date().getFullYear()} {OPERATOR_NAME}
        </p>
      </div>
    </footer>
  );
}
