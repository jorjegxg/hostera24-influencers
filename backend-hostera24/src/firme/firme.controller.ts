import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('profil/logo')
  @UseInterceptors(FileInterceptor('logo'))
  uploadLogo(
    @Req() req: AuthRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp|gif)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.firmeService.uploadLogo(req.user.firmaId, file);
  }
}
