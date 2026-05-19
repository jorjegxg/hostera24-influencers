import { Controller, Get, Param, Post } from '@nestjs/common';
import { CoduriQrService } from './coduri-qr.service';

@Controller('coduri-qr/public')
export class CoduriQrPublicController {
  constructor(private readonly coduriQrService: CoduriQrService) {}

  @Get(':cod')
  findOne(@Param('cod') cod: string) {
    return this.coduriQrService.findPublicByCod(cod);
  }

  @Post(':cod/scan')
  recordScan(@Param('cod') cod: string) {
    return this.coduriQrService.recordPublicScan(cod);
  }
}
