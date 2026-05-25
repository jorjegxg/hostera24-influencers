import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { scanatLaForApi } from '../common/datetime.util';
import { normalizePublicUploadsUrl } from '../common/uploads.util';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { Scanare } from '../scanari/scanare.entity';
import { CodQr } from './cod-qr.entity';
import { CreateCodQrDto } from './dto/create-cod-qr.dto';
import { UpdateCodQrDto } from './dto/update-cod-qr.dto';
import {
  isCodQrScannableNow,
  normalizeProgramareDto,
  programareBlockMessage,
  toProgramareResponse,
} from './qr-schedule.util';
import {
  isScanLimitReached,
  scanLimitBlockMessage,
  toLimitaScanariResponse,
} from './qr-limit.util';

@Injectable()
export class CoduriQrService {
  constructor(
    @InjectRepository(CodQr)
    private readonly coduriRepo: Repository<CodQr>,
    @InjectRepository(Scanare)
    private readonly scanariRepo: Repository<Scanare>,
    private readonly config: ConfigService,
  ) {}

  async findAllForFirma(firmaId: number) {
    const rows = await this.coduriRepo
      .createQueryBuilder('cod')
      .loadRelationCountAndMap(
        'cod.numarScanari',
        'cod.scanari',
        'scanari_reusite',
        (qb) => qb.andWhere('scanari_reusite.reusit = :reusit', { reusit: true }),
      )
      .loadRelationCountAndMap(
        'cod.numarScanariRespinse',
        'cod.scanari',
        'scanari_respinse',
        (qb) => qb.andWhere('scanari_respinse.reusit = :reusit', { reusit: false }),
      )
      .where('cod.firmaId = :firmaId', { firmaId })
      .andWhere('cod.sters = :sters', { sters: false })
      .orderBy('cod.creatLa', 'DESC')
      .getMany();

    return rows.map((cod) => {
      const extended = cod as CodQr & {
        numarScanari: number;
        numarScanariRespinse: number;
      };
      return this.toQrListItem(
        cod,
        extended.numarScanari ?? 0,
        extended.numarScanariRespinse ?? 0,
      );
    });
  }

  async findOneForFirma(firmaId: number, id: number) {
    const cod = await this.findActiveOrThrow(firmaId, id);

    const numarScanari = await this.countScanariReusite(id);
    const numarScanariRespinse = await this.countScanariRespinse(id);

    return {
      id: cod.id,
      cod: cod.cod,
      numePostareClienti: cod.numePostareClienti,
      numePostareFirme: cod.numePostareFirme,
      pret: cod.pret,
      pretRedus: cod.pretRedus,
      creatLa: cod.creatLa,
      numarScanari,
      numarScanariRespinse,
      ...toProgramareResponse(cod),
      ...toLimitaScanariResponse(cod, numarScanari),
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
        scanatLa: scanatLaForApi(s.scanatLa),
        reusit: s.reusit,
      })),
      total,
      page,
      limit: take,
      hasMore: skip + scanari.length < total,
    };
  }

  async create(firmaId: number, dto: CreateCodQrDto) {
    const cod = await this.generateUniqueCod();
    const programare = normalizeProgramareDto(dto);

    const entry = this.coduriRepo.create({
      firmaId,
      cod,
      numePostareClienti: this.normalizeOptionalText(dto.numePostareClienti),
      numePostareFirme: this.normalizeOptionalText(dto.numePostareFirme),
      pret: this.normalizeOptionalText(dto.pret),
      pretRedus: this.normalizeOptionalText(dto.pretRedus),
      programareTip: programare.programareTip,
      programareDeLa: programare.programareDeLa,
      programarePanaLa: programare.programarePanaLa,
      programareZile: programare.programareZile,
      limitaScanari: this.normalizeLimitaScanari(dto.limitaScanari),
      sters: false,
    });

    const saved = await this.coduriRepo.save(entry);
    return this.toQrListItem(saved, 0);
  }

  async update(firmaId: number, id: number, dto: UpdateCodQrDto) {
    const cod = await this.findActiveOrThrow(firmaId, id);

    if (dto.numePostareClienti !== undefined) {
      cod.numePostareClienti = this.normalizeOptionalText(dto.numePostareClienti);
    }
    if (dto.numePostareFirme !== undefined) {
      cod.numePostareFirme = this.normalizeOptionalText(dto.numePostareFirme);
    }
    if (dto.pret !== undefined) {
      cod.pret = this.normalizeOptionalText(dto.pret);
    }
    if (dto.pretRedus !== undefined) {
      cod.pretRedus = this.normalizeOptionalText(dto.pretRedus);
    }

    if (
      dto.programareTip !== undefined ||
      dto.programareDeLa !== undefined ||
      dto.programarePanaLa !== undefined ||
      dto.programareZile !== undefined
    ) {
      const programare = normalizeProgramareDto({
        programareTip: dto.programareTip ?? null,
        programareDeLa: dto.programareDeLa,
        programarePanaLa: dto.programarePanaLa,
        programareZile: dto.programareZile,
      });
      cod.programareTip = programare.programareTip;
      cod.programareDeLa = programare.programareDeLa;
      cod.programarePanaLa = programare.programarePanaLa;
      cod.programareZile = programare.programareZile;
    }

    if (dto.limitaScanari !== undefined) {
      const numarScanari = await this.countScanariReusite(id);
      const nextLimit = this.normalizeLimitaScanari(dto.limitaScanari);
      if (nextLimit != null && nextLimit < numarScanari) {
        throw new BadRequestException(
          `Limita (${nextLimit}) nu poate fi mai mică decât scanările deja înregistrate (${numarScanari}).`,
        );
      }
      cod.limitaScanari = nextLimit;
    }

    const saved = await this.coduriRepo.save(cod);
    const numarScanari = await this.countScanariReusite(saved.id);
    const numarScanariRespinse = await this.countScanariRespinse(saved.id);
    return this.toQrListItem(saved, numarScanari, numarScanariRespinse);
  }

  async scan(firmaId: number, rawPayload: string) {
    const codValue = this.extractCod(rawPayload);
    if (!codValue) {
      return { status: 'not_found' as const };
    }

    const entry = await this.findActiveByCod(codValue);

    if (!entry) {
      return { status: 'not_found' as const };
    }

    if (!isCodQrScannableNow(entry)) {
      return {
        status: 'unavailable' as const,
        cod: entry.cod,
        mesajProgramare: programareBlockMessage(entry),
        ...toProgramareResponse(entry),
      };
    }

    const recorded = await this.recordScanAtomic(entry.id);
    if ('exhausted' in recorded) {
      return {
        status: 'exhausted' as const,
        cod: entry.cod,
        mesajLimita: scanLimitBlockMessage(entry),
        limitaScanari: recorded.limitaScanari,
        numarScanari: recorded.numarScanari,
        numarScanariRespinse: recorded.numarScanariRespinse,
        inregistrat: recorded.inregistrat,
      };
    }

    const numarScanari = recorded.numarScanari;
    const base = this.toPublicEntry(entry);

    if (entry.firmaId === firmaId) {
      return {
        status: 'own' as const,
        ...base,
        numarScanari,
        numarScanariRespinse: recorded.numarScanariRespinse,
        ...toLimitaScanariResponse(entry, numarScanari),
      };
    }

    return {
      status: 'other' as const,
      cod: base.cod,
      numePostareClienti: base.numePostareClienti,
      pret: base.pret,
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
      pret: entry.pret,
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
    const entry = await this.findActiveByCod(cod, { firma: true });

    if (!entry) {
      throw new NotFoundException('Codul QR nu există');
    }

    const numarScanari = await this.countScanariReusite(entry.id);

    return {
      cod: entry.cod,
      numePostareClienti: entry.numePostareClienti,
      pret: entry.pret,
      pretRedus: entry.pretRedus,
      ...toLimitaScanariResponse(entry, numarScanari),
      firma: {
        email: entry.firma.email,
        nume: entry.firma.nume,
        telefon: entry.firma.telefon,
        descriere: entry.firma.descriere,
        website: entry.firma.website,
        logoUrl: normalizePublicUploadsUrl(
          entry.firma.logoUrl,
          this.config,
        ),
      },
    };
  }

  async recordPublicScan(codValue: string) {
    const cod = codValue.trim();
    const entry = await this.findActiveByCod(cod);

    if (!entry) {
      throw new NotFoundException('Codul QR nu există');
    }

    if (!isCodQrScannableNow(entry)) {
      throw new UnprocessableEntityException(programareBlockMessage(entry));
    }

    const recorded = await this.recordScanAtomic(entry.id);
    if ('exhausted' in recorded) {
      throw new UnprocessableEntityException(scanLimitBlockMessage(entry));
    }

    return { ok: true };
  }

  private toQrListItem(
    cod: CodQr,
    numarScanari: number,
    numarScanariRespinse = 0,
  ) {
    return {
      id: cod.id,
      cod: cod.cod,
      numePostareClienti: cod.numePostareClienti,
      numePostareFirme: cod.numePostareFirme,
      pret: cod.pret,
      pretRedus: cod.pretRedus,
      creatLa: cod.creatLa,
      numarScanari,
      numarScanariRespinse,
      ...toProgramareResponse(cod),
      ...toLimitaScanariResponse(cod, numarScanari),
    };
  }

  private countScanariReusite(codQrId: number) {
    return this.scanariRepo.count({
      where: { codQrId, reusit: true },
    });
  }

  private countScanariRespinse(codQrId: number) {
    return this.scanariRepo.count({
      where: { codQrId, reusit: false },
    });
  }

  private normalizeLimitaScanari(value?: number | null): number | null {
    if (value == null) return null;
    return value;
  }

  private async recordScanAtomic(
    codQrId: number,
  ): Promise<
    | { ok: true; numarScanari: number; numarScanariRespinse: number }
    | {
        exhausted: true;
        limitaScanari: number;
        numarScanari: number;
        numarScanariRespinse: number;
        inregistrat: boolean;
      }
  > {
    return this.coduriRepo.manager.transaction(async (manager) => {
      const cod = await manager.findOne(CodQr, {
        where: { id: codQrId, sters: false },
        lock: { mode: 'pessimistic_write' },
      });
      if (!cod) {
        throw new NotFoundException('Codul QR nu există');
      }

      const countReusite = await manager.count(Scanare, {
        where: { codQrId, reusit: true },
      });
      const countRespinse = await manager.count(Scanare, {
        where: { codQrId, reusit: false },
      });

      if (isScanLimitReached(cod, countReusite)) {
        await manager.save(
          Scanare,
          manager.create(Scanare, { codQrId, reusit: false }),
        );
        return {
          exhausted: true,
          limitaScanari: cod.limitaScanari!,
          numarScanari: countReusite,
          numarScanariRespinse: countRespinse + 1,
          inregistrat: true,
        };
      }

      await manager.save(
        Scanare,
        manager.create(Scanare, { codQrId, reusit: true }),
      );
      return {
        ok: true,
        numarScanari: countReusite + 1,
        numarScanariRespinse: countRespinse,
      };
    });
  }

  private async findActiveByCod(
    codValue: string,
    relations?: { firma?: boolean },
  ): Promise<CodQr | null> {
    const cod = codValue.trim();
    if (!cod) return null;

    const qb = this.coduriRepo
      .createQueryBuilder('cod')
      .where('cod.sters = :sters', { sters: false })
      .andWhere('LOWER(cod.cod) = LOWER(:cod)', { cod });

    if (relations?.firma) {
      qb.leftJoinAndSelect('cod.firma', 'firma');
    }

    return qb.getOne();
  }

  private extractCod(raw: string): string | null {
    const trimmed = raw
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, '');
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
