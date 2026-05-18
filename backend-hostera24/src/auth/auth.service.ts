import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Firma } from '../firme/firma.entity';
import { LoginDto } from './dto/login.dto';

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
