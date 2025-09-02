import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresa } from './Empresa';
import { Unidade } from './Unidade';
import { User } from './User';
import { Certificado } from './Certificado';

export enum TrainingType {
  NR10 = 'nr10',
  NR20 = 'nr20',
  NR33 = 'nr33',
  NR35 = 'nr35',
  BRIGADA_INCENDIO = 'brigada_incendio',
  PRIMEIROS_SOCORROS = 'primeiros_socorros',
  EXTINTORES = 'extintores',
  ESPACOS_CONFINADOS = 'espacos_confinados',
  TRABALHO_ALTURA = 'trabalho_altura',
  OUTROS = 'outros'
}

export enum TrainingStatus {
  PLANEJADO = 'planejado',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado',
  SUSPENSO = 'suspenso'
}

export enum TrainingModality {
  PRESENCIAL = 'presencial',
  ONLINE = 'online',
  HIBRIDO = 'hibrido',
  EAD = 'ead'
}

@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TrainingType })
  type: TrainingType;

  @Column({ type: 'enum', enum: TrainingStatus, default: TrainingStatus.PLANEJADO })
  status: TrainingStatus;

  @Column({ type: 'enum', enum: TrainingModality, default: TrainingModality.PRESENCIAL })
  modality: TrainingModality;

  @Column({ type: 'integer' })
  durationHours: number;

  @Column({ type: 'integer' })
  maxStudents: number;

  @Column({ type: 'integer' })
  minStudents: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  location: string;

  @Column({ type: 'jsonb', nullable: true })
  coordinates: { lat: number; lng: number };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instructor: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instructorCredentials: string;

  @Column({ type: 'jsonb', nullable: true })
  syllabus: Array<{
    topic: string;
    duration: number;
    description: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  materials: Array<{
    name: string;
    type: 'pdf' | 'video' | 'link' | 'other';
    url: string;
    description: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  requirements: Array<{
    description: string;
    mandatory: boolean;
  }>;

  @Column({ type: 'boolean', default: false })
  hasExam: boolean;

  @Column({ type: 'integer', nullable: true })
  passingScore: number;

  @Column({ type: 'integer', nullable: true })
  maxAttempts: number;

  @Column({ type: 'boolean', default: false })
  issuesCertificate: boolean;

  @Column({ type: 'integer', nullable: true })
  certificateValidityYears: number;

  @Column({ type: 'jsonb', nullable: true })
  schedule: Array<{
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }>;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Empresa, empresa => empresa.trainings)
  @JoinColumn({ name: 'empresaId' })
  empresa: Empresa;

  @Column({ type: 'uuid' })
  empresaId: string;

  @ManyToOne(() => Unidade, unidade => unidade.trainings)
  @JoinColumn({ name: 'unidadeId' })
  unidade: Unidade;

  @Column({ type: 'uuid' })
  unidadeId: string;

  @ManyToOne(() => User, user => user.createdTrainings)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'uuid' })
  createdById: string;

  @OneToMany(() => TrainingEnrollment, enrollment => enrollment.training)
  enrollments: TrainingEnrollment[];

  @OneToMany(() => Certificado, certificado => certificado.training)
  certificados: Certificado[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Métodos auxiliares
  isActive(): boolean {
    const today = new Date();
    return today >= this.startDate && today <= this.endDate;
  }

  isFull(): boolean {
    return this.enrollments?.filter(e => e.status === TrainingEnrollmentStatus.ACTIVE).length >= this.maxStudents;
  }

  canEnroll(): boolean {
    return this.status === TrainingStatus.PLANEJADO && !this.isFull();
  }

  getProgress(): number {
    if (this.status === TrainingStatus.CONCLUIDO) return 100;
    if (this.status === TrainingStatus.PLANEJADO) return 0;
    
    const total = this.endDate.getTime() - this.startDate.getTime();
    const elapsed = new Date().getTime() - this.startDate.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  getDurationDays(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

@Entity('training_enrollments')
export class TrainingEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Training, training => training.enrollments)
  @JoinColumn({ name: 'trainingId' })
  training: Training;

  @Column({ type: 'uuid' })
  trainingId: string;

  @ManyToOne(() => User, user => user.enrollments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: TrainingEnrollmentStatus, default: TrainingEnrollmentStatus.PENDING })
  status: TrainingEnrollmentStatus;

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'date', nullable: true })
  completionDate: Date;

  @Column({ type: 'integer', nullable: true })
  attendancePercentage: number;

  @Column({ type: 'integer', nullable: true })
  examScore: number;

  @Column({ type: 'boolean', default: false })
  passed: boolean;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'jsonb', nullable: true })
  progress: {
    completedTopics: string[];
    currentTopic: string;
    timeSpent: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum TrainingEnrollmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended'
}
