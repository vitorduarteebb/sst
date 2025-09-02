import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Matricula } from './Matricula';
import { Presenca } from './Presenca';
import { Avaliacao } from './Avaliacao';

@Entity('pessoas')
export class Pessoa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 14, nullable: false, unique: true })
  cpf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rg: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  funcao: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cargo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  dataNascimento: Date;

  @Column({ type: 'date', nullable: true })
  dataAdmissao: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  endereco: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  uf: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  cep: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nomeMae: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nomePai: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estadoCivil: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  genero: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  escolaridade: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Empresa, empresa => empresa.pessoas)
  empresa: Empresa;

  @Column({ type: 'uuid', nullable: true })
  empresaId: string;

  @OneToMany(() => Matricula, matricula => matricula.pessoa)
  matriculas: Matricula[];

  @OneToMany(() => Presenca, presenca => presenca.pessoa)
  presencas: Presenca[];

  @OneToMany(() => Avaliacao, avaliacao => avaliacao.pessoa)
  avaliacoes: Avaliacao[];
}
