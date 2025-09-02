import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from './Pessoa';
import { Turma } from './Turma';

export enum TipoAvaliacao {
  PROVA_ESCRITA = 'prova_escrita',
  PROVA_PRATICA = 'prova_pratica',
  TRABALHO = 'trabalho',
  APRESENTACAO = 'apresentacao',
  PARTICIPACAO = 'participacao',
  OUTROS = 'outros'
}

@Entity('avaliacoes')
export class Avaliacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pessoa, pessoa => pessoa.avaliacoes)
  @JoinColumn({ name: 'pessoaId' })
  pessoa: Pessoa;

  @Column({ type: 'uuid' })
  pessoaId: string;

  @ManyToOne(() => Turma, turma => turma.avaliacoes)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @Column({ type: 'uuid' })
  turmaId: string;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'enum', enum: TipoAvaliacao })
  tipo: TipoAvaliacao;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  nota: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10.0 })
  notaMaxima: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  peso: number;

  @Column({ type: 'date' })
  dataAvaliacao: Date;

  @Column({ type: 'date', nullable: true })
  dataEntrega: Date;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avaliadoPor: string;

  @Column({ type: 'timestamp', nullable: true })
  avaliadoEm: Date;

  @Column({ type: 'jsonb', nullable: true })
  criterios: Array<{
    criterio: string;
    nota: number;
    peso: number;
    observacao?: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Métodos auxiliares
  getNotaPercentual(): number {
    return (this.nota / this.notaMaxima) * 100;
  }

  getNotaPonderada(): number {
    return this.nota * this.peso;
  }

  isAprovado(notaMinima: number = 6.0): boolean {
    return this.nota >= notaMinima;
  }
}
