import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Ativo } from './Ativo';
import { OS } from './OS';
import { Turma } from './Turma';

@Entity('unidades')
export class Unidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nome: string;

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

  @Column({ type: 'varchar', length: 200, nullable: true })
  tipoUnidade: string; // Industrial, Comercial, Escritório, etc.

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  // Georreferenciamento PostGIS
  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  geo: any; // Point(lat, lng)

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Empresa, empresa => empresa.unidades)
  empresa: Empresa;

  @Column({ type: 'uuid', nullable: false })
  empresaId: string;

  @OneToMany(() => Ativo, ativo => ativo.unidade)
  ativos: Ativo[];

  @OneToMany(() => OS, os => os.unidade)
  ordensServico: OS[];

  @OneToMany(() => Turma, turma => turma.unidade)
  turmas: Turma[];
}
