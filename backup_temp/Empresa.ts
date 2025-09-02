import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Unidade } from './Unidade';
import { Pessoa } from './Pessoa';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  razaoSocial: string;

  @Column({ type: 'varchar', length: 18, nullable: false, unique: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  nomeFantasia: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  endereco: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  uf: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  cep: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  responsavel: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefoneResponsavel: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emailResponsavel: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => Unidade, unidade => unidade.empresa)
  unidades: Unidade[];

  @OneToMany(() => Pessoa, pessoa => pessoa.empresa)
  pessoas: Pessoa[];
}
