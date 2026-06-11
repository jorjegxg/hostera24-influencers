export type ProgramareTip = "interval" | "zile";

export type PublicProgramare = {
  programareTip: ProgramareTip | null;
  programareDeLa: string | null;
  programarePanaLa: string | null;
  programareZile: number[];
};

const ZI_SAPTAMANA: Record<number, string> = {
  1: "luni",
  2: "marți",
  3: "miercuri",
  4: "joi",
  5: "vineri",
  6: "sâmbătă",
  7: "duminică",
};

function formatRoDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return null;
  return `${d}.${m}.${y}`;
}

/** Text pentru pagina publică a codului QR, dacă există programare. */
export function formatValabilitateLabel(
  programare: PublicProgramare,
): string | null {
  const { programareTip, programareDeLa, programarePanaLa, programareZile } =
    programare;

  if (!programareTip) return null;

  if (programareTip === "interval") {
    const deLa = formatRoDate(programareDeLa);
    const panaLa = formatRoDate(programarePanaLa);
    if (deLa && panaLa) {
      return `Valabilitate: ${deLa} - ${panaLa}`;
    }
    return null;
  }

  if (programareTip === "zile") {
    const labels = programareZile
      .map((d) => ZI_SAPTAMANA[d])
      .filter((label): label is string => Boolean(label));
    if (labels.length > 0) {
      return `Valabil în: ${labels.join(", ")}`;
    }
    return null;
  }

  return null;
}
