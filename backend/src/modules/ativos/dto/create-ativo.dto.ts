import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';

export enum AtivoTipo {
  EQUIPAMENTO = 'EQUIPAMENTO',
  FERRAMENTA = 'FERRAMENTA',
  MAQUINA = 'MAQUINA',
  VEICULO = 'VEICULO',
  INSTRUMENTO = 'INSTRUMENTO',
  OUTRO = 'OUTRO',
}

export enum AtivoStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  MANUTENCAO = 'MANUTENCAO',
  FORA_DE_USO = 'FORA_DE_USO',
  DESCARTADO = 'DESCARTADO',
}

export class CreateAtivoDto {
  @ApiProperty({
    description: 'Nome do ativo',
    example: 'Extintor ABC 6kg',
    required: true,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  nome: string;

  @ApiProperty({
    description: 'Tipo do ativo',
    enum: AtivoTipo,
    example: AtivoTipo.EQUIPAMENTO,
    required: true,
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  @IsEnum(AtivoTipo, { message: 'Tipo deve ser um valor válido' })
  tipo: AtivoTipo;

  @ApiProperty({
    description: 'Status do ativo',
    enum: AtivoStatus,
    example: AtivoStatus.ATIVO,
    required: true,
  })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  @IsEnum(AtivoStatus, { message: 'Status deve ser um valor válido' })
  status: AtivoStatus;

  @ApiProperty({
    description: 'ID da unidade onde o ativo está localizado',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({ message: 'ID da unidade é obrigatório' })
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeId: string;

  @ApiProperty({
    description: 'Descrição detalhada do ativo',
    example: 'Extintor de pó químico ABC 6kg com manômetro',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao?: string;

  @ApiProperty({
    description: 'Marca do ativo',
    example: 'Pyrex',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Marca deve ser uma string' })
  marca?: string;

  @ApiProperty({
    description: 'Modelo do ativo',
    example: 'ABC-6',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Modelo deve ser uma string' })
  modelo?: string;

  @ApiProperty({
    description: 'Número de série do ativo',
    example: 'SN123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Número de série deve ser uma string' })
  numeroSerie?: string;

  @ApiProperty({
    description: 'Data de aquisição do ativo',
    example: '2023-01-15',
    required: false,
  })
  @IsOptional()
  dataAquisicao?: Date;

  @ApiProperty({
    description: 'Data de fabricação do ativo',
    example: '2022-12-01',
    required: false,
  })
  @IsOptional()
  dataFabricacao?: Date;

  @ApiProperty({
    description: 'Valor de aquisição do ativo',
    example: 150.00,
    required: false,
  })
  @IsOptional()
  valorAquisicao?: number;

  @ApiProperty({
    description: 'Localização específica dentro da unidade',
    example: 'Sala 101 - Corredor A',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Localização deve ser uma string' })
  localizacao?: string;
}
