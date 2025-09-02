import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put,
  HttpCode,
  HttpStatus,
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AssinaturasService } from './assinaturas.service';
import { 
  CreateAssinaturaDto, 
  UpdateAssinaturaDto, 
  AssinaturaResponseDto,
  SincronizacaoResponseDto 
} from './dto/assinatura.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/dto/auth.dto';

@ApiTags('Assinaturas Offline')
@Controller('assinaturas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssinaturasController {
  constructor(private readonly assinaturasService: AssinaturasService) {}

  @Post()
  @Roles(UserRole.TECNICO, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Criar nova assinatura',
    description: 'Cria uma nova assinatura que será sincronizada quando houver conexão',
  })
  @ApiResponse({
    status: 201,
    description: 'Assinatura criada com sucesso',
    type: AssinaturaResponseDto,
  })
  async create(@Body() createAssinaturaDto: CreateAssinaturaDto): Promise<AssinaturaResponseDto> {
    return this.assinaturasService.create(createAssinaturaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as assinaturas',
    description: 'Retorna todas as assinaturas (pendentes, confirmadas e com erro)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de assinaturas retornada com sucesso',
    type: [AssinaturaResponseDto],
  })
  async findAll(): Promise<AssinaturaResponseDto[]> {
    return this.assinaturasService.findAll();
  }

  @Get('pending')
  @ApiOperation({
    summary: 'Listar assinaturas pendentes',
    description: 'Retorna apenas as assinaturas que ainda não foram sincronizadas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de assinaturas pendentes retornada com sucesso',
    type: [AssinaturaResponseDto],
  })
  async findPending(): Promise<AssinaturaResponseDto[]> {
    return this.assinaturasService.findPending();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obter estatísticas das assinaturas',
    description: 'Retorna estatísticas gerais das assinaturas (total, pendentes, confirmadas, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  async getStats() {
    return this.assinaturasService.getStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar assinatura por ID',
    description: 'Retorna uma assinatura específica pelo seu ID',
  })
  @ApiParam({ name: 'id', description: 'ID da assinatura' })
  @ApiResponse({
    status: 200,
    description: 'Assinatura encontrada com sucesso',
    type: AssinaturaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Assinatura não encontrada',
  })
  async findOne(@Param('id') id: string): Promise<AssinaturaResponseDto> {
    return this.assinaturasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar assinatura',
    description: 'Atualiza os dados de uma assinatura existente',
  })
  @ApiParam({ name: 'id', description: 'ID da assinatura' })
  @ApiResponse({
    status: 200,
    description: 'Assinatura atualizada com sucesso',
    type: AssinaturaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Assinatura não encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAssinaturaDto: UpdateAssinaturaDto,
  ): Promise<AssinaturaResponseDto> {
    return this.assinaturasService.update(id, updateAssinaturaDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover assinatura',
    description: 'Remove uma assinatura do sistema',
  })
  @ApiParam({ name: 'id', description: 'ID da assinatura' })
  @ApiResponse({
    status: 204,
    description: 'Assinatura removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Assinatura não encontrada',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.assinaturasService.remove(id);
  }

  @Post('sync')
  @Roles(UserRole.TECNICO, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Sincronizar assinaturas pendentes',
    description: 'Tenta sincronizar todas as assinaturas pendentes com o servidor',
  })
  @ApiResponse({
    status: 200,
    description: 'Sincronização concluída',
    type: SincronizacaoResponseDto,
  })
  async sincronizarAssinaturas(): Promise<SincronizacaoResponseDto> {
    return this.assinaturasService.sincronizarAssinaturas();
  }

  @Post(':id/sync')
  @ApiOperation({
    summary: 'Forçar sincronização de assinatura específica',
    description: 'Força a sincronização de uma assinatura específica',
  })
  @ApiParam({ name: 'id', description: 'ID da assinatura' })
  @ApiResponse({
    status: 200,
    description: 'Assinatura sincronizada com sucesso',
    type: AssinaturaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Falha na sincronização ou assinatura já sincronizada',
  })
  @ApiResponse({
    status: 404,
    description: 'Assinatura não encontrada',
  })
  async forcarSincronizacao(@Param('id') id: string): Promise<AssinaturaResponseDto> {
    return this.assinaturasService.forcarSincronizacao(id);
  }
}
