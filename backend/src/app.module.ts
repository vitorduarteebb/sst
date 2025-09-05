import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { OrdensServicoSimpleModule } from './modules/ordens-servico/ordens-servico-simple.module';
import { AssinaturasModule } from './modules/assinaturas/assinaturas.module';
import { AuthModule } from './auth/auth.module';
import { CertificadosModule } from './modules/certificados/certificados.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Configurações globais
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Banco de dados
    DatabaseModule,

    // Módulos da aplicação
    AuthModule, // Módulo de Autenticação JWT
    UsersModule, // Módulo de Usuários
    OrdensServicoSimpleModule, // Módulo de Ordens de Serviço
    AssinaturasModule, // Módulo de Assinaturas Offline
    CertificadosModule, // Módulo de Certificados
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
