import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Unidade } from './Unidade';
import { OS } from './OS';

export enum TipoAtivo {
  EQUIPAMENTO_ELETRICO = 'equipamento_eletrico',
  EQUIPAMENTO_MECANICO = 'equipamento_mecanico',
  EQUIPAMENTO_QUIMICO = 'equipamento_quimico',
  EQUIPAMENTO_BIOLOGICO = 'equipamento_biologico',
  EXTINTOR = 'extintor',
  LINHA_VIDA = 'linha_vida',
  TANQUE = 'tanque',
  FERRAMENTA = 'ferramenta',
  EPI = 'epi',
  OUTROS = 'outros'
}

export enum StatusAtivo {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  MANUTENCAO = 'manutencao',
  FORA_SERVICO = 'fora_servico',
  DESCONTINUADO = 'descontinuado',
  RESERVA = 'reserva'
}

@Entity('ativos')
export class Ativo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  codigo: string;

  @Column({ type: 'enum', enum: TipoAtivo })
  tipo: TipoAtivo;

  @Column({ type: 'enum', enum: StatusAtivo, default: StatusAtivo.ATIVO })
  status: StatusAtivo;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  numeroSerie: string;

  @Column({ type: 'date' })
  dataAquisicao: Date;

  @Column({ type: 'date', nullable: true })
  dataInstalacao: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  valorAquisicao: number;

  @Column({ type: 'integer', nullable: true })
  vidaUtilAnos: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  localizacao: string;

  @Column({ type: 'jsonb', nullable: true })
  coordenadas: { lat: number; lng: number };

  @Column({ type: 'jsonb', nullable: true })
  especificacoes: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  manutencao: Array<{
    data: Date;
    tipo: 'preventiva' | 'corretiva' | 'preditiva';
    descricao: string;
    custo: number;
    tecnico: string;
    proximaManutencao: Date;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  inspecoes: Array<{
    data: Date;
    inspetor: string;
    resultado: 'aprovado' | 'reprovado' | 'condicional';
    observacoes: string;
    proximaInspecao: Date;
  }>;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagemUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  qrCodeUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  manualUrl: string;

  @ManyToOne(() => Unidade, unidade => unidade.ativos)
  @JoinColumn({ name: 'unidadeId' })
  unidade: Unidade;

  @Column({ type: 'uuid' })
  unidadeId: string;

  @OneToMany(() => OS, os => os.ativo)
  ordensServico: OS[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Métodos auxiliares
  getAge(): number {
    const today = new Date();
    const aquisicao = new Date(this.dataAquisicao);
    return today.getFullYear() - aquisicao.getFullYear();
  }

  needsMaintenance(): boolean {
    if (!this.manutencao || this.manutencao.length === 0) return false;
    
    const lastMaintenance = this.manutencao[this.manutencao.length - 1];
    if (!lastMaintenance.proximaManutencao) return false;
    
    const today = new Date();
    return today >= new Date(lastMaintenance.proximaManutencao);
  }

  needsInspection(): boolean {
    if (!this.inspecoes || this.inspecoes.length === 0) return false;
    
    const lastInspection = this.inspecoes[this.inspecoes.length - 1];
    if (!lastInspection.proximaInspecao) return false;
    
    const today = new Date();
    return today >= new Date(lastInspection.proximaInspecao);
  }

  isExpired(): boolean {
    if (!this.vidaUtilAnos) return false;
    return this.getAge() >= this.vidaUtilAnos;
  }

  getStatusColor(): string {
    switch (this.status) {
      case StatusAtivo.ATIVO: return 'green';
      case StatusAtivo.MANUTENCAO: return 'yellow';
      case StatusAtivo.FORA_SERVICO: return 'red';
      case StatusAtivo.INATIVO: return 'gray';
      case StatusAtivo.RESERVA: return 'blue';
      default: return 'blue';
    }
  }
}
