import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { MesajContact } from '../contact/mesaj-contact.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(MesajContact)
    private readonly mesajeRepo: Repository<MesajContact>,
  ) {}

  /** Citește hash bcrypt; suportă ghilimele și $$ (escape Docker Compose pentru $ din hash). */
  private adminPasswordHash(): string | undefined {
    const raw = this.config.get<string>('ADMIN_PASSWORD_HASH');
    if (!raw?.trim()) return undefined;
    let hash = raw.trim();
    if (
      (hash.startsWith("'") && hash.endsWith("'")) ||
      (hash.startsWith('"') && hash.endsWith('"'))
    ) {
      hash = hash.slice(1, -1).trim();
    }
    if (hash.includes('$$')) {
      hash = hash.replace(/\$\$/g, '$');
    }
    return hash || undefined;
  }

  async login(parola: string): Promise<{ accessToken: string }> {
    const hash = this.adminPasswordHash();
    if (!hash) {
      throw new UnauthorizedException(
        'Admin neconfigurat — lipsește ADMIN_PASSWORD_HASH în .env (la Docker: fiecare $ din hash devine $$)',
      );
    }

    const valid = await bcrypt.compare(parola, hash);
    if (!valid) {
      throw new UnauthorizedException('Parolă incorectă');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: 'admin',
      role: 'admin',
    });

    return { accessToken };
  }

  async listMesajeContact(): Promise<
    {
      id: number;
      tip: string;
      nume: string;
      email: string;
      telefon: string;
      agentie: string | null;
      mesaj: string | null;
      creatLa: Date;
    }[]
  > {
    const rows = await this.mesajeRepo.find({
      order: { creatLa: 'DESC' },
    });

    return rows.map((r) => ({
      id: r.id,
      tip: r.tip,
      nume: r.nume,
      email: r.email,
      telefon: r.telefon,
      agentie: r.agentie,
      mesaj: r.mesaj,
      creatLa: r.creatLa,
    }));
  }
}
