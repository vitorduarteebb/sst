import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { AtivoTipo, AtivoStatus } from './create-ativo.dto';

export class AtivoFiltersDto {
  @ApiProperty({
    description: 'Termo de busca por nome, descrição, marca, modelo ou número de série',
    example: 'extintor',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Termo de busca deve ser uma string' })
  search?: string;

  @ApiProperty({
    description: 'Filtrar por tipo de ativo',
    enum: AtivoTipo,
    example: AtivoTipo.EQUIPAMENTO,
    required: false,
  })
  @IsOptional()
  @IsEnum(AtivoTipo, { message: 'Tipo deve ser um valor válido' })
  tipo?: AtivoTipo;

  @ApiProperty({
    description: 'Filtrar por status do ativo',
    enum: AtivoStatus,
    example: AtivoStatus.ATIVO,
    required: false,
  })
  @IsOptional()
  @IsEnum(AtivoStatus, { message: 'Status deve ser um valor válido' })
  status?: AtivoStatus;

  @ApiProperty({
    description: 'Filtrar por ID da unidade',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da unidade deve ser um UUID válido' })
  unidadeId?: string;

  @ApiProperty({
    description: 'Filtrar por marca',
    example: 'Pyrex',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Marca deve ser uma string' })
  marca?: string;

  @ApiProperty({
    description: 'Filtrar por modelo',
    example: 'ABC-6',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Modelo deve ser uma string' })
  modelo?: string;

  @ApiProperty({
    description: 'Filtrar por valor mínimo de aquisição',
    example: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Valor mínimo deve ser um número' })
  @Min(0, { message: 'Valor mínimo deve ser maior ou igual a 0' })
  valorMinimo?: number;

  @ApiProperty({
    description: 'Filtrar por valor máximo de aquisição',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Valor máximo deve ser um número' })
  @Min(0, { message: 'Valor máximo deve ser maior ou igual a 0' })
  valorMaximo?: number;

  @ApiProperty({
    description: 'Filtrar por data de aquisição mínima',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  dataAquisicaoMin?: Date;

  @ApiProperty({
    description: 'Filtrar por data de aquisição máxima',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  dataAquisicaoMax?: Date;

  @ApiProperty({
    description: 'Filtrar por data de fabricação mínima',
    example: '2022-01-01',
    required: false,
  })
  @IsOptional()
  dataFabricacaoMin?: Date;

  @ApiProperty({
    description: 'Filtrar por data de fabricação máxima',
    example: '2022-12-31',
    required: false,
  })
  @IsOptional()
  dataFabricacaoMax?: Date;

  @ApiProperty({
    description: 'Página para paginação',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Página deve ser um número' })
  @Min(1, { message: 'Página deve ser maior ou igual a 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Itens por página',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit deve ser um número' })
  @Min(1, { message: 'Limit deve ser maior ou igual a 1' })
  @Max(100, { message: 'Limit deve ser menor ou igual a 100' })
  limit?: number = 10;

  @ApiProperty({
    description: 'Campo para ordenação',
    example: 'nome',
    default: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Campo de ordenação deve ser uma string' })
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Direção da ordenação',
    example: 'ASC',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Direção de ordenação deve ser uma string' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
