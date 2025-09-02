import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UnidadeTipo {
  FILIAL = 'FILIAL',
  MATRIZ = 'MATRIZ',
  DEPOSITO = 'DEPOSITO',
  ALMOXARIFADO = 'ALMOXARIFADO',
  GARAGEM = 'GARAGEM',
  OFICINA = 'OFICINA',
  LABORATORIO = 'LABORATORIO',
  OUTRO = 'OUTRO',
}

export enum UnidadeStatus {
  ATIVA = 'ATIVA',
  INATIVA = 'INATIVA',
  MANUTENCAO = 'MANUTENCAO',
  SUSPENSA = 'SUSPENSA',
  CLOSED = 'CLOSED',
}

export class UnidadeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  tipo: UnidadeTipo;

  @ApiProperty()
  status: UnidadeStatus;

  @ApiProperty()
  endereco: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  inscricaoEstadual: string;

  @ApiProperty()
  inscricaoMunicipal: string;

  @ApiProperty()
  observacoes: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
