import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoCertificado {
  NR10 = 'nr10',
  NR20 = 'nr20',
  NR35 = 'nr35',
  BRIGADA = 'brigada',
  PRIMEIROS_SOCORROS = 'primeiros_socorros',
  OUTROS = 'outros'
}

export enum StatusCertificado {
  PENDENTE = 'pendente',
  EMITIDO = 'emitido',
  VENCIDO = 'vencido',
  CANCELADO = 'cancelado'
}

export class ParticipanteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cpf: string;
}

export class TreinamentoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  instrutor: string;

  @ApiProperty()
  @IsNumber()
  cargaHoraria: number;
}

export class CreateCertificadoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ enum: TipoCertificado })
  @IsEnum(TipoCertificado)
  tipo: TipoCertificado;

  @ApiProperty()
  @IsNotEmpty()
  participante: ParticipanteDto;

  @ApiProperty()
  @IsNotEmpty()
  treinamento: TreinamentoDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class UpdateCertificadoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ enum: TipoCertificado, required: false })
  @IsOptional()
  @IsEnum(TipoCertificado)
  tipo?: TipoCertificado;

  @ApiProperty({ required: false })
  @IsOptional()
  participante?: ParticipanteDto;

  @ApiProperty({ required: false })
  @IsOptional()
  treinamento?: TreinamentoDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  nota?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  aprovado?: boolean;
}

export class EmitirCertificadoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  certificadoId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  nota?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class CertificadoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  numero: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty({ enum: TipoCertificado })
  tipo: TipoCertificado;

  @ApiProperty()
  participante: ParticipanteDto;

  @ApiProperty()
  treinamento: TreinamentoDto;

  @ApiProperty()
  dataEmissao: string;

  @ApiProperty()
  dataValidade: string;

  @ApiProperty({ enum: StatusCertificado })
  status: StatusCertificado;

  @ApiProperty()
  hash: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  linkValidacao: string;

  @ApiProperty({ required: false })
  observacoes?: string;

  @ApiProperty({ required: false })
  nota?: number;

  @ApiProperty()
  aprovado: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  pdfUrl?: string;
}

export class ValidarCertificadoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  hash: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numero: string;
}

export class ValidacaoResponseDto {
  @ApiProperty()
  valido: boolean;

  @ApiProperty()
  certificado?: CertificadoResponseDto;

  @ApiProperty()
  mensagem: string;

  @ApiProperty()
  dataValidacao: string;
}
