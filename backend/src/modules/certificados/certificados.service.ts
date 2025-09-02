import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { 
  CreateCertificadoDto, 
  UpdateCertificadoDto, 
  EmitirCertificadoDto,
  CertificadoResponseDto,
  ValidarCertificadoDto,
  ValidacaoResponseDto,
  TipoCertificado,
  StatusCertificado
} from './dto/certificado.dto';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { PdfService } from './pdf.service';

export interface Certificado {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  tipo: TipoCertificado;
  participante: {
    id: string;
    nome: string;
    email: string;
    cpf: string;
  };
  treinamento: {
    id: string;
    titulo: string;
    instrutor: string;
    cargaHoraria: number;
  };
  dataEmissao: string;
  dataValidade: string;
  status: StatusCertificado;
  hash: string;
  qrCode: string;
  linkValidacao: string;
  observacoes?: string;
  nota?: number;
  aprovado: boolean;
  createdAt: string;
  pdfUrl?: string;
}

@Injectable()
export class CertificadosService {
  constructor(
    private jwtService: JwtService,
    private pdfService: PdfService
  ) {}

  private certificados: Certificado[] = [
    {
      id: '1',
      numero: 'CERT-2024-001',
      titulo: 'Certificado NR-10 - Segurança em Instalações Elétricas',
      descricao: 'Certificado de conclusão do treinamento NR-10 com carga horária de 40 horas.',
      tipo: TipoCertificado.NR10,
      participante: {
        id: '1',
        nome: 'João Silva Santos',
        email: 'joao.silva@empresa.com',
        cpf: '123.456.789-00'
      },
      treinamento: {
        id: '1',
        titulo: 'NR-10 - Segurança em Instalações e Serviços com Eletricidade',
        instrutor: 'Eng. Carlos Silva',
        cargaHoraria: 40
      },
      dataEmissao: '2024-01-26',
      dataValidade: '2025-01-26',
      status: StatusCertificado.EMITIDO,
      hash: 'a1b2c3d4e5f6789012345678901234567890abcdef',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sst.com.br/validar/CERT-2024-001',
      linkValidacao: 'https://sst.com.br/validar/CERT-2024-001',
      observacoes: 'Participante aprovado com excelente desempenho.',
      nota: 95,
      aprovado: true,
      createdAt: '2024-01-26'
    },
    {
      id: '2',
      numero: 'CERT-2024-002',
      titulo: 'Certificado NR-20 - Trabalho com Inflamáveis',
      descricao: 'Certificado de conclusão do treinamento NR-20 com carga horária de 32 horas.',
      tipo: TipoCertificado.NR20,
      participante: {
        id: '2',
        nome: 'Maria Santos Costa',
        email: 'maria.santos@empresa.com',
        cpf: '987.654.321-00'
      },
      treinamento: {
        id: '2',
        titulo: 'NR-20 - Segurança e Saúde no Trabalho com Inflamáveis',
        instrutor: 'Eng. Ana Costa',
        cargaHoraria: 32
      },
      dataEmissao: '2024-01-20',
      dataValidade: '2025-01-20',
      status: StatusCertificado.EMITIDO,
      hash: 'b2c3d4e5f6789012345678901234567890abcdefa1',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sst.com.br/validar/CERT-2024-002',
      linkValidacao: 'https://sst.com.br/validar/CERT-2024-002',
      observacoes: 'Participante aprovado com bom desempenho.',
      nota: 88,
      aprovado: true,
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      numero: 'CERT-2024-003',
      titulo: 'Certificado NR-35 - Trabalho em Altura',
      descricao: 'Certificado de conclusão do treinamento NR-35 com carga horária de 24 horas.',
      tipo: TipoCertificado.NR35,
      participante: {
        id: '3',
        nome: 'Pedro Oliveira Lima',
        email: 'pedro.oliveira@empresa.com',
        cpf: '456.789.123-00'
      },
      treinamento: {
        id: '3',
        titulo: 'NR-35 - Trabalho em Altura',
        instrutor: 'Eng. Roberto Santos',
        cargaHoraria: 24
      },
      dataEmissao: '',
      dataValidade: '',
      status: StatusCertificado.PENDENTE,
      hash: '',
      qrCode: '',
      linkValidacao: '',
      observacoes: 'Aguardando conclusão do treinamento.',
      nota: 0,
      aprovado: false,
      createdAt: '2024-01-05'
    }
  ];

  async findAll(): Promise<CertificadoResponseDto[]> {
    return this.certificados.map(cert => this.mapToResponseDto(cert));
  }

  async findOne(id: string): Promise<CertificadoResponseDto> {
    const certificado = this.certificados.find(cert => cert.id === id);
    if (!certificado) {
      throw new NotFoundException('Certificado não encontrado');
    }
    return this.mapToResponseDto(certificado);
  }

  async create(createCertificadoDto: CreateCertificadoDto): Promise<CertificadoResponseDto> {
    const numero = `CERT-${new Date().getFullYear()}-${String(this.certificados.length + 1).padStart(3, '0')}`;
    
    const certificado: Certificado = {
      id: Date.now().toString(),
      numero,
      ...createCertificadoDto,
      dataEmissao: '',
      dataValidade: '',
      status: StatusCertificado.PENDENTE,
      hash: '',
      qrCode: '',
      linkValidacao: '',
      nota: 0,
      aprovado: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.certificados.push(certificado);
    return this.mapToResponseDto(certificado);
  }

  async update(id: string, updateCertificadoDto: UpdateCertificadoDto): Promise<CertificadoResponseDto> {
    const index = this.certificados.findIndex(cert => cert.id === id);
    if (index === -1) {
      throw new NotFoundException('Certificado não encontrado');
    }

    this.certificados[index] = { ...this.certificados[index], ...updateCertificadoDto };
    return this.mapToResponseDto(this.certificados[index]);
  }

  async remove(id: string): Promise<void> {
    const index = this.certificados.findIndex(cert => cert.id === id);
    if (index === -1) {
      throw new NotFoundException('Certificado não encontrado');
    }

    this.certificados.splice(index, 1);
  }

  async emitirCertificado(emitirDto: EmitirCertificadoDto): Promise<CertificadoResponseDto> {
    const certificado = this.certificados.find(cert => cert.id === emitirDto.certificadoId);
    if (!certificado) {
      throw new NotFoundException('Certificado não encontrado');
    }

    if (certificado.status !== StatusCertificado.PENDENTE) {
      throw new BadRequestException('Apenas certificados pendentes podem ser emitidos');
    }

    // Gerar hash único
    const hash = this.generateHash(certificado.numero);
    
    // Gerar QR Code
    const qrCodeData = `https://sst.com.br/validar/${certificado.numero}?hash=${hash}`;
    const qrCode = await this.generateQRCode(qrCodeData);

    // Calcular datas
    const dataEmissao = new Date().toISOString().split('T')[0];
    const dataValidade = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Atualizar certificado
    certificado.status = StatusCertificado.EMITIDO;
    certificado.dataEmissao = dataEmissao;
    certificado.dataValidade = dataValidade;
    certificado.hash = hash;
    certificado.qrCode = qrCode;
    certificado.linkValidacao = `https://sst.com.br/validar/${certificado.numero}?hash=${hash}`;
    certificado.aprovado = true;
    certificado.nota = emitirDto.nota || Math.floor(Math.random() * 20) + 80;
    
    if (emitirDto.observacoes) {
      certificado.observacoes = emitirDto.observacoes;
    }

    return this.mapToResponseDto(certificado);
  }

  async validarCertificado(validarDto: ValidarCertificadoDto): Promise<ValidacaoResponseDto> {
    const certificado = this.certificados.find(cert => 
      cert.numero === validarDto.numero && cert.hash === validarDto.hash
    );

    if (!certificado) {
      return {
        valido: false,
        mensagem: 'Certificado não encontrado ou inválido',
        dataValidacao: new Date().toISOString()
      };
    }

    // Verificar se está vencido
    if (certificado.status === StatusCertificado.VENCIDO) {
      return {
        valido: false,
        certificado: this.mapToResponseDto(certificado),
        mensagem: 'Certificado vencido',
        dataValidacao: new Date().toISOString()
      };
    }

    // Verificar se foi cancelado
    if (certificado.status === StatusCertificado.CANCELADO) {
      return {
        valido: false,
        certificado: this.mapToResponseDto(certificado),
        mensagem: 'Certificado cancelado',
        dataValidacao: new Date().toISOString()
      };
    }

    // Verificar validade por data
    if (certificado.dataValidade && new Date(certificado.dataValidade) < new Date()) {
      certificado.status = StatusCertificado.VENCIDO;
      return {
        valido: false,
        certificado: this.mapToResponseDto(certificado),
        mensagem: 'Certificado vencido',
        dataValidacao: new Date().toISOString()
      };
    }

    return {
      valido: true,
      certificado: this.mapToResponseDto(certificado),
      mensagem: 'Certificado válido',
      dataValidacao: new Date().toISOString()
    };
  }

  async gerarPDF(certificadoId: string): Promise<string> {
    const certificado = this.certificados.find(cert => cert.id === certificadoId);
    if (!certificado) {
      throw new NotFoundException('Certificado não encontrado');
    }

    if (certificado.status !== StatusCertificado.EMITIDO) {
      throw new BadRequestException('Apenas certificados emitidos podem gerar PDF');
    }

    try {
      // Gerar PDF real usando Puppeteer
      const pdfUrl = await this.pdfService.saveCertificadoPDF(certificado);
      certificado.pdfUrl = pdfUrl;

      return pdfUrl;
    } catch (error) {
      throw new BadRequestException(`Erro ao gerar PDF: ${error.message}`);
    }
  }

  async getStats(): Promise<any> {
    const total = this.certificados.length;
    const emitidos = this.certificados.filter(cert => cert.status === StatusCertificado.EMITIDO).length;
    const pendentes = this.certificados.filter(cert => cert.status === StatusCertificado.PENDENTE).length;
    const vencidos = this.certificados.filter(cert => cert.status === StatusCertificado.VENCIDO).length;
    const cancelados = this.certificados.filter(cert => cert.status === StatusCertificado.CANCELADO).length;

    return {
      total,
      emitidos,
      pendentes,
      vencidos,
      cancelados,
      percentualEmitidos: total > 0 ? Math.round((emitidos / total) * 100) : 0
    };
  }

  private generateHash(numero: string): string {
    const data = `${numero}-${Date.now()}-${Math.random()}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 40);
  }

  private async generateQRCode(data: string): Promise<string> {
    try {
      return await QRCode.toDataURL(data, {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      // Fallback para URL externa
      return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
    }
  }

  private mapToResponseDto(certificado: Certificado): CertificadoResponseDto {
    return {
      id: certificado.id,
      numero: certificado.numero,
      titulo: certificado.titulo,
      descricao: certificado.descricao,
      tipo: certificado.tipo,
      participante: certificado.participante,
      treinamento: certificado.treinamento,
      dataEmissao: certificado.dataEmissao,
      dataValidade: certificado.dataValidade,
      status: certificado.status,
      hash: certificado.hash,
      qrCode: certificado.qrCode,
      linkValidacao: certificado.linkValidacao,
      observacoes: certificado.observacoes,
      nota: certificado.nota,
      aprovado: certificado.aprovado,
      createdAt: certificado.createdAt,
      pdfUrl: certificado.pdfUrl
    };
  }
}
