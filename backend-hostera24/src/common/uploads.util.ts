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
  const port = config.get<string>('PORT', '3022');
  return `http://localhost:${port}/uploads`;
}
