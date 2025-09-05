import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Unidade } from './Unidade';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  razaoSocial: string;

  @Column({ length: 200 })
  nomeFantasia: string;

  @Column({ length: 18, unique: true })
  cnpj: string;

  @Column({ length: 20, nullable: true })
  inscricaoEstadual?: string;

  @Column({ length: 20, nullable: true })
  inscricaoMunicipal?: string;

  @Column({ length: 10, nullable: true })
  cep?: string;

  @Column({ length: 200, nullable: true })
  logradouro?: string;

  @Column({ length: 10, nullable: true })
  numero?: string;

  @Column({ length: 100, nullable: true })
  complemento?: string;

  @Column({ length: 100, nullable: true })
  bairro?: string;

  @Column({ length: 100, nullable: true })
  cidade?: string;

  @Column({ length: 2, nullable: true })
  estado?: string;

  @Column({ length: 50, nullable: true })
  pais?: string;

  @Column({ length: 20, nullable: true })
  telefone?: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ length: 100, nullable: true })
  website?: string;

  @Column({ length: 100, nullable: true })
  responsavelTecnicoNome?: string;

  @Column({ length: 20, nullable: true })
  responsavelTecnicoCrea?: string;

  @Column({ length: 20, nullable: true })
  responsavelTecnicoTelefone?: string;

  @Column({ length: 100, nullable: true })
  responsavelTecnicoEmail?: string;

  @Column({ type: 'enum', enum: ['ativa', 'inativa', 'suspensa'], default: 'ativa' })
  status: 'ativa' | 'inativa' | 'suspensa';

  @OneToMany(() => Unidade, unidade => unidade.empresa)
  unidades: Unidade[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
