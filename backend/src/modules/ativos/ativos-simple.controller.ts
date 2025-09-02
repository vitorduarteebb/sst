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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AtivosSimpleService } from './ativos-simple.service';
import { CreateAtivoDto } from './dto/create-ativo.dto';
import { UpdateAtivoDto } from './dto/update-ativo.dto';
import { AtivoFiltersDto } from './dto/ativo-filters.dto';
import { AtivoResponseDto } from './dto/ativo-response.dto';
import { AtivoListResponseDto } from './dto/ativo-list-response.dto';
import { AtivoTipo, AtivoStatus } from './dto/create-ativo.dto';

@ApiTags('Ativos')
@Controller('ativos')
export class AtivosSimpleController {
  constructor(private readonly ativosService: AtivosSimpleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar um novo ativo',
    description: 'Cria um novo ativo no sistema com validações de dados',
  })
  @ApiBody({
    type: CreateAtivoDto,
    description: 'Dados do ativo a ser criado',
  })
  @ApiResponse({
    status: 201,
    description: 'Ativo criado com sucesso',
    type: AtivoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou ativo já existe',
  })
  @ApiResponse({
    status: 404,
    description: 'Unidade não encontrada',
  })
  create(@Body() createAtivoDto: CreateAtivoDto): Promise<AtivoResponseDto> {
    return this.ativosService.create(createAtivoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os ativos',
    description: 'Retorna uma lista paginada de ativos com filtros opcionais',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca por nome, descrição, marca, modelo ou número de série',
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    enum: AtivoTipo,
    description: 'Filtrar por tipo de ativo',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: AtivoStatus,
    description: 'Filtrar por status do ativo',
  })
  @ApiQuery({
    name: 'unidadeId',
    required: false,
    description: 'Filtrar por ID da unidade',
  })
  @ApiQuery({
    name: 'marca',
    required: false,
    description: 'Filtrar por marca',
  })
  @ApiQuery({
    name: 'modelo',
    required: false,
    description: 'Filtrar por modelo',
  })
  @ApiQuery({
    name: 'valorMinimo',
    required: false,
    description: 'Valor mínimo de aquisição',
  })
  @ApiQuery({
    name: 'valorMaximo',
    required: false,
    description: 'Valor máximo de aquisição',
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
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Campo para ordenação',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Direção da ordenação',
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ativos retornada com sucesso',
    type: AtivoListResponseDto,
  })
  findAll(@Query() filters: AtivoFiltersDto): Promise<AtivoListResponseDto> {
    return this.ativosService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obter estatísticas dos ativos',
    description: 'Retorna estatísticas gerais dos ativos no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  getStats() {
    return this.ativosService.getStats();
  }

  @Get('stats/unidade/:unidadeId')
  @ApiOperation({
    summary: 'Obter estatísticas dos ativos por unidade',
    description: 'Retorna estatísticas dos ativos de uma unidade específica',
  })
  @ApiParam({
    name: 'unidadeId',
    description: 'ID da unidade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas da unidade retornadas com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Unidade não encontrada',
  })
  getStatsByUnidade(@Param('unidadeId') unidadeId: string) {
    return this.ativosService.getStatsByUnidade(unidadeId);
  }

  @Get('stats/tipo/:tipo')
  @ApiOperation({
    summary: 'Obter estatísticas dos ativos por tipo',
    description: 'Retorna estatísticas dos ativos de um tipo específico',
  })
  @ApiParam({
    name: 'tipo',
    enum: AtivoTipo,
    description: 'Tipo do ativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas do tipo retornadas com sucesso',
  })
  getStatsByTipo(@Param('tipo') tipo: AtivoTipo) {
    return this.ativosService.getStatsByTipo(tipo);
  }

  @Get('unidade/:unidadeId')
  @ApiOperation({
    summary: 'Listar ativos por unidade',
    description: 'Retorna todos os ativos de uma unidade específica',
  })
  @ApiParam({
    name: 'unidadeId',
    description: 'ID da unidade',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativos da unidade retornados com sucesso',
    type: [AtivoResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Unidade não encontrada',
  })
  findByUnidade(@Param('unidadeId') unidadeId: string): Promise<AtivoResponseDto[]> {
    return this.ativosService.findByUnidade(unidadeId);
  }

  @Get('tipo/:tipo')
  @ApiOperation({
    summary: 'Listar ativos por tipo',
    description: 'Retorna todos os ativos de um tipo específico',
  })
  @ApiParam({
    name: 'tipo',
    enum: AtivoTipo,
    description: 'Tipo do ativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativos do tipo retornados com sucesso',
    type: [AtivoResponseDto],
  })
  findByTipo(@Param('tipo') tipo: AtivoTipo): Promise<AtivoResponseDto[]> {
    return this.ativosService.findByTipo(tipo);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Listar ativos por status',
    description: 'Retorna todos os ativos de um status específico',
  })
  @ApiParam({
    name: 'status',
    enum: AtivoStatus,
    description: 'Status do ativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativos do status retornados com sucesso',
    type: [AtivoResponseDto],
  })
  findByStatus(@Param('status') status: AtivoStatus): Promise<AtivoResponseDto[]> {
    return this.ativosService.findByStatus(status);
  }

  @Get('marca/:marca')
  @ApiOperation({
    summary: 'Listar ativos por marca',
    description: 'Retorna todos os ativos de uma marca específica',
  })
  @ApiParam({
    name: 'marca',
    description: 'Marca do ativo',
    example: 'Pyrex',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativos da marca retornados com sucesso',
    type: [AtivoResponseDto],
  })
  findByMarca(@Param('marca') marca: string): Promise<AtivoResponseDto[]> {
    return this.ativosService.findByMarca(marca);
  }

  @Get('modelo/:modelo')
  @ApiOperation({
    summary: 'Listar ativos por modelo',
    description: 'Retorna todos os ativos de um modelo específico',
  })
  @ApiParam({
    name: 'modelo',
    description: 'Modelo do ativo',
    example: 'ABC-6',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativos do modelo retornados com sucesso',
    type: [AtivoResponseDto],
  })
  findByModelo(@Param('modelo') modelo: string): Promise<AtivoResponseDto[]> {
    return this.ativosService.findByModelo(modelo);
  }

  @Get('valor-range')
  @ApiOperation({
    summary: 'Listar ativos por faixa de valor',
    description: 'Retorna ativos dentro de uma faixa de valor de aquisição',
  })
  @ApiQuery({
    name: 'valorMinimo',
    required: true,
    description: 'Valor mínimo',
    example: 100,
  })
  @ApiQuery({
    name: 'valorMaximo',
    required: true,
    description: 'Valor máximo',
    example: 1000,
  })
  @ApiResponse({
    status: 200,
    description: 'Ativos da faixa de valor retornados com sucesso',
    type: [AtivoResponseDto],
  })
  findByValorRange(
    @Query('valorMinimo') valorMinimo: number,
    @Query('valorMaximo') valorMaximo: number,
  ): Promise<AtivoResponseDto[]> {
    return this.ativosService.findByValorRange(valorMinimo, valorMaximo);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter um ativo específico',
    description: 'Retorna um ativo pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativo retornado com sucesso',
    type: AtivoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  findOne(@Param('id') id: string): Promise<AtivoResponseDto> {
    return this.ativosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um ativo',
    description: 'Atualiza os dados de um ativo existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateAtivoDto,
    description: 'Dados do ativo a ser atualizado',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativo atualizado com sucesso',
    type: AtivoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou ativo já existe',
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  update(
    @Param('id') id: string,
    @Body() updateAtivoDto: UpdateAtivoDto,
  ): Promise<AtivoResponseDto> {
    return this.ativosService.update(id, updateAtivoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover um ativo',
    description: 'Remove um ativo do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Ativo removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.ativosService.remove(id);
  }

  // Endpoints de controle de status
  @Patch(':id/ativar')
  @ApiOperation({
    summary: 'Ativar um ativo',
    description: 'Altera o status de um ativo para ATIVO',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativo ativado com sucesso',
    type: AtivoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  ativar(@Param('id') id: string): Promise<AtivoResponseDto> {
    return this.ativosService.ativar(id);
  }

  @Patch(':id/desativar')
  @ApiOperation({
    summary: 'Desativar um ativo',
    description: 'Altera o status de um ativo para INATIVO',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativo desativado com sucesso',
    type: AtivoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  desativar(@Param('id') id: string): Promise<AtivoResponseDto> {
    return this.ativosService.desativar(id);
  }

  @Patch(':id/manutencao')
  @ApiOperation({
    summary: 'Colocar ativo em manutenção',
    description: 'Altera o status de um ativo para MANUTENCAO',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativo colocado em manutenção com sucesso',
    type: AtivoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  colocarEmManutencao(@Param('id') id: string): Promise<AtivoResponseDto> {
    return this.ativosService.colocarEmManutencao(id);
  }

  @Patch(':id/fora-de-uso')
  @ApiOperation({
    summary: 'Colocar ativo fora de uso',
    description: 'Altera o status de um ativo para FORA_DE_USO',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativo colocado fora de uso com sucesso',
    type: AtivoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  colocarForaDeUso(@Param('id') id: string): Promise<AtivoResponseDto> {
    return this.ativosService.colocarForaDeUso(id);
  }

  @Patch(':id/descartar')
  @ApiOperation({
    summary: 'Descartar um ativo',
    description: 'Altera o status de um ativo para DESCARTADO',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ativo descartado com sucesso',
    type: AtivoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo não encontrado',
  })
  descartar(@Param('id') id: string): Promise<AtivoResponseDto> {
    return this.ativosService.descartar(id);
  }
}
