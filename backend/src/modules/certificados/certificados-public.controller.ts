import { 
  Controller, 
  Get, 
  Param, 
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CertificadosService } from './certificados.service';
import { ValidacaoResponseDto } from './dto/certificado.dto';

@ApiTags('Certificados - Público')
@Controller('certificados-public')
export class CertificadosPublicController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @Get('validar/:numero')
  @ApiOperation({ summary: 'Validar certificado por número e hash (público)' })
  @ApiResponse({ status: 200, description: 'Resultado da validação', type: ValidacaoResponseDto })
  async validarCertificadoPublico(
    @Param('numero') numero: string,
    @Query('hash') hash: string
  ): Promise<ValidacaoResponseDto> {
    return this.certificadosService.validarCertificado({ numero, hash });
  }

  @Get('qr/:numero')
  @ApiOperation({ summary: 'Obter QR Code do certificado (público)' })
  @ApiResponse({ status: 200, description: 'QR Code do certificado' })
  @ApiResponse({ status: 404, description: 'Certificado não encontrado' })
  async getQRCode(@Param('numero') numero: string): Promise<{ qrCode: string }> {
    const certificados = await this.certificadosService.findAll();
    const certificado = certificados.find(cert => cert.numero === numero);
    
    if (!certificado) {
      throw new Error('Certificado não encontrado');
    }

    return { qrCode: certificado.qrCode };
  }
}
