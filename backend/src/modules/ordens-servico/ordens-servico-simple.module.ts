import { Module } from '@nestjs/common';
import { OrdensServicoSimpleController } from './ordens-servico-simple.controller';
import { OrdensServicoSimpleService } from './ordens-servico-simple.service';

@Module({
  controllers: [OrdensServicoSimpleController],
  providers: [OrdensServicoSimpleService],
  exports: [OrdensServicoSimpleService],
})
export class OrdensServicoSimpleModule {}
