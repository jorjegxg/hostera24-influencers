import Image from "next/image";
import { FadeInSection } from "./FadeInSection";

const STEPS = [
  {
    step: 1,
    title: "Creați codul QR pentru campanie",
    description:
      "Configurați reducerea, perioada de valabilitate și condițiile direct în aplicația Hostera24.",
    imageSrc: "/validati.jpeg",
    imageAlt: "Ecran Hostera24 — creare cod QR pentru campanie",
  },
  {
    step: 2,
    title: "Distribuiți codul",
    description:
      "Îl atașați la postări, story-uri, parteneri sau materiale în magazin — clienții vin la casă cu oferta.",
    imageSrc: "/screenshot-exemplu.jpeg",
    imageAlt: "Exemplu distribuire cod QR în postare sau magazin",
  },
  {
    step: 3,
    title: "Validați la casă și urmăriți rezultatele",
    description:
      "Persoana de la casă scanează codul din aplicația Hostera24 — reducerea se aplică pe loc, iar scanările și statisticile apar în contul dumneavoastră.",
    imageSrc: "/cod_campanie.jpeg",
    imageAlt: "Ecran Hostera24 — scanare la casă și statistici campanie",
  },
] as const;

function StepArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6 shrink-0 text-neutral-300"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function AppStepsSection() {
  return (
    <FadeInSection
      id="cum-functioneaza"
      className="mt-20 border-t border-neutral-200 pt-16"
      aria-labelledby="heading-cum-functioneaza"
    >
      <div className="max-w-3xl">
        <h2
          id="heading-cum-functioneaza"
          className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
        >
          Cum funcționează în 3 pași
        </h2>
        <p className="mt-3 text-lg text-[var(--color-text-secondary)]">
          Configurați campania, distribuiți codul — la casă, colegul scanează din
          aplicația Hostera24 și vedeți rezultatele măsurate.
        </p>
      </div>

      <ol className="mt-12 flex list-none flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-0">
        {STEPS.map(({ step, title, description, imageSrc, imageAlt }, index) => (
          <li
            key={step}
            className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-stretch"
          >
            <article className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-[var(--color-surface)] shadow-sm">
              <div className="flex justify-center bg-gradient-to-b from-emerald-50/60 to-neutral-50/80 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
                <div className="relative h-[260px] w-[148px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-md">
                  <span
                    className="absolute left-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-br-2xl bg-[var(--color-accent)] text-sm font-bold text-white"
                    aria-hidden
                  >
                    {step}
                  </span>
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-contain object-top"
                    sizes="148px"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
                <h3 className="text-lg font-bold leading-snug text-[var(--color-text-primary)]">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                  {description}
                </p>
              </div>
            </article>

            {index < STEPS.length - 1 ? (
              <div
                className="flex items-center justify-center py-2 lg:w-10 lg:shrink-0 lg:py-0 lg:pl-1 lg:pr-0"
                aria-hidden
              >
                <div className="rotate-90 lg:rotate-0">
                  <StepArrow />
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </FadeInSection>
  );
}
