import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAtivoDto } from './dto/create-ativo.dto';
import { UpdateAtivoDto } from './dto/update-ativo.dto';
import { AtivoFiltersDto } from './dto/ativo-filters.dto';
import { AtivoResponseDto } from './dto/ativo-response.dto';
import { AtivoListResponseDto } from './dto/ativo-list-response.dto';
import { AtivoTipo, AtivoStatus } from './dto/create-ativo.dto';

// Interface simplificada para Ativo
interface AtivoSimple {
  id: string;
  nome: string;
  tipo: AtivoTipo;
  status: AtivoStatus;
  unidadeId: string;
  unidadeNome: string;
  descricao?: string;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  dataAquisicao?: Date;
  dataFabricacao?: Date;
  valorAquisicao?: number;
  localizacao?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AtivosSimpleService {
  private ativos: AtivoSimple[] = [
    {
      id: '1',
      nome: 'Extintor ABC 6kg',
      tipo: AtivoTipo.EQUIPAMENTO,
      status: AtivoStatus.ATIVO,
      unidadeId: '1',
      unidadeNome: 'Unidade Central',
      descricao: 'Extintor de pó químico ABC 6kg com manômetro',
      marca: 'Pyrex',
      modelo: 'ABC-6',
      numeroSerie: 'SN123456789',
      dataAquisicao: new Date('2023-01-15'),
      dataFabricacao: new Date('2022-12-01'),
      valorAquisicao: 150.00,
      localizacao: 'Sala 101 - Corredor A',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15'),
    },
    {
      id: '2',
      nome: 'Máscara PFF2',
      tipo: AtivoTipo.EQUIPAMENTO,
      status: AtivoStatus.ATIVO,
      unidadeId: '1',
      unidadeNome: 'Unidade Central',
      descricao: 'Máscara PFF2 descartável',
      marca: '3M',
      modelo: 'PFF2',
      dataAquisicao: new Date('2023-02-01'),
      valorAquisicao: 5.50,
      localizacao: 'Almoxarifado',
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-02-01'),
    },
    {
      id: '3',
      nome: 'Capacete de Segurança',
      tipo: AtivoTipo.EQUIPAMENTO,
      status: AtivoStatus.ATIVO,
      unidadeId: '2',
      unidadeNome: 'Unidade Industrial',
      descricao: 'Capacete de segurança industrial',
      marca: 'MSA',
      modelo: 'V-Gard',
      dataAquisicao: new Date('2023-01-20'),
      valorAquisicao: 45.00,
      localizacao: 'Vestiário',
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-01-20'),
    },
    {
      id: '4',
      nome: 'Luvas de Proteção',
      tipo: AtivoTipo.EQUIPAMENTO,
      status: AtivoStatus.INATIVO,
      unidadeId: '2',
      unidadeNome: 'Unidade Industrial',
      descricao: 'Luvas de proteção química',
      marca: 'Ansell',
      modelo: 'NeoTouch',
      dataAquisicao: new Date('2022-11-15'),
      valorAquisicao: 25.00,
      localizacao: 'Almoxarifado',
      createdAt: new Date('2022-11-15'),
      updatedAt: new Date('2023-03-01'),
    },
    {
      id: '5',
      nome: 'Cinto de Segurança',
      tipo: AtivoTipo.EQUIPAMENTO,
      status: AtivoStatus.MANUTENCAO,
      unidadeId: '1',
      unidadeNome: 'Unidade Central',
      descricao: 'Cinto de segurança para trabalho em altura',
      marca: 'Miller',
      modelo: 'Miller Lite',
      dataAquisicao: new Date('2022-08-10'),
      valorAquisicao: 120.00,
      localizacao: 'Depósito de EPIs',
      createdAt: new Date('2022-08-10'),
      updatedAt: new Date('2023-04-15'),
    },
  ];

  async create(createAtivoDto: CreateAtivoDto): Promise<AtivoResponseDto> {
    // Simular verificação de unidade
    const unidadeNome = this.getUnidadeNome(createAtivoDto.unidadeId);
    if (!unidadeNome) {
      throw new NotFoundException('Unidade não encontrada');
    }

    // Verificar se já existe um ativo com o mesmo número de série na unidade
    if (createAtivoDto.numeroSerie) {
      const ativoExistente = this.ativos.find(
        ativo =>
          ativo.numeroSerie === createAtivoDto.numeroSerie &&
          ativo.unidadeId === createAtivoDto.unidadeId,
      );

      if (ativoExistente) {
        throw new BadRequestException(
          'Já existe um ativo com este número de série nesta unidade',
        );
      }
    }

    const novoAtivo: AtivoSimple = {
      id: (this.ativos.length + 1).toString(),
      ...createAtivoDto,
      unidadeNome,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.ativos.push(novoAtivo);
    return this.mapToResponseDto(novoAtivo);
  }

  async findAll(filters: AtivoFiltersDto): Promise<AtivoListResponseDto> {
    let ativosFiltrados = [...this.ativos];

    // Aplicar filtros
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      ativosFiltrados = ativosFiltrados.filter(
        ativo =>
          ativo.nome.toLowerCase().includes(searchTerm) ||
          ativo.descricao?.toLowerCase().includes(searchTerm) ||
          ativo.marca?.toLowerCase().includes(searchTerm) ||
          ativo.modelo?.toLowerCase().includes(searchTerm) ||
          ativo.numeroSerie?.toLowerCase().includes(searchTerm),
      );
    }

    if (filters.tipo) {
      ativosFiltrados = ativosFiltrados.filter(ativo => ativo.tipo === filters.tipo);
    }

    if (filters.status) {
      ativosFiltrados = ativosFiltrados.filter(ativo => ativo.status === filters.status);
    }

    if (filters.unidadeId) {
      ativosFiltrados = ativosFiltrados.filter(ativo => ativo.unidadeId === filters.unidadeId);
    }

    if (filters.marca) {
      ativosFiltrados = ativosFiltrados.filter(ativo => ativo.marca === filters.marca);
    }

    if (filters.modelo) {
      ativosFiltrados = ativosFiltrados.filter(ativo => ativo.modelo === filters.modelo);
    }

    if (filters.valorMinimo !== undefined) {
      ativosFiltrados = ativosFiltrados.filter(
        ativo => ativo.valorAquisicao && ativo.valorAquisicao >= filters.valorMinimo,
      );
    }

    if (filters.valorMaximo !== undefined) {
      ativosFiltrados = ativosFiltrados.filter(
        ativo => ativo.valorAquisicao && ativo.valorAquisicao <= filters.valorMaximo,
      );
    }

    if (filters.dataAquisicaoMin) {
      ativosFiltrados = ativosFiltrados.filter(
        ativo => ativo.dataAquisicao && ativo.dataAquisicao >= filters.dataAquisicaoMin,
      );
    }

    if (filters.dataAquisicaoMax) {
      ativosFiltrados = ativosFiltrados.filter(
        ativo => ativo.dataAquisicao && ativo.dataAquisicao <= filters.dataAquisicaoMax,
      );
    }

    if (filters.dataFabricacaoMin) {
      ativosFiltrados = ativosFiltrados.filter(
        ativo => ativo.dataFabricacao && ativo.dataFabricacao >= filters.dataFabricacaoMin,
      );
    }

    if (filters.dataFabricacaoMax) {
      ativosFiltrados = ativosFiltrados.filter(
        ativo => ativo.dataFabricacao && ativo.dataFabricacao <= filters.dataFabricacaoMax,
      );
    }

    // Aplicar ordenação
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    ativosFiltrados.sort((a, b) => {
      const aValue = a[sortBy as keyof AtivoSimple];
      const bValue = b[sortBy as keyof AtivoSimple];
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'ASC' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'ASC' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'ASC' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    // Aplicar paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    const ativosPaginados = ativosFiltrados.slice(offset, offset + limit);

    const total = ativosFiltrados.length;
    const totalPages = Math.ceil(total / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const ativosResponse = ativosPaginados.map(ativo => this.mapToResponseDto(ativo));

    return {
      data: ativosResponse,
      total,
      page,
      limit,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  }

  async findOne(id: string): Promise<AtivoResponseDto> {
    const ativo = this.ativos.find(a => a.id === id);
    if (!ativo) {
      throw new NotFoundException('Ativo não encontrado');
    }
    return this.mapToResponseDto(ativo);
  }

  async findByUnidade(unidadeId: string): Promise<AtivoResponseDto[]> {
    const ativos = this.ativos.filter(ativo => ativo.unidadeId === unidadeId);
    return ativos.map(ativo => this.mapToResponseDto(ativo));
  }

  async findByTipo(tipo: AtivoTipo): Promise<AtivoResponseDto[]> {
    const ativos = this.ativos.filter(ativo => ativo.tipo === tipo);
    return ativos.map(ativo => this.mapToResponseDto(ativo));
  }

  async findByStatus(status: AtivoStatus): Promise<AtivoResponseDto[]> {
    const ativos = this.ativos.filter(ativo => ativo.status === status);
    return ativos.map(ativo => this.mapToResponseDto(ativo));
  }

  async findByMarca(marca: string): Promise<AtivoResponseDto[]> {
    const ativos = this.ativos.filter(ativo => ativo.marca === marca);
    return ativos.map(ativo => this.mapToResponseDto(ativo));
  }

  async findByModelo(modelo: string): Promise<AtivoResponseDto[]> {
    const ativos = this.ativos.filter(ativo => ativo.modelo === modelo);
    return ativos.map(ativo => this.mapToResponseDto(ativo));
  }

  async findByValorRange(valorMinimo: number, valorMaximo: number): Promise<AtivoResponseDto[]> {
    const ativos = this.ativos.filter(
      ativo =>
        ativo.valorAquisicao &&
        ativo.valorAquisicao >= valorMinimo &&
        ativo.valorAquisicao <= valorMaximo,
    );
    return ativos.map(ativo => this.mapToResponseDto(ativo));
  }

  async update(id: string, updateAtivoDto: UpdateAtivoDto): Promise<AtivoResponseDto> {
    const ativoIndex = this.ativos.findIndex(a => a.id === id);
    if (ativoIndex === -1) {
      throw new NotFoundException('Ativo não encontrado');
    }

    const ativo = this.ativos[ativoIndex];

    // Se estiver alterando a unidade, verificar se a nova unidade existe
    if (updateAtivoDto.unidadeId && updateAtivoDto.unidadeId !== ativo.unidadeId) {
      const unidadeNome = this.getUnidadeNome(updateAtivoDto.unidadeId);
      if (!unidadeNome) {
        throw new NotFoundException('Unidade não encontrada');
      }
    }

    // Se estiver alterando o número de série, verificar se já existe na unidade
    if (
      updateAtivoDto.numeroSerie &&
      updateAtivoDto.numeroSerie !== ativo.numeroSerie
    ) {
      const ativoExistente = this.ativos.find(
        a =>
          a.numeroSerie === updateAtivoDto.numeroSerie &&
          a.unidadeId === (updateAtivoDto.unidadeId || ativo.unidadeId) &&
          a.id !== id,
      );

      if (ativoExistente) {
        throw new BadRequestException(
          'Já existe um ativo com este número de série nesta unidade',
        );
      }
    }

    // Atualizar o ativo
    const ativoAtualizado = {
      ...ativo,
      ...updateAtivoDto,
      unidadeNome: updateAtivoDto.unidadeId
        ? this.getUnidadeNome(updateAtivoDto.unidadeId) || ativo.unidadeNome
        : ativo.unidadeNome,
      updatedAt: new Date(),
    };

    this.ativos[ativoIndex] = ativoAtualizado;
    return this.mapToResponseDto(ativoAtualizado);
  }

  async remove(id: string): Promise<void> {
    const ativoIndex = this.ativos.findIndex(a => a.id === id);
    if (ativoIndex === -1) {
      throw new NotFoundException('Ativo não encontrado');
    }
    this.ativos.splice(ativoIndex, 1);
  }

  // Métodos de controle de status
  async ativar(id: string): Promise<AtivoResponseDto> {
    const ativoIndex = this.ativos.findIndex(a => a.id === id);
    if (ativoIndex === -1) {
      throw new NotFoundException('Ativo não encontrado');
    }

    this.ativos[ativoIndex].status = AtivoStatus.ATIVO;
    this.ativos[ativoIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ativos[ativoIndex]);
  }

  async desativar(id: string): Promise<AtivoResponseDto> {
    const ativoIndex = this.ativos.findIndex(a => a.id === id);
    if (ativoIndex === -1) {
      throw new NotFoundException('Ativo não encontrado');
    }

    this.ativos[ativoIndex].status = AtivoStatus.INATIVO;
    this.ativos[ativoIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ativos[ativoIndex]);
  }

  async colocarEmManutencao(id: string): Promise<AtivoResponseDto> {
    const ativoIndex = this.ativos.findIndex(a => a.id === id);
    if (ativoIndex === -1) {
      throw new NotFoundException('Ativo não encontrado');
    }

    this.ativos[ativoIndex].status = AtivoStatus.MANUTENCAO;
    this.ativos[ativoIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ativos[ativoIndex]);
  }

  async colocarForaDeUso(id: string): Promise<AtivoResponseDto> {
    const ativoIndex = this.ativos.findIndex(a => a.id === id);
    if (ativoIndex === -1) {
      throw new NotFoundException('Ativo não encontrado');
    }

    this.ativos[ativoIndex].status = AtivoStatus.FORA_DE_USO;
    this.ativos[ativoIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ativos[ativoIndex]);
  }

  async descartar(id: string): Promise<AtivoResponseDto> {
    const ativoIndex = this.ativos.findIndex(a => a.id === id);
    if (ativoIndex === -1) {
      throw new NotFoundException('Ativo não encontrado');
    }

    this.ativos[ativoIndex].status = AtivoStatus.DESCARTADO;
    this.ativos[ativoIndex].updatedAt = new Date();

    return this.mapToResponseDto(this.ativos[ativoIndex]);
  }

  // Métodos de estatísticas
  async getStats(): Promise<any> {
    const total = this.ativos.length;
    const ativos = this.ativos.filter(ativo => ativo.status === AtivoStatus.ATIVO).length;
    const inativos = this.ativos.filter(ativo => ativo.status === AtivoStatus.INATIVO).length;
    const emManutencao = this.ativos.filter(ativo => ativo.status === AtivoStatus.MANUTENCAO).length;
    const foraDeUso = this.ativos.filter(ativo => ativo.status === AtivoStatus.FORA_DE_USO).length;
    const descartados = this.ativos.filter(ativo => ativo.status === AtivoStatus.DESCARTADO).length;

    const statsPorTipo = Object.values(AtivoTipo).map(tipo => ({
      tipo,
      count: this.ativos.filter(ativo => ativo.tipo === tipo).length,
    }));

    const valorTotal = this.ativos
      .filter(ativo => ativo.valorAquisicao)
      .reduce((total, ativo) => total + (ativo.valorAquisicao || 0), 0);

    return {
      total,
      porStatus: {
        ativos,
        inativos,
        emManutencao,
        foraDeUso,
        descartados,
      },
      porTipo: statsPorTipo,
      valorTotal,
    };
  }

  async getStatsByUnidade(unidadeId: string): Promise<any> {
    const ativosUnidade = this.ativos.filter(ativo => ativo.unidadeId === unidadeId);
    const total = ativosUnidade.length;
    const ativos = ativosUnidade.filter(ativo => ativo.status === AtivoStatus.ATIVO).length;
    const inativos = ativosUnidade.filter(ativo => ativo.status === AtivoStatus.INATIVO).length;
    const emManutencao = ativosUnidade.filter(ativo => ativo.status === AtivoStatus.MANUTENCAO).length;

    const statsPorTipo = Object.values(AtivoTipo).map(tipo => ({
      tipo,
      count: ativosUnidade.filter(ativo => ativo.tipo === tipo).length,
    }));

    const valorTotal = ativosUnidade
      .filter(ativo => ativo.valorAquisicao)
      .reduce((total, ativo) => total + (ativo.valorAquisicao || 0), 0);

    return {
      total,
      porStatus: {
        ativos,
        inativos,
        emManutencao,
      },
      porTipo: statsPorTipo,
      valorTotal,
    };
  }

  async getStatsByTipo(tipo: AtivoTipo): Promise<any> {
    const ativosTipo = this.ativos.filter(ativo => ativo.tipo === tipo);
    const total = ativosTipo.length;
    const ativos = ativosTipo.filter(ativo => ativo.status === AtivoStatus.ATIVO).length;
    const inativos = ativosTipo.filter(ativo => ativo.status === AtivoStatus.INATIVO).length;
    const emManutencao = ativosTipo.filter(ativo => ativo.status === AtivoStatus.MANUTENCAO).length;

    const valorTotal = ativosTipo
      .filter(ativo => ativo.valorAquisicao)
      .reduce((total, ativo) => total + (ativo.valorAquisicao || 0), 0);

    return {
      total,
      porStatus: {
        ativos,
        inativos,
        emManutencao,
      },
      valorTotal,
    };
  }

  // Métodos privados
  private getUnidadeNome(unidadeId: string): string | null {
    // Simular nomes de unidades
    const unidades = {
      '1': 'Unidade Central',
      '2': 'Unidade Industrial',
      '3': 'Unidade Comercial',
    };
    return unidades[unidadeId as keyof typeof unidades] || null;
  }

  private mapToResponseDto(ativo: AtivoSimple): AtivoResponseDto {
    const response = new AtivoResponseDto();
    Object.assign(response, ativo);
    return response;
  }
}
