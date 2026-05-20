import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Firma } from './firma.entity';
import { FirmeController } from './firme.controller';
import { FirmeUploadsService } from './firme-uploads.service';
import { FirmeService } from './firme.service';

@Module({
  imports: [TypeOrmModule.forFeature([Firma]), AuthModule],
  controllers: [FirmeController],
  providers: [FirmeService, FirmeUploadsService],
})
export class FirmeModule {}
