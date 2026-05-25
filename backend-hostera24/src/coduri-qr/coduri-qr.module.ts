import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Firma } from '../firme/firma.entity';
import { Scanare } from '../scanari/scanare.entity';
import { VizitaPaginaQr } from '../vizite-pagina/vizita-pagina-qr.entity';
import { CodQr } from './cod-qr.entity';
import { CoduriQrController } from './coduri-qr.controller';
import { CoduriQrPublicController } from './coduri-qr-public.controller';
import { CoduriQrService } from './coduri-qr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CodQr, Scanare, VizitaPaginaQr, Firma]),
    AuthModule,
  ],
  controllers: [CoduriQrController, CoduriQrPublicController],
  providers: [CoduriQrService],
})
export class CoduriQrModule {}
