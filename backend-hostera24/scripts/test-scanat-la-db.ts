/**
 * Test DB: inserează scanat_la UTC, citește, verifică ora 15:04 (România).
 * Rulează: npm run test:scanat-timezone
 */
import * as fs from 'fs';
import * as path from 'path';
import mysql from 'mysql2/promise';
import {
  addHours,
  scanatLaForApi,
  toIsoEuropeBucharest,
} from '../src/common/datetime.util';

const TARGET_HOUR = 15;
const TARGET_MINUTE = 4;
/** UTC care trebuie să devină 15:04 în România (mai 2026, +3). */
const INSERT_UTC = '2026-05-22 12:04:00';

function loadEnv(): Record<string, string> {
  const candidates = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env'),
  ];
  const out: Record<string, string> = {};
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i < 1) continue;
      out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
    break;
  }
  return out;
}

function parseWallTime(iso: string): { hour: number; minute: number } {
  const m = iso.match(/T(\d{2}):(\d{2})/);
  if (!m) throw new Error(`Format ISO invalid: ${iso}`);
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function matchesTarget(iso: string): boolean {
  const w = parseWallTime(iso);
  return w.hour === TARGET_HOUR && w.minute === TARGET_MINUTE;
}

async function main() {
  const env = { ...process.env, ...loadEnv() };
  const host = env.DATABASE_HOST ?? 'localhost';
  const port = Number(env.DATABASE_PORT ?? 3306);
  const user = env.DATABASE_USER ?? 'hostera24';
  const password = env.DATABASE_PASSWORD ?? 'hostera24';
  const database = env.DATABASE_NAME ?? 'hostera24';

  console.log(`Conectare MySQL ${host}:${port}/${database} (timezone Z) ...`);

  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    timezone: 'Z',
  });

  let insertId = 0;
  try {
    const [codRows] = await conn.query<{ id: number }[]>(
      'SELECT id FROM coduri_qr WHERE sters = 0 ORDER BY id LIMIT 1',
    );
    const codQrId = codRows[0]?.id ?? 1;

    const [insertResult] = await conn.query<mysql.ResultSetHeader>(
      'INSERT INTO scanari (cod_qr_id, scanat_la) VALUES (?, ?)',
      [codQrId, INSERT_UTC],
    );
    insertId = insertResult.insertId;
    console.log(`Inserat scanare id=${insertId}, UTC=${INSERT_UTC}`);

    const [rows] = await conn.query<{ scanat_la: Date }[]>(
      'SELECT scanat_la FROM scanari WHERE id = ?',
      [insertId],
    );
    const raw = rows[0]?.scanat_la;
    if (!raw) throw new Error('Nu s-a putut citi scanat_la');

    console.log(`Citit din DB: ${raw.toISOString()}`);

    const isoDirect = toIsoEuropeBucharest(raw);
    console.log(`Format direct: ${isoDirect}`);

    let dbOffset = 0;
    if (!matchesTarget(isoDirect)) {
      console.log('\nCăut compensare DB_SCANAT_OFFSET_HOURS (1–3) ...');
      for (const h of [1, 2, 3]) {
        const tryIso = toIsoEuropeBucharest(addHours(raw, h));
        console.log(`  +${h}h → ${tryIso}`);
        if (matchesTarget(tryIso)) {
          dbOffset = h;
          break;
        }
      }
    }

    process.env.DB_SCANAT_OFFSET_HOURS = String(dbOffset);
    const isoApi = scanatLaForApi(raw);
    console.log(`\nAPI scanatLaForApi (offset=${dbOffset}): ${isoApi}`);

    if (!matchesTarget(isoApi)) {
      console.error(`\n✗ Eșuat: așteptat ${TARGET_HOUR}:${String(TARGET_MINUTE).padStart(2, '0')}.`);
      process.exit(1);
    }

    console.log(`\n✓ OK: ${TARGET_HOUR}:${String(TARGET_MINUTE).padStart(2, '0')} România`);
    if (dbOffset > 0) {
      console.log(`→ Pune în .env: DB_SCANAT_OFFSET_HOURS=${dbOffset}`);
    } else {
      console.log('→ DB_SCANAT_OFFSET_HOURS=0 (sau omit) — TypeORM timezone: Z e suficient');
    }
  } finally {
    if (insertId > 0) {
      await conn.query('DELETE FROM scanari WHERE id = ?', [insertId]);
      console.log(`\nȘters rând test id=${insertId}`);
    }
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
