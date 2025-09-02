import { Module } from '@nestjs/common';
import { UnidadesSimpleController } from './unidades-simple.controller';
import { UnidadesSimpleService } from './unidades-simple.service';

@Module({
  controllers: [UnidadesSimpleController],
  providers: [UnidadesSimpleService],
  exports: [UnidadesSimpleService]
})
export class UnidadesSimpleModule {}
