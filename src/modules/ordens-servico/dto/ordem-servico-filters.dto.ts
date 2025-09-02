import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { OrdemServicoStatus, OrdemServicoPrioridade, OrdemServicoTipo } from './create-ordem-servico.dto';

export class OrdemServicoFiltersDto {
  @ApiProperty({
    description: 'Termo de busca por título, descrição ou observações',
    example: 'manutenção extintor',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Termo de busca deve ser uma string' })
  search?: string;

  @ApiProperty({
    description: 'Filtrar por status da ordem de serviço',
    enum: OrdemServicoStatus,
    example: OrdemServicoStatus.PENDENTE,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrdemServicoStatus, { message: 'Status deve ser um valor válido' })
  status?: OrdemServicoStatus;

  @ApiProperty({
    description: 'Filtrar por prioridade da ordem de serviço',
    enum: OrdemServicoPrioridade,
    example: OrdemServicoPrioridade.MEDIA,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrdemServicoPrioridade, { message: 'Prioridade deve ser um valor válido' })
  prioridade?: OrdemServicoPrioridade;

  @ApiProperty({
    description: 'Filtrar por tipo da ordem de serviço',
    enum: OrdemServicoTipo,
    example: OrdemServicoTipo.MANUTENCAO,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrdemServicoTipo, { message: 'Tipo deve ser um valor válido' })
  tipo?: OrdemServicoTipo;

  @ApiProperty({
    description: 'Filtrar por ID do responsável',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID do responsável deve ser uma string' })
  responsavelId?: string;

  @ApiProperty({
    description: 'Filtrar por ID da unidade',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID da unidade deve ser uma string' })
  unidadeId?: string;

  @ApiProperty({
    description: 'Filtrar por ID do ativo',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID do ativo deve ser uma string' })
  ativoId?: string;

  @ApiProperty({
    description: 'Filtrar por ID da empresa',
    example: 'empresa-1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID da empresa deve ser uma string' })
  empresaId?: string;

  @ApiProperty({
    description: 'Filtrar por data de início mínima',
    example: '2023-12-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de início mínima deve ser uma data válida' })
  dataInicioMin?: string;

  @ApiProperty({
    description: 'Filtrar por data de início máxima',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de início máxima deve ser uma data válida' })
  dataInicioMax?: string;

  @ApiProperty({
    description: 'Filtrar por data de fim mínima',
    example: '2023-12-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim mínima deve ser uma data válida' })
  dataFimMin?: string;

  @ApiProperty({
    description: 'Filtrar por data de fim máxima',
    example: '2023-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim máxima deve ser uma data válida' })
  dataFimMax?: string;

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
    example: 'createdAt',
    default: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Campo de ordenação deve ser uma string' })
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Direção da ordenação',
    example: 'DESC',
    default: 'DESC',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Direção de ordenação deve ser uma string' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
