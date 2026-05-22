import { CodQr } from './cod-qr.entity';

export function toLimitaScanariResponse(cod: CodQr, numarScanari: number) {
  const limit = cod.limitaScanari;
  if (limit == null) {
    return { limitaScanari: null as null, scanariRamase: null as null };
  }
  return {
    limitaScanari: limit,
    scanariRamase: Math.max(0, limit - numarScanari),
  };
}

export function isScanLimitReached(cod: CodQr, numarScanari: number): boolean {
  return cod.limitaScanari != null && numarScanari >= cod.limitaScanari;
}

export function scanLimitBlockMessage(cod: CodQr): string {
  const limit = cod.limitaScanari;
  if (limit == null) {
    return 'Limita de scanări a fost atinsă.';
  }
  if (limit === 1) {
    return 'A fost deja folosită singura scanare disponibilă pentru acest cod.';
  }
  return `Au fost deja folosite toate cele ${limit} scanări disponibile pentru acest cod.`;
}
