import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pessoa } from './Pessoa';

@Entity('evidencias')
export class Evidencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  tipo: string; // FOTO, VIDEO, GPS, ASSINATURA, DOCUMENTO, AUDIO

  @Column({ type: 'varchar', length: 50, nullable: false })
  refType: string; // Tipo da entidade referenciada (OS, TURMA, ATIVO, etc.)

  @Column({ type: 'uuid', nullable: false })
  refId: string; // ID da entidade referenciada

  @Column({ type: 'varchar', length: 500, nullable: true })
  storageKey: string; // Chave no S3 ou storage local

  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string; // URL pública da evidência

  @Column({ type: 'varchar', length: 100, nullable: true })
  nomeArquivo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mimeType: string;

  @Column({ type: 'bigint', nullable: true })
  tamanho: number; // Tamanho em bytes

  @Column({ type: 'varchar', length: 64, nullable: true })
  hash: string; // Hash MD5/SHA do arquivo

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Metadados específicos do tipo de evidência

  // Metadados de GPS
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  precisao: number; // Precisão em metros

  @Column({ type: 'varchar', length: 100, nullable: true })
  endereco: string; // Endereço reverso das coordenadas

  // Metadados de dispositivo
  @Column({ type: 'varchar', length: 100, nullable: true })
  deviceId: string; // ID único do dispositivo

  @Column({ type: 'varchar', length: 100, nullable: true })
  deviceModel: string; // Modelo do dispositivo

  @Column({ type: 'varchar', length: 50, nullable: true })
  appVersion: string; // Versão do app

  @Column({ type: 'varchar', length: 50, nullable: true })
  osVersion: string; // Versão do sistema operacional

  // Metadados de captura
  @Column({ type: 'timestamp', nullable: true })
  timestampCaptura: Date; // Timestamp da captura no dispositivo

  @Column({ type: 'timestamp', nullable: true })
  timestampUpload: Date; // Timestamp do upload

  @Column({ type: 'boolean', default: false })
  sincronizado: boolean; // Se foi sincronizado com o servidor

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'PENDENTE' })
  status: string; // PENDENTE, PROCESSANDO, CONCLUIDA, ERRO

  @Column({ type: 'text', nullable: true })
  erro: string; // Mensagem de erro se houver

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

  // Métodos
  get isMidia(): boolean {
    return ['FOTO', 'VIDEO', 'AUDIO'].includes(this.tipo);
  }

  get isGPS(): boolean {
    return this.tipo === 'GPS';
  }

  get isAssinatura(): boolean {
    return this.tipo === 'ASSINATURA';
  }

  get isDocumento(): boolean {
    return this.tipo === 'DOCUMENTO';
  }

  get coordenadas(): { lat: number; lng: number } | null {
    if (this.latitude && this.longitude) {
      return { lat: this.latitude, lng: this.longitude };
    }
    return null;
  }

  get tamanhoFormatado(): string {
    if (!this.tamanho) return 'N/A';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    let size = this.tamanho;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < sizes.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${sizes[unitIndex]}`;
  }

  // Valida se a evidência está completa
  isValid(): boolean {
    if (this.isMidia && !this.storageKey) return false;
    if (this.isGPS && (!this.latitude || !this.longitude)) return false;
    if (this.isAssinatura && !this.metadata?.assinatura) return false;
    
    return true;
  }

  // Marca como sincronizada
  marcarSincronizada(): void {
    this.sincronizado = true;
    this.status = 'CONCLUIDA';
    this.timestampUpload = new Date();
  }

  // Marca como erro
  marcarErro(mensagem: string): void {
    this.status = 'ERRO';
    this.erro = mensagem;
  }
}
