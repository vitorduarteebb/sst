import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../../entities/Empresa';

export interface CreateEmpresaDto {
  nome: string;
  cnpj: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  email?: string;
}

export interface UpdateEmpresaDto {
  nome?: string;
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  email?: string;
  ativo?: boolean;
}

export class EmpresaResponseDto {
  id: string;
  nome: string;
  cnpj: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
  ) {}

  async findAll(): Promise<EmpresaResponseDto[]> {
    console.log('🔍 EmpresasService - findAll chamado');
    
    const empresas = await this.empresaRepository.find();
    console.log('✅ EmpresasService - findAll retornou:', empresas.length, 'empresas');
    return empresas.map(empresa => this.mapToResponseDto(empresa));
  }

  async findOne(id: string): Promise<EmpresaResponseDto> {
    const empresa = await this.empresaRepository.findOne({ where: { id } });
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }
    return this.mapToResponseDto(empresa);
  }

  async create(createEmpresaDto: CreateEmpresaDto): Promise<EmpresaResponseDto> {
    console.log('🔍 EmpresasService - create chamado com dados:', createEmpresaDto);
    
    // Verificar se CNPJ já existe
    const existingEmpresa = await this.empresaRepository.findOne({ where: { cnpj: createEmpresaDto.cnpj } });
    if (existingEmpresa) {
      throw new BadRequestException('CNPJ já está em uso');
    }

    const empresa = this.empresaRepository.create({
      ...createEmpresaDto,
      ativo: true
    });

    const savedEmpresa = await this.empresaRepository.save(empresa);
    console.log('✅ EmpresasService - create retornou:', savedEmpresa);
    return this.mapToResponseDto(savedEmpresa);
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto): Promise<EmpresaResponseDto> {
    const empresa = await this.empresaRepository.findOne({ where: { id } });
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    // Verificar se CNPJ já existe (se estiver sendo alterado)
    if (updateEmpresaDto.cnpj) {
      const existingEmpresa = await this.empresaRepository.findOne({ 
        where: { cnpj: updateEmpresaDto.cnpj } 
      });
      if (existingEmpresa && existingEmpresa.id !== id) {
        throw new BadRequestException('CNPJ já está em uso');
      }
    }

    Object.assign(empresa, updateEmpresaDto);
    const updatedEmpresa = await this.empresaRepository.save(empresa);
    return this.mapToResponseDto(updatedEmpresa);
  }

  async remove(id: string): Promise<void> {
    const empresa = await this.empresaRepository.findOne({ where: { id } });
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    await this.empresaRepository.remove(empresa);
  }

  private mapToResponseDto(empresa: Empresa): EmpresaResponseDto {
    return {
      id: empresa.id,
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      endereco: empresa.endereco,
      cidade: empresa.cidade,
      estado: empresa.estado,
      telefone: empresa.telefone,
      email: empresa.email,
      ativo: empresa.ativo,
      createdAt: empresa.createdAt.toISOString(),
      updatedAt: empresa.updatedAt.toISOString()
    };
  }
}
