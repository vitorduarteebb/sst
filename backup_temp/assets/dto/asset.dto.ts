import { IsString, IsOptional, IsUUID, MinLength, IsEnum, IsNumber, IsBoolean, IsDateString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssetType, AssetStatus, AssetPriority } from '../../entities/Asset';

export class CreateAssetDto {
  @ApiProperty({ description: 'Nome/Identificação do ativo' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'Descrição do ativo' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Número de série' })
  @IsString()
  serialNumber: string;

  @ApiProperty({ description: 'Modelo do ativo' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ description: 'Fabricante' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Tipo do ativo', enum: AssetType })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiProperty({ description: 'Status do ativo', enum: AssetStatus })
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @ApiProperty({ description: 'Prioridade do ativo', enum: AssetPriority })
  @IsEnum(AssetPriority)
  @IsOptional()
  priority?: AssetPriority;

  @ApiProperty({ description: 'Data de instalação' })
  @IsDateString()
  installationDate: string;

  @ApiProperty({ description: 'Data da última inspeção' })
  @IsDateString()
  @IsOptional()
  lastInspectionDate?: string;

  @ApiProperty({ description: 'Data da próxima inspeção' })
  @IsDateString()
  @IsOptional()
  nextInspectionDate?: string;

  @ApiProperty({ description: 'Data da última manutenção' })
  @IsDateString()
  @IsOptional()
  lastMaintenanceDate?: string;

  @ApiProperty({ description: 'Data da próxima manutenção' })
  @IsDateString()
  @IsOptional()
  nextMaintenanceDate?: string;

  @ApiProperty({ description: 'Vida útil em anos' })
  @IsNumber()
  @IsOptional()
  lifespanYears?: number;

  @ApiProperty({ description: 'Valor de compra' })
  @IsNumber()
  @IsOptional()
  purchaseValue?: number;

  @ApiProperty({ description: 'Localização física' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Coordenadas GPS' })
  @IsObject()
  @IsOptional()
  coordinates?: { lat: number; lng: number };

  @ApiProperty({ description: 'Especificações técnicas' })
  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiProperty({ description: 'Histórico de manutenção' })
  @IsObject()
  @IsOptional()
  maintenanceHistory?: Array<{
    date: Date;
    description: string;
    cost: number;
    technician: string;
    nextMaintenance: Date;
  }>;
}

export class UpdateAssetDto {
  @ApiProperty({ description: 'Nome/Identificação do ativo' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Descrição do ativo' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Número de série' })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiProperty({ description: 'Modelo do ativo' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ description: 'Fabricante' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: 'Tipo do ativo', enum: AssetType })
  @IsEnum(AssetType)
  @IsOptional()
  type?: AssetType;

  @ApiProperty({ description: 'Status do ativo', enum: AssetStatus })
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @ApiProperty({ description: 'Prioridade do ativo', enum: AssetPriority })
  @IsEnum(AssetPriority)
  @IsOptional()
  priority?: AssetPriority;

  @ApiProperty({ description: 'Data da última inspeção' })
  @IsDateString()
  @IsOptional()
  lastInspectionDate?: string;

  @ApiProperty({ description: 'Data da próxima inspeção' })
  @IsDateString()
  @IsOptional()
  nextInspectionDate?: string;

  @ApiProperty({ description: 'Data da última manutenção' })
  @IsDateString()
  @IsOptional()
  lastMaintenanceDate?: string;

  @ApiProperty({ description: 'Data da próxima manutenção' })
  @IsDateString()
  @IsOptional()
  nextMaintenanceDate?: string;

  @ApiProperty({ description: 'Vida útil em anos' })
  @IsNumber()
  @IsOptional()
  lifespanYears?: number;

  @ApiProperty({ description: 'Valor de compra' })
  @IsNumber()
  @IsOptional()
  purchaseValue?: number;

  @ApiProperty({ description: 'Localização física' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Coordenadas GPS' })
  @IsObject()
  @IsOptional()
  coordinates?: { lat: number; lng: number };

  @ApiProperty({ description: 'Especificações técnicas' })
  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;
}

export class AssetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  model?: string;

  @ApiProperty()
  manufacturer?: string;

  @ApiProperty({ enum: AssetType })
  type: AssetType;

  @ApiProperty({ enum: AssetStatus })
  status: AssetStatus;

  @ApiProperty({ enum: AssetPriority })
  priority: AssetPriority;

  @ApiProperty()
  installationDate: Date;

  @ApiProperty()
  lastInspectionDate?: Date;

  @ApiProperty()
  nextInspectionDate?: Date;

  @ApiProperty()
  lastMaintenanceDate?: Date;

  @ApiProperty()
  nextMaintenanceDate?: Date;

  @ApiProperty()
  lifespanYears?: number;

  @ApiProperty()
  purchaseValue?: number;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  coordinates?: { lat: number; lng: number };

  @ApiProperty()
  specifications?: Record<string, any>;

  @ApiProperty()
  maintenanceHistory?: Array<{
    date: Date;
    description: string;
    cost: number;
    technician: string;
    nextMaintenance: Date;
  }>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AssetFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, enum: AssetType })
  @IsEnum(AssetType)
  @IsOptional()
  type?: AssetType;

  @ApiProperty({ required: false, enum: AssetStatus })
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @ApiProperty({ required: false, enum: AssetPriority })
  @IsEnum(AssetPriority)
  @IsOptional()
  priority?: AssetPriority;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  serialNumber?: string;
}




