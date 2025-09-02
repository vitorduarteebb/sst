import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Configurar prefixo da API
  app.setGlobalPrefix('api/v1');

  // Configurar middleware para servir arquivos estáticos
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('SST Platform API')
    .setDescription('API da Plataforma SST - Sistema de Segurança do Trabalho')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log('🚀 Backend rodando em: http://localhost:3001');
  console.log('📚 Swagger disponível em: http://localhost:3001/api');
}
bootstrap();
