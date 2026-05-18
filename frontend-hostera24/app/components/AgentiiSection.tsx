import { LeadForm } from "./LeadForm";
import { PlaceholderScreenshot } from "./PlaceholderScreenshot";

export function AgentiiSection() {
  return (
    <div
      id="panel-agentii"
      role="tabpanel"
      aria-labelledby="tab-agentii"
      className="w-full pb-16 pt-10"
    >
      <section className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
            Oferă clienților tăi rezultate măsurabile
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)] sm:text-xl">
            Platforma care urmărește conversiile și vânzările aduse de
            creatorii de conținut.
          </p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <PlaceholderScreenshot />
        </div>
      </section>

      <section className="mt-20 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Problema agențiilor
        </h2>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-[var(--color-text-secondary)]">
          <li>Clienții tăi nu au bugete mari pentru marketing.</li>
          <li>
            Creatorii de conținut nu știu câți clienți aduc cu exactitate.
          </li>
          <li>Se creează plăți incorecte.</li>
          <li>
            Firmele se tem să cheltuie bani fără conversie garantată.
          </li>
        </ul>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Soluția HOSTERA24
        </h2>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          O platformă simplă care elimină riscul pentru toți.
        </p>
        <p className="mt-3 text-[var(--color-text-secondary)]">
          QR-uri în videoclipuri, validare la locație, plată doar pe
          performanță.
        </p>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Structura financiară pentru agenții
        </h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          Tu, ca agenție, iei 10% din fiecare vânzare.
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
                <td className="px-4 py-3 text-lg">🤝</td>
                <td className="px-4 py-3 font-medium">10%</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Comisionul tău (agenție / creator)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-lg">🛒</td>
                <td className="px-4 py-3 font-medium">5%</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Reducere client
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-lg">🎁</td>
                <td className="px-4 py-3 font-medium">5%</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Fond premii (ședință gratis la 20 clienți)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Firma plătește doar un procent din vânzare. Tu îți primești partea ta.
        </p>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Cum arată o campanie
        </h2>
        <ul className="mt-6 space-y-4 text-[var(--color-text-secondary)]">
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              🤝
            </span>
            <span>
              Închei parteneriatul cu o firmă (ex: centru de călărie)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              📹
            </span>
            <span>Creezi videoclipuri cu QR-ul HOSTERA24</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              📢
            </span>
            <span>Publici pe TikTok / Instagram / Facebook</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              🧾
            </span>
            <span>Firma validează fiecare vânzare</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              📊
            </span>
            <span>Primești raport lunar cu vânzările tale</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl" aria-hidden>
              💸
            </span>
            <span>Încasezi 10% din fiecare vânzare</span>
          </li>
        </ul>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Beneficii pentru agenție
        </h2>
        <ul className="mt-6 space-y-3 text-[var(--color-text-secondary)]">
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Pay-per-performance – fără risc pentru client</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>
              Vânzare mai ușoară – argument clar: „plătești doar rezultatele”
            </span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Ușor de explicat – 5% + 5% + 10%</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Funcționează offline – QR + reducere + tombolă</span>
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span>
            <span>Rezultate măsurabile – știi exact câți clienți ai adus</span>
          </li>
        </ul>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Cât poți câștiga
        </h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          10 firme partenere, fiecare cu 10.000 lei vânzări/lună
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-[var(--color-surface)]">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Indicator</th>
                <th className="px-4 py-3 font-semibold">Valoare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Vânzări totale
                </td>
                <td className="px-4 py-3 font-medium">100.000 lei</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                  Comisionul tău (10%)
                </td>
                <td className="px-4 py-3 font-medium">10.000 lei / lună</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[var(--color-text-secondary)]">
          Venit recurent, pasiv, predictibil.
        </p>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Întrebări frecvente
        </h2>
        <dl className="mt-6 space-y-6">
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Trebuie să plătesc ceva upfront?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Nu. Platforma este gratuită pentru agenții.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Cum urmăresc vânzările?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Primești raport lunar de la firme sau folosești dashboard-ul
              HOSTERA24.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--color-text-primary)]">
              Pot folosi proprii mei creatori de conținut?
            </dt>
            <dd className="mt-2 text-[var(--color-text-secondary)]">
              Da. Platforma funcționează cu orice creator.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-16 border-t border-neutral-200 pt-16">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Devino partener HOSTERA24
        </h2>
        <LeadForm variant="agentii" />
      </section>
    </div>
  );
}
