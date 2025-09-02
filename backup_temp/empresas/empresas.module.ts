import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { Empresa } from '../../entities/Empresa';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  controllers: [EmpresasController],
  providers: [EmpresasService],
  exports: [EmpresasService],
})
export class EmpresasModule {}
