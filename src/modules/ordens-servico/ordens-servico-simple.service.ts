import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrdemServicoDto } from './dto/create-ordem-servico.dto';
import { UpdateOrdemServicoDto } from './dto/update-ordem-servico.dto';
import { OrdemServicoFiltersDto } from './dto/ordem-servico-filters.dto';
import { OrdemServicoResponseDto } from './dto/ordem-servico-response.dto';
import { OrdemServicoListResponseDto } from './dto/ordem-servico-list-response.dto';
import { OrdemServicoStatus, OrdemServicoPrioridade, OrdemServicoTipo } from './dto/create-ordem-servico.dto';

// Interface simplificada para Ordem de Serviço
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
    {
      id: '3',
      titulo: 'Limpeza de Áreas Comuns',
      descricao: 'Realizar limpeza geral das áreas comuns da unidade',
      status: OrdemServicoStatus.CONCLUIDA,
      prioridade: OrdemServicoPrioridade.BAIXA,
      tipo: OrdemServicoTipo.LIMPEZA,
      dataInicio: new Date('2023-11-28T07:00:00Z'),
      dataFim: new Date('2023-11-28T15:00:00Z'),
      responsavelId: '3',
      responsavelNome: 'Pedro Oliveira',
      unidadeId: '2',
      unidadeNome: 'Unidade Industrial',
      empresaId: 'empresa-1',
      empresaNome: 'Empresa ABC Ltda',
      observacoes: 'Limpeza concluída com sucesso',
      createdAt: new Date('2023-11-27T16:00:00Z'),
      updatedAt: new Date('2023-11-28T15:30:00Z'),
    },
    {
      id: '4',
      titulo: 'Reparo de Sistema de Ventilação',
      descricao: 'Reparar sistema de ventilação da sala de máquinas',
      status: OrdemServicoStatus.PAUSADA,
      prioridade: OrdemServicoPrioridade.URGENTE,
      tipo: OrdemServicoTipo.REPARO,
      dataInicio: new Date('2023-11-30T06:00:00Z'),
      dataFim: new Date('2023-12-01T18:00:00Z'),
      responsavelId: '1',
      responsavelNome: 'João Silva',
      unidadeId: '2',
      unidadeNome: 'Unidade Industrial',
      empresaId: 'empresa-1',
      empresaNome: 'Empresa ABC Ltda',
      observacoes: 'Aguardando peças de reposição',
      createdAt: new Date('2023-11-29T08:00:00Z'),
      updatedAt: new Date('2023-12-01T12:00:00Z'),
    },
    {
      id: '5',
      titulo: 'Instalação de Novos Extintores',
      descricao: 'Instalar novos extintores conforme especificação técnica',
      status: OrdemServicoStatus.PENDENTE,
      prioridade: OrdemServicoPrioridade.ALTA,
      tipo: OrdemServicoTipo.INSTALACAO,
      dataInicio: new Date('2023-12-05T08:00:00Z'),
      dataFim: new Date('2023-12-05T17:00:00Z'),
      responsavelId: '2',
      responsavelNome: 'Maria Santos',
      unidadeId: '1',
      unidadeNome: 'Unidade Central',
      empresaId: 'empresa-1',
      empresaNome: 'Empresa ABC Ltda',
      observacoes: 'Verificar se os extintores chegaram',
      createdAt: new Date('2023-12-01T11:00:00Z'),
      updatedAt: new Date('2023-12-01T11:00:00Z'),
    },
  ];

  async create(createOrdemServicoDto: CreateOrdemServicoDto): Promise<OrdemServicoResponseDto> {
    // Simular verificação de responsável
    const responsavelNome = this.getResponsavelNome(createOrdemServicoDto.responsavelId);
    if (!responsavelNome) {
      throw new NotFoundException('Responsável não encontrado');
    }

    // Simular verificação de unidade
    const unidadeNome = this.getUnidadeNome(createOrdemServicoDto.unidadeId);
    if (!unidadeNome) {
      throw new NotFoundException('Unidade não encontrada');
    }

    // Simular verificação de empresa
    const empresaNome = this.getEmpresaNome(createOrdemServicoDto.empresaId);
    if (!empresaNome) {
      throw new NotFoundException('Empresa não encontrada');
    }

    // Simular verificação de ativo (se fornecido)
    let ativoNome: string | undefined;
    if (createOrdemServicoDto.ativoId) {
      ativoNome = this.getAtivoNome(createOrdemServicoDto.ativoId);
      if (!ativoNome) {
        throw new NotFoundException('Ativo não encontrado');
      }
    }

    const novaOrdemServico: OrdemServicoSimple = {
      id: (this.ordensServico.length + 1).toString(),
      ...createOrdemServicoDto,
      responsavelNome,
      unidadeNome,
      ativoNome,
      empresaNome,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.ordensServico.push(novaOrdemServico);
    return this.mapToResponseDto(novaOrdemServico);
  }

  async findAll(filters: OrdemServicoFiltersDto): Promise<OrdemServicoListResponseDto> {
    let ordensFiltradas = [...this.ordensServico];

    // Aplicar filtros
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      ordensFiltradas = ordensFiltradas.filter(
        ordem =>
          ordem.titulo.toLowerCase().includes(searchTerm) ||
          ordem.descricao.toLowerCase().includes(searchTerm) ||
          ordem.observacoes?.toLowerCase().includes(searchTerm),
      );
    }

    if (filters.status) {
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.status === filters.status);
    }

    if (filters.prioridade) {
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.prioridade === filters.prioridade);
    }

    if (filters.tipo) {
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.tipo === filters.tipo);
    }

    if (filters.responsavelId) {
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.responsavelId === filters.responsavelId);
    }

    if (filters.unidadeId) {
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.unidadeId === filters.unidadeId);
    }

    if (filters.ativoId) {
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.ativoId === filters.ativoId);
    }

    if (filters.empresaId) {
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.empresaId === filters.empresaId);
    }

    if (filters.dataInicioMin) {
      const dataMin = new Date(filters.dataInicioMin);
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.dataInicio >= dataMin);
    }

    if (filters.dataInicioMax) {
      const dataMax = new Date(filters.dataInicioMax);
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.dataInicio <= dataMax);
    }

    if (filters.dataFimMin) {
      const dataMin = new Date(filters.dataFimMin);
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.dataFim >= dataMin);
    }

    if (filters.dataFimMax) {
      const dataMax = new Date(filters.dataFimMax);
      ordensFiltradas = ordensFiltradas.filter(ordem => ordem.dataFim <= dataMax);
    }

    // Aplicar ordenação
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    ordensFiltradas.sort((a, b) => {
      const aValue = a[sortBy as keyof OrdemServicoSimple];
      const bValue = b[sortBy as keyof OrdemServicoSimple];
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'ASC' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'ASC' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    // Aplicar paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    const ordensPaginadas = ordensFiltradas.slice(offset, offset + limit);

    const total = ordensFiltradas.length;
    const totalPages = Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const ordensResponse = ordensPaginadas.map(ordem => this.mapToResponseDto(ordem));

    return {
      data: ordensResponse,
      total,
      page,
      limit,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  }

  async findOne(id: string): Promise<OrdemServicoResponseDto> {
    const ordem = this.ordensServico.find(o => o.id === id);
    if (!ordem) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }
    return this.mapToResponseDto(ordem);
  }

  async update(id: string, updateOrdemServicoDto: UpdateOrdemServicoDto): Promise<OrdemServicoResponseDto> {
    const ordemIndex = this.ordensServico.findIndex(o => o.id === id);
    if (ordemIndex === -1) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    const ordem = this.ordensServico[ordemIndex];

    // Verificar responsável se estiver sendo alterado
    let responsavelNome = ordem.responsavelNome;
    if (updateOrdemServicoDto.responsavelId && updateOrdemServicoDto.responsavelId !== ordem.responsavelId) {
      responsavelNome = this.getResponsavelNome(updateOrdemServicoDto.responsavelId);
      if (!responsavelNome) {
        throw new NotFoundException('Responsável não encontrado');
      }
    }

    // Verificar unidade se estiver sendo alterada
    let unidadeNome = ordem.unidadeNome;
    if (updateOrdemServicoDto.unidadeId && updateOrdemServicoDto.unidadeId !== ordem.unidadeId) {
      unidadeNome = this.getUnidadeNome(updateOrdemServicoDto.unidadeId);
      if (!unidadeNome) {
        throw new NotFoundException('Unidade não encontrada');
      }
    }

    // Verificar empresa se estiver sendo alterada
    let empresaNome = ordem.empresaNome;
    if (updateOrdemServicoDto.empresaId && updateOrdemServicoDto.empresaId !== ordem.empresaId) {
      empresaNome = this.getEmpresaNome(updateOrdemServicoDto.empresaId);
      if (!empresaNome) {
        throw new NotFoundException('Empresa não encontrada');
      }
    }

    // Verificar ativo se estiver sendo alterado
    let ativoNome = ordem.ativoNome;
    if (updateOrdemServicoDto.ativoId && updateOrdemServicoDto.ativoId !== ordem.ativoId) {
      ativoNome = this.getAtivoNome(updateOrdemServicoDto.ativoId);
      if (!ativoNome) {
        throw new NotFoundException('Ativo não encontrado');
      }
    }

    // Atualizar a ordem de serviço
    const ordemAtualizada = {
      ...ordem,
      ...updateOrdemServicoDto,
      responsavelNome,
      unidadeNome,
      ativoNome,
      empresaNome,
      updatedAt: new Date(),
    };

    this.ordensServico[ordemIndex] = ordemAtualizada;
    return this.mapToResponseDto(ordemAtualizada);
  }

  async remove(id: string): Promise<void> {
    const ordemIndex = this.ordensServico.findIndex(o => o.id === id);
    if (ordemIndex === -1) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }
    this.ordensServico.splice(ordemIndex, 1);
  }

  // Métodos de controle de status
  async iniciar(id: string): Promise<OrdemServicoResponseDto> {
    const ordemIndex = this.ordensServico.findIndex(o => o.id === id);
    if (ordemIndex === -1) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    this.ordensServico[ordemIndex].status = OrdemServicoStatus.EM_ANDAMENTO;
    this.ordensServico[ordemIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ordensServico[ordemIndex]);
  }

  async pausar(id: string): Promise<OrdemServicoResponseDto> {
    const ordemIndex = this.ordensServico.findIndex(o => o.id === id);
    if (ordemIndex === -1) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    this.ordensServico[ordemIndex].status = OrdemServicoStatus.PAUSADA;
    this.ordensServico[ordemIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ordensServico[ordemIndex]);
  }

  async concluir(id: string): Promise<OrdemServicoResponseDto> {
    const ordemIndex = this.ordensServico.findIndex(o => o.id === id);
    if (ordemIndex === -1) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    this.ordensServico[ordemIndex].status = OrdemServicoStatus.CONCLUIDA;
    this.ordensServico[ordemIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ordensServico[ordemIndex]);
  }

  async cancelar(id: string): Promise<OrdemServicoResponseDto> {
    const ordemIndex = this.ordensServico.findIndex(o => o.id === id);
    if (ordemIndex === -1) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    this.ordensServico[ordemIndex].status = OrdemServicoStatus.CANCELADA;
    this.ordensServico[ordemIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ordensServico[ordemIndex]);
  }

  // Métodos de busca específicos
  async findByStatus(status: OrdemServicoStatus): Promise<OrdemServicoResponseDto[]> {
    const ordens = this.ordensServico.filter(ordem => ordem.status === status);
    return ordens.map(ordem => this.mapToResponseDto(ordem));
  }

  async findByPrioridade(prioridade: OrdemServicoPrioridade): Promise<OrdemServicoResponseDto[]> {
    const ordens = this.ordensServico.filter(ordem => ordem.prioridade === prioridade);
    return ordens.map(ordem => this.mapToResponseDto(ordem));
  }

  async findByTipo(tipo: OrdemServicoTipo): Promise<OrdemServicoResponseDto[]> {
    const ordens = this.ordensServico.filter(ordem => ordem.tipo === tipo);
    return ordens.map(ordem => this.mapToResponseDto(ordem));
  }

  async findByResponsavel(responsavelId: string): Promise<OrdemServicoResponseDto[]> {
    const ordens = this.ordensServico.filter(ordem => ordem.responsavelId === responsavelId);
    return ordens.map(ordem => this.mapToResponseDto(ordem));
  }

  async findByUnidade(unidadeId: string): Promise<OrdemServicoResponseDto[]> {
    const ordens = this.ordensServico.filter(ordem => ordem.unidadeId === unidadeId);
    return ordens.map(ordem => this.mapToResponseDto(ordem));
  }

  async findByEmpresa(empresaId: string): Promise<OrdemServicoResponseDto[]> {
    const ordens = this.ordensServico.filter(ordem => ordem.empresaId === empresaId);
    return ordens.map(ordem => this.mapToResponseDto(ordem));
  }

  // Métodos de estatísticas
  async getStats(): Promise<any> {
    const total = this.ordensServico.length;
    const pendentes = this.ordensServico.filter(ordem => ordem.status === OrdemServicoStatus.PENDENTE).length;
    const emAndamento = this.ordensServico.filter(ordem => ordem.status === OrdemServicoStatus.EM_ANDAMENTO).length;
    const pausadas = this.ordensServico.filter(ordem => ordem.status === OrdemServicoStatus.PAUSADA).length;
    const concluidas = this.ordensServico.filter(ordem => ordem.status === OrdemServicoStatus.CONCLUIDA).length;
    const canceladas = this.ordensServico.filter(ordem => ordem.status === OrdemServicoStatus.CANCELADA).length;

    const statsPorPrioridade = Object.values(OrdemServicoPrioridade).map(prioridade => ({
      prioridade,
      count: this.ordensServico.filter(ordem => ordem.prioridade === prioridade).length,
    }));

    const statsPorTipo = Object.values(OrdemServicoTipo).map(tipo => ({
      tipo,
      count: this.ordensServico.filter(ordem => ordem.tipo === tipo).length,
    }));

    return {
      total,
      porStatus: {
        pendentes,
        emAndamento,
        pausadas,
        concluidas,
        canceladas,
      },
      porPrioridade: statsPorPrioridade,
      porTipo: statsPorTipo,
    };
  }

  // Métodos privados
  private getResponsavelNome(responsavelId: string): string | null {
    const responsaveis = {
      '1': 'João Silva',
      '2': 'Maria Santos',
      '3': 'Pedro Oliveira',
    };
    return responsaveis[responsavelId as keyof typeof responsaveis] || null;
  }

  private getUnidadeNome(unidadeId: string): string | null {
    const unidades = {
      '1': 'Unidade Central',
      '2': 'Unidade Industrial',
      '3': 'Unidade Comercial',
    };
    return unidades[unidadeId as keyof typeof unidades] || null;
  }

  private getAtivoNome(ativoId: string): string | null {
    const ativos = {
      '1': 'Extintor ABC 6kg',
      '2': 'Máscara PFF2',
      '3': 'Capacete de Segurança',
    };
    return ativos[ativoId as keyof typeof ativos] || null;
  }

  private getEmpresaNome(empresaId: string): string | null {
    const empresas = {
      'empresa-1': 'Empresa ABC Ltda',
      'empresa-2': 'Empresa XYZ Ltda',
    };
    return empresas[empresaId as keyof typeof empresas] || null;
  }

  private mapToResponseDto(ordem: OrdemServicoSimple): OrdemServicoResponseDto {
    const response = new OrdemServicoResponseDto();
    Object.assign(response, ordem);
    return response;
  }
}
