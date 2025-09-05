import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const createTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  
  if (isProduction) {
    // Configuração para produção (PostgreSQL)
    return {
      type: 'postgres',
      host: configService.get('DB_HOST', 'localhost'),
      port: configService.get('DB_PORT', 5432),
      username: configService.get('DB_USERNAME', 'postgres'),
      password: configService.get('DB_PASSWORD', 'password'),
      database: configService.get('DB_NAME', 'sst_platform'),
      
      // Entidades
      entities: [
        'src/entities/**/*.entity.ts',
        'dist/entities/**/*.entity.js'
      ],
      
      // Migrações
      migrations: [
        'src/migrations/**/*.ts',
        'dist/migrations/**/*.js'
      ],
      
      // Configurações de produção
      synchronize: true, // Temporariamente true para criar tabelas
      logging: true,
      ssl: {
        rejectUnauthorized: false
      },
      
      // Pool de conexões
      extra: {
        connectionLimit: 20,
        acquireTimeout: 60000,
        timeout: 60000,
      }
    };
  } else {
    // Configuração para desenvolvimento (SQLite)
    return {
      type: 'sqlite',
      database: 'database.sqlite',
      
      // Entidades
      entities: [
        'src/entities/**/*.entity.ts',
        'dist/entities/**/*.entity.js'
      ],
      
      // Migrações
      migrations: [
        'src/migrations/**/*.ts',
        'dist/migrations/**/*.js'
      ],
      
      // Configurações de desenvolvimento
      synchronize: true,
      logging: true,
    };
  }
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [
    'src/entities/**/*.entity.ts',
    'dist/entities/**/*.entity.js'
  ],
  migrations: [
    'src/migrations/**/*.ts',
    'dist/migrations/**/*.js'
  ],
  synchronize: true,
  logging: true,
};
