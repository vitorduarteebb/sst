import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsUUID } from 'class-validator';

export enum OrdemServicoStatus {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PAUSADA = 'PAUSADA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
}

export enum OrdemServicoPrioridade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export enum OrdemServicoTipo {
  MANUTENCAO = 'MANUTENCAO',
  INSPECAO = 'INSPECAO',
  LIMPEZA = 'LIMPEZA',
  REPARO = 'REPARO',
  INSTALACAO = 'INSTALACAO',
  OUTRO = 'OUTRO',
}

export class CreateOrdemServicoDto {
  @ApiProperty({
    description: 'Título da ordem de serviço',
    example: 'Manutenção Preventiva - Extintores',
    required: true,
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada da ordem de serviço',
    example: 'Realizar manutenção preventiva em todos os extintores da unidade',
    required: true,
  })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString({ message: 'Descrição deve ser uma string' })
  descricao: string;

  @ApiProperty({
    description: 'Status da ordem de serviço',
    enum: OrdemServicoStatus,
    example: OrdemServicoStatus.PENDENTE,
    required: true,
  })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  @IsEnum(OrdemServicoStatus, { message: 'Status deve ser um valor válido' })
  status: OrdemServicoStatus;

  @ApiProperty({
    description: 'Prioridade da ordem de serviço',
    enum: OrdemServicoPrioridade,
    example: OrdemServicoPrioridade.MEDIA,
    required: true,
  })
  @IsNotEmpty({ message: 'Prioridade é obrigatória' })
  @IsEnum(OrdemServicoPrioridade, { message: 'Prioridade deve ser um valor válido' })
  prioridade: OrdemServicoPrioridade;

  @ApiProperty({
    description: 'Tipo da ordem de serviço',
    enum: OrdemServicoTipo,
    example: OrdemServicoTipo.MANUTENCAO,
    required: true,
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  @IsEnum(OrdemServicoTipo, { message: 'Tipo deve ser um valor válido' })
  tipo: OrdemServicoTipo;

  @ApiProperty({
    description: 'Data de início prevista',
    example: '2023-12-01T08:00:00Z',
    required: true,
  })
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  dataInicio: Date;

  @ApiProperty({
    description: 'Data de fim prevista',
    example: '2023-12-01T17:00:00Z',
    required: true,
  })
  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  dataFim: Date;

  @ApiProperty({
    description: 'ID do responsável pela ordem de serviço',
    example: '1',
    required: true,
  })
  @IsNotEmpty({ message: 'ID do responsável é obrigatório' })
  @IsString({ message: 'ID do responsável deve ser uma string' })
  responsavelId: string;

  @ApiProperty({
    description: 'ID da unidade onde será executada a OS',
    example: '1',
    required: true,
  })
  @IsNotEmpty({ message: 'ID da unidade é obrigatório' })
  @IsString({ message: 'ID da unidade deve ser uma string' })
  unidadeId: string;

  @ApiProperty({
    description: 'ID do ativo relacionado (opcional)',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID do ativo deve ser uma string' })
  ativoId?: string;

  @ApiProperty({
    description: 'ID da empresa',
    example: 'empresa-1',
    required: true,
  })
  @IsNotEmpty({ message: 'ID da empresa é obrigatório' })
  @IsString({ message: 'ID da empresa deve ser uma string' })
  empresaId: string;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Verificar se há materiais disponíveis antes de iniciar',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  observacoes?: string;
}
