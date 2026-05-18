import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { CodQr } from './cod-qr.entity';
import { CreateCodQrDto } from './dto/create-cod-qr.dto';
import { UpdateCodQrDto } from './dto/update-cod-qr.dto';

@Injectable()
export class CoduriQrService {
  constructor(
    @InjectRepository(CodQr)
    private readonly coduriRepo: Repository<CodQr>,
  ) {}

  findAllForFirma(firmaId: number) {
    return this.coduriRepo.find({
      where: { firmaId, sters: false },
      order: { creatLa: 'DESC' },
    });
  }

  async create(firmaId: number, dto: CreateCodQrDto) {
    const cod = await this.generateUniqueCod();

    const entry = this.coduriRepo.create({
      firmaId,
      cod,
      numePostareClienti: dto.numePostareClienti.trim(),
      numePostareFirme: dto.numePostareFirme.trim(),
      sters: false,
    });

    return this.coduriRepo.save(entry);
  }

  async update(firmaId: number, id: number, dto: UpdateCodQrDto) {
    const cod = await this.findActiveOrThrow(firmaId, id);

    cod.numePostareClienti = dto.numePostareClienti.trim();
    cod.numePostareFirme = dto.numePostareFirme.trim();

    return this.coduriRepo.save(cod);
  }

  async softDelete(firmaId: number, id: number) {
    const cod = await this.findActiveOrThrow(firmaId, id);
    cod.sters = true;
    await this.coduriRepo.save(cod);
    return { ok: true };
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
