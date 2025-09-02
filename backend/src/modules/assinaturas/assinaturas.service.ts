import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { 
  CreateAssinaturaDto, 
  UpdateAssinaturaDto, 
  AssinaturaResponseDto, 
  AssinaturaStatus,
  SincronizacaoResponseDto 
} from './dto/assinatura.dto';

interface Assinatura {
  id: string;
  servidorId?: string;
  tipo: string;
  documentoId: string;
  responsavelNome: string;
  responsavelCpf: string;
  responsavelCargo: string;
  dadosAssinatura: string;
  observacoes?: string;
  dataAssinatura: Date;
  latitude?: string;
  longitude?: string;
  empresaId: string;
  unidadeId: string;
  status: AssinaturaStatus;
  tentativasSincronizacao: number;
  ultimaTentativa?: Date;
  erroSincronizacao?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AssinaturasService {
  private assinaturas: Assinatura[] = [];
  private maxTentativas = 3;

  async create(createAssinaturaDto: CreateAssinaturaDto): Promise<AssinaturaResponseDto> {
    const assinatura: Assinatura = {
      ...createAssinaturaDto,
      tentativasSincronizacao: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.assinaturas.push(assinatura);
    
    return this.mapToResponseDto(assinatura);
  }

  async findAll(): Promise<AssinaturaResponseDto[]> {
    return this.assinaturas.map(assinatura => this.mapToResponseDto(assinatura));
  }

  async findPending(): Promise<AssinaturaResponseDto[]> {
    return this.assinaturas
      .filter(assinatura => assinatura.status === AssinaturaStatus.PENDENTE)
      .map(assinatura => this.mapToResponseDto(assinatura));
  }

  async findOne(id: string): Promise<AssinaturaResponseDto> {
    const assinatura = this.assinaturas.find(a => a.id === id);
    if (!assinatura) {
      throw new NotFoundException('Assinatura não encontrada');
    }
    return this.mapToResponseDto(assinatura);
  }

  async update(id: string, updateAssinaturaDto: UpdateAssinaturaDto): Promise<AssinaturaResponseDto> {
    const index = this.assinaturas.findIndex(a => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    this.assinaturas[index] = {
      ...this.assinaturas[index],
      ...updateAssinaturaDto,
      updatedAt: new Date(),
    };

    return this.mapToResponseDto(this.assinaturas[index]);
  }

  async remove(id: string): Promise<void> {
    const index = this.assinaturas.findIndex(a => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Assinatura não encontrada');
    }
    this.assinaturas.splice(index, 1);
  }

  async sincronizarAssinaturas(): Promise<SincronizacaoResponseDto> {
    const pendentes = this.assinaturas.filter(
      a => a.status === AssinaturaStatus.PENDENTE && 
           a.tentativasSincronizacao < this.maxTentativas
    );

    const resultado: SincronizacaoResponseDto = {
      totalSincronizadas: 0,
      totalErros: 0,
      erros: [],
      assinaturasSincronizadas: [],
    };

    for (const assinatura of pendentes) {
      try {
        // Simular envio para servidor
        await this.simularEnvioServidor(assinatura);
        
        // Atualizar status
        const index = this.assinaturas.findIndex(a => a.id === assinatura.id);
        this.assinaturas[index] = {
          ...this.assinaturas[index],
          status: AssinaturaStatus.CONFIRMADO,
          servidorId: `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          updatedAt: new Date(),
        };

        resultado.totalSincronizadas++;
        resultado.assinaturasSincronizadas.push(
          this.mapToResponseDto(this.assinaturas[index])
        );
      } catch (error) {
        // Incrementar tentativas
        const index = this.assinaturas.findIndex(a => a.id === assinatura.id);
        this.assinaturas[index] = {
          ...this.assinaturas[index],
          tentativasSincronizacao: this.assinaturas[index].tentativasSincronizacao + 1,
          ultimaTentativa: new Date(),
          erroSincronizacao: error.message,
          status: this.assinaturas[index].tentativasSincronizacao + 1 >= this.maxTentativas 
            ? AssinaturaStatus.ERRO 
            : AssinaturaStatus.PENDENTE,
          updatedAt: new Date(),
        };

        resultado.totalErros++;
        resultado.erros.push(`Assinatura ${assinatura.id}: ${error.message}`);
      }
    }

    return resultado;
  }

  async forcarSincronizacao(id: string): Promise<AssinaturaResponseDto> {
    const assinatura = this.assinaturas.find(a => a.id === id);
    if (!assinatura) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    if (assinatura.status === AssinaturaStatus.CONFIRMADO) {
      throw new BadRequestException('Assinatura já foi sincronizada');
    }

    try {
      // Simular envio para servidor
      await this.simularEnvioServidor(assinatura);
      
      // Atualizar status
      const index = this.assinaturas.findIndex(a => a.id === id);
      this.assinaturas[index] = {
        ...this.assinaturas[index],
        status: AssinaturaStatus.CONFIRMADO,
        servidorId: `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        tentativasSincronizacao: 0,
        erroSincronizacao: undefined,
        updatedAt: new Date(),
      };

      return this.mapToResponseDto(this.assinaturas[index]);
    } catch (error) {
      // Incrementar tentativas
      const index = this.assinaturas.findIndex(a => a.id === id);
      this.assinaturas[index] = {
        ...this.assinaturas[index],
        tentativasSincronizacao: this.assinaturas[index].tentativasSincronizacao + 1,
        ultimaTentativa: new Date(),
        erroSincronizacao: error.message,
        status: this.assinaturas[index].tentativasSincronizacao + 1 >= this.maxTentativas 
          ? AssinaturaStatus.ERRO 
          : AssinaturaStatus.PENDENTE,
        updatedAt: new Date(),
      };

      throw new BadRequestException(`Falha na sincronização: ${error.message}`);
    }
  }

  async getStats(): Promise<any> {
    const total = this.assinaturas.length;
    const pendentes = this.assinaturas.filter(a => a.status === AssinaturaStatus.PENDENTE).length;
    const confirmadas = this.assinaturas.filter(a => a.status === AssinaturaStatus.CONFIRMADO).length;
    const comErro = this.assinaturas.filter(a => a.status === AssinaturaStatus.ERRO).length;

    return {
      total,
      pendentes,
      confirmadas,
      comErro,
      taxaSucesso: total > 0 ? ((confirmadas / total) * 100).toFixed(2) + '%' : '0%',
    };
  }

  private async simularEnvioServidor(assinatura: Assinatura): Promise<void> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // Simular falha ocasional (10% de chance)
    if (Math.random() < 0.1) {
      throw new Error('Erro de conexão com servidor');
    }
  }

  private mapToResponseDto(assinatura: Assinatura): AssinaturaResponseDto {
    return {
      id: assinatura.id,
      servidorId: assinatura.servidorId,
      tipo: assinatura.tipo as any,
      documentoId: assinatura.documentoId,
      responsavelNome: assinatura.responsavelNome,
      responsavelCpf: assinatura.responsavelCpf,
      responsavelCargo: assinatura.responsavelCargo,
      dadosAssinatura: assinatura.dadosAssinatura,
      observacoes: assinatura.observacoes,
      dataAssinatura: assinatura.dataAssinatura,
      latitude: assinatura.latitude,
      longitude: assinatura.longitude,
      empresaId: assinatura.empresaId,
      unidadeId: assinatura.unidadeId,
      status: assinatura.status,
      tentativasSincronizacao: assinatura.tentativasSincronizacao,
      ultimaTentativa: assinatura.ultimaTentativa,
      erroSincronizacao: assinatura.erroSincronizacao,
      createdAt: assinatura.createdAt,
      updatedAt: assinatura.updatedAt,
    };
  }
}
