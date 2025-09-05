import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidade, UnidadeStatus, UnidadeTipo } from '../../entities/Unidade';

export interface UnidadeSimple {
  id: string;
  nome: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'SUSPENDED' | 'CLOSED';
  tipo: 'FILIAL' | 'MATRIZ' | 'DEPOSITO' | 'ESCRITORIO' | 'FABRICA' | 'OBRA' | 'OFICINA' | 'LABORATORIO' | 'ALMOXARIFADO' | 'GARAGEM' | 'OUTRO';
  empresaId: string;
  empresaNome?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnidadeFilters {
  empresaId?: string;
  tipo?: string;
  status?: string;
  cidade?: string;
  estado?: string;
  search?: string;
}

export interface UnidadePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UnidadeListResponse {
  data: UnidadeSimple[];
  pagination: UnidadePagination;
}

@Injectable()
export class UnidadesSimpleService {
  constructor(
    @InjectRepository(Unidade)
    private unidadeRepository: Repository<Unidade>,
  ) {}

  private unidades: UnidadeSimple[] = [
    {
      id: '1',
      nome: 'Filial São Paulo',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      status: 'ACTIVE',
      tipo: 'FILIAL',
      empresaId: 'empresa-1',
      empresaNome: 'Empresa ABC Ltda',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      nome: 'Depósito Rio de Janeiro',
      endereco: 'Av. Atlântica, 456',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      status: 'ACTIVE',
      tipo: 'DEPOSITO',
      empresaId: 'empresa-1',
      empresaNome: 'Empresa ABC Ltda',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    },
    {
      id: '3',
      nome: 'Oficina Belo Horizonte',
      endereco: 'Rua da Liberdade, 789',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      status: 'MAINTENANCE',
      tipo: 'OFICINA',
      empresaId: 'empresa-1',
      empresaNome: 'Empresa ABC Ltda',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    }
  ];

  async findAll(
    filters: UnidadeFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<UnidadeListResponse> {
    let filteredUnidades = [...this.unidades];

    // Aplicar filtros
    if (filters.empresaId) {
      filteredUnidades = filteredUnidades.filter(u => u.empresaId === filters.empresaId);
    }

    if (filters.tipo) {
      filteredUnidades = filteredUnidades.filter(u => u.tipo === filters.tipo);
    }

    if (filters.status) {
      filteredUnidades = filteredUnidades.filter(u => u.status === filters.status);
    }

    if (filters.cidade) {
      filteredUnidades = filteredUnidades.filter(u => 
        u.cidade?.toLowerCase().includes(filters.cidade!.toLowerCase())
      );
    }

    if (filters.estado) {
      filteredUnidades = filteredUnidades.filter(u => u.estado === filters.estado);
    }

    if (filters.search) {
      filteredUnidades = filteredUnidades.filter(u => 
        u.nome.toLowerCase().includes(filters.search!.toLowerCase()) ||
        u.cidade?.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Aplicar paginação
    const total = filteredUnidades.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredUnidades.slice(startIndex, endIndex);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  async findOne(id: string): Promise<UnidadeSimple> {
    const unidade = this.unidades.find(u => u.id === id);
    if (!unidade) {
      throw new Error(`Unidade com ID ${id} não encontrada`);
    }
    return unidade;
  }

  async create(unidadeData: Omit<UnidadeSimple, 'id' | 'createdAt' | 'updatedAt'>): Promise<UnidadeSimple> {
    const newUnidade: UnidadeSimple = {
      ...unidadeData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.unidades.push(newUnidade);
    return newUnidade;
  }

  async update(id: string, unidadeData: Partial<UnidadeSimple>): Promise<UnidadeSimple> {
    const index = this.unidades.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`Unidade com ID ${id} não encontrada`);
    }

    this.unidades[index] = {
      ...this.unidades[index],
      ...unidadeData,
      updatedAt: new Date()
    };

    return this.unidades[index];
  }

  async remove(id: string): Promise<void> {
    const index = this.unidades.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`Unidade com ID ${id} não encontrada`);
    }

    this.unidades.splice(index, 1);
  }

  async getStats(): Promise<any> {
    const total = this.unidades.length;
    const active = this.unidades.filter(u => u.status === 'ACTIVE').length;
    const inactive = this.unidades.filter(u => u.status === 'INACTIVE').length;
    const maintenance = this.unidades.filter(u => u.status === 'MAINTENANCE').length;
    const suspended = this.unidades.filter(u => u.status === 'SUSPENDED').length;
    const closed = this.unidades.filter(u => u.status === 'CLOSED').length;

    return {
      total,
      active,
      inactive,
      maintenance,
      suspended,
      closed
    };
  }

  async findByEmpresa(empresaId: string): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.empresaId === empresaId);
  }

  async findByTipo(tipo: string): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.tipo === tipo);
  }

  async findByStatus(status: string): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.status === status);
  }

  async findByCidade(cidade: string): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.cidade === cidade);
  }

  async findByEstado(estado: string): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.estado === estado);
  }

  async findActive(): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.status === 'ACTIVE');
  }

  async findInactive(): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.status === 'INACTIVE');
  }

  async findInMaintenance(): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.status === 'MAINTENANCE');
  }

  async findSuspended(): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.status === 'SUSPENDED');
  }

  async findClosed(): Promise<UnidadeSimple[]> {
    return this.unidades.filter(u => u.status === 'CLOSED');
  }

  async activate(id: string): Promise<UnidadeSimple> {
    return this.update(id, { status: 'ACTIVE' });
  }

  async deactivate(id: string): Promise<UnidadeSimple> {
    return this.update(id, { status: 'INACTIVE' });
  }

  async putInMaintenance(id: string): Promise<UnidadeSimple> {
    return this.update(id, { status: 'MAINTENANCE' });
  }

  async suspend(id: string): Promise<UnidadeSimple> {
    return this.update(id, { status: 'SUSPENDED' });
  }

  async close(id: string): Promise<UnidadeSimple> {
    return this.update(id, { status: 'CLOSED' });
  }
}
