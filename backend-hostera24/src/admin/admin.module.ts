import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MesajContact } from '../contact/mesaj-contact.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([MesajContact])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
