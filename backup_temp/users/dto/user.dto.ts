import { IsString, IsEmail, IsOptional, IsEnum, IsUUID, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../entities/User';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @MinLength(3)
  firstName: string;

  @ApiProperty({ description: 'Sobrenome do usuário' })
  @IsString()
  @MinLength(3)
  lastName: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'CPF do usuário' })
  @IsString()
  @MinLength(11)
  cpf: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Telefone do usuário' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Role do usuário', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'ID da empresa' })
  @IsUUID()
  empresaId: string;

  @ApiProperty({ description: 'ID da unidade' })
  @IsUUID()
  @IsOptional()
  unidadeId?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'Sobrenome do usuário' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Telefone do usuário' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Role do usuário', enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ description: 'Status do usuário', enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: 'ID da unidade' })
  @IsUUID()
  @IsOptional()
  unidadeId?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Senha atual' })
  @IsString()
  senhaAtual: string;

  @ApiProperty({ description: 'Nova senha' })
  @IsString()
  @MinLength(6)
  novaSenha: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  empresaId: string;

  @ApiProperty()
  unidadeId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ required: false, enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  empresaId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  unidadeId?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
