import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidade, UnidadeStatus, UnidadeTipo } from '../../entities/Unidade';

export interface CreateUnidadeDto {
  nome: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  status: UnidadeStatus;
  tipo: UnidadeTipo;
  empresaId: string;
}

export interface UpdateUnidadeDto {
  nome?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  status?: UnidadeStatus;
  tipo?: UnidadeTipo;
  empresaId?: string;
}

export interface UnidadeResponseDto {
  id: string;
  nome: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  status: UnidadeStatus;
  tipo: UnidadeTipo;
  empresaId: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidade)
    private unidadeRepository: Repository<Unidade>,
  ) {}

  async findAll(): Promise<UnidadeResponseDto[]> {
    console.log('🔍 UnidadesService - findAll chamado');
    
    const unidades = await this.unidadeRepository.find();
    console.log('✅ UnidadesService - findAll retornou:', unidades.length, 'unidades');
    return unidades.map(unidade => this.mapToResponseDto(unidade));
  }

  async findOne(id: string): Promise<UnidadeResponseDto> {
    const unidade = await this.unidadeRepository.findOne({ where: { id } });
    if (!unidade) {
      throw new NotFoundException('Unidade não encontrada');
    }
    return this.mapToResponseDto(unidade);
  }

  async create(createUnidadeDto: CreateUnidadeDto): Promise<UnidadeResponseDto> {
    console.log('🔍 UnidadesService - create chamado com dados:', createUnidadeDto);
    
    const unidade = this.unidadeRepository.create(createUnidadeDto);
    const savedUnidade = await this.unidadeRepository.save(unidade);
    console.log('✅ UnidadesService - create retornou:', savedUnidade);
    return this.mapToResponseDto(savedUnidade);
  }

  async update(id: string, updateUnidadeDto: UpdateUnidadeDto): Promise<UnidadeResponseDto> {
    const unidade = await this.unidadeRepository.findOne({ where: { id } });
    if (!unidade) {
      throw new NotFoundException('Unidade não encontrada');
    }

    Object.assign(unidade, updateUnidadeDto);
    const updatedUnidade = await this.unidadeRepository.save(unidade);
    return this.mapToResponseDto(updatedUnidade);
  }

  async remove(id: string): Promise<void> {
    const unidade = await this.unidadeRepository.findOne({ where: { id } });
    if (!unidade) {
      throw new NotFoundException('Unidade não encontrada');
    }

    await this.unidadeRepository.remove(unidade);
  }

  async findByEmpresa(empresaId: string): Promise<UnidadeResponseDto[]> {
    const unidades = await this.unidadeRepository.find({ where: { empresaId } });
    return unidades.map(unidade => this.mapToResponseDto(unidade));
  }

  private mapToResponseDto(unidade: Unidade): UnidadeResponseDto {
    return {
      id: unidade.id,
      nome: unidade.nome,
      endereco: unidade.endereco,
      cidade: unidade.cidade,
      estado: unidade.estado,
      status: unidade.status,
      tipo: unidade.tipo,
      empresaId: unidade.empresaId,
      createdAt: unidade.createdAt.toISOString(),
      updatedAt: unidade.updatedAt.toISOString()
    };
  }
}
