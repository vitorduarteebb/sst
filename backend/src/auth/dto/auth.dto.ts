import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
  CLIENTE = 'CLIENTE',
  AUDITOR = 'AUDITOR',
}

export class LoginDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Perfil do usuário', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'CPF do usuário' })
  @IsString()
  cpf: string;

  @ApiProperty({ description: 'Telefone do usuário' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ description: 'ID da empresa' })
  @IsString()
  empresaId: string;

  @ApiProperty({ description: 'ID da unidade' })
  @IsOptional()
  @IsString()
  unidadeId?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  telefone?: string;

  @ApiProperty()
  empresaId: string;

  @ApiProperty()
  unidadeId?: string;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty()
  expires_in: number;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Token de refresh' })
  @IsString()
  refresh_token: string;
}
