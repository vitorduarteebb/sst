import { IsString, IsEnum, IsOptional, IsUUID, IsBoolean, IsNumber, IsArray, IsEmail, IsPhoneNumber, Length, IsLatitude, IsLongitude } from 'class-validator';
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

export class CreateUnidadeDto {
  @ApiProperty({
    description: 'Nome da unidade',
    example: 'Unidade Central',
    required: true,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(2, 100, { message: 'Nome deve ter entre 2 e 100 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'Tipo da unidade',
    enum: UnidadeTipo,
    example: UnidadeTipo.FILIAL,
    required: true,
  })
  @IsEnum(UnidadeTipo, { message: 'Tipo deve ser um valor válido' })
  tipo: UnidadeTipo;

  @ApiProperty({
    description: 'Status da unidade',
    enum: UnidadeStatus,
    example: UnidadeStatus.ATIVA,
    required: true,
  })
  @IsEnum(UnidadeStatus, { message: 'Status deve ser um valor válido' })
  status: UnidadeStatus;

  @ApiProperty({
    description: 'Endereço da unidade',
    example: 'Rua das Flores, 123 - Centro',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Endereço deve ser uma string' })
  @Length(5, 200, { message: 'Endereço deve ter entre 5 e 200 caracteres' })
  endereco?: string;

  @ApiProperty({
    description: 'Telefone da unidade',
    example: '(11) 99999-9999',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Telefone deve ser um número válido' })
  telefone?: string;

  @ApiProperty({
    description: 'Email da unidade',
    example: 'unidade@empresa.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser um email válido' })
  email?: string;

  @ApiProperty({
    description: 'CNPJ da unidade',
    example: '12.345.678/0001-90',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Length(14, 18, { message: 'CNPJ deve ter entre 14 e 18 caracteres' })
  cnpj?: string;

  @ApiProperty({
    description: 'Inscrição Estadual da unidade',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Inscrição Estadual deve ser uma string' })
  inscricaoEstadual?: string;

  @ApiProperty({
    description: 'Inscrição Municipal da unidade',
    example: '987654321',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Inscrição Municipal deve ser uma string' })
  inscricaoMunicipal?: string;

  @ApiProperty({
    description: 'Observações sobre a unidade',
    example: 'Unidade principal da empresa',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  @Length(0, 500, { message: 'Observações devem ter no máximo 500 caracteres' })
  observacoes?: string;
}
