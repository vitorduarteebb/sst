import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Unidade } from './Unidade';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  nome: string;

  @Column({ length: 18, unique: true })
  cnpj: string;

  @Column({ length: 200, nullable: true })
  endereco?: string;

  @Column({ length: 100, nullable: true })
  cidade?: string;

  @Column({ length: 2, nullable: true })
  estado?: string;

  @Column({ length: 20, nullable: true })
  telefone?: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Unidade, unidade => unidade.empresa)
  unidades: Unidade[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
