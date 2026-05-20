import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import {
  buildFirmaLogoUrl,
  getUploadsRoot,
} from '../common/uploads.util';

const MAX_BYTES = 5 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

@Injectable()
export class FirmeUploadsService {
  constructor(private readonly config: ConfigService) {}

  async saveFirmaLogo(
    firmaId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Fișier logo lipsă');
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException('Logo prea mare (max 5 MB)');
    }

    const ext = this.resolveImageExt(file);
    if (!ext) {
      throw new BadRequestException(
        'Format invalid. Folosește JPEG, PNG, WebP sau GIF.',
      );
    }

    const firmaDir = join(getUploadsRoot(this.config), 'firme', String(firmaId));
    await mkdir(firmaDir, { recursive: true });

    const filename = `logo.${ext}`;
    const filePath = join(firmaDir, filename);

    try {
      const existing = await readdir(firmaDir);
      await Promise.all(
        existing
          .filter((name) => name.startsWith('logo.'))
          .map((name) => unlink(join(firmaDir, name))),
      );
      await writeFile(filePath, file.buffer);
    } catch {
      throw new InternalServerErrorException('Nu am putut salva logo-ul');
    }

    return buildFirmaLogoUrl(this.config, firmaId, ext);
  }

  private resolveImageExt(file: Express.Multer.File): string | null {
    const fromMime = EXT_BY_MIME[file.mimetype];
    if (fromMime) return fromMime;

    const name = (file.originalname ?? '').toLowerCase();
    if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'jpg';
    if (name.endsWith('.png')) return 'png';
    if (name.endsWith('.webp')) return 'webp';
    if (name.endsWith('.gif')) return 'gif';

    return null;
  }
}
