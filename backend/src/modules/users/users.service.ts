import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/User';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(filters: any = {}): Promise<UserResponseDto[]> {
    console.log('🔍 UsersService - findAll chamado com filtros:', filters);
    
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Aplicar filtros
    if (filters.status && filters.status !== 'todos') {
      const isAtivo = filters.status === 'ativo';
      queryBuilder.andWhere('user.ativo = :ativo', { ativo: isAtivo });
    }

    if (filters.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(LOWER(user.nome) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search) OR user.cpf LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.empresaId) {
      queryBuilder.andWhere('user.empresaId = :empresaId', { empresaId: filters.empresaId });
    }

    if (filters.unidadeId) {
      queryBuilder.andWhere('user.unidadeId = :unidadeId', { unidadeId: filters.unidadeId });
    }

    const users = await queryBuilder.getMany();
    console.log('✅ UsersService - findAll retornou:', users.length, 'usuários');
    return users.map(user => this.mapToResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.mapToResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    console.log('🔍 UsersService - create chamado com dados:', createUserDto);
    
    // Verificar se email já existe
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email já está em uso');
    }

    // Verificar se CPF já existe (se fornecido)
    if (createUserDto.cpf) {
      const existingCpf = await this.userRepository.findOne({ where: { cpf: createUserDto.cpf } });
      if (existingCpf) {
        throw new BadRequestException('CPF já está em uso');
      }
    }

    const user = this.userRepository.create({
      nome: createUserDto.nome,
      email: createUserDto.email,
      cpf: createUserDto.cpf,
      telefone: createUserDto.telefone,
      role: createUserDto.role,
      ativo: true,
      empresaId: createUserDto.empresaId,
      unidadeId: createUserDto.unidadeId,
      password: createUserDto.password || '123456' // Senha padrão
    });

    const savedUser = await this.userRepository.save(user);
    console.log('✅ UsersService - create retornou:', savedUser);
    return this.mapToResponseDto(savedUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se email já existe (se estiver sendo alterado)
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({ 
        where: { email: updateUserDto.email } 
      });
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email já está em uso');
      }
    }

    // Verificar se CPF já existe (se estiver sendo alterado)
    if (updateUserDto.cpf) {
      const existingCpf = await this.userRepository.findOne({ 
        where: { cpf: updateUserDto.cpf } 
      });
      if (existingCpf && existingCpf.id !== id) {
        throw new BadRequestException('CPF já está em uso');
      }
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return this.mapToResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userRepository.remove(user);
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    return { available: !existingUser };
  }

  async checkCpfAvailability(cpf: string): Promise<{ available: boolean }> {
    const existingCpf = await this.userRepository.findOne({ where: { cpf } });
    return { available: !existingCpf };
  }

  async getUsersByEmpresa(empresaId: string, filters: any = {}): Promise<UserResponseDto[]> {
    return this.findAll({ ...filters, empresaId });
  }

  async getUsersByUnidade(unidadeId: string, filters: any = {}): Promise<UserResponseDto[]> {
    return this.findAll({ ...filters, unidadeId });
  }

  async getUsersByRole(role: UserRole, filters: any = {}): Promise<UserResponseDto[]> {
    return this.findAll({ ...filters, role });
  }

  async searchUsers(searchTerm: string, filters: any = {}): Promise<UserResponseDto[]> {
    return this.findAll({ ...filters, search: searchTerm });
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      telefone: user.telefone,
      role: user.role as any,
      ativo: user.ativo,
      empresaId: user.empresaId,
      unidadeId: user.unidadeId,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
}
