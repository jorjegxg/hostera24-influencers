import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoduriQrService } from './coduri-qr.service';
import { CreateCodQrDto } from './dto/create-cod-qr.dto';
import { ScanCodQrDto } from './dto/scan-cod-qr.dto';
import { UpdateCodQrDto } from './dto/update-cod-qr.dto';

type AuthRequest = { user: { firmaId: number; email: string } };

@Controller('coduri-qr')
@UseGuards(JwtAuthGuard)
export class CoduriQrController {
  constructor(private readonly coduriQrService: CoduriQrService) {}

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.coduriQrService.findAllForFirma(req.user.firmaId);
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateCodQrDto) {
    return this.coduriQrService.create(req.user.firmaId, dto);
  }

  @Post('scan')
  scan(@Req() req: AuthRequest, @Body() dto: ScanCodQrDto) {
    return this.coduriQrService.scan(req.user.firmaId, dto.payload);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCodQrDto,
  ) {
    return this.coduriQrService.update(req.user.firmaId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.coduriQrService.softDelete(req.user.firmaId, id);
  }
}
