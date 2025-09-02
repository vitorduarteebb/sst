import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
  Res,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CertificadosService } from './certificados.service';
import { PdfService } from './pdf.service';
import { 
  CreateCertificadoDto, 
  UpdateCertificadoDto, 
  EmitirCertificadoDto,
  CertificadoResponseDto,
  ValidarCertificadoDto,
  ValidacaoResponseDto
} from './dto/certificado.dto';
import { UserRole } from '../../auth/dto/auth.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Response } from 'express';

@ApiTags('Certificados')
@Controller('certificados')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CertificadosController {
  constructor(
    private readonly certificadosService: CertificadosService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar novo certificado' })
  @ApiResponse({ status: 201, description: 'Certificado criado com sucesso', type: CertificadoResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Body() createCertificadoDto: CreateCertificadoDto): Promise<CertificadoResponseDto> {
    return this.certificadosService.create(createCertificadoDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  @ApiOperation({ summary: 'Listar todos os certificados' })
  @ApiResponse({ status: 200, description: 'Lista de certificados', type: [CertificadoResponseDto] })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'tipo', required: false, description: 'Filtrar por tipo' })
  @ApiQuery({ name: 'participante', required: false, description: 'Buscar por participante' })
  async findAll(
    @Query('status') status?: string,
    @Query('tipo') tipo?: string,
    @Query('participante') participante?: string
  ): Promise<CertificadoResponseDto[]> {
    const certificados = await this.certificadosService.findAll();
    
    // Aplicar filtros
    let filtered = certificados;
    
    if (status && status !== 'todos') {
      filtered = filtered.filter(cert => cert.status === status);
    }
    
    if (tipo && tipo !== 'todos') {
      filtered = filtered.filter(cert => cert.tipo === tipo);
    }
    
    if (participante) {
      filtered = filtered.filter(cert => 
        cert.participante.nome.toLowerCase().includes(participante.toLowerCase()) ||
        cert.participante.email.toLowerCase().includes(participante.toLowerCase())
      );
    }
    
    return filtered;
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obter estatísticas dos certificados' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos certificados' })
  async getStats() {
    return this.certificadosService.getStats();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  @ApiOperation({ summary: 'Buscar certificado por ID' })
  @ApiResponse({ status: 200, description: 'Certificado encontrado', type: CertificadoResponseDto })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  async findOne(@Param('id') id: string): Promise<CertificadoResponseDto> {
    return this.certificadosService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar certificado' })
  @ApiResponse({ status: 200, description: 'Certificado atualizado', type: CertificadoResponseDto })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateCertificadoDto: UpdateCertificadoDto
  ): Promise<CertificadoResponseDto> {
    return this.certificadosService.update(id, updateCertificadoDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Excluir certificado' })
  @ApiResponse({ status: 200, description: 'Certificado excluído' })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.certificadosService.remove(id);
  }

  @Post('emitir')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Emitir certificado' })
  @ApiResponse({ status: 200, description: 'Certificado emitido com sucesso', type: CertificadoResponseDto })
  @ApiResponse({ status: 400, description: 'Certificado não pode ser emitido' })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  async emitirCertificado(@Body() emitirDto: EmitirCertificadoDto): Promise<CertificadoResponseDto> {
    return this.certificadosService.emitirCertificado(emitirDto);
  }

  @Post('validar')
  @ApiOperation({ summary: 'Validar certificado' })
  @ApiResponse({ status: 200, description: 'Resultado da validação', type: ValidacaoResponseDto })
  async validarCertificado(@Body() validarDto: ValidarCertificadoDto): Promise<ValidacaoResponseDto> {
    return this.certificadosService.validarCertificado(validarDto);
  }



  @Get(':id/pdf')
  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  @ApiOperation({ summary: 'Gerar PDF do certificado' })
  @ApiResponse({ status: 200, description: 'URL do PDF gerado' })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  async gerarPDF(@Param('id') id: string): Promise<{ pdfUrl: string }> {
    const pdfUrl = await this.certificadosService.gerarPDF(id);
    return { pdfUrl };
  }

  @Get(':id/download')
  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  @ApiOperation({ summary: 'Download do PDF do certificado' })
  @ApiResponse({ status: 200, description: 'PDF do certificado' })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    const certificado = await this.certificadosService.findOne(id);
    
    if (certificado.status !== 'emitido') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Apenas certificados emitidos podem ser baixados'
      });
    }

    try {
      // Gerar PDF real usando Puppeteer
      const pdfBuffer = await this.pdfService.generateCertificadoPDF(certificado as any);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${certificado.numero}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Erro ao gerar PDF: ${error.message}`
      });
    }
  }




}
