import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { OrdensServicoSimpleService } from './ordens-servico-simple.service';
import { CreateOrdemServicoDto } from './dto/create-ordem-servico.dto';
import { UpdateOrdemServicoDto } from './dto/update-ordem-servico.dto';
import { OrdemServicoResponseDto } from './dto/ordem-servico-response.dto';
import { OrdemServicoListResponseDto } from './dto/ordem-servico-list-response.dto';
import { OrdemServicoFiltersDto } from './dto/ordem-servico-filters.dto';
import { OrdemServicoStatus, OrdemServicoPrioridade, OrdemServicoTipo } from './dto/create-ordem-servico.dto';

@ApiTags('Ordens de Serviço')
@Controller('ordens-servico')
export class OrdensServicoSimpleController {
  constructor(private readonly ordensServicoService: OrdensServicoSimpleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova ordem de serviço',
    description: 'Cria uma nova ordem de serviço com os dados fornecidos',
  })
  @ApiBody({
    type: CreateOrdemServicoDto,
    description: 'Dados da ordem de serviço a ser criada',
  })
  @ApiResponse({
    status: 201,
    description: 'Ordem de serviço criada com sucesso',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Responsável, unidade, empresa ou ativo não encontrado',
  })
  async create(
    @Body() createOrdemServicoDto: CreateOrdemServicoDto,
  ): Promise<OrdemServicoResponseDto> {
    return this.ordensServicoService.create(createOrdemServicoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar ordens de serviço',
    description: 'Retorna uma lista paginada de ordens de serviço com filtros opcionais',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca por título, descrição ou observações',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrdemServicoStatus,
    description: 'Filtrar por status',
  })
  @ApiQuery({
    name: 'prioridade',
    required: false,
    enum: OrdemServicoPrioridade,
    description: 'Filtrar por prioridade',
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    enum: OrdemServicoTipo,
    description: 'Filtrar por tipo',
  })
  @ApiQuery({
    name: 'responsavelId',
    required: false,
    description: 'Filtrar por ID do responsável',
  })
  @ApiQuery({
    name: 'unidadeId',
    required: false,
    description: 'Filtrar por ID da unidade',
  })
  @ApiQuery({
    name: 'ativoId',
    required: false,
    description: 'Filtrar por ID do ativo',
  })
  @ApiQuery({
    name: 'empresaId',
    required: false,
    description: 'Filtrar por ID da empresa',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso',
    type: OrdemServicoListResponseDto,
  })
  async findAll(@Query() filters: OrdemServicoFiltersDto): Promise<OrdemServicoListResponseDto> {
    return this.ordensServicoService.findAll(filters);
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

  @Get('status/:status')
  @ApiOperation({
    summary: 'Listar ordens de serviço por status',
    description: 'Retorna todas as ordens de serviço com o status especificado',
  })
  @ApiParam({
    name: 'status',
    enum: OrdemServicoStatus,
    description: 'Status das ordens de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso',
    type: [OrdemServicoResponseDto],
  })
  async findByStatus(@Param('status') status: OrdemServicoStatus): Promise<OrdemServicoResponseDto[]> {
    return this.ordensServicoService.findByStatus(status);
  }

  @Get('prioridade/:prioridade')
  @ApiOperation({
    summary: 'Listar ordens de serviço por prioridade',
    description: 'Retorna todas as ordens de serviço com a prioridade especificada',
  })
  @ApiParam({
    name: 'prioridade',
    enum: OrdemServicoPrioridade,
    description: 'Prioridade das ordens de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso',
    type: [OrdemServicoResponseDto],
  })
  async findByPrioridade(@Param('prioridade') prioridade: OrdemServicoPrioridade): Promise<OrdemServicoResponseDto[]> {
    return this.ordensServicoService.findByPrioridade(prioridade);
  }

  @Get('tipo/:tipo')
  @ApiOperation({
    summary: 'Listar ordens de serviço por tipo',
    description: 'Retorna todas as ordens de serviço com o tipo especificado',
  })
  @ApiParam({
    name: 'tipo',
    enum: OrdemServicoTipo,
    description: 'Tipo das ordens de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso',
    type: [OrdemServicoResponseDto],
  })
  async findByTipo(@Param('tipo') tipo: OrdemServicoTipo): Promise<OrdemServicoResponseDto[]> {
    return this.ordensServicoService.findByTipo(tipo);
  }

  @Get('responsavel/:responsavelId')
  @ApiOperation({
    summary: 'Listar ordens de serviço por responsável',
    description: 'Retorna todas as ordens de serviço do responsável especificado',
  })
  @ApiParam({
    name: 'responsavelId',
    description: 'ID do responsável',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso',
    type: [OrdemServicoResponseDto],
  })
  async findByResponsavel(@Param('responsavelId') responsavelId: string): Promise<OrdemServicoResponseDto[]> {
    return this.ordensServicoService.findByResponsavel(responsavelId);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({
    summary: 'Listar ordens de serviço por unidade',
    description: 'Retorna todas as ordens de serviço da unidade especificada',
  })
  @ApiParam({
    name: 'unidadeId',
    description: 'ID da unidade',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso',
    type: [OrdemServicoResponseDto],
  })
  async findByUnidade(@Param('unidadeId') unidadeId: string): Promise<OrdemServicoResponseDto[]> {
    return this.ordensServicoService.findByUnidade(unidadeId);
  }

  @Get('empresa/:empresaId')
  @ApiOperation({
    summary: 'Listar ordens de serviço por empresa',
    description: 'Retorna todas as ordens de serviço da empresa especificada',
  })
  @ApiParam({
    name: 'empresaId',
    description: 'ID da empresa',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço retornada com sucesso',
    type: [OrdemServicoResponseDto],
  })
  async findByEmpresa(@Param('empresaId') empresaId: string): Promise<OrdemServicoResponseDto[]> {
    return this.ordensServicoService.findByEmpresa(empresaId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar ordem de serviço por ID',
    description: 'Retorna uma ordem de serviço específica pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço encontrada com sucesso',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de serviço não encontrada',
  })
  async findOne(@Param('id') id: string): Promise<OrdemServicoResponseDto> {
    return this.ordensServicoService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar ordem de serviço',
    description: 'Atualiza uma ordem de serviço existente com os dados fornecidos',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
  })
  @ApiBody({
    type: UpdateOrdemServicoDto,
    description: 'Dados para atualização da ordem de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço atualizada com sucesso',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de serviço não encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrdemServicoDto: UpdateOrdemServicoDto,
  ): Promise<OrdemServicoResponseDto> {
    return this.ordensServicoService.update(id, updateOrdemServicoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover ordem de serviço',
    description: 'Remove uma ordem de serviço pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
  })
  @ApiResponse({
    status: 204,
    description: 'Ordem de serviço removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de serviço não encontrada',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.ordensServicoService.remove(id);
  }

  // Endpoints de controle de status
  @Put(':id/iniciar')
  @ApiOperation({
    summary: 'Iniciar ordem de serviço',
    description: 'Altera o status da ordem de serviço para "Em Andamento"',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço iniciada com sucesso',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de serviço não encontrada',
  })
  async iniciar(@Param('id') id: string): Promise<OrdemServicoResponseDto> {
    return this.ordensServicoService.iniciar(id);
  }

  @Put(':id/pausar')
  @ApiOperation({
    summary: 'Pausar ordem de serviço',
    description: 'Altera o status da ordem de serviço para "Pausada"',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço pausada com sucesso',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de serviço não encontrada',
  })
  async pausar(@Param('id') id: string): Promise<OrdemServicoResponseDto> {
    return this.ordensServicoService.pausar(id);
  }

  @Put(':id/concluir')
  @ApiOperation({
    summary: 'Concluir ordem de serviço',
    description: 'Altera o status da ordem de serviço para "Concluída"',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço concluída com sucesso',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de serviço não encontrada',
  })
  async concluir(@Param('id') id: string): Promise<OrdemServicoResponseDto> {
    return this.ordensServicoService.concluir(id);
  }

  @Put(':id/cancelar')
  @ApiOperation({
    summary: 'Cancelar ordem de serviço',
    description: 'Altera o status da ordem de serviço para "Cancelada"',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço cancelada com sucesso',
    type: OrdemServicoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem de serviço não encontrada',
  })
  async cancelar(@Param('id') id: string): Promise<OrdemServicoResponseDto> {
    return this.ordensServicoService.cancelar(id);
  }
}
