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
import { EmpresasService } from './empresas.service';
import {
  CreateEmpresaDto,
  UpdateEmpresaDto,
  EmpresaResponseDto,
  EmpresaFilterDto,
} from './dto/empresa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Empresas')
@Controller('empresas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova empresa' })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso', type: EmpresaResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'CNPJ já existe' })
  async create(@Body() createEmpresaDto: CreateEmpresaDto): Promise<EmpresaResponseDto> {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar empresas com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de empresas', type: [EmpresaResponseDto] })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por razão social, nome fantasia ou CNPJ' })
  @ApiQuery({ name: 'cidade', required: false, description: 'Filtrar por cidade' })
  @ApiQuery({ name: 'uf', required: false, description: 'Filtrar por UF' })
  @ApiQuery({ name: 'ativo', required: false, description: 'Filtrar por status ativo' })
  @ApiQuery({ name: 'observacoes', required: false, description: 'Filtrar por observações' })
  async findAll(@Query() filters: EmpresaFilterDto): Promise<EmpresaResponseDto[]> {
    return this.empresasService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas das empresas' })
  @ApiResponse({ status: 200, description: 'Estatísticas das empresas' })
  async getStats() {
    return this.empresasService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada', type: EmpresaResponseDto })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async findOne(@Param('id') id: string): Promise<EmpresaResponseDto> {
    return this.empresasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar empresa' })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso', type: EmpresaResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 409, description: 'CNPJ já existe' })
  async update(
    @Param('id') id: string,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<EmpresaResponseDto> {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Alternar status da empresa (ativo/inativo)' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso', type: EmpresaResponseDto })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async toggleStatus(@Param('id') id: string): Promise<EmpresaResponseDto> {
    return this.empresasService.toggleStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover empresa (soft delete)' })
  @ApiResponse({ status: 204, description: 'Empresa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.empresasService.remove(id);
  }

  @Get('check/cnpj/:cnpj')
  @ApiOperation({ summary: 'Verificar disponibilidade de CNPJ' })
  @ApiResponse({ status: 200, description: 'CNPJ disponível ou não' })
  async checkCnpjAvailability(@Param('cnpj') cnpj: string) {
    return this.empresasService.checkCnpjAvailability(cnpj);
  }
}
