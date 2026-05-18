import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CodQr } from './coduri-qr/cod-qr.entity';
import { CoduriQrModule } from './coduri-qr/coduri-qr.module';
import { Firma } from './firme/firma.entity';
import { Scanare } from './scanari/scanare.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '..', '.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: parseInt(config.get<string>('DATABASE_PORT', '3306'), 10),
        username: config.get<string>('DATABASE_USER', 'hostera24'),
        password: config.get<string>('DATABASE_PASSWORD', 'hostera24'),
        database: config.get<string>('DATABASE_NAME', 'hostera24'),
        charset: 'utf8mb4',
        entities: [Firma, CodQr, Scanare],
        synchronize: false,
      }),
    }),
    AuthModule,
    CoduriQrModule,
  ],
})
export class AppModule {}
