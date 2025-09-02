import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ItemChecklist } from './ItemChecklist';
import { OS } from './OS';

@Entity('modelos_checklist')
export class ModeloChecklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  versao: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoria: string; // NR10, NR20, NR33, NR35, Brigada, Extintores, etc.

  @Column({ type: 'varchar', length: 100, nullable: true })
  tipo: string; // Inspeção, Manutenção, Treinamento, etc.

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'text', nullable: true })
  instrucoes: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  tempoEstimado: number; // em minutos

  @Column({ type: 'boolean', default: false })
  requerFotos: boolean;

  @Column({ type: 'boolean', default: false })
  requerGPS: boolean;

  @Column({ type: 'boolean', default: false })
  requerAssinatura: boolean;

  @Column({ type: 'jsonb', nullable: true })
  configuracoes: any; // Configurações específicas do modelo

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => ItemChecklist, item => item.modelo)
  itens: ItemChecklist[];

  @OneToMany(() => OS, os => os.modeloChecklist)
  ordensServico: OS[];

  // Métodos
  get totalItens(): number {
    return this.itens?.length || 0;
  }

  get itensObrigatorios(): number {
    return this.itens?.filter(item => item.obrigatorio).length || 0;
  }

  get itensComFoto(): number {
    return this.itens?.filter(item => item.comFoto).length || 0;
  }

  get percentualCompleto(): number {
    if (!this.itens || this.itens.length === 0) return 0;
    return (this.itensObrigatorios / this.totalItens) * 100;
  }

  // Valida se o modelo está configurado corretamente
  isValid(): boolean {
    return this.nome && 
           this.versao && 
           this.categoria && 
           this.tipo && 
           this.itens && 
           this.itens.length > 0;
  }
}
