import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
  CLIENTE = 'CLIENTE',
  AUDITOR = 'AUDITOR',
}

export enum UserStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'CPF do usuário' })
  @IsString()
  cpf: string;

  @ApiProperty({ description: 'Telefone do usuário', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Função do usuário', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'ID da empresa' })
  @IsString()
  empresaId: string;

  @ApiProperty({ description: 'ID da unidade', required: false })
  @IsOptional()
  @IsString()
  unidadeId?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ description: 'Email do usuário', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'CPF do usuário', required: false })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ description: 'Telefone do usuário', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'Função do usuário', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ description: 'Status do usuário', enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  ativo?: boolean;

  @ApiProperty({ description: 'ID da empresa', required: false })
  @IsOptional()
  @IsString()
  empresaId?: string;

  @ApiProperty({ description: 'ID da unidade', required: false })
  @IsOptional()
  @IsString()
  unidadeId?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome completo do usuário' })
  nome: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'CPF do usuário' })
  cpf: string;

  @ApiProperty({ description: 'Telefone do usuário' })
  telefone?: string;

  @ApiProperty({ description: 'Função do usuário', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'Status do usuário' })
  ativo: boolean;

  @ApiProperty({ description: 'ID da empresa' })
  empresaId: string;

  @ApiProperty({ description: 'ID da unidade' })
  unidadeId?: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: string;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: string;
}
