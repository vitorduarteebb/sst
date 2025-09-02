import { Module } from '@nestjs/common';
import { AtivosSimpleController } from './ativos-simple.controller';
import { AtivosSimpleService } from './ativos-simple.service';

@Module({
  controllers: [AtivosSimpleController],
  providers: [AtivosSimpleService],
  exports: [AtivosSimpleService],
})
export class AtivosSimpleModule {}
