"use client";

type LeadFormProps = {
  variant: "firme" | "agentii";
};

const MAIL = "georgelutaoff@gmail.com";

export function LeadForm({ variant }: LeadFormProps) {
  const formId = variant === "firme" ? "cta-firme" : "cta-agentii";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nume = String(fd.get("nume") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const telefon = String(fd.get("telefon") ?? "").trim();
    const agentie =
      variant === "agentii" ? String(fd.get("agentie") ?? "").trim() : "";

    if (!nume || !email || !telefon) {
      alert("Completează numele, emailul și telefonul.");
      return;
    }
    if (variant === "agentii" && !agentie) {
      alert("Completează numele agenției.");
      return;
    }

    const lines =
      variant === "firme"
        ? [
            "Înscriere — Pentru Firme",
            "",
            `Nume: ${nume}`,
            `Email: ${email}`,
            `Telefon: ${telefon}`,
          ]
        : [
            "Înscriere — Pentru Agenții",
            "",
            `Nume: ${nume}`,
            `Agenție: ${agentie}`,
            `Email: ${email}`,
            `Telefon: ${telefon}`,
          ];

    const subject =
      variant === "firme"
        ? "HOSTERA24 — Vreau clienți noi (Firme)"
        : "HOSTERA24 — Partener agenție";
    const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = mailto;
  }

  return (
    <div className="mx-auto mt-6 w-[min(100%,50vw)]">
      <form
        id={formId}
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 rounded-xl border border-neutral-200 bg-[var(--color-surface)] p-5 shadow-sm"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-primary)]">
            Nume
          </span>
          <input
            name="nume"
            type="text"
            autoComplete="name"
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[var(--color-text-primary)] outline-none ring-[var(--color-accent)] focus:ring-2"
          />
        </label>
        {variant === "agentii" ? (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--color-text-primary)]">
              Agenție
            </span>
            <input
              name="agentie"
              type="text"
              autoComplete="organization"
              required
              className="rounded-lg border border-neutral-300 px-3 py-2 text-[var(--color-text-primary)] outline-none ring-[var(--color-accent)] focus:ring-2"
            />
          </label>
        ) : null}
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-primary)]">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[var(--color-text-primary)] outline-none ring-[var(--color-accent)] focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-primary)]">
            Telefon
          </span>
          <input
            name="telefon"
            type="tel"
            autoComplete="tel"
            required
            className="rounded-lg border border-neutral-300 px-3 py-2 text-[var(--color-text-primary)] outline-none ring-[var(--color-accent)] focus:ring-2"
          />
        </label>
        <button
          type="submit"
          className="mt-1 rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
        >
          Trimite
        </button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
        Se deschide aplicația ta de email cu mesajul complet. Dacă nu ai client
        de mail configurat, poți scrie direct la{" "}
        <a className="underline" href={`mailto:${MAIL}`}>
          {MAIL}
        </a>
        .
      </p>
    </div>
  );
}
