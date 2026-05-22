import { addHours, scanatLaForApi, toIsoEuropeBucharest } from './datetime.util';

describe('toIsoEuropeBucharest', () => {
  it('convertește 12:04 UTC în 15:04+03:00 (vara România)', () => {
    const utc = new Date('2026-05-22T12:04:00.000Z');
    expect(toIsoEuropeBucharest(utc)).toBe('2026-05-22T15:04:00+03:00');
  });

  it('convertește 13:04 UTC în 15:04+02:00 (iarna România)', () => {
    const utc = new Date('2026-01-22T13:04:00.000Z');
    expect(toIsoEuropeBucharest(utc)).toBe('2026-01-22T15:04:00+02:00');
  });
});

describe('scanatLaForApi', () => {
  it('12:04 UTC → 15:04+03:00 (fără offset DB)', () => {
    const prev = process.env.DB_SCANAT_OFFSET_HOURS;
    process.env.DB_SCANAT_OFFSET_HOURS = '0';
    const fromDb = new Date('2026-05-22T12:04:00.000Z');
    expect(scanatLaForApi(fromDb)).toBe('2026-05-22T15:04:00+03:00');
    if (prev === undefined) delete process.env.DB_SCANAT_OFFSET_HOURS;
    else process.env.DB_SCANAT_OFFSET_HOURS = prev;
  });

  it('09:04 UTC + offset 3h → 15:04+03:00 (driver vechi)', () => {
    const prev = process.env.DB_SCANAT_OFFSET_HOURS;
    process.env.DB_SCANAT_OFFSET_HOURS = '3';
    const fromDb = new Date('2026-05-22T09:04:00.000Z');
    expect(scanatLaForApi(fromDb)).toBe('2026-05-22T15:04:00+03:00');
    if (prev === undefined) delete process.env.DB_SCANAT_OFFSET_HOURS;
    else process.env.DB_SCANAT_OFFSET_HOURS = prev;
  });
});
