import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDate, IsUUID } from 'class-validator';

export enum AssinaturaStatus {
  PENDENTE = 'PENDENTE',
  ENVIADO = 'ENVIADO',
  CONFIRMADO = 'CONFIRMADO',
  ERRO = 'ERRO',
}

export enum AssinaturaTipo {
  CHECKLIST = 'CHECKLIST',
  ORDEM_SERVICO = 'ORDEM_SERVICO',
  TREINAMENTO = 'TREINAMENTO',
  INSPECAO = 'INSPECAO',
}

export class CreateAssinaturaDto {
  @ApiProperty({ description: 'ID único da assinatura (gerado localmente)' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Tipo da assinatura' })
  @IsEnum(AssinaturaTipo)
  tipo: AssinaturaTipo;

  @ApiProperty({ description: 'ID do documento relacionado' })
  @IsString()
  documentoId: string;

  @ApiProperty({ description: 'Nome do responsável' })
  @IsString()
  responsavelNome: string;

  @ApiProperty({ description: 'CPF do responsável' })
  @IsString()
  responsavelCpf: string;

  @ApiProperty({ description: 'Cargo do responsável' })
  @IsString()
  responsavelCargo: string;

  @ApiProperty({ description: 'Dados da assinatura (base64)' })
  @IsString()
  dadosAssinatura: string;

  @ApiProperty({ description: 'Observações adicionais' })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({ description: 'Data e hora da assinatura' })
  @IsDate()
  dataAssinatura: Date;

  @ApiProperty({ description: 'Localização GPS (latitude)' })
  @IsOptional()
  @IsString()
  latitude?: string;

  @ApiProperty({ description: 'Localização GPS (longitude)' })
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiProperty({ description: 'ID da empresa' })
  @IsString()
  empresaId: string;

  @ApiProperty({ description: 'ID da unidade' })
  @IsString()
  unidadeId: string;

  @ApiProperty({ description: 'Status da sincronização' })
  @IsEnum(AssinaturaStatus)
  status: AssinaturaStatus;

  @ApiProperty({ description: 'Tentativas de sincronização' })
  @IsOptional()
  tentativasSincronizacao?: number;

  @ApiProperty({ description: 'Última tentativa de sincronização' })
  @IsOptional()
  @IsDate()
  ultimaTentativa?: Date;

  @ApiProperty({ description: 'Mensagem de erro (se houver)' })
  @IsOptional()
  @IsString()
  erroSincronizacao?: string;
}

export class UpdateAssinaturaDto {
  @ApiProperty({ description: 'Status da sincronização' })
  @IsEnum(AssinaturaStatus)
  status: AssinaturaStatus;

  @ApiProperty({ description: 'Tentativas de sincronização' })
  @IsOptional()
  tentativasSincronizacao?: number;

  @ApiProperty({ description: 'Última tentativa de sincronização' })
  @IsOptional()
  @IsDate()
  ultimaTentativa?: Date;

  @ApiProperty({ description: 'Mensagem de erro (se houver)' })
  @IsOptional()
  @IsString()
  erroSincronizacao?: string;

  @ApiProperty({ description: 'ID do servidor (após sincronização)' })
  @IsOptional()
  @IsUUID()
  servidorId?: string;
}

export class AssinaturaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  servidorId?: string;

  @ApiProperty()
  tipo: AssinaturaTipo;

  @ApiProperty()
  documentoId: string;

  @ApiProperty()
  responsavelNome: string;

  @ApiProperty()
  responsavelCpf: string;

  @ApiProperty()
  responsavelCargo: string;

  @ApiProperty()
  dadosAssinatura: string;

  @ApiProperty()
  observacoes?: string;

  @ApiProperty()
  dataAssinatura: Date;

  @ApiProperty()
  latitude?: string;

  @ApiProperty()
  longitude?: string;

  @ApiProperty()
  empresaId: string;

  @ApiProperty()
  unidadeId: string;

  @ApiProperty()
  status: AssinaturaStatus;

  @ApiProperty()
  tentativasSincronizacao: number;

  @ApiProperty()
  ultimaTentativa?: Date;

  @ApiProperty()
  erroSincronizacao?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SincronizacaoResponseDto {
  @ApiProperty({ description: 'Total de assinaturas sincronizadas' })
  totalSincronizadas: number;

  @ApiProperty({ description: 'Total de erros' })
  totalErros: number;

  @ApiProperty({ description: 'Detalhes dos erros' })
  erros: string[];

  @ApiProperty({ description: 'Assinaturas sincronizadas com sucesso' })
  assinaturasSincronizadas: AssinaturaResponseDto[];
}
