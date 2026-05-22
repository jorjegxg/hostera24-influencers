export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 3600 * 1000);
}

function dbScanatOffsetHours(): number {
  return Number(process.env.DB_SCANAT_OFFSET_HOURS ?? '0');
}

/** scanat_la din DB → ISO pentru API (ora României). */
export function scanatLaForApi(dbDate: Date): string {
  const offset = dbScanatOffsetHours();
  const adjusted = offset === 0 ? dbDate : addHours(dbDate, offset);
  return toIsoEuropeBucharest(adjusted);
}

/** ISO 8601 în fusul Europe/Bucharest (ex. 2026-05-22T14:18:00+03:00). */
export function toIsoEuropeBucharest(date: Date): string {
  const wall = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  const tzName =
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Bucharest',
      timeZoneName: 'shortOffset',
    })
      .formatToParts(date)
      .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+2';

  const m = tzName.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  let offset = '+02:00';
  if (m) {
    const sign = m[1];
    const h = m[2].padStart(2, '0');
    const min = (m[3] ?? '00').padStart(2, '0');
    offset = `${sign}${h}:${min}`;
  }

  return `${wall.replace(' ', 'T')}${offset}`;
}
