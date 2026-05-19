import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Scanare } from '../scanari/scanare.entity';
import { CodQr } from './cod-qr.entity';
import { CoduriQrController } from './coduri-qr.controller';
import { CoduriQrService } from './coduri-qr.service';

@Module({
  imports: [TypeOrmModule.forFeature([CodQr, Scanare]), AuthModule],
  controllers: [CoduriQrController],
  providers: [CoduriQrService],
})
export class CoduriQrModule {}
