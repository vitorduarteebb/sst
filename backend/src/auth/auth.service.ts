import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto, LoginResponseDto, UserResponseDto, UserRole } from './dto/auth.dto';

interface User {
  id: string;
  nome: string;
  email: string;
  password: string;
  role: UserRole;
  cpf: string;
  telefone?: string;
  empresaId: string;
  unidadeId?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: '1',
      nome: 'Administrador',
      email: 'admin@sst.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: UserRole.ADMIN,
      cpf: '123.456.789-00',
      telefone: '(11) 99999-9999',
      empresaId: 'empresa-1',
      unidadeId: 'unidade-1',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      nome: 'Técnico Silva',
      email: 'tecnico@sst.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: UserRole.TECNICO,
      cpf: '987.654.321-00',
      telefone: '(11) 88888-8888',
      empresaId: 'empresa-1',
      unidadeId: 'unidade-1',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      nome: 'Cliente Santos',
      email: 'cliente@sst.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: UserRole.CLIENTE,
      cpf: '111.222.333-44',
      telefone: '(11) 77777-7777',
      empresaId: 'empresa-1',
      unidadeId: 'unidade-1',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.users.find(u => u.email === email && u.ativo);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      empresaId: user.empresaId,
      unidadeId: user.unidadeId
    };

    const access_token = this.jwtService.sign(payload);
    const expires_in = 3600; // 1 hora

    return {
      access_token,
      user: this.mapToUserResponse(user),
      expires_in,
    };
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    // Verificar se email já existe
    const existingUser = this.users.find(u => u.email === registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    // Verificar se CPF já existe
    const existingCpf = this.users.find(u => u.cpf === registerDto.cpf);
    if (existingCpf) {
      throw new BadRequestException('CPF já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser: User = {
      id: (this.users.length + 1).toString(),
      nome: registerDto.nome,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
      cpf: registerDto.cpf,
      telefone: registerDto.telefone,
      empresaId: registerDto.empresaId,
      unidadeId: registerDto.unidadeId,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    return this.mapToUserResponse(newUser);
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    console.log(`🔍 AuthService - findById chamado com ID: ${id}`);
    console.log(`🔍 AuthService - Usuários disponíveis:`, this.users.map(u => ({ id: u.id, nome: u.nome, ativo: u.ativo })));
    
    const user = this.users.find(u => u.id === id && u.ativo);
    console.log(`🔍 AuthService - Usuário encontrado:`, user ? { id: user.id, nome: user.nome, ativo: user.ativo } : 'NÃO ENCONTRADO');
    
    return user ? this.mapToUserResponse(user) : null;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = this.users.find(u => u.email === email && u.ativo);
    return user ? this.mapToUserResponse(user) : null;
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.users
      .filter(u => u.ativo)
      .map(user => this.mapToUserResponse(user));
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<UserResponseDto> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new BadRequestException('Usuário não encontrado');
    }

    this.users[index] = {
      ...this.users[index],
      ...updateData,
      updatedAt: new Date(),
    };

    return this.mapToUserResponse(this.users[index]);
  }

  async deactivateUser(id: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new BadRequestException('Usuário não encontrado');
    }

    this.users[index].ativo = false;
    this.users[index].updatedAt = new Date();
  }

  private mapToUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      cpf: user.cpf,
      telefone: user.telefone,
      empresaId: user.empresaId,
      unidadeId: user.unidadeId,
      ativo: user.ativo,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
