import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Firma } from '../firme/firma.entity';
import { Angajat } from './angajat.entity';
import { CreateAngajatDto } from './dto/create-angajat.dto';

export type AngajatResponse = {
  id: number;
  email: string;
  nume: string | null;
  /** true după prima conectare cu Google */
  activat: boolean;
  creatLa: Date;
};

@Injectable()
export class AngajatiService {
  constructor(
    @InjectRepository(Angajat)
    private readonly angajatiRepo: Repository<Angajat>,
    @InjectRepository(Firma)
    private readonly firmeRepo: Repository<Firma>,
  ) {}

  async findAllForFirma(firmaId: number): Promise<AngajatResponse[]> {
    const angajati = await this.angajatiRepo.find({
      where: { firmaId },
      order: { creatLa: 'DESC' },
    });
    return angajati.map((a) => this.toResponse(a));
  }

  async add(firmaId: number, dto: CreateAngajatDto): Promise<AngajatResponse> {
    const email = dto.email.trim().toLowerCase();

    const firmaExistenta = await this.firmeRepo.findOne({ where: { email } });
    if (firmaExistenta) {
      throw new ConflictException(
        'Acest email aparține deja unui cont de firmă și nu poate fi adăugat ca angajat.',
      );
    }

    const existent = await this.angajatiRepo.findOne({ where: { email } });
    if (existent) {
      if (existent.firmaId === firmaId) {
        throw new ConflictException('Acest angajat este deja adăugat.');
      }
      throw new ConflictException(
        'Acest email este deja angajat la altă firmă.',
      );
    }

    const angajat = await this.angajatiRepo.save(
      this.angajatiRepo.create({
        firmaId,
        email,
        nume: dto.nume?.trim() || null,
      }),
    );
    return this.toResponse(angajat);
  }

  async remove(firmaId: number, angajatId: number): Promise<void> {
    const angajat = await this.angajatiRepo.findOne({
      where: { id: angajatId, firmaId },
    });
    if (!angajat) {
      throw new NotFoundException('Angajatul nu a fost găsit');
    }
    await this.angajatiRepo.delete(angajat.id);
  }

  /** Verifică la fiecare scanare că angajatul nu a fost șters între timp. */
  async verifyActive(angajatId: number, firmaId: number): Promise<void> {
    const angajat = await this.angajatiRepo.findOne({
      where: { id: angajatId, firmaId },
    });
    if (!angajat) {
      throw new UnauthorizedException(
        'Contul tău de angajat nu mai este activ. Contactează firma.',
      );
    }
  }

  private toResponse(angajat: Angajat): AngajatResponse {
    return {
      id: angajat.id,
      email: angajat.email,
      nume: angajat.nume,
      activat: angajat.firebaseUid != null,
      creatLa: angajat.creatLa,
    };
  }
}
