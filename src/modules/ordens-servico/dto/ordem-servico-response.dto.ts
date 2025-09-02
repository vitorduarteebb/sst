import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrdemServicoStatus, OrdemServicoPrioridade, OrdemServicoTipo } from './create-ordem-servico.dto';

export class OrdemServicoResponseDto {
  @ApiProperty({
    description: 'ID único da ordem de serviço',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Título da ordem de serviço',
    example: 'Manutenção Preventiva - Extintores',
  })
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada da ordem de serviço',
    example: 'Realizar manutenção preventiva em todos os extintores da unidade',
  })
  descricao: string;

  @ApiProperty({
    description: 'Status da ordem de serviço',
    enum: OrdemServicoStatus,
    example: OrdemServicoStatus.PENDENTE,
  })
  status: OrdemServicoStatus;

  @ApiProperty({
    description: 'Prioridade da ordem de serviço',
    enum: OrdemServicoPrioridade,
    example: OrdemServicoPrioridade.MEDIA,
  })
  prioridade: OrdemServicoPrioridade;

  @ApiProperty({
    description: 'Tipo da ordem de serviço',
    enum: OrdemServicoTipo,
    example: OrdemServicoTipo.MANUTENCAO,
  })
  tipo: OrdemServicoTipo;

  @ApiProperty({
    description: 'Data de início prevista',
    example: '2023-12-01T08:00:00Z',
  })
  dataInicio: Date;

  @ApiProperty({
    description: 'Data de fim prevista',
    example: '2023-12-01T17:00:00Z',
  })
  dataFim: Date;

  @ApiProperty({
    description: 'ID do responsável pela ordem de serviço',
    example: '1',
  })
  responsavelId: string;

  @ApiProperty({
    description: 'Nome do responsável',
    example: 'João Silva',
  })
  responsavelNome: string;

  @ApiProperty({
    description: 'ID da unidade onde será executada a OS',
    example: '1',
  })
  unidadeId: string;

  @ApiProperty({
    description: 'Nome da unidade',
    example: 'Unidade Central',
  })
  unidadeNome: string;

  @ApiProperty({
    description: 'ID do ativo relacionado (opcional)',
    example: '1',
    required: false,
  })
  ativoId?: string;

  @ApiProperty({
    description: 'Nome do ativo',
    example: 'Extintor ABC 6kg',
    required: false,
  })
  ativoNome?: string;

  @ApiProperty({
    description: 'ID da empresa',
    example: 'empresa-1',
  })
  empresaId: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa ABC Ltda',
  })
  empresaNome: string;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Verificar se há materiais disponíveis antes de iniciar',
    required: false,
  })
  observacoes?: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2023-12-01T08:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2023-12-01T08:00:00Z',
  })
  updatedAt: Date;

  // Propriedades computadas
  @ApiProperty({
    description: 'Descrição do status da OS',
    example: 'Pendente',
  })
  get statusDescricao(): string {
    const status = {
      [OrdemServicoStatus.PENDENTE]: 'Pendente',
      [OrdemServicoStatus.EM_ANDAMENTO]: 'Em Andamento',
      [OrdemServicoStatus.PAUSADA]: 'Pausada',
      [OrdemServicoStatus.CONCLUIDA]: 'Concluída',
      [OrdemServicoStatus.CANCELADA]: 'Cancelada',
    };
    return status[this.status] || 'Desconhecido';
  }

  @ApiProperty({
    description: 'Descrição da prioridade da OS',
    example: 'Média',
  })
  get prioridadeDescricao(): string {
    const prioridades = {
      [OrdemServicoPrioridade.BAIXA]: 'Baixa',
      [OrdemServicoPrioridade.MEDIA]: 'Média',
      [OrdemServicoPrioridade.ALTA]: 'Alta',
      [OrdemServicoPrioridade.URGENTE]: 'Urgente',
    };
    return prioridades[this.prioridade] || 'Desconhecida';
  }

  @ApiProperty({
    description: 'Descrição do tipo da OS',
    example: 'Manutenção',
  })
  get tipoDescricao(): string {
    const tipos = {
      [OrdemServicoTipo.MANUTENCAO]: 'Manutenção',
      [OrdemServicoTipo.INSPECAO]: 'Inspeção',
      [OrdemServicoTipo.LIMPEZA]: 'Limpeza',
      [OrdemServicoTipo.REPARO]: 'Reparo',
      [OrdemServicoTipo.INSTALACAO]: 'Instalação',
      [OrdemServicoTipo.OUTRO]: 'Outro',
    };
    return tipos[this.tipo] || 'Desconhecido';
  }

  @ApiProperty({
    description: 'Indica se a OS está pendente',
    example: true,
  })
  get isPendente(): boolean {
    return this.status === OrdemServicoStatus.PENDENTE;
  }

  @ApiProperty({
    description: 'Indica se a OS está em andamento',
    example: false,
  })
  get isEmAndamento(): boolean {
    return this.status === OrdemServicoStatus.EM_ANDAMENTO;
  }

  @ApiProperty({
    description: 'Indica se a OS está concluída',
    example: false,
  })
  get isConcluida(): boolean {
    return this.status === OrdemServicoStatus.CONCLUIDA;
  }

  @ApiProperty({
    description: 'Indica se a OS é urgente',
    example: false,
  })
  get isUrgente(): boolean {
    return this.prioridade === OrdemServicoPrioridade.URGENTE;
  }

  @ApiProperty({
    description: 'Duração prevista em horas',
    example: 8,
  })
  get duracaoPrevistaHoras(): number {
    if (!this.dataInicio || !this.dataFim) return 0;
    const diffTime = Math.abs(this.dataFim.getTime() - this.dataInicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
  }

  @ApiProperty({
    description: 'Data de início formatada',
    example: '01/12/2023 08:00',
  })
  get dataInicioFormatada(): string {
    if (!this.dataInicio) return 'N/A';
    return this.dataInicio.toLocaleString('pt-BR');
  }

  @ApiProperty({
    description: 'Data de fim formatada',
    example: '01/12/2023 17:00',
  })
  get dataFimFormatada(): string {
    if (!this.dataFim) return 'N/A';
    return this.dataFim.toLocaleString('pt-BR');
  }
}
