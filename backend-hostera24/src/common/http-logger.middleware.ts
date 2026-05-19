import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const ms = Date.now() - start;
      const ip = req.ip || req.socket.remoteAddress || '-';
      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms ip=${ip}`,
      );
    });

    next();
  }
}
