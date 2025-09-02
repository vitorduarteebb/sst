import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Turma } from './Turma';
import { Avaliacao } from './Avaliacao';

export enum TipoProva {
  OBJETIVA = 'objetiva',
  DISSERTATIVA = 'dissertativa',
  PRATICA = 'pratica',
  MISTA = 'mista'
}

export enum StatusProva {
  RASCUNHO = 'rascunho',
  ATIVA = 'ativa',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDA = 'concluida',
  ARQUIVADA = 'arquivada'
}

@Entity('provas')
export class Prova {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'enum', enum: TipoProva })
  tipo: TipoProva;

  @Column({ type: 'enum', enum: StatusProva, default: StatusProva.RASCUNHO })
  status: StatusProva;

  @Column({ type: 'integer' })
  duracaoMinutos: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10.0 })
  notaMaxima: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 6.0 })
  notaMinima: number;

  @Column({ type: 'date', nullable: true })
  dataInicio: Date;

  @Column({ type: 'date', nullable: true })
  dataFim: Date;

  @Column({ type: 'time', nullable: true })
  horaInicio: string;

  @Column({ type: 'time', nullable: true })
  horaFim: string;

  @Column({ type: 'boolean', default: false })
  permiteConsultarMaterial: boolean;

  @Column({ type: 'boolean', default: false })
  permiteColaboracao: boolean;

  @Column({ type: 'integer', default: 1 })
  tentativasPermitidas: number;

  @Column({ type: 'jsonb', nullable: true })
  questoes: Array<{
    id: string;
    tipo: 'objetiva' | 'dissertativa' | 'verdadeiro_falso' | 'associacao';
    enunciado: string;
    alternativas?: string[];
    respostaCorreta?: string | string[];
    peso: number;
    tempoEstimado: number;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  instrucoes: Array<{
    ordem: number;
    instrucao: string;
    obrigatoria: boolean;
  }>;

  @ManyToOne(() => Turma, turma => turma.provas)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @Column({ type: 'uuid' })
  turmaId: string;

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.prova)
  avaliacoes: Avaliacao[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Métodos auxiliares
  isAtiva(): boolean {
    const now = new Date();
    return this.status === StatusProva.ATIVA && 
           this.dataInicio <= now && 
           this.dataFim >= now;
  }

  getDuracaoHoras(): number {
    return this.duracaoMinutos / 60;
  }

  getTotalQuestoes(): number {
    return this.questoes?.length || 0;
  }

  getPesoTotal(): number {
    return this.questoes?.reduce((total, questao) => total + questao.peso, 0) || 0;
  }
}
