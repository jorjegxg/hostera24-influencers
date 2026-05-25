import { BenefitCard } from "./BenefitCard";
import type { BenefitIconName } from "./BenefitIcon";
import { FadeInSection } from "./FadeInSection";
import type { ReactNode } from "react";

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
    id: "instagram-reduceri",
    icon: "instagram-reduceri",
    title: "Reduceri cadou pentru cei activi pe Instagram",
    body: (
      <p>
        Răsplătiți persoanele interesate de postările voastre — cele care dau
        like sau lasă un comentariu. Trimiteți-le un cod QR cu reducere ca
        mulțumire; la magazin,{" "}
        <strong className="text-[var(--color-text-primary)]">
          o scanare și reducerea se aplică imediat
        </strong>
        . Transformați engagement-ul de pe Instagram în clienți care vin
        efectiv în locație.
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
    title: "Oferte limitate — primii X clienți",
    body: (
      <p>
        Configurați reduceri pentru primele X persoane care prezintă codul în
        magazin (ex. 50% reducere). Ideal pentru campanii de urgență și pentru a
        consolida comunitatea pe rețelele sociale — urmăritorii află primii de
        ofertele viitoare.
      </p>
    ),
  },
  {
    id: "concurs",
    icon: "concurs",
    title: "Premii la concursuri — foarte simplu",
    body: (
      <p>
        Organizați un concurs pe rețelele sociale și generați un cod QR dedicat
        câștigătorilor. La magazin,{" "}
        <strong className="text-[var(--color-text-primary)]">
          scanarea confirmă premiul pe loc
        </strong>{" "}
        — fără liste pe hârtie, fără coduri de verificat manual. Setați câte
        premii sunt disponibile și pentru cât timp e valid codul; totul se
        gestionează din aplicație.
      </p>
    ),
  },
];

export function BeneficiiSection() {
  return (
    <FadeInSection
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

      <div className="mt-10 space-y-3">
        {BENEFIT_ITEMS.map((item) => (
          <BenefitCard
            key={item.id}
            id={item.id}
            icon={item.icon}
            title={item.title}
            body={item.body}
          />
        ))}
      </div>
    </FadeInSection>
  );
}
