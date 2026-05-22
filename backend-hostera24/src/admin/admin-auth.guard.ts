import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends { role?: string }>(
    err: Error | null,
    user: TUser | false,
    _info: unknown,
    _context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException('Autentificare necesară');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenException('Acces interzis');
    }
    return user;
  }
}
