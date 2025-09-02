import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto, UserRole, UserStatus } from './dto/user.dto';

// Mock data para demonstração
const mockUsers: UserResponseDto[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999',
    role: UserRole.TECNICO,
    ativo: true,
    empresaId: '1',
    unidadeId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    cpf: '987.654.321-00',
    telefone: '(11) 88888-8888',
    role: UserRole.ADMIN,
    ativo: true,
    empresaId: '1',
    unidadeId: '1',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    cpf: '456.789.123-00',
    telefone: '(11) 77777-7777',
    role: UserRole.AUDITOR,
    ativo: false,
    empresaId: '2',
    unidadeId: '2',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  }
];

@Injectable()
export class UsersService {
  private users = [...mockUsers];

  async findAll(filters: any = {}): Promise<UserResponseDto[]> {
    console.log('🔍 UsersService - findAll chamado com filtros:', filters);
    
    let filteredUsers = [...this.users];

    // Aplicar filtros
    if (filters.status && filters.status !== 'todos') {
      const isAtivo = filters.status === 'ativo';
      filteredUsers = filteredUsers.filter(user => user.ativo === isAtivo);
    }

    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.nome.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.cpf && user.cpf.includes(searchTerm))
      );
    }

    if (filters.empresaId) {
      filteredUsers = filteredUsers.filter(user => user.empresaId === filters.empresaId);
    }

    if (filters.unidadeId) {
      filteredUsers = filteredUsers.filter(user => user.unidadeId === filters.unidadeId);
    }

    console.log('✅ UsersService - findAll retornou:', filteredUsers.length, 'usuários');
    return filteredUsers;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    console.log('🔍 UsersService - create chamado com dados:', createUserDto);
    
    // Verificar se email já existe
    const existingUser = this.users.find(user => user.email === createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email já está em uso');
    }

    // Verificar se CPF já existe (se fornecido)
    if (createUserDto.cpf) {
      const existingCpf = this.users.find(user => user.cpf === createUserDto.cpf);
      if (existingCpf) {
        throw new BadRequestException('CPF já está em uso');
      }
    }

    const newUser: UserResponseDto = {
      id: Date.now().toString(),
      nome: createUserDto.nome,
      email: createUserDto.email,
      cpf: createUserDto.cpf,
      telefone: createUserDto.telefone,
      role: createUserDto.role,
      ativo: true,
      empresaId: createUserDto.empresaId,
      unidadeId: createUserDto.unidadeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(newUser);
    console.log('✅ UsersService - create retornou:', newUser);
    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se email já existe (se estiver sendo alterado)
    if (updateUserDto.email) {
      const existingUser = this.users.find(user => 
        user.email === updateUserDto.email && user.id !== id
      );
      if (existingUser) {
        throw new BadRequestException('Email já está em uso');
      }
    }

    // Verificar se CPF já existe (se estiver sendo alterado)
    if (updateUserDto.cpf) {
      const existingCpf = this.users.find(user => 
        user.cpf === updateUserDto.cpf && user.id !== id
      );
      if (existingCpf) {
        throw new BadRequestException('CPF já está em uso');
      }
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date().toISOString()
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('Usuário não encontrado');
    }

    this.users.splice(userIndex, 1);
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const existingUser = this.users.find(user => user.email === email);
    return { available: !existingUser };
  }

  async checkCpfAvailability(cpf: string): Promise<{ available: boolean }> {
    const existingCpf = this.users.find(user => user.cpf === cpf);
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
}
