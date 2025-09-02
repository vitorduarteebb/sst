import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, length: 14 })
  cpf: string;

  @Column()
  password: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true })
  empresaId?: string;

  @Column({ nullable: true })
  unidadeId?: string;

  @Column({ type: 'simple-array', nullable: true })
  permissions: string[];

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  passwordChangedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  hasPermission(permission: string): boolean {
    return this.permissions?.includes(permission) || this.role === UserRole.ADMIN;
  }
}
