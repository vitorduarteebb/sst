import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from './Pessoa';
import { Turma } from './Turma';

export enum StatusPresenca {
  PRESENTE = 'presente',
  AUSENTE = 'ausente',
  AUSENTE_JUSTIFICADA = 'ausente_justificada',
  ATRASO = 'atraso'
}

@Entity('presencas')
export class Presenca {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pessoa, pessoa => pessoa.presencas)
  @JoinColumn({ name: 'pessoaId' })
  pessoa: Pessoa;

  @Column({ type: 'uuid' })
  pessoaId: string;

  @ManyToOne(() => Turma, turma => turma.presencas)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @Column({ type: 'uuid' })
  turmaId: string;

  @Column({ type: 'date' })
  data: Date;

  @Column({ type: 'time', nullable: true })
  horaEntrada: string;

  @Column({ type: 'time', nullable: true })
  horaSaida: string;

  @Column({ type: 'enum', enum: StatusPresenca, default: StatusPresenca.AUSENTE })
  status: StatusPresenca;

  @Column({ type: 'text', nullable: true })
  justificativa: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  justificadaPor: string;

  @Column({ type: 'timestamp', nullable: true })
  justificadaEm: Date;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
