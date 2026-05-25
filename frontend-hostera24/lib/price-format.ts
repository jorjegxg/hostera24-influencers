export function formatLei(value: number): string {
  const isWhole = Number.isInteger(value);
  const amount = isWhole
    ? String(value)
    : value.toFixed(2).replace(".", ",");
  return `${amount} lei`;
}

export function formatPretLabel(pret: number | null | undefined): string | null {
  if (pret == null || Number.isNaN(pret)) return null;
  return formatLei(pret);
}

export function formatReducereLabel(
  reducere: number | null | undefined,
): string | null {
  if (reducere == null || Number.isNaN(reducere) || reducere <= 0) return null;
  return `Reducere ${formatLei(reducere)}`;
}

export function formatPretFinalLabel(
  pret: number | null | undefined,
  reducere: number | null | undefined,
): string | null {
  if (pret == null || Number.isNaN(pret)) return null;
  if (reducere == null || Number.isNaN(reducere) || reducere <= 0) {
    return formatLei(pret);
  }
  const finalPret = pret - reducere;
  if (finalPret <= 0) return formatLei(pret);
  return formatLei(finalPret);
}

/** Mesaj principal pe pagina publică: cât economisești sau „Gratis”. */
export function formatBeneficiuCuponLabel(
  pret: number | null | undefined,
  reducere: number | null | undefined,
): string | null {
  if (reducere == null || Number.isNaN(reducere) || reducere <= 0) {
    return null;
  }
  if (pret != null && !Number.isNaN(pret) && pret - reducere <= 0) {
    return "Gratis";
  }
  return `Economisești ${formatLei(reducere)}`;
}
