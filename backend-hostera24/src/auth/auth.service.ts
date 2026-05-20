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
    private readonly jwtService: JwtService,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const firma = await this.firmeRepo.findOne({ where: { email } });

    if (!firma) {
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

    return this.issueToken(firma);
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.firmeRepo.findOne({ where: { email } });

    if (existing) {
      throw new ConflictException('Există deja un cont cu acest email');
    }

    const parolaHash = await bcrypt.hash(dto.parola, 10);
    const firma = await this.firmeRepo.save(
      this.firmeRepo.create({ email, parolaHash }),
    );

    return this.issueToken(firma);
  }

  async loginWithGoogle(dto: FirebaseLoginDto) {
    try {
      const decoded = await this.firebaseAdmin.verifyIdToken(dto.idToken);
      const email = decoded.email?.trim().toLowerCase();
      const uid = decoded.uid;

      if (!email) {
        throw new UnauthorizedException('Contul Google nu are email asociat');
      }

      let firma =
        (await this.firmeRepo.findOne({ where: { firebaseUid: uid } })) ??
        (await this.firmeRepo.findOne({ where: { email } }));

      if (firma) {
        if (!firma.firebaseUid) {
          firma.firebaseUid = uid;
          await this.firmeRepo.save(firma);
        }
      } else {
        firma = await this.firmeRepo.save(
          this.firmeRepo.create({ email, firebaseUid: uid, parolaHash: null }),
        );
      }

      return this.issueToken(firma);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.logger.error(`loginWithGoogle DB: ${error.message}`);
        throw new InternalServerErrorException(
          'Baza de date nu e actualizată pe server (lipsește migrarea Google). Rulează scripts/vps-migrate.sh pe VPS.',
        );
      }
      throw error;
    }
  }

  private async issueToken(firma: Firma) {
    const accessToken = await this.jwtService.signAsync({
      sub: firma.id,
      email: firma.email,
    });

    return {
      accessToken,
      firma: { id: firma.id, email: firma.email },
    };
  }
}
