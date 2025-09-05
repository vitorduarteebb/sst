import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UnidadesService, CreateUnidadeDto, UpdateUnidadeDto, UnidadeResponseDto } from './unidades.service';

@ApiTags('Unidades')
@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar unidade', description: 'Cria uma nova unidade' })
  @ApiResponse({ status: 201, description: 'Unidade criada com sucesso', type: UnidadeResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createUnidadeDto: CreateUnidadeDto): Promise<UnidadeResponseDto> {
    return this.unidadesService.create(createUnidadeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar unidades', description: 'Lista todas as unidades' })
  @ApiResponse({ status: 200, description: 'Lista de unidades retornada com sucesso', type: [UnidadeResponseDto] })
  async findAll(): Promise<UnidadeResponseDto[]> {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar unidade', description: 'Busca uma unidade por ID' })
  @ApiParam({ name: 'id', description: 'ID da unidade' })
  @ApiResponse({ status: 200, description: 'Unidade encontrada', type: UnidadeResponseDto })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  async findOne(@Param('id') id: string): Promise<UnidadeResponseDto> {
    return this.unidadesService.findOne(id);
  }

  @Get('empresa/:empresaId')
  @ApiOperation({ summary: 'Unidades por empresa', description: 'Lista todas as unidades de uma empresa específica' })
  @ApiParam({ name: 'empresaId', description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de unidades da empresa retornada com sucesso', type: [UnidadeResponseDto] })
  async findByEmpresa(@Param('empresaId') empresaId: string): Promise<UnidadeResponseDto[]> {
    return this.unidadesService.findByEmpresa(empresaId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar unidade', description: 'Atualiza uma unidade existente' })
  @ApiParam({ name: 'id', description: 'ID da unidade' })
  @ApiResponse({ status: 200, description: 'Unidade atualizada com sucesso', type: UnidadeResponseDto })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  async update(@Param('id') id: string, @Body() updateUnidadeDto: UpdateUnidadeDto): Promise<UnidadeResponseDto> {
    return this.unidadesService.update(id, updateUnidadeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir unidade', description: 'Exclui uma unidade' })
  @ApiParam({ name: 'id', description: 'ID da unidade' })
  @ApiResponse({ status: 204, description: 'Unidade excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Unidade não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.unidadesService.remove(id);
  }
}
