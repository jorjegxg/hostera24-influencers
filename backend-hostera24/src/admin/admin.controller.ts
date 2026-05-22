import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto.parola);
  }

  @Get('mesaje-contact')
  @UseGuards(AdminAuthGuard)
  listMesajeContact() {
    return this.adminService.listMesajeContact();
  }
}
