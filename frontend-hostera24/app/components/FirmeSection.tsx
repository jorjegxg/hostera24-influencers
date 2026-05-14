import { LeadForm } from "./LeadForm";
import { PlaceholderScreenshot } from "./PlaceholderScreenshot";

const FIRME_FLOW_STEPS = [
  {
    icon: "📹",
    title: "Videoclip cu serviciul tău",
    body: "Creatorul prezintă oferta în conținut (ex.: centru de călărie).",
  },
  {
    icon: "📲",
    title: "Clientul scanează QR-ul",
    body: "Codul din videoclip deschide campania și înregistrează interesul.",
  },
  {
    icon: "🏢",
    title: "Vizită la tine",
    body: "Clientul vine la locație și arată codul pentru validare.",
  },
  {
    icon: "💰",
    title: "Reducere la casă",
    body: "Primește 5% reducere la plată.",
  },
  {
    icon: "🎲",
    title: "Tombolă automată",
    body: "Intră în extragere — 1 din 20 câștigă o ședință gratis.",
  },
  {
    icon: "📊",
    title: "Măsurare automată",
    body: "Volumul de clienți se actualizează în sistem din scanările validate la punctul de vânzare — fără raportare lunară manuală.",
  },
  {
    icon: "💸",
    title: "Plătești doar rezultatele",
    body: "20% din vânzările reale generate prin campanie.",
  },
] as const;

export function FirmeSection() {
  return (
    <div
      id="panel-firme"
      role="tabpanel"
      aria-labelledby="tab-firme"
      className="w-full pb-16 pt-10"
    >
      {/* Hero */}
      <section className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            Vrei clienți noi fără risc?
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)] sm:text-xl">
            Plătești doar 20% din vânzare la clienții aduși de agenție. Zero cost upfront.
          </p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <PlaceholderScreenshot />
        </div>
      </section>

      <section
        className="mt-20 border-t border-neutral-200 pt-16"
        aria-labelledby="heading-pasi-firme"
      >
        <h2
          id="heading-pasi-firme"
          className="text-2xl font-bold text-[var(--color-text-primary)]"
        >
          Patru pași: de la codul QR la clienți noi
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--color-text-secondary)]">
          Totul pornește din aplicația HOSTERA24; agenția preia codul și îl
          pune în fața publicului — tu vezi rezultatele.
        </p>
        <div className="mt-12 overflow-x-auto pb-2 md:overflow-visible">
          <ol className="grid min-w-[600px] list-none grid-cols-4 gap-3 md:min-w-0 md:gap-4 lg:gap-6">
            <li className="flex min-w-0 flex-col gap-3">
              <div className="flex gap-2">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white"
                  aria-hidden
                >
                  1
                </span>
                <h3 className="text-xs font-semibold leading-tight text-[var(--color-text-primary)] sm:text-sm">
                  Generezi codul QR și perioada promoției
                </h3>
              </div>
              <p className="text-[11px] leading-snug text-[var(--color-text-secondary)] sm:text-xs">
                În HOSTERA24 creezi un cod dedicat campaniei și setezi cât ține
                promoția — oferta e clară pentru tine și pentru clienți.
              </p>
              <div className="flex justify-center">
                <PlaceholderScreenshot variant="compact" />
              </div>
            </li>
            <li className="flex min-w-0 flex-col gap-3">
              <div className="flex gap-2">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white"
                  aria-hidden
                >
                  2
                </span>
                <h3 className="text-xs font-semibold leading-tight text-[var(--color-text-primary)] sm:text-sm">
                  Transmite codul agenției de marketing
                </h3>
              </div>
              <p className="text-[11px] leading-snug text-[var(--color-text-secondary)] sm:text-xs">
                Pui la dispoziția agenției codul QR și regulile campaniei; ei
                îl integrează în materialele și mesajele către audiență.
              </p>
              <div className="flex justify-center">
                <PlaceholderScreenshot variant="compact" />
              </div>
            </li>
            <li className="flex min-w-0 flex-col gap-3">
              <div className="flex gap-2">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white"
                  aria-hidden
                >
                  3
                </span>
                <h3 className="text-xs font-semibold leading-tight text-[var(--color-text-primary)] sm:text-sm">
                  Agenția promovează oferta ta
                </h3>
              </div>
              <p className="text-[11px] leading-snug text-[var(--color-text-secondary)] sm:text-xs">
                Campaniile și conținutul (video, social etc.) duc codul în
                fața celor care pot deveni clienți — fără să refaci tu fluxul
                creativ.
              </p>
              <div className="flex justify-center">
                <PlaceholderScreenshot variant="compact" />
              </div>
            </li>
            <li className="flex min-w-0 flex-col gap-3">
              <div className="flex gap-2">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white"
                  aria-hidden
                >
                  4
                </span>
                <h3 className="text-xs font-semibold leading-tight text-[var(--color-text-primary)] sm:text-sm">
                  Vezi cum crește interesul pentru firma ta
                </h3>
              </div>
              <p className="text-[11px] leading-snug text-[var(--color-text-secondary)] sm:text-xs">
                În aplicație urmărești scanările și clienții care vin prin
                campanie — transparență despre cine ajunge la tine datorită
                promovării.
              </p>
              <div className="flex justify-center">
                <PlaceholderScreenshot variant="compact" />
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section
        className="mt-20 border-t border-neutral-200 pt-16"
        aria-labelledby="heading-problema-solutie"
      >
        <h2
          id="heading-problema-solutie"
          className="text-center text-2xl font-bold text-[var(--color-text-primary)]"
        >
          De la incertitudine la măsurabil
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--color-text-secondary)]">
          Mai întâi contextul care te costă bani, apoi cum îl rezolvă HOSTERA24.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 bg-[var(--color-surface)] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">
            <article className="border-b border-neutral-200 bg-neutral-100/90 p-6 lg:border-b-0 lg:border-r">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                Problema
              </h3>
              <p className="mt-3 text-lg font-medium text-[var(--color-text-primary)]">
                Te-ai săturat să plătești reclame care nu aduc clienți?
              </p>
              <p className="mt-3 text-[var(--color-text-secondary)]">
                Niciun creator de conținut nu îți poate spune exact câți clienți a
                adus. Tu pierzi bani, iar rezultatele sunt necunoscute.
              </p>
            </article>

            <div
              className="flex items-center justify-center border-b border-neutral-200 bg-neutral-50 py-4 lg:border-b-0 lg:border-x lg:py-0 lg:px-1"
              aria-hidden="true"
            >
              <svg
                className="h-10 w-10 shrink-0 text-[var(--color-accent)] lg:hidden"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
              <svg
                className="hidden h-10 w-10 shrink-0 text-[var(--color-accent)] lg:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>

            <article className="bg-[var(--color-surface)] p-6 lg:bg-emerald-50/40">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                Soluția
              </h3>
              <p className="mt-3 text-lg font-medium text-[var(--color-text-primary)]">
                HOSTERA24 îți arată exact câți clienți vin de la fiecare creator.
              </p>
              <p className="mt-3 text-[var(--color-text-secondary)]">
                Cu un simplu cod QR, fiecare vânzare este urmărită. Tu plătești
                doar pentru rezultate reale.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Structura financiară
        </h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          20% din vânzare se împarte așa:
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-[var(--color-surface)]">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="w-12 px-4 py-3" aria-hidden="true" />
                <th className="px-4 py-3 font-semibold">Procent</th>
                <th className="px-4 py-3 font-semibold">Destinație</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="px-4 py-3 text-lg">🛒</td>
                <td className="px-4 py-3 font-medium">5%</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Reducere client (oferită de tine)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-lg">🎁</td>
                <td className="px-4 py-3 font-medium">5%</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Fond premii – o ședință gratis la fiecare 20 clienți
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-lg">🤝</td>
                <td className="px-4 py-3 font-medium">10%</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Comisionul creatorului / agenției
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Tu nu plătești nimic în plus. Totul vine din același 20%.
        </p>
      </section>

      <section
        className="mt-16 border-t border-neutral-200 pt-16 scroll-mt-24"
        aria-labelledby="heading-cum-functioneaza"
      >
        <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-[var(--color-surface)] px-5 py-10 shadow-sm sm:px-8 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Fluxul complet
          </p>
          <h2
            id="heading-cum-functioneaza"
            className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl"
          >
            Cum funcționează
          </h2>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
            De la primul view la clientul plătitor — fiecare pas e simplu de
            explicat și urmărit.
          </p>
        </div>

        <ol className="mx-auto mt-12 max-w-3xl list-none space-y-0">
          {FIRME_FLOW_STEPS.map((step, index) => {
            const isLast = index === FIRME_FLOW_STEPS.length - 1;
            const isOutcome = isLast;
            return (
              <li
                key={step.title}
                className="relative flex gap-4 sm:gap-6"
              >
                <div className="flex w-11 shrink-0 flex-col items-center self-stretch sm:w-12">
                  <div
                    className={
                      isOutcome
                        ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white shadow-md ring-4 ring-[var(--color-accent)]/20 sm:h-12 sm:w-12"
                        : "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-neutral-200 bg-[var(--color-surface)] text-sm font-bold text-[var(--color-text-primary)] shadow-sm sm:h-12 sm:w-12"
                    }
                  >
                    {index + 1}
                  </div>
                  {!isLast ? (
                    <div
                      className="mt-2 w-px flex-1 bg-neutral-200"
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div
                  className={
                    isOutcome
                      ? "mb-0 flex-1 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-surface)] p-4 shadow-md ring-1 ring-[var(--color-accent)]/10 sm:p-5"
                      : "mb-8 flex-1 rounded-xl border border-neutral-200/80 bg-[var(--color-surface)]/90 p-4 shadow-sm sm:mb-10 sm:p-5"
                  }
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="text-2xl leading-none" aria-hidden>
                      {step.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-[var(--color-text-primary)] sm:text-lg">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        </div>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Beneficii
        </h2>
        <ul className="mt-6 space-y-3 text-[var(--color-text-secondary)]">
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Zero risc – Plătești doar dacă vin clienți</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Plătești performanța – 20% clar și simplu</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Fără bătaie de cap – Noi facem videoclipurile</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Premiul se plătește singur – Fondul de 5% acoperă ședințele gratuite</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Clienți fericiți – Reducere + șansa la gratis</span>
          </li>
        </ul>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Exemplu numeric
        </h2>
        <p className="mt-2 font-medium text-[var(--color-text-secondary)]">
          20 clienți × 100 lei = 2000 lei vânzări (baza de calcul pentru
          împărțirea celor 20%)
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-[var(--color-surface)]">
          <table className="w-full min-w-[300px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Indicator</th>
                <th className="px-4 py-3 font-semibold">Calcul</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Reducere pentru clienți (5%)
                </td>
                <td className="px-4 py-3">100 lei (înapoi la clienți)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Fond premii (5% din 2000 lei)
                </td>
                <td className="px-4 py-3">
                  100 lei (ex.: o ședință gratis la fiecare 20 clienți)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Comision agenție de publicitate (10%)
                </td>
                <td className="px-4 py-3">200 lei</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Îți rămân (firma)
                </td>
                <td className="px-4 py-3 font-medium">
                  2000 − 100 − 100 − 200 = 1600 lei
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          Ai avut 20 clienți noi și ai plătit doar pentru rezultate reale.
        </p>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Întrebări frecvente
        </h2>
        <dl className="mt-6 space-y-6">
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Ce se întâmplă dacă nu vine niciun client?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Nu plătești nimic. Zero cost.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Se plătesc cei 20% pentru fiecare client sau doar pentru cei aduși
              de agenția de marketing (cu cod QR scanat)?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Doar pentru clienții care vin prin campanie — cei pentru care se
              validează codul QR la tine. Clienții care nu provin din acest canal
              nu intră în calculul celor 20%. Bineînțeles, nu toți cei care te
              descoperă din videoclip vor veni și cu codul QR; pentru acei
              clienți nu plătești nimic.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Cine plătește ședința gratis?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Fondul de 5% din fiecare vânzare acoperă 100% costul.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Gata să aduci clienți noi?
        </h2>
        <LeadForm variant="firme" />
      </section>
    </div>
  );
}
