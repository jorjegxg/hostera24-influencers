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
import { VizitaPaginaQr } from '../vizite-pagina/vizita-pagina-qr.entity';
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
    @InjectRepository(VizitaPaginaQr)
    private readonly vizitePaginaRepo: Repository<VizitaPaginaQr>,
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

    const viziteByCod = await this.viziteCountByCodIds(rows.map((c) => c.id));

    return rows.map((cod) => {
      const extended = cod as CodQr & {
        numarScanari: number;
        numarScanariRespinse: number;
      };
      return this.toQrListItem(
        cod,
        extended.numarScanari ?? 0,
        extended.numarScanariRespinse ?? 0,
        viziteByCod.get(cod.id) ?? 0,
      );
    });
  }

  async findOneForFirma(firmaId: number, id: number) {
    const cod = await this.findActiveOrThrow(firmaId, id);

    const numarScanari = await this.countScanariLaCasă(id);
    const numarScanariRespinse = await this.countScanariRespinseLaCasă(id);

    const numarVizitePublice = await this.countVizitePublice(id);

    return {
      id: cod.id,
      cod: cod.cod,
      numePostareClienti: cod.numePostareClienti,
      numePostareFirme: cod.numePostareFirme,
      pret: cod.pret,
      reducere: cod.reducere,
      creatLa: cod.creatLa,
      numarScanari,
      numarScanariRespinse,
      numarVizitePublice,
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
    this.assertReducereNotGreaterThanPret(dto.pret, dto.reducere);

    const entry = this.coduriRepo.create({
      firmaId,
      cod,
      numePostareClienti: dto.numePostareClienti.trim(),
      numePostareFirme: this.normalizeOptionalText(dto.numePostareFirme),
      pret: dto.pret,
      reducere: dto.reducere,
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
      cod.numePostareClienti = dto.numePostareClienti.trim();
    }
    if (dto.numePostareFirme !== undefined) {
      cod.numePostareFirme = this.normalizeOptionalText(dto.numePostareFirme);
    }
    if (dto.pret !== undefined) {
      cod.pret = dto.pret;
    }
    if (dto.reducere !== undefined) {
      cod.reducere = dto.reducere;
    }
    if (cod.pret != null && cod.reducere != null) {
      this.assertReducereNotGreaterThanPret(cod.pret, cod.reducere);
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
      const numarScanari = await this.countScanariLaCasă(id);
      const nextLimit = this.normalizeLimitaScanari(dto.limitaScanari);
      if (nextLimit != null && nextLimit < numarScanari) {
        throw new BadRequestException(
          `Limita (${nextLimit}) nu poate fi mai mică decât scanările deja înregistrate (${numarScanari}).`,
        );
      }
      cod.limitaScanari = nextLimit;
    }

    const saved = await this.coduriRepo.save(cod);
    const numarScanari = await this.countScanariLaCasă(saved.id);
    const numarScanariRespinse = await this.countScanariRespinseLaCasă(saved.id);
    const numarVizitePublice = await this.countVizitePublice(saved.id);
    return this.toQrListItem(
      saved,
      numarScanari,
      numarScanariRespinse,
      numarVizitePublice,
    );
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

    const base = this.toPublicEntry(entry);

    if (entry.firmaId !== firmaId) {
      return {
        status: 'other' as const,
        cod: base.cod,
        numePostareClienti: base.numePostareClienti,
        pret: base.pret,
        reducere: base.reducere,
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
    return {
      status: 'own' as const,
      ...base,
      numarScanari,
      numarScanariRespinse: recorded.numarScanariRespinse,
      ...toLimitaScanariResponse(entry, numarScanari),
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
      reducere: entry.reducere,
      creatLa: entry.creatLa,
    };
  }

  private normalizeOptionalText(value?: string): string | null {
    if (value == null) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private normalizeOptionalNumber(value?: number | null): number | null {
    if (value == null || Number.isNaN(value)) return null;
    return value;
  }

  private assertReducereNotGreaterThanPret(pret: number, reducere: number) {
    if (reducere > pret) {
      throw new BadRequestException(
        'Reducerea nu poate fi mai mare decât prețul serviciului.',
      );
    }
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

    const numarScanari = await this.countScanariLaCasă(entry.id);

    return {
      cod: entry.cod,
      numePostareClienti: entry.numePostareClienti,
      pret: entry.pret,
      reducere: entry.reducere,
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

    await this.incrementVizitaPagina(entry.id);

    return { ok: true };
  }

  private toQrListItem(
    cod: CodQr,
    numarScanari: number,
    numarScanariRespinse = 0,
    numarVizitePublice = 0,
  ) {
    return {
      id: cod.id,
      cod: cod.cod,
      numePostareClienti: cod.numePostareClienti,
      numePostareFirme: cod.numePostareFirme,
      pret: cod.pret,
      reducere: cod.reducere,
      creatLa: cod.creatLa,
      numarScanari,
      numarScanariRespinse,
      numarVizitePublice,
      ...toProgramareResponse(cod),
      ...toLimitaScanariResponse(cod, numarScanari),
    };
  }

  private countScanariLaCasă(codQrId: number) {
    return this.scanariRepo.count({
      where: { codQrId, reusit: true },
    });
  }

  private countScanariRespinseLaCasă(codQrId: number) {
    return this.scanariRepo.count({
      where: { codQrId, reusit: false },
    });
  }

  private async countVizitePublice(codQrId: number) {
    const row = await this.vizitePaginaRepo.findOne({ where: { codQrId } });
    return row?.numarVizite ?? 0;
  }

  private async viziteCountByCodIds(codQrIds: number[]) {
    const map = new Map<number, number>();
    if (codQrIds.length === 0) return map;

    const rows = await this.vizitePaginaRepo
      .createQueryBuilder('v')
      .select('v.codQrId', 'codQrId')
      .addSelect('v.numarVizite', 'numarVizite')
      .where('v.codQrId IN (:...ids)', { ids: codQrIds })
      .getRawMany<{ codQrId: number; numarVizite: string }>();

    for (const row of rows) {
      map.set(Number(row.codQrId), Number(row.numarVizite));
    }
    return map;
  }

  private async incrementVizitaPagina(codQrId: number) {
    await this.vizitePaginaRepo.manager.transaction(async (manager) => {
      let row = await manager.findOne(VizitaPaginaQr, {
        where: { codQrId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!row) {
        row = manager.create(VizitaPaginaQr, { codQrId, numarVizite: 1 });
      } else {
        row.numarVizite += 1;
      }
      await manager.save(VizitaPaginaQr, row);
    });
  }

  private normalizeLimitaScanari(value?: number | null): number | null {
    if (value == null) return null;
    return value;
  }

  private async recordScanAtomic(codQrId: number): Promise<
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

      const countReusiteLaCasă = await manager.count(Scanare, {
        where: { codQrId, reusit: true },
      });
      const countRespinseLaCasă = await manager.count(Scanare, {
        where: { codQrId, reusit: false },
      });

      if (isScanLimitReached(cod, countReusiteLaCasă)) {
        await manager.save(
          Scanare,
          manager.create(Scanare, { codQrId, reusit: false }),
        );
        return {
          exhausted: true,
          limitaScanari: cod.limitaScanari!,
          numarScanari: countReusiteLaCasă,
          numarScanariRespinse: countRespinseLaCasă + 1,
          inregistrat: true,
        };
      }

      await manager.save(
        Scanare,
        manager.create(Scanare, { codQrId, reusit: true }),
      );

      return {
        ok: true,
        numarScanari: countReusiteLaCasă + 1,
        numarScanariRespinse: countRespinseLaCasă,
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
