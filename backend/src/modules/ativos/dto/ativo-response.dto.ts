import { ApiProperty } from '@nestjs/swagger';
import { AtivoTipo, AtivoStatus } from './create-ativo.dto';

export class AtivoResponseDto {
  @ApiProperty({
    description: 'ID único do ativo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do ativo',
    example: 'Extintor ABC 6kg',
  })
  nome: string;

  @ApiProperty({
    description: 'Tipo do ativo',
    enum: AtivoTipo,
    example: AtivoTipo.EQUIPAMENTO,
  })
  tipo: AtivoTipo;

  @ApiProperty({
    description: 'Status do ativo',
    enum: AtivoStatus,
    example: AtivoStatus.ATIVO,
  })
  status: AtivoStatus;

  @ApiProperty({
    description: 'ID da unidade onde o ativo está localizado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  unidadeId: string;

  @ApiProperty({
    description: 'Nome da unidade',
    example: 'Unidade Central',
  })
  unidadeNome: string;

  @ApiProperty({
    description: 'Descrição detalhada do ativo',
    example: 'Extintor de pó químico ABC 6kg com manômetro',
    required: false,
  })
  descricao?: string;

  @ApiProperty({
    description: 'Marca do ativo',
    example: 'Pyrex',
    required: false,
  })
  marca?: string;

  @ApiProperty({
    description: 'Modelo do ativo',
    example: 'ABC-6',
    required: false,
  })
  modelo?: string;

  @ApiProperty({
    description: 'Número de série do ativo',
    example: 'SN123456789',
    required: false,
  })
  numeroSerie?: string;

  @ApiProperty({
    description: 'Data de aquisição do ativo',
    example: '2023-01-15',
    required: false,
  })
  dataAquisicao?: Date;

  @ApiProperty({
    description: 'Data de fabricação do ativo',
    example: '2022-12-01',
    required: false,
  })
  dataFabricacao?: Date;

  @ApiProperty({
    description: 'Valor de aquisição do ativo',
    example: 150.00,
    required: false,
  })
  valorAquisicao?: number;

  @ApiProperty({
    description: 'Localização específica dentro da unidade',
    example: 'Sala 101 - Corredor A',
    required: false,
  })
  localizacao?: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2023-01-15T10:00:00Z',
  })
  updatedAt: Date;

  // Propriedades computadas
  @ApiProperty({
    description: 'Descrição do tipo do ativo',
    example: 'Equipamento',
  })
  get tipoDescricao(): string {
    const tipos = {
      [AtivoTipo.EQUIPAMENTO]: 'Equipamento',
      [AtivoTipo.FERRAMENTA]: 'Ferramenta',
      [AtivoTipo.MAQUINA]: 'Máquina',
      [AtivoTipo.VEICULO]: 'Veículo',
      [AtivoTipo.INSTRUMENTO]: 'Instrumento',
      [AtivoTipo.OUTRO]: 'Outro',
    };
    return tipos[this.tipo] || 'Desconhecido';
  }

  @ApiProperty({
    description: 'Descrição do status do ativo',
    example: 'Ativo',
  })
  get statusDescricao(): string {
    const status = {
      [AtivoStatus.ATIVO]: 'Ativo',
      [AtivoStatus.INATIVO]: 'Inativo',
      [AtivoStatus.MANUTENCAO]: 'Em Manutenção',
      [AtivoStatus.FORA_DE_USO]: 'Fora de Uso',
      [AtivoStatus.DESCARTADO]: 'Descartado',
    };
    return status[this.status] || 'Desconhecido';
  }

  @ApiProperty({
    description: 'Indica se o ativo está ativo',
    example: true,
  })
  get isAtivo(): boolean {
    return this.status === AtivoStatus.ATIVO;
  }

  @ApiProperty({
    description: 'Indica se o ativo está em manutenção',
    example: false,
  })
  get isEmManutencao(): boolean {
    return this.status === AtivoStatus.MANUTENCAO;
  }

  @ApiProperty({
    description: 'Indica se o ativo está fora de uso',
    example: false,
  })
  get isForaDeUso(): boolean {
    return this.status === AtivoStatus.FORA_DE_USO;
  }

  @ApiProperty({
    description: 'Indica se o ativo foi descartado',
    example: false,
  })
  get isDescartado(): boolean {
    return this.status === AtivoStatus.DESCARTADO;
  }

  @ApiProperty({
    description: 'Idade do ativo em anos',
    example: 1,
  })
  get idadeAnos(): number {
    if (!this.dataAquisicao) return 0;
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - this.dataAquisicao.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  }

  @ApiProperty({
    description: 'Valor formatado da aquisição',
    example: 'R$ 150,00',
  })
  get valorAquisicaoFormatado(): string {
    if (!this.valorAquisicao) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valorAquisicao);
  }

  @ApiProperty({
    description: 'Data de aquisição formatada',
    example: '15/01/2023',
  })
  get dataAquisicaoFormatada(): string {
    if (!this.dataAquisicao) return 'N/A';
    return this.dataAquisicao.toLocaleDateString('pt-BR');
  }

  @ApiProperty({
    description: 'Data de fabricação formatada',
    example: '01/12/2022',
  })
  get dataFabricacaoFormatada(): string {
    if (!this.dataFabricacao) return 'N/A';
    return this.dataFabricacao.toLocaleDateString('pt-BR');
  }
}
