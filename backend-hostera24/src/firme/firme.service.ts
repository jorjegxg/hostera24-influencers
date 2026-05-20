import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateFirmaProfilDto } from './dto/update-firma-profil.dto';
import { Firma } from './firma.entity';
import { FirmeUploadsService } from './firme-uploads.service';

export type FirmaProfilResponse = {
  id: number;
  email: string;
  nume: string | null;
  telefon: string | null;
  descriere: string | null;
  website: string | null;
  logoUrl: string | null;
  creatLa: Date;
};

@Injectable()
export class FirmeService {
  constructor(
    @InjectRepository(Firma)
    private readonly firmeRepo: Repository<Firma>,
    private readonly uploads: FirmeUploadsService,
  ) {}

  async getProfil(firmaId: number): Promise<FirmaProfilResponse> {
    const firma = await this.firmeRepo.findOne({ where: { id: firmaId } });
    if (!firma) {
      throw new NotFoundException('Firma nu a fost găsită');
    }
    return this.toProfil(firma);
  }

  async updateProfil(
    firmaId: number,
    dto: UpdateFirmaProfilDto,
  ): Promise<FirmaProfilResponse> {
    const firma = await this.firmeRepo.findOne({ where: { id: firmaId } });
    if (!firma) {
      throw new NotFoundException('Firma nu a fost găsită');
    }

    if (dto.nume !== undefined) {
      firma.nume = this.trimOrNull(dto.nume);
    }
    if (dto.telefon !== undefined) {
      firma.telefon = this.trimOrNull(dto.telefon);
    }
    if (dto.descriere !== undefined) {
      firma.descriere = this.trimOrNull(dto.descriere);
    }
    if (dto.website !== undefined) {
      firma.website = this.normalizeUrl(dto.website);
    }
    if (dto.logoUrl !== undefined) {
      firma.logoUrl = this.normalizeUrl(dto.logoUrl);
    }

    await this.firmeRepo.save(firma);
    return this.toProfil(firma);
  }

  async uploadLogo(
    firmaId: number,
    file: Express.Multer.File,
  ): Promise<FirmaProfilResponse> {
    const firma = await this.firmeRepo.findOne({ where: { id: firmaId } });
    if (!firma) {
      throw new NotFoundException('Firma nu a fost găsită');
    }

    firma.logoUrl = await this.uploads.saveFirmaLogo(firmaId, file);
    await this.firmeRepo.save(firma);
    return this.toProfil(firma);
  }

  private toProfil(firma: Firma): FirmaProfilResponse {
    return {
      id: firma.id,
      email: firma.email,
      nume: firma.nume,
      telefon: firma.telefon,
      descriere: firma.descriere,
      website: firma.website,
      logoUrl: firma.logoUrl,
      creatLa: firma.creatLa,
    };
  }

  private trimOrNull(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  private normalizeUrl(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }
}
