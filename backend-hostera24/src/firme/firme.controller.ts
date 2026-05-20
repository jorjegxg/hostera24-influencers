import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateFirmaProfilDto } from './dto/update-firma-profil.dto';
import { FirmeService } from './firme.service';

type AuthRequest = { user: { firmaId: number; email: string } };

@Controller('firma')
@UseGuards(JwtAuthGuard)
export class FirmeController {
  constructor(private readonly firmeService: FirmeService) {}

  @Get('profil')
  getProfil(@Req() req: AuthRequest) {
    return this.firmeService.getProfil(req.user.firmaId);
  }

  @Patch('profil')
  updateProfil(@Req() req: AuthRequest, @Body() dto: UpdateFirmaProfilDto) {
    return this.firmeService.updateProfil(req.user.firmaId, dto);
  }
}
