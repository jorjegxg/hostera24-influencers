import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Firma } from '../firme/firma.entity';
import { Angajat } from './angajat.entity';
import { AngajatiController } from './angajati.controller';
import { AngajatiService } from './angajati.service';

@Module({
  imports: [TypeOrmModule.forFeature([Angajat, Firma]), AuthModule],
  controllers: [AngajatiController],
  providers: [AngajatiService],
  exports: [AngajatiService],
})
export class AngajatiModule {}
