import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Unidade } from './Unidade';
import { OS } from './OS';

export enum AssetType {
  EXTINTOR = 'extintor',
  LINHA_VIDA = 'linha_vida',
  TANQUE = 'tanque',
  EQUIPAMENTO_ELETRICO = 'equipamento_eletrico',
  EQUIPAMENTO_MECANICO = 'equipamento_mecanico',
  EQUIPAMENTO_QUIMICO = 'equipamento_quimico',
  EQUIPAMENTO_BIOLOGICO = 'equipamento_biologico',
  OUTROS = 'outros'
}

export enum AssetStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  MANUTENCAO = 'manutencao',
  FORA_SERVICO = 'fora_servico',
  DESCONTINUADO = 'descontinuado'
}

export enum AssetPriority {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta',
  CRITICA = 'critica'
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  serialNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  model: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  manufacturer: string;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.ATIVO })
  status: AssetStatus;

  @Column({ type: 'enum', enum: AssetPriority, default: AssetPriority.MEDIA })
  priority: AssetPriority;

  @Column({ type: 'date' })
  installationDate: Date;

  @Column({ type: 'date', nullable: true })
  lastInspectionDate: Date;

  @Column({ type: 'date', nullable: true })
  nextInspectionDate: Date;

  @Column({ type: 'date', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ type: 'integer', nullable: true })
  lifespanYears: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchaseValue: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'jsonb', nullable: true })
  coordinates: { lat: number; lng: number };

  @Column({ type: 'jsonb', nullable: true })
  specifications: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  maintenanceHistory: Array<{
    date: Date;
    description: string;
    cost: number;
    technician: string;
    nextMaintenance: Date;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  inspectionHistory: Array<{
    date: Date;
    inspector: string;
    result: 'aprovado' | 'reprovado' | 'condicional';
    observations: string;
    nextInspection: Date;
  }>;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  qrCodeUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  manualUrl: string;

  @ManyToOne(() => Empresa, empresa => empresa.assets)
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @Column({ type: 'uuid' })
  empresaId: string;

  @ManyToOne(() => Unidade, unidade => unidade.assets)
  @JoinColumn({ name: 'unidadeId' })
  unidade: Unidade;

  @Column({ type: 'uuid' })
  unidadeId: string;

  @OneToMany(() => OS, os => os.asset)
  ordensServico: OS[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Métodos auxiliares
  needsInspection(): boolean {
    if (!this.nextInspectionDate) return false;
    const today = new Date();
    const nextInspection = new Date(this.nextInspectionDate);
    return today >= nextInspection;
  }

  needsMaintenance(): boolean {
    if (!this.nextMaintenanceDate) return false;
    const today = new Date();
    const nextMaintenance = new Date(this.nextMaintenanceDate);
    return today >= nextMaintenance;
  }

  getAge(): number {
    const today = new Date();
    const installation = new Date(this.installationDate);
    return today.getFullYear() - installation.getFullYear();
  }

  isExpired(): boolean {
    if (!this.lifespanYears) return false;
    return this.getAge() >= this.lifespanYears;
  }

  getStatusColor(): string {
    switch (this.status) {
      case AssetStatus.ATIVO: return 'green';
      case AssetStatus.MANUTENCAO: return 'yellow';
      case AssetStatus.FORA_SERVICO: return 'red';
      case AssetStatus.INATIVO: return 'gray';
      default: return 'blue';
    }
  }
}
