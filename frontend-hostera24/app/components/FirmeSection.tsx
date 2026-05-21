import { BenefitIcon, type BenefitIconName } from "./BenefitIcon";
import { AppStepsSection } from "./AppStepsSection";
import { BeneficiiSection } from "./BeneficiiSection";
import { FadeInSection } from "./FadeInSection";
import { LeadForm } from "./LeadForm";
import { PlaceholderScreenshot } from "./PlaceholderScreenshot";

const STAT_ITEMS: { icon: BenefitIconName; text: string }[] = [
  { icon: "statistici-scan", text: "Grafice de scanări per cod QR" },
  { icon: "statistici-ore", text: "Distribuție pe zile și ore" },
  {
    icon: "statistici-compar",
    text: "Compari postări, cupoane și campanii affiliat",
  },
];

export function FirmeSection() {
  return (
    <div className="w-full pb-16 pt-10">
      {/* Secțiune 1 — Motto */}
      <FadeInSection
        id="motto"
        className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
      >
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            Cu aplicația Hostera24, aduceți clienți noi din fiecare postare
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)] sm:text-xl">
            Creezi coduri în aplicație, le pui în postări sau le dai
            partenerilor, scanezi la casă — și vezi exact câți clienți aduce
            fiecare campanie.
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
      </FadeInSection>

      <BeneficiiSection />

      <AppStepsSection />

      {/* Statistici */}
      <FadeInSection
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

        <ul className="mt-10 max-w-2xl space-y-4 text-[var(--color-text-secondary)]">
          {STAT_ITEMS.map((item) => (
            <li key={item.text} className="flex items-center gap-3">
              <BenefitIcon name={item.icon} className="h-10 w-10" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </FadeInSection>

      {/* Secțiune 3 — Contact */}
      <FadeInSection
        id="contact"
        className="mt-20 border-t border-neutral-200 pt-16"
        aria-labelledby="heading-contact"
      >
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-[var(--color-surface)] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="border-b border-neutral-100 bg-gradient-to-br from-emerald-50/50 to-[var(--color-surface)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <h2
                id="heading-contact"
                className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
              >
                Solicită acces la aplicație
              </h2>
              <p className="mt-3 text-[var(--color-text-secondary)] sm:text-lg">
                Completează formularul — îți răspundem direct, fără aplicația de
                email.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--color-text-secondary)]">
                <li className="flex gap-2">
                  <span
                    className="mt-0.5 text-[var(--color-accent)]"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>Răspuns în 1–2 zile lucrătoare</span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="mt-0.5 text-[var(--color-accent)]"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>Datele tale nu sunt partajate cu terți</span>
                </li>
                <li className="flex gap-2">
                  <span
                    className="mt-0.5 text-[var(--color-accent)]"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>Poți solicita demo sau întrebări despre funcții</span>
                </li>
              </ul>
            </div>
            <div className="p-6 sm:p-8">
              <LeadForm embedded />
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}
