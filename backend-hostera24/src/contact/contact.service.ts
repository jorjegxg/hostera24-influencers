import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMesajContactDto } from './dto/create-mesaj-contact.dto';
import { MesajContact } from './mesaj-contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(MesajContact)
    private readonly mesajeRepo: Repository<MesajContact>,
  ) {}

  async create(dto: CreateMesajContactDto): Promise<{ ok: true; id: number }> {
    const row = this.mesajeRepo.create({
      tip: dto.tip,
      nume: dto.nume.trim(),
      email: dto.email.trim().toLowerCase(),
      telefon: dto.telefon.trim(),
      agentie: dto.agentie?.trim() || null,
      mesaj: dto.mesaj?.trim() || null,
    });
    const saved = await this.mesajeRepo.save(row);
    return { ok: true, id: saved.id };
  }
}
