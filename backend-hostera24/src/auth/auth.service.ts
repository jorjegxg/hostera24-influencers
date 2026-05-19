import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Firma } from '../firme/firma.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Firma)
    private readonly firmeRepo: Repository<Firma>,
    private readonly jwtService: JwtService,
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
