import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../../entities/Empresa';

export interface CreateEmpresaDto {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
  };
  contato: {
    telefone: string;
    email: string;
    website?: string;
  };
  responsavelTecnico: {
    nome: string;
    crea?: string;
    telefone: string;
    email: string;
  };
}

export interface UpdateEmpresaDto {
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
  };
  contato?: {
    telefone?: string;
    email?: string;
    website?: string;
  };
  responsavelTecnico?: {
    nome?: string;
    crea?: string;
    telefone?: string;
    email?: string;
  };
  status?: 'ativa' | 'inativa' | 'suspensa';
}

export class EmpresaResponseDto {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
  };
  contato: {
    telefone: string;
    email: string;
    website?: string;
  };
  responsavelTecnico: {
    nome: string;
    crea?: string;
    telefone: string;
    email: string;
  };
  status: 'ativa' | 'inativa' | 'suspensa';
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
      razaoSocial: createEmpresaDto.razaoSocial,
      nomeFantasia: createEmpresaDto.nomeFantasia,
      cnpj: createEmpresaDto.cnpj,
      inscricaoEstadual: createEmpresaDto.inscricaoEstadual,
      inscricaoMunicipal: createEmpresaDto.inscricaoMunicipal,
      cep: createEmpresaDto.endereco.cep,
      logradouro: createEmpresaDto.endereco.logradouro,
      numero: createEmpresaDto.endereco.numero,
      complemento: createEmpresaDto.endereco.complemento,
      bairro: createEmpresaDto.endereco.bairro,
      cidade: createEmpresaDto.endereco.cidade,
      estado: createEmpresaDto.endereco.estado,
      pais: createEmpresaDto.endereco.pais,
      telefone: createEmpresaDto.contato.telefone,
      email: createEmpresaDto.contato.email,
      website: createEmpresaDto.contato.website,
      responsavelTecnicoNome: createEmpresaDto.responsavelTecnico.nome,
      responsavelTecnicoCrea: createEmpresaDto.responsavelTecnico.crea,
      responsavelTecnicoTelefone: createEmpresaDto.responsavelTecnico.telefone,
      responsavelTecnicoEmail: createEmpresaDto.responsavelTecnico.email,
      status: 'ativa'
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
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia,
      cnpj: empresa.cnpj,
      inscricaoEstadual: empresa.inscricaoEstadual,
      inscricaoMunicipal: empresa.inscricaoMunicipal,
      endereco: {
        cep: empresa.cep || '',
        logradouro: empresa.logradouro || '',
        numero: empresa.numero || '',
        complemento: empresa.complemento,
        bairro: empresa.bairro || '',
        cidade: empresa.cidade || '',
        estado: empresa.estado || '',
        pais: empresa.pais || 'Brasil'
      },
      contato: {
        telefone: empresa.telefone || '',
        email: empresa.email || '',
        website: empresa.website
      },
      responsavelTecnico: {
        nome: empresa.responsavelTecnicoNome || '',
        crea: empresa.responsavelTecnicoCrea,
        telefone: empresa.responsavelTecnicoTelefone || '',
        email: empresa.responsavelTecnicoEmail || ''
      },
      status: empresa.status,
      createdAt: empresa.createdAt.toISOString(),
      updatedAt: empresa.updatedAt.toISOString()
    };
  }
}
