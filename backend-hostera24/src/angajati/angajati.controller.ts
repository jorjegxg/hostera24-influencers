import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AngajatiService } from './angajati.service';
import { CreateAngajatDto } from './dto/create-angajat.dto';

type AuthRequest = { user: { firmaId: number; email: string } };

@Controller('firma/angajati')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('firma')
export class AngajatiController {
  constructor(private readonly angajatiService: AngajatiService) {}

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.angajatiService.findAllForFirma(req.user.firmaId);
  }

  @Post()
  add(@Req() req: AuthRequest, @Body() dto: CreateAngajatDto) {
    return this.angajatiService.add(req.user.firmaId, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.angajatiService.remove(req.user.firmaId, id);
  }
}
