import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { getUploadsRoot } from './common/uploads.util';
import { AuthModule } from './auth/auth.module';
import { HttpLoggerMiddleware } from './common/http-logger.middleware';
import { CodQr } from './coduri-qr/cod-qr.entity';
import { CoduriQrModule } from './coduri-qr/coduri-qr.module';
import { Firma } from './firme/firma.entity';
import { FirmeModule } from './firme/firme.module';
import { Scanare } from './scanari/scanare.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '..', '.env'),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: getUploadsRoot(config),
          serveRoot: '/uploads',
          serveStaticOptions: { index: false, fallthrough: true },
        },
      ],
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
    FirmeModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
