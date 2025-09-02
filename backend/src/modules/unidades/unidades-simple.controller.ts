import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { UnidadesSimpleService, UnidadeSimple, UnidadeListResponse } from './unidades-simple.service';

@ApiTags('Unidades')
@Controller('unidades')
export class UnidadesSimpleController {
  constructor(private readonly unidadesService: UnidadesSimpleService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova unidade',
    description: 'Cria uma nova unidade no sistema'
  })
  @ApiBody({
    description: 'Dados da unidade a ser criada',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Filial São Paulo' },
        endereco: { type: 'string', example: 'Rua das Flores, 123' },
        cidade: { type: 'string', example: 'São Paulo' },
        estado: { type: 'string', example: 'SP' },
        status: { 
          type: 'string', 
          enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'SUSPENDED', 'CLOSED'],
          example: 'ACTIVE'
        },
        tipo: { 
          type: 'string', 
          enum: ['FILIAL', 'MATRIZ', 'DEPOSITO', 'ESCRITORIO', 'FABRICA', 'OBRA', 'OFICINA', 'LABORATORIO', 'ALMOXARIFADO', 'GARAGEM', 'OUTRO'],
          example: 'FILIAL'
        },
        empresaId: { type: 'string', example: 'empresa-1' }
      },
      required: ['nome', 'status', 'tipo', 'empresaId']
    }
  })
  @ApiCreatedResponse({
    description: 'Unidade criada com sucesso',
    type: 'object'
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos'
  })
  async create(@Body() createUnidadeDto: any): Promise<UnidadeSimple> {
    return this.unidadesService.create(createUnidadeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar unidades',
    description: 'Lista todas as unidades com filtros e paginação'
  })
  @ApiQuery({
    name: 'empresaId',
    required: false,
    description: 'ID da empresa para filtrar unidades',
    type: String
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    description: 'Tipo da unidade para filtrar',
    type: String
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Status da unidade para filtrar',
    type: String
  })
  @ApiQuery({
    name: 'cidade',
    required: false,
    description: 'Cidade para filtrar unidades',
    type: String
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    description: 'Estado (UF) para filtrar unidades',
    type: String
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca para nome ou cidade',
    type: String
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página',
    type: Number,
    example: 10
  })
  @ApiOkResponse({
    description: 'Lista de unidades retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nome: { type: 'string' },
              endereco: { type: 'string' },
              cidade: { type: 'string' },
              estado: { type: 'string' },
              status: { type: 'string' },
              tipo: { type: 'string' },
              empresaId: { type: 'string' },
              empresaNome: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  })
  async findAll(
    @Query('empresaId') empresaId?: string,
    @Query('tipo') tipo?: string,
    @Query('status') status?: string,
    @Query('cidade') cidade?: string,
    @Query('estado') estado?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
  ): Promise<UnidadeListResponse> {
    const filters = {
      empresaId,
      tipo,
      status,
      cidade,
      estado,
      search
    };

    return this.unidadesService.findAll(filters, page, limit);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Estatísticas das unidades',
    description: 'Retorna estatísticas gerais das unidades'
  })
  @ApiOkResponse({
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        maintenance: { type: 'number' },
        suspended: { type: 'number' },
        closed: { type: 'number' }
      }
    }
  })
  async getStats() {
    return this.unidadesService.getStats();
  }

  @Get('empresa/:empresaId')
  @ApiOperation({
    summary: 'Unidades por empresa',
    description: 'Lista todas as unidades de uma empresa específica'
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa',
    type: String
  })
  @ApiOkResponse({
    description: 'Lista de unidades da empresa retornada com sucesso',
    type: [Object]
  })
  async findByEmpresa(@Param('empresaId') empresaId: string): Promise<UnidadeSimple[]> {
    return this.unidadesService.findByEmpresa(empresaId);
  }

  @Get('tipo/:tipo')
  @ApiOperation({
    summary: 'Unidades por tipo',
    description: 'Lista todas as unidades de um tipo específico'
  })
  @ApiParam({
    name: 'tipo',
    description: 'Tipo da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Lista de unidades do tipo retornada com sucesso',
    type: [Object]
  })
  async findByTipo(@Param('tipo') tipo: string): Promise<UnidadeSimple[]> {
    return this.unidadesService.findByTipo(tipo);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Unidades por status',
    description: 'Lista todas as unidades de um status específico'
  })
  @ApiParam({
    name: 'status',
    description: 'Status da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Lista de unidades do status retornada com sucesso',
    type: [Object]
  })
  async findByStatus(@Param('status') status: string): Promise<UnidadeSimple[]> {
    return this.unidadesService.findByStatus(status);
  }

  @Get('ativas')
  @ApiOperation({
    summary: 'Unidades ativas',
    description: 'Lista todas as unidades com status ativo'
  })
  @ApiOkResponse({
    description: 'Lista de unidades ativas retornada com sucesso',
    type: [Object]
  })
  async findActive(): Promise<UnidadeSimple[]> {
    return this.unidadesService.findActive();
  }

  @Get('inativas')
  @ApiOperation({
    summary: 'Unidades inativas',
    description: 'Lista todas as unidades com status inativo'
  })
  @ApiOkResponse({
    description: 'Lista de unidades inativas retornada com sucesso',
    type: [Object]
  })
  async findInactive(): Promise<UnidadeSimple[]> {
    return this.unidadesService.findInactive();
  }

  @Get('manutencao')
  @ApiOperation({
    summary: 'Unidades em manutenção',
    description: 'Lista todas as unidades com status de manutenção'
  })
  @ApiOkResponse({
    description: 'Lista de unidades em manutenção retornada com sucesso',
    type: [Object]
  })
  async findInMaintenance(): Promise<UnidadeSimple[]> {
    return this.unidadesService.findInMaintenance();
  }

  @Get('suspensas')
  @ApiOperation({
    summary: 'Unidades suspensas',
    description: 'Lista todas as unidades com status suspenso'
  })
  @ApiOkResponse({
    description: 'Lista de unidades suspensas retornada com sucesso',
    type: [Object]
  })
  async findSuspended(): Promise<UnidadeSimple[]> {
    return this.unidadesService.findSuspended();
  }

  @Get('fechadas')
  @ApiOperation({
    summary: 'Unidades fechadas',
    description: 'Lista todas as unidades com status fechado'
  })
  @ApiOkResponse({
    description: 'Lista de unidades fechadas retornada com sucesso',
    type: [Object]
  })
  async findClosed(): Promise<UnidadeSimple[]> {
    return this.unidadesService.findClosed();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar unidade por ID',
    description: 'Busca uma unidade específica pelo ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Unidade encontrada com sucesso',
    type: 'object'
  })
  @ApiNotFoundResponse({
    description: 'Unidade não encontrada'
  })
  async findOne(@Param('id') id: string): Promise<UnidadeSimple> {
    return this.unidadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar unidade',
    description: 'Atualiza uma unidade existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da unidade',
    type: String
  })
  @ApiBody({
    description: 'Dados da unidade a ser atualizada',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string' },
        endereco: { type: 'string' },
        cidade: { type: 'string' },
        estado: { type: 'string' },
        status: { type: 'string' },
        tipo: { type: 'string' },
        empresaId: { type: 'string' }
      }
    }
  })
  @ApiOkResponse({
    description: 'Unidade atualizada com sucesso',
    type: 'object'
  })
  @ApiNotFoundResponse({
    description: 'Unidade não encontrada'
  })
  async update(
    @Param('id') id: string,
    @Body() updateUnidadeDto: any
  ): Promise<UnidadeSimple> {
    return this.unidadesService.update(id, updateUnidadeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover unidade',
    description: 'Remove uma unidade do sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Unidade removida com sucesso'
  })
  @ApiNotFoundResponse({
    description: 'Unidade não encontrada'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.unidadesService.remove(id);
  }

  // Endpoints para controle de status
  @Patch(':id/ativar')
  @ApiOperation({
    summary: 'Ativar unidade',
    description: 'Ativa uma unidade inativa'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Unidade ativada com sucesso',
    type: 'object'
  })
  async activate(@Param('id') id: string): Promise<UnidadeSimple> {
    return this.unidadesService.activate(id);
  }

  @Patch(':id/inativar')
  @ApiOperation({
    summary: 'Inativar unidade',
    description: 'Inativa uma unidade ativa'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Unidade inativada com sucesso',
    type: 'object'
  })
  async deactivate(@Param('id') id: string): Promise<UnidadeSimple> {
    return this.unidadesService.deactivate(id);
  }

  @Patch(':id/manutencao')
  @ApiOperation({
    summary: 'Colocar unidade em manutenção',
    description: 'Coloca uma unidade em status de manutenção'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Unidade colocada em manutenção com sucesso',
    type: 'object'
  })
  async putInMaintenance(@Param('id') id: string): Promise<UnidadeSimple> {
    return this.unidadesService.putInMaintenance(id);
  }

  @Patch(':id/suspender')
  @ApiOperation({
    summary: 'Suspender unidade',
    description: 'Suspende uma unidade'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Unidade suspensa com sucesso',
    type: 'object'
  })
  async suspend(@Param('id') id: string): Promise<UnidadeSimple> {
    return this.unidadesService.suspend(id);
  }

  @Patch(':id/fechar')
  @ApiOperation({
    summary: 'Fechar unidade',
    description: 'Fecha uma unidade permanentemente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da unidade',
    type: String
  })
  @ApiOkResponse({
    description: 'Unidade fechada com sucesso',
    type: 'object'
  })
  async close(@Param('id') id: string): Promise<UnidadeSimple> {
    return this.unidadesService.close(id);
  }
}
