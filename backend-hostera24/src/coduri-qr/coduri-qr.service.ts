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

@Injectable()
export class CoduriQrService {
  constructor(
    @InjectRepository(CodQr)
    private readonly coduriRepo: Repository<CodQr>,
  ) {}

  findAllForFirma(firmaId: number) {
    return this.coduriRepo.find({
      where: { firmaId },
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
    });

    return this.coduriRepo.save(entry);
  }

  async remove(firmaId: number, id: number) {
    const cod = await this.coduriRepo.findOne({ where: { id } });
    if (!cod) {
      throw new NotFoundException('Codul QR nu există');
    }
    if (cod.firmaId !== firmaId) {
      throw new ForbiddenException('Nu poți șterge acest cod QR');
    }
    await this.coduriRepo.remove(cod);
    return { ok: true };
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
