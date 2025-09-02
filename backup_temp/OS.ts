import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Unidade } from './Unidade';
import { Pessoa } from './Pessoa';
import { ModeloChecklist } from './ModeloChecklist';
import { ExecucaoOS } from './ExecucaoOS';

@Entity('ordens_servico')
export class OS {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  numero: string; // Número sequencial da OS

  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'PENDENTE' })
  status: string; // PENDENTE, EM_EXECUCAO, CONCLUIDA, CANCELADA, PAUSADA

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'BAIXA' })
  prioridade: string; // BAIXA, MEDIA, ALTA, URGENTE

  @Column({ type: 'timestamp', nullable: false })
  dataAgendada: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataInicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataFim: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  sla: number; // SLA em minutos

  @Column({ type: 'timestamp', nullable: true })
  dataLimite: Date; // Data limite baseada no SLA

  @Column({ type: 'varchar', length: 100, nullable: true })
  localizacao: string; // Local específico na unidade

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  geo: any; // Coordenadas GPS específicas

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'text', nullable: true })
  instrucoes: string;

  @Column({ type: 'jsonb', nullable: true })
  metadados: any; // Dados adicionais específicos da OS

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Unidade, unidade => unidade.ordensServico)
  unidade: Unidade;

  @Column({ type: 'uuid', nullable: false })
  unidadeId: string;

  @ManyToOne(() => Pessoa, pessoa => pessoa.id)
  tecnico: Pessoa;

  @Column({ type: 'uuid', nullable: false })
  tecnicoId: string;

  @ManyToOne(() => ModeloChecklist, modelo => modelo.ordensServico)
  modeloChecklist: ModeloChecklist;

  @Column({ type: 'uuid', nullable: false })
  modeloChecklistId: string;

  @OneToMany(() => ExecucaoOS, execucao => execucao.ordemServico)
  execucoes: ExecucaoOS[];

  // Métodos
  get tempoDecorrido(): number {
    if (!this.dataInicio) return 0;
    const fim = this.dataFim || new Date();
    return Math.floor((fim.getTime() - this.dataInicio.getTime()) / (1000 * 60));
  }

  get tempoRestante(): number {
    if (!this.dataLimite) return -1;
    const agora = new Date();
    const diff = this.dataLimite.getTime() - agora.getTime();
    return Math.floor(diff / (1000 * 60));
  }

  get estaAtrasada(): boolean {
    if (!this.dataLimite) return false;
    return new Date() > this.dataLimite;
  }

  get percentualConcluido(): number {
    if (this.status === 'CONCLUIDA') return 100;
    if (this.status === 'PENDENTE') return 0;
    
    // Calcula baseado nos itens do checklist
    const execucaoAtual = this.execucoes?.find(e => e.status === 'EM_EXECUCAO');
    if (!execucaoAtual) return 0;
    
    return execucaoAtual.percentualConcluido || 0;
  }

  podeSerExecutada(): boolean {
    return this.status === 'PENDENTE' && 
           this.dataAgendada <= new Date() &&
           this.tecnicoId;
  }

  podeSerPausada(): boolean {
    return this.status === 'EM_EXECUCAO';
  }

  podeSerConcluida(): boolean {
    return this.status === 'EM_EXECUCAO' && this.percentualConcluido === 100;
  }

  // Calcula a data limite baseada no SLA
  calcularDataLimite(): Date {
    const dataBase = this.dataAgendada;
    const dataLimite = new Date(dataBase.getTime() + (this.sla * 60 * 1000));
    return dataLimite;
  }
}
