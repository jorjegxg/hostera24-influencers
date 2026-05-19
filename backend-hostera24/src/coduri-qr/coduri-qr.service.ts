import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { Scanare } from '../scanari/scanare.entity';
import { CodQr } from './cod-qr.entity';
import { CreateCodQrDto } from './dto/create-cod-qr.dto';
import { UpdateCodQrDto } from './dto/update-cod-qr.dto';

@Injectable()
export class CoduriQrService {
  constructor(
    @InjectRepository(CodQr)
    private readonly coduriRepo: Repository<CodQr>,
    @InjectRepository(Scanare)
    private readonly scanariRepo: Repository<Scanare>,
  ) {}

  findAllForFirma(firmaId: number) {
    return this.coduriRepo
      .createQueryBuilder('cod')
      .loadRelationCountAndMap('cod.numarScanari', 'cod.scanari')
      .where('cod.firmaId = :firmaId', { firmaId })
      .andWhere('cod.sters = :sters', { sters: false })
      .orderBy('cod.creatLa', 'DESC')
      .getMany();
  }

  async findOneForFirma(firmaId: number, id: number) {
    const cod = await this.findActiveOrThrow(firmaId, id);

    const numarScanari = await this.scanariRepo.count({
      where: { codQrId: id },
    });

    return {
      id: cod.id,
      cod: cod.cod,
      numePostareClienti: cod.numePostareClienti,
      numePostareFirme: cod.numePostareFirme,
      pretRedus: cod.pretRedus,
      creatLa: cod.creatLa,
      numarScanari,
    };
  }

  async findScanariPage(
    firmaId: number,
    id: number,
    page: number,
    limit: number,
  ) {
    await this.findActiveOrThrow(firmaId, id);

    const take = limit;
    const skip = (page - 1) * take;

    const [scanari, total] = await this.scanariRepo.findAndCount({
      where: { codQrId: id },
      order: { scanatLa: 'DESC' },
      take,
      skip,
    });

    return {
      scanari: scanari.map((s) => ({
        id: s.id,
        scanatLa: s.scanatLa,
      })),
      total,
      page,
      limit: take,
      hasMore: skip + scanari.length < total,
    };
  }

  async create(firmaId: number, dto: CreateCodQrDto) {
    const cod = await this.generateUniqueCod();

    const entry = this.coduriRepo.create({
      firmaId,
      cod,
      numePostareClienti: this.normalizeOptionalText(dto.numePostareClienti),
      numePostareFirme: this.normalizeOptionalText(dto.numePostareFirme),
      pretRedus: this.normalizeOptionalText(dto.pretRedus),
      sters: false,
    });

    return this.coduriRepo.save(entry);
  }

  async update(firmaId: number, id: number, dto: UpdateCodQrDto) {
    const cod = await this.findActiveOrThrow(firmaId, id);

    if (dto.numePostareClienti !== undefined) {
      cod.numePostareClienti = this.normalizeOptionalText(dto.numePostareClienti);
    }
    if (dto.numePostareFirme !== undefined) {
      cod.numePostareFirme = this.normalizeOptionalText(dto.numePostareFirme);
    }
    if (dto.pretRedus !== undefined) {
      cod.pretRedus = this.normalizeOptionalText(dto.pretRedus);
    }

    return this.coduriRepo.save(cod);
  }

  async scan(firmaId: number, rawPayload: string) {
    const codValue = this.extractCod(rawPayload);
    if (!codValue) {
      return { status: 'not_found' as const };
    }

    const entry = await this.coduriRepo.findOne({
      where: { cod: codValue, sters: false },
    });

    if (!entry) {
      return { status: 'not_found' as const };
    }

    await this.scanariRepo.save(
      this.scanariRepo.create({ codQrId: entry.id }),
    );

    const numarScanari = await this.scanariRepo.count({
      where: { codQrId: entry.id },
    });

    const base = this.toPublicEntry(entry);

    if (entry.firmaId === firmaId) {
      return { status: 'own' as const, ...base, numarScanari };
    }

    return {
      status: 'other' as const,
      cod: base.cod,
      numePostareClienti: base.numePostareClienti,
      pretRedus: base.pretRedus,
    };
  }

  async softDelete(firmaId: number, id: number) {
    const cod = await this.findActiveOrThrow(firmaId, id);
    cod.sters = true;
    await this.coduriRepo.save(cod);
    return { ok: true };
  }

  private toPublicEntry(entry: CodQr) {
    return {
      cod: entry.cod,
      numePostareClienti: entry.numePostareClienti,
      numePostareFirme: entry.numePostareFirme,
      pretRedus: entry.pretRedus,
      creatLa: entry.creatLa,
    };
  }

  private normalizeOptionalText(value?: string): string | null {
    if (value == null) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private async findActiveOrThrow(firmaId: number, id: number) {
    const cod = await this.coduriRepo.findOne({ where: { id, sters: false } });
    if (!cod) {
      throw new NotFoundException('Codul QR nu există');
    }
    if (cod.firmaId !== firmaId) {
      throw new ForbiddenException('Nu poți modifica acest cod QR');
    }
    return cod;
  }

  async findPublicByCod(codValue: string) {
    const cod = codValue.trim();
    const entry = await this.coduriRepo.findOne({
      where: { cod, sters: false },
      relations: { firma: true },
    });

    if (!entry) {
      throw new NotFoundException('Codul QR nu există');
    }

    return {
      cod: entry.cod,
      numePostareClienti: entry.numePostareClienti,
      pretRedus: entry.pretRedus,
      firma: {
        email: entry.firma.email,
        logoUrl: entry.firma.logoUrl,
      },
    };
  }

  async recordPublicScan(codValue: string) {
    const cod = codValue.trim();
    const entry = await this.coduriRepo.findOne({
      where: { cod, sters: false },
    });

    if (!entry) {
      throw new NotFoundException('Codul QR nu există');
    }

    await this.scanariRepo.save(
      this.scanariRepo.create({ codQrId: entry.id }),
    );

    return { ok: true };
  }

  private extractCod(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    const fromUrl = this.extractCodFromUrl(trimmed);
    if (fromUrl) return fromUrl;

    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed) as { cod?: string };
        if (parsed.cod && parsed.cod.trim().length > 0) {
          return parsed.cod.trim();
        }
      } catch {
        return null;
      }
    }

    if (/^H24-[A-F0-9]+$/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }

    if (/^[A-Z0-9][A-Z0-9-]+$/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }

    return null;
  }

  private extractCodFromUrl(raw: string): string | null {
    const coduriMatch = raw.match(/\/coduri\/([^/?#]+)/i);
    if (coduriMatch?.[1]) {
      return decodeURIComponent(coduriMatch[1]).trim();
    }

    try {
      const normalized = raw.includes('://') ? raw : `https://${raw}`;
      const url = new URL(normalized);
      const segments = url.pathname.split('/').filter(Boolean);
      const coduriIndex = segments.findIndex(
        (s) => s.toLowerCase() === 'coduri',
      );
      if (coduriIndex >= 0 && segments[coduriIndex + 1]) {
        return decodeURIComponent(segments[coduriIndex + 1]).trim();
      }
    } catch {
      return null;
    }

    return null;
  }

  private async generateUniqueCod(): Promise<string> {
    for (let attempt = 0; attempt < 8; attempt++) {
      const suffix = randomBytes(4).toString('hex').toUpperCase();
      const cod = `H24-${suffix}`;
      const existing = await this.coduriRepo.exists({ where: { cod } });
      if (!existing) return cod;
    }
    throw new Error('Nu s-a putut genera un cod QR unic');
  }
}
