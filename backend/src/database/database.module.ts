import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTypeOrmConfig } from '../config/typeorm.config';
import { User } from '../entities/User';
import { Empresa } from '../entities/Empresa';
import { Unidade } from '../entities/Unidade';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => createTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Empresa, Unidade]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
