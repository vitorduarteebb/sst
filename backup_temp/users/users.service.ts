import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { User, UserStatus } from '../../entities/User';
import { CreateUserDto, UpdateUserDto, UserFilterDto, UserResponseDto, ChangePasswordDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar se email já existe
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });
    if (existingEmail) {
      throw new ConflictException('Email já está em uso');
    }

    // Verificar se CPF já existe
    const existingCpf = await this.usersRepository.findOne({
      where: { cpf: createUserDto.cpf }
    });
    if (existingCpf) {
      throw new ConflictException('CPF já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.mapToResponseDto(savedUser);
  }

  async findAll(filters: UserFilterDto = {}): Promise<UserResponseDto[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Aplicar filtros
    if (filters.search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR user.cpf ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters.status) {
      queryBuilder.andWhere('user.status = :status', { status: filters.status });
    }

    if (filters.empresaId) {
      queryBuilder.andWhere('user.empresaId = :empresaId', { empresaId: filters.empresaId });
    }

    if (filters.unidadeId) {
      queryBuilder.andWhere('user.unidadeId = :unidadeId', { unidadeId: filters.unidadeId });
    }

    if (filters.ativo !== undefined) {
      const status = filters.ativo ? UserStatus.ACTIVE : UserStatus.INACTIVE;
      queryBuilder.andWhere('user.status = :status', { status });
    }

    queryBuilder.orderBy('user.firstName', 'ASC');

    const users = await queryBuilder.getMany();
    return users.map(user => this.mapToResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['empresa', 'unidade']
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.mapToResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email }
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { cpf }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se email já existe (se foi alterado)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email }
      });
      if (existingEmail) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Atualizar usuário
    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    return this.mapToResponseDto(updatedUser);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(changePasswordDto.senhaAtual, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(changePasswordDto.novaSenha, 10);
    user.password = hashedNewPassword;

    await this.usersRepository.save(user);
  }

  async toggleStatus(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.status = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    const updatedUser = await this.usersRepository.save(user);

    return this.mapToResponseDto(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Soft delete - apenas marcar como inativo
    user.status = UserStatus.INACTIVE;
    await this.usersRepository.save(user);
  }

  async getStats(empresaId?: string): Promise<any> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (empresaId) {
      queryBuilder.andWhere('user.empresaId = :empresaId', { empresaId });
    }

    const total = await queryBuilder.getCount();
    const ativos = await queryBuilder.andWhere('user.status = :status', { status: UserStatus.ACTIVE }).getCount();
    const inativos = await queryBuilder.andWhere('user.status = :status', { status: UserStatus.INACTIVE }).getCount();

    // Estatísticas por role
    const roles = await queryBuilder
      .select('user.role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return {
      total,
      ativos,
      inativos,
      roles,
      percentualAtivos: total > 0 ? (ativos / total) * 100 : 0
    };
  }

  private mapToResponseDto(user: User): UserResponseDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponseDto;
  }
}
