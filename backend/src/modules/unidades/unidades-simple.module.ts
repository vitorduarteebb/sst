import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesSimpleController } from './unidades-simple.controller';
import { UnidadesSimpleService } from './unidades-simple.service';
import { UnidadesController } from './unidades.controller';
import { UnidadesService } from './unidades.service';
import { Unidade } from '../../entities/Unidade';

@Module({
  imports: [TypeOrmModule.forFeature([Unidade])],
  controllers: [UnidadesSimpleController, UnidadesController],
  providers: [UnidadesSimpleService, UnidadesService],
  exports: [UnidadesSimpleService, UnidadesService]
})
export class UnidadesSimpleModule {}
