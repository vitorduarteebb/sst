import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Unidade } from './Unidade';
import { OS } from './OS';
import { Evidencia } from './Evidencia';
import { Certificado } from './Certificado';

export enum UserRole {
  ADMIN = 'admin',
  COORDENACAO = 'coordenacao',
  TECNICO = 'tecnico',
  CLIENTE = 'cliente',
  AUDITOR = 'auditor'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_APPROVAL = 'pending_approval'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cpf: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENTE })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_APPROVAL })
  status: UserStatus;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  phoneVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  lastLoginIp: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  permissions: string[];

  @ManyToOne(() => Empresa, empresa => empresa.users, { nullable: true })
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @Column({ type: 'uuid', nullable: true })
  empresaId: string;

  @ManyToOne(() => Unidade, unidade => unidade.users, { nullable: true })
  @JoinColumn({ name: 'unidadeId' })
  unidade: Unidade;

  @Column({ type: 'uuid', nullable: true })
  unidadeId: string;

  @OneToMany(() => OS, os => os.createdBy)
  createdOS: OS[];

  @OneToMany(() => OS, os => os.assignedTo)
  assignedOS: OS[];

  @OneToMany(() => Evidencia, evidencia => evidencia.createdBy)
  evidencias: Evidencia[];

  @OneToMany(() => Certificado, certificado => certificado.user)
  certificados: Certificado[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Métodos auxiliares
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  hasPermission(permission: string): boolean {
    return this.permissions?.includes(permission) || this.role === UserRole.ADMIN;
  }

  canAccessResource(resourceOwnerId: string): boolean {
    return this.role === UserRole.ADMIN || this.id === resourceOwnerId;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }
}
