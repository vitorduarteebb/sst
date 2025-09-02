import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import {
  CreateAssetDto,
  UpdateAssetDto,
  AssetResponseDto,
  AssetFilterDto,
} from './dto/asset.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Ativos')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo ativo' })
  @ApiResponse({ status: 201, description: 'Ativo criado com sucesso', type: AssetResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Número de série já existe' })
  async create(@Body() createAssetDto: CreateAssetDto): Promise<AssetResponseDto> {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ativos com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de ativos', type: [AssetResponseDto] })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome, descrição ou número de série' })
  @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filtrar por prioridade' })
  @ApiQuery({ name: 'manufacturer', required: false, description: 'Filtrar por fabricante' })
  @ApiQuery({ name: 'location', required: false, description: 'Filtrar por localização' })
  @ApiQuery({ name: 'serialNumber', required: false, description: 'Filtrar por número de série' })
  async findAll(@Query() filters: AssetFilterDto): Promise<AssetResponseDto[]> {
    return this.assetsService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos ativos' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos ativos' })
  async getStats() {
    return this.assetsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter ativo por ID' })
  @ApiResponse({ status: 200, description: 'Ativo encontrado', type: AssetResponseDto })
  @ApiResponse({ status: 404, description: 'Ativo não encontrado' })
  async findOne(@Param('id') id: string): Promise<AssetResponseDto> {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ativo' })
  @ApiResponse({ status: 200, description: 'Ativo atualizado com sucesso', type: AssetResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Ativo não encontrado' })
  @ApiResponse({ status: 409, description: 'Número de série já existe' })
  async update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ): Promise<AssetResponseDto> {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status do ativo (ativo/inativo)' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso', type: AssetResponseDto })
  @ApiResponse({ status: 404, description: 'Ativo não encontrado' })
  async toggleStatus(@Param('id') id: string): Promise<AssetResponseDto> {
    return this.assetsService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover ativo (soft delete)' })
  @ApiResponse({ status: 204, description: 'Ativo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Ativo não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.assetsService.remove(id);
  }

  @Get('check/serial/:serialNumber')
  @ApiOperation({ summary: 'Verificar disponibilidade de número de série' })
  @ApiResponse({ status: 200, description: 'Número de série disponível ou não' })
  async checkSerialNumberAvailability(@Param('serialNumber') serialNumber: string) {
    return this.assetsService.checkSerialNumberAvailability(serialNumber);
  }
}
