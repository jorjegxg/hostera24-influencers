import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type JwtPayload = {
  sub: number | string;
  email?: string;
  role?: 'admin' | 'angajat';
  firmaId?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    if (payload.role === 'admin') {
      return { role: 'admin' as const };
    }
    if (payload.role === 'angajat') {
      return {
        role: 'angajat' as const,
        angajatId: payload.sub as number,
        firmaId: payload.firmaId as number,
        email: payload.email ?? '',
      };
    }
    return {
      role: 'firma' as const,
      firmaId: payload.sub as number,
      email: payload.email ?? '',
    };
  }
}
