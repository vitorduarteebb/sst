import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pessoa } from './Pessoa';
import { Turma } from './Turma';

@Entity('certificados')
export class Certificado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  idPublico: string; // ID público para validação externa

  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  hashSha256: string; // Hash SHA-256 do payload canônico

  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  norma: string; // NR10, NR20, NR33, NR35, etc.

  @Column({ type: 'int', nullable: false })
  cargaHoraria: number; // em horas

  @Column({ type: 'date', nullable: false })
  dataConclusao: Date;

  @Column({ type: 'date', nullable: false })
  dataEmissao: Date;

  @Column({ type: 'date', nullable: true })
  dataValidade: Date;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'VALIDO' })
  status: string; // VALIDO, REVOGADO, EXPIRADO

  @Column({ type: 'text', nullable: true })
  motivoRevogacao: string;

  @Column({ type: 'uuid', nullable: true })
  revogadoPor: string; // ID do usuário que revogou

  @Column({ type: 'timestamp', nullable: true })
  dataRevogacao: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  urlVerificacao: string; // URL pública para validação

  @Column({ type: 'varchar', length: 500, nullable: true })
  qrCodeUrl: string; // URL do QR Code gerado

  @Column({ type: 'jsonb', nullable: true })
  payloadCanonico: any; // Payload usado para gerar o hash

  @Column({ type: 'jsonb', nullable: true })
  evidencias: any; // Hash das evidências (presença, prova, etc.)

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Pessoa, pessoa => pessoa.id)
  pessoa: Pessoa;

  @Column({ type: 'uuid', nullable: false })
  pessoaId: string;

  @ManyToOne(() => Turma, turma => turma.id)
  turma: Turma;

  @Column({ type: 'uuid', nullable: false })
  turmaId: string;

  // Métodos
  isValido(): boolean {
    return this.status === 'VALIDO' && 
           (!this.dataValidade || this.dataValidade > new Date());
  }

  podeSerRevogado(): boolean {
    return this.status === 'VALIDO';
  }

  get diasParaVencimento(): number {
    if (!this.dataValidade) return -1;
    const hoje = new Date();
    const diffTime = this.dataValidade.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Gera o payload canônico para cálculo do hash
  gerarPayloadCanonico(): any {
    return {
      certId: this.idPublico,
      pessoaId: this.pessoaId,
      turmaId: this.turmaId,
      norma: this.norma,
      cargaHoraria: this.cargaHoraria,
      dataConclusao: this.dataConclusao.toISOString().split('T')[0],
      evidenciasHash: this.evidencias?.hash || '',
      dataEmissao: this.dataEmissao.toISOString().split('T')[0]
    };
  }

  // Calcula o hash SHA-256 do payload canônico
  calcularHash(): string {
    const payload = this.gerarPayloadCanonico();
    const payloadString = JSON.stringify(payload, Object.keys(payload).sort());
    // Em produção, usar crypto.createHash('sha256').update(payloadString).digest('hex')
    return `sha256:${payloadString.length}`; // Placeholder
  }
}
