import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';

export enum UnidadeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export enum UnidadeTipo {
  FILIAL = 'FILIAL',
  MATRIZ = 'MATRIZ',
  DEPOSITO = 'DEPOSITO',
  ESCRITORIO = 'ESCRITORIO',
  FABRICA = 'FABRICA',
  OBRA = 'OBRA',
  OFICINA = 'OFICINA',
  LABORATORIO = 'LABORATORIO',
  ALMOXARIFADO = 'ALMOXARIFADO',
  GARAGEM = 'GARAGEM',
  OUTRO = 'OUTRO'
}

@Entity('unidades')
export class Unidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  nome: string;

  @Column({ length: 200, nullable: true })
  endereco?: string;

  @Column({ length: 100, nullable: true })
  cidade?: string;

  @Column({ length: 2, nullable: true })
  estado?: string;

  @Column({ type: 'enum', enum: UnidadeStatus, default: UnidadeStatus.ACTIVE })
  status: UnidadeStatus;

  @Column({ type: 'enum', enum: UnidadeTipo, default: UnidadeTipo.FILIAL })
  tipo: UnidadeTipo;

  @Column()
  empresaId: string;

  @ManyToOne(() => Empresa, empresa => empresa.unidades)
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
