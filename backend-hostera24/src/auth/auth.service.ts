import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { QueryFailedError, Repository } from 'typeorm';
import { Angajat } from '../angajati/angajat.entity';
import { Firma } from '../firme/firma.entity';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { FirebaseAdminService } from './firebase-admin.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Firma)
    private readonly firmeRepo: Repository<Firma>,
    @InjectRepository(Angajat)
    private readonly angajatiRepo: Repository<Angajat>,
    private readonly jwtService: JwtService,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const firma = await this.firmeRepo.findOne({ where: { email } });

    if (!firma) {
      const angajat = await this.angajatiRepo.findOne({ where: { email } });
      if (angajat) {
        throw new UnauthorizedException(
          'Acest cont de angajat folosește autentificare Google',
        );
      }
      throw new UnauthorizedException('Email sau parolă incorectă');
    }

    if (!firma.parolaHash) {
      throw new UnauthorizedException(
        'Acest cont folosește autentificare Google',
      );
    }

    const valid = await bcrypt.compare(dto.parola, firma.parolaHash);
    if (!valid) {
      throw new UnauthorizedException('Email sau parolă incorectă');
    }

    return this.issueFirmaToken(firma);
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.firmeRepo.findOne({ where: { email } });

    if (existing) {
      throw new ConflictException('Există deja un cont cu acest email');
    }

    const angajat = await this.angajatiRepo.findOne({ where: { email } });
    if (angajat) {
      throw new ConflictException(
        'Acest email este înregistrat ca angajat. Conectează-te cu Google.',
      );
    }

    const parolaHash = await bcrypt.hash(dto.parola, 10);
    const firma = await this.firmeRepo.save(
      this.firmeRepo.create({ email, parolaHash }),
    );

    return this.issueFirmaToken(firma);
  }

  async loginWithGoogle(dto: FirebaseLoginDto) {
    try {
      const decoded = await this.firebaseAdmin.verifyIdToken(dto.idToken);
      const email = decoded.email?.trim().toLowerCase();
      const uid = decoded.uid;

      if (!email) {
        throw new UnauthorizedException('Contul Google nu are email asociat');
      }

      const firma =
        (await this.firmeRepo.findOne({ where: { firebaseUid: uid } })) ??
        (await this.firmeRepo.findOne({ where: { email } }));

      if (firma) {
        if (!firma.firebaseUid) {
          firma.firebaseUid = uid;
          await this.firmeRepo.save(firma);
        }
        return this.issueFirmaToken(firma);
      }

      const angajat =
        (await this.angajatiRepo.findOne({ where: { firebaseUid: uid } })) ??
        (await this.angajatiRepo.findOne({ where: { email } }));

      if (angajat) {
        if (!angajat.firebaseUid) {
          angajat.firebaseUid = uid;
          await this.angajatiRepo.save(angajat);
        }
        return this.issueAngajatToken(angajat);
      }

      const created = await this.firmeRepo.save(
        this.firmeRepo.create({ email, firebaseUid: uid, parolaHash: null }),
      );
      return this.issueFirmaToken(created);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.logger.error(`loginWithGoogle DB: ${error.message}`);
        throw new InternalServerErrorException(
          'Baza de date nu e actualizată pe server (lipsește migrarea). Rulează scripts/vps-migrate.sh pe VPS.',
        );
      }
      throw error;
    }
  }

  private async issueFirmaToken(firma: Firma) {
    const accessToken = await this.jwtService.signAsync({
      sub: firma.id,
      email: firma.email,
    });

    return {
      accessToken,
      role: 'firma' as const,
      firma: { id: firma.id, email: firma.email, nume: firma.nume },
    };
  }

  private async issueAngajatToken(angajat: Angajat) {
    const accessToken = await this.jwtService.signAsync({
      sub: angajat.id,
      email: angajat.email,
      role: 'angajat',
      firmaId: angajat.firmaId,
    });

    const firma = await this.firmeRepo.findOne({
      where: { id: angajat.firmaId },
    });

    return {
      accessToken,
      role: 'angajat' as const,
      angajat: { id: angajat.id, email: angajat.email, nume: angajat.nume },
      firma: {
        id: angajat.firmaId,
        email: firma?.email ?? '',
        nume: firma?.nume ?? null,
      },
    };
  }
}
