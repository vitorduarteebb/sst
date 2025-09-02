import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from './Pessoa';
import { Turma } from './Turma';

export enum StatusMatricula {
  PENDENTE = 'pendente',
  ATIVA = 'ativa',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada',
  SUSPENSA = 'suspensa'
}

@Entity('matriculas')
export class Matricula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pessoa, pessoa => pessoa.matriculas)
  @JoinColumn({ name: 'pessoaId' })
  pessoa: Pessoa;

  @Column({ type: 'uuid' })
  pessoaId: string;

  @ManyToOne(() => Turma, turma => turma.matriculas)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @Column({ type: 'uuid' })
  turmaId: string;

  @Column({ type: 'enum', enum: StatusMatricula, default: StatusMatricula.PENDENTE })
  status: StatusMatricula;

  @Column({ type: 'date' })
  dataMatricula: Date;

  @Column({ type: 'date', nullable: true })
  dataConclusao: Date;

  @Column({ type: 'integer', nullable: true })
  notaFinal: number;

  @Column({ type: 'boolean', default: false })
  aprovado: boolean;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'jsonb', nullable: true })
  frequencia: Array<{
    data: Date;
    presente: boolean;
    justificativa?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  notas: Array<{
    atividade: string;
    nota: number;
    peso: number;
    data: Date;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
