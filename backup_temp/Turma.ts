import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Unidade } from './Unidade';
import { Pessoa } from './Pessoa';
import { Matricula } from './Matricula';
import { Prova } from './Prova';
import { Presenca } from './Presenca';

@Entity('turmas')
export class Turma {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  norma: string; // NR10, NR20, NR33, NR35, etc.

  @Column({ type: 'varchar', length: 200, nullable: true })
  local: string;

  @Column({ type: 'date', nullable: false })
  dataInicio: Date;

  @Column({ type: 'date', nullable: false })
  dataFim: Date;

  @Column({ type: 'time', nullable: true })
  horarioInicio: string;

  @Column({ type: 'time', nullable: true })
  horarioFim: string;

  @Column({ type: 'int', nullable: false })
  cargaHoraria: number; // em horas

  @Column({ type: 'int', nullable: false, default: 0 })
  lotacao: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  vagasOcupadas: number;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'ABERTA' })
  status: string; // ABERTA, EM_ANDAMENTO, CONCLUIDA, CANCELADA

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  notaMinima: number; // nota mínima para aprovação

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Unidade, unidade => unidade.turmas)
  unidade: Unidade;

  @Column({ type: 'uuid', nullable: false })
  unidadeId: string;

  @ManyToOne(() => Pessoa, pessoa => pessoa.id)
  instrutor: Pessoa;

  @Column({ type: 'uuid', nullable: false })
  instrutorId: string;

  @OneToMany(() => Matricula, matricula => matricula.turma)
  matriculas: Matricula[];

  @OneToMany(() => Prova, prova => prova.turma)
  provas: Prova[];

  @OneToMany(() => Presenca, presenca => presenca.turma)
  presencas: Presenca[];

  // Métodos
  get vagasDisponiveis(): number {
    return this.lotacao - this.vagasOcupadas;
  }

  get percentualOcupacao(): number {
    return this.lotacao > 0 ? (this.vagasOcupadas / this.lotacao) * 100 : 0;
  }

  podeMatricular(): boolean {
    return this.status === 'ABERTA' && this.vagasDisponiveis > 0;
  }
}
