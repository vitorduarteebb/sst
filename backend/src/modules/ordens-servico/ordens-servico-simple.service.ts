import { Injectable, NotFoundException } from '@nestjs/common';

export enum OrdemServicoStatus {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PAUSADA = 'PAUSADA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

export enum OrdemServicoPrioridade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export enum OrdemServicoTipo {
  MANUTENCAO = 'MANUTENCAO',
  INSPECAO = 'INSPECAO',
  LIMPEZA = 'LIMPEZA',
  REPARO = 'REPARO',
  INSTALACAO = 'INSTALACAO',
  OUTRO = 'OUTRO',
}

interface OrdemServicoSimple {
  id: string;
  titulo: string;
  descricao: string;
  status: OrdemServicoStatus;
  prioridade: OrdemServicoPrioridade;
  tipo: OrdemServicoTipo;
  dataInicio: Date;
  dataFim: Date;
  responsavelId: string;
  responsavelNome: string;
  unidadeId: string;
  unidadeNome: string;
  ativoId?: string;
  ativoNome?: string;
  empresaId: string;
  empresaNome: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OrdensServicoSimpleService {
  private ordensServico: OrdemServicoSimple[] = [
    {
      id: '1',
      titulo: 'Manutenção Preventiva - Extintores',
      descricao: 'Realizar manutenção preventiva em todos os extintores da unidade',
      status: OrdemServicoStatus.PENDENTE,
      prioridade: OrdemServicoPrioridade.MEDIA,
      tipo: OrdemServicoTipo.MANUTENCAO,
      dataInicio: new Date('2023-12-01T08:00:00Z'),
      dataFim: new Date('2023-12-01T17:00:00Z'),
      responsavelId: '1',
      responsavelNome: 'João Silva',
      unidadeId: '1',
      unidadeNome: 'Unidade Central',
      ativoId: '1',
      ativoNome: 'Extintor ABC 6kg',
      empresaId: 'empresa-1',
      empresaNome: 'Empresa ABC Ltda',
      observacoes: 'Verificar se há materiais disponíveis antes de iniciar',
      createdAt: new Date('2023-11-30T10:00:00Z'),
      updatedAt: new Date('2023-11-30T10:00:00Z'),
    },
    {
      id: '2',
      titulo: 'Inspeção de Segurança - Equipamentos',
      descricao: 'Inspecionar todos os equipamentos de segurança da unidade',
      status: OrdemServicoStatus.EM_ANDAMENTO,
      prioridade: OrdemServicoPrioridade.ALTA,
      tipo: OrdemServicoTipo.INSPECAO,
      dataInicio: new Date('2023-12-02T08:00:00Z'),
      dataFim: new Date('2023-12-02T16:00:00Z'),
      responsavelId: '2',
      responsavelNome: 'Maria Santos',
      unidadeId: '1',
      unidadeNome: 'Unidade Central',
      empresaId: 'empresa-1',
      empresaNome: 'Empresa ABC Ltda',
      observacoes: 'Documentar todas as irregularidades encontradas',
      createdAt: new Date('2023-11-29T14:00:00Z'),
      updatedAt: new Date('2023-12-01T09:00:00Z'),
    },
  ];

  async findAll(): Promise<OrdemServicoSimple[]> {
    return this.ordensServico;
  }

  async findOne(id: string): Promise<OrdemServicoSimple> {
    const ordem = this.ordensServico.find(o => o.id === id);
    if (!ordem) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }
    return ordem;
  }

  async getStats(): Promise<any> {
    const total = this.ordensServico.length;
    const pendentes = this.ordensServico.filter(ordem => ordem.status === OrdemServicoStatus.PENDENTE).length;
    const emAndamento = this.ordensServico.filter(ordem => ordem.status === OrdemServicoStatus.EM_ANDAMENTO).length;
    const concluidas = this.ordensServico.filter(ordem => ordem.status === OrdemServicoStatus.CONCLUIDA).length;

    return {
      total,
      pendentes,
      emAndamento,
      concluidas,
    };
  }
}
