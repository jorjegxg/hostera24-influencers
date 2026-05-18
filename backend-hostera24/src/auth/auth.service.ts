import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { Firma } from '../firme/firma.entity';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client | null = null;

  constructor(
    @InjectRepository(Firma)
    private readonly firmeRepo: Repository<Firma>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const firma = await this.firmeRepo.findOne({ where: { email } });

    if (!firma) {
      throw new UnauthorizedException('Email sau parolă incorectă');
    }

    const valid = await bcrypt.compare(dto.parola, firma.parolaHash);
    if (!valid) {
      throw new UnauthorizedException('Email sau parolă incorectă');
    }

    return this.issueTokens(firma);
  }

  async loginWithGoogle(dto: GoogleLoginDto) {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new InternalServerErrorException(
        'GOOGLE_CLIENT_ID lipsește din configurare',
      );
    }

    const client = this.getGoogleClient(clientId);
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: dto.idToken,
        audience: clientId,
      });
    } catch {
      throw new UnauthorizedException('Token Google invalid');
    }

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new UnauthorizedException('Token Google invalid');
    }

    if (payload.email_verified === false) {
      throw new UnauthorizedException('Emailul Google nu este verificat');
    }

    const email = payload.email.toLowerCase();
    let firma = await this.firmeRepo.findOne({ where: { email } });

    if (!firma) {
      const parolaHash = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
      firma = await this.firmeRepo.save(
        this.firmeRepo.create({ email, parolaHash }),
      );
    }

    return this.issueTokens(firma);
  }

  private getGoogleClient(clientId: string) {
    if (!this.googleClient) {
      this.googleClient = new OAuth2Client(clientId);
    }
    return this.googleClient;
  }

  private async issueTokens(firma: Firma) {
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
