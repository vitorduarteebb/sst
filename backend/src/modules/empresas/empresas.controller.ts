import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmpresasService, CreateEmpresaDto, UpdateEmpresaDto, EmpresaResponseDto } from './empresas.service';

@ApiTags('Empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar empresa', description: 'Cria uma nova empresa' })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso', type: EmpresaResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou CNPJ já existe' })
  async create(@Body() createEmpresaDto: CreateEmpresaDto): Promise<EmpresaResponseDto> {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar empresas', description: 'Lista todas as empresas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas retornada com sucesso', type: [EmpresaResponseDto] })
  async findAll(): Promise<EmpresaResponseDto[]> {
    return this.empresasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa', description: 'Busca uma empresa por ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada', type: EmpresaResponseDto })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async findOne(@Param('id') id: string): Promise<EmpresaResponseDto> {
    return this.empresasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar empresa', description: 'Atualiza uma empresa existente' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso', type: EmpresaResponseDto })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou CNPJ já existe' })
  async update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto): Promise<EmpresaResponseDto> {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir empresa', description: 'Exclui uma empresa' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({ status: 204, description: 'Empresa excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.empresasService.remove(id);
  }
}
