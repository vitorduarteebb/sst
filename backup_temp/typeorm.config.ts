import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'sst_platform',
  
  // Configurações PostGIS
  extra: {
    // Habilita extensão PostGIS
    postgis: true,
    // Configurações de pool de conexões
    max: 20, // Máximo de conexões
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
  
  // Entidades
  entities: [
    'src/entities/**/*.ts',
    'dist/entities/**/*.js'
  ],
  
  // Migrações
  migrations: [
    'src/migrations/**/*.ts',
    'dist/migrations/**/*.js'
  ],
  
  // Configurações de sincronização (apenas para desenvolvimento)
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  
  // Configurações de SSL (para produção)
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
};
