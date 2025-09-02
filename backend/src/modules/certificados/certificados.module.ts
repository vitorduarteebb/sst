import { Module } from '@nestjs/common';
import { CertificadosController } from './certificados.controller';
import { CertificadosPublicController } from './certificados-public.controller';
import { CertificadosService } from './certificados.service';
import { PdfService } from './pdf.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'sst-secret-key',
        signOptions: { expiresIn: '1y' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CertificadosController, CertificadosPublicController],
  providers: [CertificadosService, PdfService],
  exports: [CertificadosService, PdfService],
})
export class CertificadosModule {}
