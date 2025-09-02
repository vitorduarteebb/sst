import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdensServicoSimpleService } from './ordens-servico-simple.service';

@ApiTags('Ordens de Serviço')
@Controller('ordens-servico')
export class OrdensServicoSimpleController {
  constructor(private readonly ordensServicoService: OrdensServicoSimpleService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar ordens de serviço',
    description: 'Retorna todas as ordens de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso',
  })
  async findAll() {
    return this.ordensServicoService.findAll();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obter estatísticas das ordens de serviço',
    description: 'Retorna estatísticas gerais das ordens de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  async getStats() {
    return this.ordensServicoService.getStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar ordem de serviço por ID',
    description: 'Retorna uma ordem de serviço específica pelo seu ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de serviço não encontrada',
  })
  async findOne(@Param('id') id: string) {
    return this.ordensServicoService.findOne(id);
  }
}
