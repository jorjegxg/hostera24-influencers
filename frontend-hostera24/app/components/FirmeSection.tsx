import { BenefitIcon, type BenefitIconName } from "./BenefitIcon";
import type { ReactNode } from "react";
import { LeadForm } from "./LeadForm";
import { PlaceholderScreenshot } from "./PlaceholderScreenshot";

const BENEFIT_ITEMS: {
  id: string;
  icon: BenefitIconName;
  title: string;
  body: ReactNode;
}[] = [
  {
    id: "cupoane",
    icon: "cupoane",
    title: "Cupoane promoționale",
    body: (
      <>
        <p>
          Configurați coduri QR cu validitate flexibilă — de exemplu luni–vineri
          sau doar anumite zile (joi, marți etc.). La scanare în magazin, clientul
          beneficiază de preț redus.{" "}
          <strong className="text-[var(--color-text-primary)]">
            Stimulați traficul în zilele cu vânzări mai slabe.
          </strong>
        </p>
        <p className="mt-3 rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-sm">
          <span className="font-semibold text-[var(--color-text-primary)]">
            Recomandare:
          </span>{" "}
          ofertele concrete (ex. „−10 lei la scanarea codului în magazin”) au rată
          de conversie mai bună decât mesajele generice de tip „reduceri de 10%”.
        </p>
      </>
    ),
  },
  {
    id: "postari",
    icon: "postari",
    title: "Performanța fiecărei postări",
    body: (
      <p>
        Atașați la fiecare postare un cod QR cu reducere fixă (ex. 10 lei), pe o
        perioadă definită. La casă, scanarea confirmă reducerea pe loc — fără
        coduri manuale sau explicații suplimentare. În aplicație vedeți statistici:{" "}
        <strong className="text-[var(--color-text-primary)]">
          ce tip de conținut aduce cel mai mult trafic în magazin.
        </strong>
      </p>
    ),
  },
  {
    id: "affiliat",
    icon: "affiliat",
    title: "Marketing afiliat",
    body: (
      <p>
        Colaborați cu agenții sau creatori de conținut pe bază de rezultate.
        Generați un cod de reducere dedicat (ex. 10%) pentru fiecare partener; ei
        îl promovează, iar remunerația se raportează la{" "}
        <strong className="text-[var(--color-text-primary)]">
          numărul real de clienți aduși în magazin
        </strong>
        , măsurați prin scanări.
      </p>
    ),
  },
  {
    id: "produs-gratis",
    icon: "produs-gratis",
    title: "Campanie cu bilete gratuite sau reduceri",
    body: (
      <p>
        Exemplu într-un videoclip: cine vă urmărește pe Instagram primește
        intrare gratuită sau reducere — la scanarea codului QR din aplicație.
      </p>
    ),
  },
  {
    id: "primele-x",
    icon: "primele-x",
    title: "Oferte limitate — primele X clienți",
    body: (
      <p>
        Configurați reduceri pentru primele X persoane care prezintă codul în
        magazin (ex. 50% reducere). Ideal pentru campanii de urgență și pentru a
        consolida comunitatea pe rețelele sociale — urmăritorii află primii de
        ofertele viitoare.
      </p>
    ),
  },
];

const STAT_ITEMS: { icon: BenefitIconName; text: string }[] = [
  { icon: "statistici-scan", text: "Grafice de scanări per cod QR" },
  { icon: "statistici-ore", text: "Distribuție pe zile și ore" },
  { icon: "statistici-compar", text: "Compari postări, cupoane și campanii affiliat" },
];

const COMBINED_STEPS = [
  "Colaborați cu o agenție de marketing — remunerare pe performanță.",
  "Generați un cod dedicat: primele X scanări beneficiază de 50% reducere.",
  "La casă, validați codul fiecărui client care vine din campanie.",
  "Reducerea se aplică automat pentru primele X persoane eligibile.",
] as const;

export function FirmeSection() {
  return (
    <div className="w-full pb-16 pt-10">
      {/* Secțiune 1 — Motto */}
      <section
        id="motto"
        className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
      >
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            Descarcă aplicația Hostera24 și adu-ți clienți noi
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)] sm:text-xl">
            Creezi coduri în aplicație, le pui în postări sau le dai partenerilor,
            scanezi la casă — și vezi exact câți clienți aduce fiecare campanie.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Vreau acces la aplicație
            </a>
            <a
              href="#beneficii"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)]"
            >
              Cum mă ajută
            </a>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <PlaceholderScreenshot />
        </div>
      </section>

      {/* Secțiune 2 — Beneficii */}
      <section
        id="beneficii"
        className="mt-20 border-t border-neutral-200 pt-16"
        aria-labelledby="heading-beneficii"
      >
        <h2
          id="heading-beneficii"
          className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
        >
          Cum îmi ajută Hostera24 afacerea
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--color-text-secondary)]">
          Te poate ajuta în mai multe feluri:
        </p>

        <div className="mt-10 space-y-6">
          {BENEFIT_ITEMS.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-[var(--color-surface)] p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-4">
                <BenefitIcon name={item.icon} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                    {item.title}
                  </h3>
                  <div className="mt-3 text-[var(--color-text-secondary)]">
                    {item.body}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border-2 border-[var(--color-accent)]/30 bg-gradient-to-br from-emerald-50/50 to-[var(--color-surface)] p-6 sm:p-8">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            Campanie combinată — exemplu practic
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Marketing afiliat și ofertă limitată pentru primele X clienți, în
            același flux.
          </p>
          <ol className="mt-4 list-none space-y-2">
            {COMBINED_STEPS.map((step, i) => (
              <li key={step} className="flex gap-3 text-[var(--color-text-secondary)]">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-xs font-bold text-[var(--color-accent)]"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Statistici */}
      <section
        id="statistici"
        className="mt-20 border-t border-neutral-200 pt-16"
        aria-labelledby="heading-statistici"
      >
        <h2
          id="heading-statistici"
          className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
        >
          Statistici — pentru fiecare cod vezi grafice de scanări
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--color-text-secondary)]">
          Și la ce oră, în ce zi au venit clienții — ca să știi când merită să
          repeți oferta și ce postare sau partener funcționează cel mai bine.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <ul className="space-y-4 text-[var(--color-text-secondary)]">
            {STAT_ITEMS.map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <BenefitIcon name={item.icon} className="h-10 w-10" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-center lg:justify-end">
            <PlaceholderScreenshot variant="compact" />
          </div>
        </div>
      </section>

      {/* Secțiune 3 — Contact */}
      <section
        id="contact"
        className="mt-20 border-t border-neutral-200 pt-16"
        aria-labelledby="heading-contact"
      >
        <h2
          id="heading-contact"
          className="text-center text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
        >
          Formular de contact
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--color-text-secondary)]">
          Lasă-ne un mesaj — îl primim direct, fără aplicația de email.
        </p>
        <LeadForm />
      </section>
    </div>
  );
}
