import { IsString, IsOptional, IsUUID, MinLength, IsEmail, IsUrl, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpresaDto {
  @ApiProperty({ description: 'Razão social da empresa' })
  @IsString()
  @MinLength(3)
  razaoSocial: string;

  @ApiProperty({ description: 'Nome fantasia da empresa' })
  @IsString()
  @MinLength(3)
  nomeFantasia: string;

  @ApiProperty({ description: 'CNPJ da empresa' })
  @IsString()
  @MinLength(14)
  cnpj: string;

  @ApiProperty({ description: 'Endereço completo' })
  @IsString()
  endereco: string;

  @ApiProperty({ description: 'Cidade' })
  @IsString()
  cidade: string;

  @ApiProperty({ description: 'UF (Estado)' })
  @IsString()
  uf: string;

  @ApiProperty({ description: 'CEP' })
  @IsString()
  cep: string;

  @ApiProperty({ description: 'Telefone principal' })
  @IsString()
  telefone: string;

  @ApiProperty({ description: 'Email de contato' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Responsável técnico' })
  @IsString()
  @IsOptional()
  responsavel?: string;

  @ApiProperty({ description: 'Telefone do responsável' })
  @IsString()
  @IsOptional()
  telefoneResponsavel?: string;

  @ApiProperty({ description: 'Email do responsável' })
  @IsEmail()
  @IsOptional()
  emailResponsavel?: string;

  @ApiProperty({ description: 'Observações' })
  @IsString()
  @IsOptional()
  observacoes?: string;
}

export class UpdateEmpresaDto {
  @ApiProperty({ description: 'Razão social da empresa' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  razaoSocial?: string;

  @ApiProperty({ description: 'Nome fantasia da empresa' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  nomeFantasia?: string;

  @ApiProperty({ description: 'Endereço completo' })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiProperty({ description: 'Cidade' })
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiProperty({ description: 'UF (Estado)' })
  @IsString()
  @IsOptional()
  uf?: string;

  @ApiProperty({ description: 'CEP' })
  @IsString()
  @IsOptional()
  cep?: string;

  @ApiProperty({ description: 'Telefone principal' })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ description: 'Email de contato' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Responsável técnico' })
  @IsString()
  @IsOptional()
  responsavel?: string;

  @ApiProperty({ description: 'Telefone do responsável' })
  @IsString()
  @IsOptional()
  telefoneResponsavel?: string;

  @ApiProperty({ description: 'Email do responsável' })
  @IsEmail()
  @IsOptional()
  emailResponsavel?: string;

  @ApiProperty({ description: 'Observações' })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiProperty({ description: 'Status ativo da empresa' })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}

export class EmpresaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  razaoSocial: string;

  @ApiProperty()
  nomeFantasia: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  endereco: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  uf: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  responsavel?: string;

  @ApiProperty()
  telefoneResponsavel?: string;

  @ApiProperty()
  emailResponsavel?: string;

  @ApiProperty()
  observacoes?: string;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class EmpresaFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  uf?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
