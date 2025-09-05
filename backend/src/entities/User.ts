import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  TECNICO = 'tecnico',
  AUDITOR = 'auditor',
  USER = 'user'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, length: 14 })
  cpf: string;

  @Column()
  password: string;

  @Column({ length: 20, nullable: true })
  telefone?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: true })
  ativo: boolean;

  @Column({ nullable: true })
  empresaId?: string;

  @Column({ nullable: true })
  unidadeId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
