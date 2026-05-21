import { BadRequestException } from '@nestjs/common';
import { CodQr } from './cod-qr.entity';

export type ProgramareTip = 'interval' | 'zile';

const TZ = 'Europe/Bucharest';

const WEEKDAY_ISO: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export function parseProgramareZile(raw: string | null | undefined): number[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => Number(v))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 7);
  } catch {
    return [];
  }
}

export function serializeProgramareZile(days: number[] | undefined): string | null {
  if (!days?.length) return null;
  const unique = [...new Set(days.filter((d) => d >= 1 && d <= 7))].sort(
    (a, b) => a - b,
  );
  return unique.length > 0 ? JSON.stringify(unique) : null;
}

export function normalizeProgramareDto(dto: {
  programareTip?: ProgramareTip | null;
  programareDeLa?: string | null;
  programarePanaLa?: string | null;
  programareZile?: number[] | null;
}): {
  programareTip: ProgramareTip | null;
  programareDeLa: string | null;
  programarePanaLa: string | null;
  programareZile: string | null;
} {
  const tip = dto.programareTip ?? null;
  if (!tip) {
    return {
      programareTip: null,
      programareDeLa: null,
      programarePanaLa: null,
      programareZile: null,
    };
  }

  if (tip === 'interval') {
    const deLa = normalizeDateOnly(dto.programareDeLa);
    const panaLa = normalizeDateOnly(dto.programarePanaLa);
    if (!deLa || !panaLa) {
      throw new BadRequestException(
        'Pentru interval, completează data de început și data de sfârșit.',
      );
    }
    if (deLa > panaLa) {
      throw new BadRequestException(
        'Data de început trebuie să fie înainte sau egală cu data de sfârșit.',
      );
    }
    return {
      programareTip: 'interval',
      programareDeLa: deLa,
      programarePanaLa: panaLa,
      programareZile: null,
    };
  }

  if (tip === 'zile') {
    const zile = serializeProgramareZile(dto.programareZile ?? undefined);
    if (!zile) {
      throw new BadRequestException(
        'Selectează cel puțin o zi din săptămână.',
      );
    }
    return {
      programareTip: 'zile',
      programareDeLa: null,
      programarePanaLa: null,
      programareZile: zile,
    };
  }

  throw new BadRequestException('Tip programare invalid.');
}

function normalizeDateOnly(value?: string | null): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new BadRequestException(
      'Data trebuie în format YYYY-MM-DD (ex: 2026-05-21).',
    );
  }
  return trimmed;
}

function bucharestCalendar(now = new Date()): { date: string; weekday: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((p) => p.type === 'year')?.value ?? '1970';
  const month = parts.find((p) => p.type === 'month')?.value ?? '01';
  const day = parts.find((p) => p.type === 'day')?.value ?? '01';
  const weekdayShort = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const weekday = WEEKDAY_ISO[weekdayShort] ?? 1;

  return { date: `${year}-${month}-${day}`, weekday };
}

export function isCodQrScannableNow(entry: CodQr, now = new Date()): boolean {
  if (!entry.programareTip) return true;

  const { date, weekday } = bucharestCalendar(now);

  if (entry.programareTip === 'interval') {
    const deLa = entry.programareDeLa;
    const panaLa = entry.programarePanaLa;
    if (!deLa || !panaLa) return true;
    return date >= deLa && date <= panaLa;
  }

  if (entry.programareTip === 'zile') {
    const zile = parseProgramareZile(entry.programareZile);
    if (zile.length === 0) return true;
    return zile.includes(weekday);
  }

  return true;
}

export function programareBlockMessage(entry: CodQr): string {
  if (!entry.programareTip) {
    return 'Codul QR nu poate fi scanat în acest moment.';
  }

  if (entry.programareTip === 'interval') {
    const deLa = formatRoDate(entry.programareDeLa);
    const panaLa = formatRoDate(entry.programarePanaLa);
    if (deLa && panaLa) {
      return `Codul poate fi scanat doar între ${deLa} și ${panaLa}.`;
    }
    return 'Codul QR nu este activ în intervalul setat.';
  }

  if (entry.programareTip === 'zile') {
    const zile = parseProgramareZile(entry.programareZile);
    const labels = zile.map((d) => ZI_SAPTAMANA[d] ?? '').filter(Boolean);
    if (labels.length > 0) {
      return `Codul poate fi scanat doar în: ${labels.join(', ')}.`;
    }
    return 'Codul QR nu este activ în zilele setate.';
  }

  return 'Codul QR nu poate fi scanat în acest moment.';
}

const ZI_SAPTAMANA: Record<number, string> = {
  1: 'luni',
  2: 'marți',
  3: 'miercuri',
  4: 'joi',
  5: 'vineri',
  6: 'sâmbătă',
  7: 'duminică',
};

function formatRoDate(iso: string | null): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return null;
  return `${d}.${m}.${y}`;
}

export function toProgramareResponse(entry: CodQr) {
  return {
    programareTip: entry.programareTip,
    programareDeLa: entry.programareDeLa,
    programarePanaLa: entry.programarePanaLa,
    programareZile: parseProgramareZile(entry.programareZile),
  };
}
