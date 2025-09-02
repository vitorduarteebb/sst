import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('change_journal')
export class ChangeJournal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  operacao: string; // CREATE, UPDATE, DELETE

  @Column({ type: 'varchar', length: 100, nullable: false })
  entidade: string; // Nome da entidade (OS, Evidencia, etc.)

  @Column({ type: 'uuid', nullable: false })
  entidadeId: string; // ID da entidade

  @Column({ type: 'jsonb', nullable: false })
  payload: any; // Dados da operação

  @Column({ type: 'varchar', length: 100, nullable: false })
  clientId: string; // ID único do cliente/dispositivo

  @Column({ type: 'bigint', nullable: false })
  lamportClock: number; // Relógio de Lamport para ordenação causal

  @Column({ type: 'varchar', length: 100, nullable: true })
  deviceId: string; // ID do dispositivo

  @Column({ type: 'varchar', length: 100, nullable: true })
  appVersion: string; // Versão do app

  @Column({ type: 'timestamp', nullable: false })
  timestampCliente: Date; // Timestamp do cliente

  @Column({ type: 'timestamp', nullable: true })
  timestampServidor: Date; // Timestamp do servidor

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'PENDENTE' })
  status: string; // PENDENTE, PROCESSANDO, CONCLUIDA, ERRO, CONFLITO

  @Column({ type: 'int', nullable: false, default: 0 })
  tentativas: number; // Número de tentativas de processamento

  @Column({ type: 'timestamp', nullable: true })
  proximaTentativa: Date; // Próxima tentativa de processamento

  @Column({ type: 'text', nullable: true })
  erro: string; // Mensagem de erro se houver

  @Column({ type: 'jsonb', nullable: true })
  resultado: any; // Resultado do processamento

  @Column({ type: 'boolean', default: false })
  processado: boolean; // Se foi processado com sucesso

  @Column({ type: 'boolean', default: false })
  sincronizado: boolean; // Se foi sincronizado com outros clientes

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos
  get isPendente(): boolean {
    return this.status === 'PENDENTE';
  }

  get isProcessando(): boolean {
    return this.status === 'PROCESSANDO';
  }

  get isConcluida(): boolean {
    return this.status === 'CONCLUIDA';
  }

  get isErro(): boolean {
    return this.status === 'ERRO';
  }

  get isConflito(): boolean {
    return this.status === 'CONFLITO';
  }

  get podeSerProcessado(): boolean {
    return this.isPendente || this.isErro;
  }

  get deveTentarNovamente(): boolean {
    if (this.isConcluida || this.isConflito) return false;
    
    if (this.proximaTentativa) {
      return new Date() >= this.proximaTentativa;
    }
    
    return this.isErro && this.tentativas < 3;
  }

  // Marca como processando
  marcarProcessando(): void {
    this.status = 'PROCESSANDO';
    this.timestampServidor = new Date();
  }

  // Marca como concluída
  marcarConcluida(resultado?: any): void {
    this.status = 'CONCLUIDA';
    this.processado = true;
    this.resultado = resultado;
    this.timestampServidor = new Date();
  }

  // Marca como erro
  marcarErro(mensagem: string): void {
    this.status = 'ERRO';
    this.erro = mensagem;
    this.tentativas++;
    this.timestampServidor = new Date();
    
    // Calcula próxima tentativa com backoff exponencial
    if (this.tentativas < 3) {
      const delay = Math.pow(2, this.tentativas) * 1000; // 2s, 4s, 8s
      this.proximaTentativa = new Date(Date.now() + delay);
    }
  }

  // Marca como conflito
  marcarConflito(mensagem: string): void {
    this.status = 'CONFLITO';
    this.erro = mensagem;
    this.timestampServidor = new Date();
  }

  // Incrementa o relógio de Lamport
  incrementarLamportClock(clockRecebido: number): void {
    this.lamportClock = Math.max(this.lamportClock, clockRecebido) + 1;
  }

  // Gera ID único para deduplicação
  get deduplicationKey(): string {
    return `${this.operacao}:${this.entidade}:${this.entidadeId}:${this.clientId}:${this.lamportClock}`;
  }

  // Valida se o journal está completo
  isValid(): boolean {
    return this.operacao && 
           this.entidade && 
           this.entidadeId && 
           this.clientId && 
           this.lamportClock !== undefined &&
           this.payload;
  }
}
