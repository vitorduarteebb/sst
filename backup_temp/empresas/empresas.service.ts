import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../../entities/Empresa';
import { CreateEmpresaDto, UpdateEmpresaDto, EmpresaFilterDto, EmpresaResponseDto } from './dto/empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private empresasRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<EmpresaResponseDto> {
    // Verificar se CNPJ já existe
    const existingCnpj = await this.empresasRepository.findOne({
      where: { cnpj: createEmpresaDto.cnpj }
    });
    if (existingCnpj) {
      throw new ConflictException('CNPJ já está em uso');
    }

    const empresa = this.empresasRepository.create({
      ...createEmpresaDto,
      ativo: true,
    });

    const savedEmpresa = await this.empresasRepository.save(empresa);
    return this.mapToResponseDto(savedEmpresa);
  }

  async findAll(filters: EmpresaFilterDto = {}): Promise<EmpresaResponseDto[]> {
    const queryBuilder = this.empresasRepository.createQueryBuilder('empresa');

    // Aplicar filtros
    if (filters.search) {
      queryBuilder.andWhere(
        '(empresa.razaoSocial ILIKE :search OR empresa.nomeFantasia ILIKE :search OR empresa.cnpj ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.cidade) {
      queryBuilder.andWhere('empresa.cidade ILIKE :cidade', { cidade: `%${filters.cidade}%` });
    }

    if (filters.uf) {
      queryBuilder.andWhere('empresa.uf = :uf', { uf: filters.uf });
    }

    if (filters.ativo !== undefined) {
      queryBuilder.andWhere('empresa.ativo = :ativo', { ativo: filters.ativo });
    }

    if (filters.observacoes) {
      queryBuilder.andWhere('empresa.observacoes ILIKE :observacoes', { observacoes: `%${filters.observacoes}%` });
    }

    queryBuilder.orderBy('empresa.razaoSocial', 'ASC');

    const empresas = await queryBuilder.getMany();
    return empresas.map(empresa => this.mapToResponseDto(empresa));
  }

  async findOne(id: string): Promise<EmpresaResponseDto> {
    const empresa = await this.empresasRepository.findOne({
      where: { id },
      relations: ['unidades', 'pessoas']
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return this.mapToResponseDto(empresa);
  }

  async findByCnpj(cnpj: string): Promise<Empresa | null> {
    return this.empresasRepository.findOne({
      where: { cnpj }
    });
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto): Promise<EmpresaResponseDto> {
    const empresa = await this.empresasRepository.findOne({
      where: { id }
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }



    // Atualizar empresa
    Object.assign(empresa, updateEmpresaDto);
    const updatedEmpresa = await this.empresasRepository.save(empresa);

    return this.mapToResponseDto(updatedEmpresa);
  }

  async toggleStatus(id: string): Promise<EmpresaResponseDto> {
    const empresa = await this.empresasRepository.findOne({
      where: { id }
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    empresa.ativo = !empresa.ativo;
    const updatedEmpresa = await this.empresasRepository.save(empresa);

    return this.mapToResponseDto(updatedEmpresa);
  }

  async remove(id: string): Promise<void> {
    const empresa = await this.empresasRepository.findOne({
      where: { id }
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    // Soft delete - apenas marcar como inativo
    empresa.ativo = false;
    await this.empresasRepository.save(empresa);
  }

  async getStats(): Promise<any> {
    const total = await this.empresasRepository.count();
    const ativas = await this.empresasRepository.count({ where: { ativo: true } });
    const inativas = await this.empresasRepository.count({ where: { ativo: false } });

    // Estatísticas por estado
    const estados = await this.empresasRepository
      .createQueryBuilder('empresa')
      .select('empresa.uf')
      .addSelect('COUNT(*)', 'count')
      .groupBy('empresa.uf')
      .getRawMany();

    // Estatísticas por cidade
    const cidades = await this.empresasRepository
      .createQueryBuilder('empresa')
      .select('empresa.cidade')
      .addSelect('COUNT(*)', 'count')
      .groupBy('empresa.cidade')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      total,
      ativas,
      inativas,
      estados,
      cidades,
      percentualAtivas: total > 0 ? (ativas / total) * 100 : 0
    };
  }

  async checkCnpjAvailability(cnpj: string): Promise<{ available: boolean }> {
    const empresa = await this.findByCnpj(cnpj);
    return { available: !empresa };
  }

  private mapToResponseDto(empresa: Empresa): EmpresaResponseDto {
    return {
      id: empresa.id,
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia,
      cnpj: empresa.cnpj,

      endereco: empresa.endereco,
      cidade: empresa.cidade,
      uf: empresa.uf,
      cep: empresa.cep,
      telefone: empresa.telefone,
      email: empresa.email,
      responsavel: empresa.responsavel,
      telefoneResponsavel: empresa.telefoneResponsavel,
      emailResponsavel: empresa.emailResponsavel,
      observacoes: empresa.observacoes,
      ativo: empresa.ativo,
      createdAt: empresa.createdAt,
      updatedAt: empresa.updatedAt,
    };
  }
}
