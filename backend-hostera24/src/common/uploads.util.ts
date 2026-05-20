import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { isAbsolute, join } from 'path';

/** Monorepo root (hostera24-influencers). */
export function getRepoRoot(): string {
  return join(__dirname, '..', '..', '..');
}

export function getUploadsRoot(config: ConfigService): string {
  const dir = config.get<string>('UPLOADS_DIR', 'uploads');
  const root = isAbsolute(dir) ? dir : join(getRepoRoot(), dir);
  if (!existsSync(root)) {
    mkdirSync(root, { recursive: true });
  }
  return root;
}

export function getPublicUploadsBaseUrl(config: ConfigService): string {
  const explicit = config.get<string>('PUBLIC_UPLOADS_BASE_URL');
  if (explicit?.trim()) {
    return explicit.trim().replace(/\/$/, '');
  }

  for (const key of ['API_BASE_URL', 'NEXT_PUBLIC_API_URL']) {
    const api = config.get<string>(key);
    if (api?.trim()) {
      return `${api.trim().replace(/\/+$/, '')}/uploads`;
    }
  }

  const port = config.get<string>('PORT', '3022');
  return `http://localhost:${port}/uploads`;
}

/** Rescrie host-ul vechi (localhost, IP local) la baza publică curentă. */
export function normalizePublicUploadsUrl(
  url: string | null | undefined,
  config: ConfigService,
): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  const idx = trimmed.indexOf('/uploads/');
  if (idx < 0) return trimmed;

  const suffix = trimmed.slice(idx + '/uploads'.length);
  return `${getPublicUploadsBaseUrl(config)}${suffix}`;
}

export function buildFirmaLogoUrl(
  config: ConfigService,
  firmaId: number,
  ext: string,
  version?: number,
): string {
  const base = getPublicUploadsBaseUrl(config);
  const v = version ?? Date.now();
  return `${base}/firme/${firmaId}/logo.${ext}?v=${v}`;
}
