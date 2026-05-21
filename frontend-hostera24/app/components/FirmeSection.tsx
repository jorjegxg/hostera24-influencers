import { LeadForm } from "./LeadForm";
import { PlaceholderScreenshot } from "./PlaceholderScreenshot";

const TRACKING_BENEFITS = [
  "Numără clienții aduși de fiecare cod",
  "Ține minte la ce oră au venit",
  "Arată care postări îți aduc cei mai mulți clienți",
] as const;

const USE_MODES = [
  {
    id: "reducere-zile-moarte",
    icon: "🏷️",
    title: "Postare cu reducere în zilele moarte",
    tagline: "Ex.: „10 lei dacă vii cu codul ăsta în magazin”",
    steps: [
      "Creezi în aplicație un cod de bare pentru campanie",
      "Postezi că ai reducere în anumite zile — când ai puțini clienți",
      "La casă scanezi codul din aplicație când clientul vine",
    ],
    result: "Aduci clienți exact în zilele în care ai nevoie.",
  },
  {
    id: "postare-vizualizari",
    icon: "📱",
    title: "Postare normală pentru vizualizări",
    tagline: "Conținut pentru reach, cod la final",
    steps: [
      "Faci o postare obișnuită care să aducă vizualizări",
      "La sfârșit le spui să folosească codul din aplicație (ex. valabil în luna mai)",
      "La casă scanezi codul din aplicație",
    ],
    result: "Transformi vizualizările în clienți măsurabili la magazin.",
  },
  {
    id: "agentii-angajati",
    icon: "🤝",
    title: "Agenții, influenceri sau angajații tăi",
    tagline: "Plătești doar pentru clienții aduși",
    steps: [
      "Te înțelegi cu agenția de marketing sau cu persoane care îți fac publicitate",
      "În schimbul la X lei sau X% pe client adus de pe urma postărilor lor",
      "Fiecare postare are cod propriu — vezi cine aduce câți clienți",
    ],
    result:
      "Bonus corect pentru angajații care fac content pe Instagram: știi exact câți clienți a adus fiecare.",
    highlight: true,
  },
] as const;

function TrackingBenefitsList({ className = "" }: { className?: string }) {
  return (
    <ul className={`space-y-2 text-sm text-[var(--color-text-secondary)] sm:text-base ${className}`}>
      {TRACKING_BENEFITS.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="shrink-0 text-[var(--color-accent)]" aria-hidden>
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function FirmeSection() {
  return (
    <div className="w-full pb-16 pt-10">
      <section className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Pentru firme
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            Umple zilele moarte. Știi câți clienți aduce fiecare postare.
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)] sm:text-xl">
            Creezi codul în aplicație, îl pui în postare, îl scanezi la casă.
            Restul — număr clienți, ore, performanță pe postare — le vezi
            automat.
          </p>
          <div className="mt-6">
            <TrackingBenefitsList />
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <PlaceholderScreenshot />
        </div>
      </section>

      <section
        className="mt-20 border-t border-neutral-200 pt-16"
        aria-labelledby="heading-moduri"
      >
        <h2
          id="heading-moduri"
          className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
        >
          Moduri în care poți folosi aplicația
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--color-text-secondary)]">
          Același flux la casă: scan din aplicație. Diferă doar cum ajunge
          codul la clienți — reducere directă, postare virală sau partener /
          angajat.
        </p>

        <div className="mt-10 space-y-6">
          {USE_MODES.map((mode) => (
            <article
              key={mode.id}
              className={
                "highlight" in mode && mode.highlight
                  ? "overflow-hidden rounded-2xl border-2 border-[var(--color-accent)]/40 bg-gradient-to-br from-emerald-50/60 to-[var(--color-surface)] p-6 shadow-sm sm:p-8"
                  : "overflow-hidden rounded-2xl border border-neutral-200 bg-[var(--color-surface)] p-6 shadow-sm sm:p-8"
              }
            >
              <div className="flex flex-wrap items-start gap-3">
                <span className="text-3xl leading-none" aria-hidden>
                  {mode.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                    {mode.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[var(--color-accent)] sm:text-base">
                    {mode.tagline}
                  </p>
                </div>
              </div>

              <ol className="mt-5 list-none space-y-3">
                {mode.steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-[var(--color-text-primary)]"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-[var(--color-text-secondary)]">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-5 rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-4 py-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Rezultat
                </p>
                <p className="mt-1 text-[var(--color-text-secondary)]">
                  {mode.result}
                </p>
              </div>

              <div className="mt-5 border-t border-neutral-200/80 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  În toate cele 3 moduri
                </p>
                <TrackingBenefitsList className="mt-2" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mt-20 border-t border-neutral-200 pt-16"
        aria-labelledby="heading-la-casa"
      >
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-[var(--color-surface)] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-b border-neutral-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <h2
                id="heading-la-casa"
                className="text-2xl font-bold text-[var(--color-text-primary)]"
              >
                La casă, în câteva secunde
              </h2>
              <p className="mt-3 text-[var(--color-text-secondary)]">
                Clientul vine cu codul din postare. Tu deschizi aplicația,
                scanezi, aplici reducerea sau oferta — și clientul e înregistrat
                la campania potrivită.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4 bg-neutral-50/80 p-6 sm:p-8">
              <div className="flex gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg text-white"
                  aria-hidden
                >
                  📲
                </span>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    Scan la punctul de vânzare
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Fără foi, fără raportări manuale la final de lună.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg text-white"
                  aria-hidden
                >
                  📊
                </span>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    Dashboard pentru decizii
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Compari postările, zilele și partenerii — știi unde merită
                    să investești în continuare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Întrebări frecvente
        </h2>
        <dl className="mt-6 space-y-6">
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Pot folosi mai multe coduri în paralel?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Da — un cod pentru reducerea de marți, altul pentru postarea din
              mai, altul pentru fiecare partener sau angajat. Vezi separat câți
              clienți aduce fiecare.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Plătesc ceva dacă nu vine nimeni?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Nu. Plătești reducerea sau comisionul doar când clientul vine și
              îl scanezi la casă — adică doar pentru rezultate reale.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Angajații mei pot avea coduri proprii?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Da. Fiecare postare poate avea codul ei; la final de lună știi cine
              merită bonusul pentru content, pe baza clienților aduși, nu pe
              estimări.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Vrei să umpli zilele moarte?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--color-text-secondary)]">
          Lasă-ne datele și te contactăm pentru acces la aplicație.
        </p>
        <LeadForm variant="firme" />
      </section>
    </div>
  );
}
