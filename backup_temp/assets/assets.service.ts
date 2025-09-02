import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetStatus, AssetPriority } from '../../entities/Asset';
import { CreateAssetDto, UpdateAssetDto, AssetFilterDto, AssetResponseDto } from './dto/asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<AssetResponseDto> {
    // Verificar se número de série já existe
    const existingSerial = await this.assetsRepository.findOne({
      where: { serialNumber: createAssetDto.serialNumber }
    });
    if (existingSerial) {
      throw new ConflictException('Número de série já está em uso');
    }

    const asset = this.assetsRepository.create({
      ...createAssetDto,
      status: createAssetDto.status || AssetStatus.ATIVO,
      priority: createAssetDto.priority || AssetPriority.MEDIA,
    });

    const savedAsset = await this.assetsRepository.save(asset);
    return this.mapToResponseDto(savedAsset);
  }

  async findAll(filters: AssetFilterDto = {}): Promise<AssetResponseDto[]> {
    const queryBuilder = this.assetsRepository.createQueryBuilder('asset');

    // Aplicar filtros
    if (filters.search) {
      queryBuilder.andWhere(
        '(asset.name ILIKE :search OR asset.description ILIKE :search OR asset.serialNumber ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters.type) {
      queryBuilder.andWhere('asset.type = :type', { type: filters.type });
    }

    if (filters.status) {
      queryBuilder.andWhere('asset.status = :status', { status: filters.status });
    }

    if (filters.priority) {
      queryBuilder.andWhere('asset.priority = :priority', { priority: filters.priority });
    }

    if (filters.manufacturer) {
      queryBuilder.andWhere('asset.manufacturer ILIKE :manufacturer', { manufacturer: `%${filters.manufacturer}%` });
    }

    if (filters.location) {
      queryBuilder.andWhere('asset.location ILIKE :location', { location: `%${filters.location}%` });
    }

    if (filters.serialNumber) {
      queryBuilder.andWhere('asset.serialNumber ILIKE :serialNumber', { serialNumber: `%${filters.serialNumber}%` });
    }

    queryBuilder.orderBy('asset.name', 'ASC');

    const assets = await queryBuilder.getMany();
    return assets.map(asset => this.mapToResponseDto(asset));
  }

  async findOne(id: string): Promise<AssetResponseDto> {
    const asset = await this.assetsRepository.findOne({
      where: { id }
    });

    if (!asset) {
      throw new NotFoundException('Ativo não encontrado');
    }

    return this.mapToResponseDto(asset);
  }

  async findBySerialNumber(serialNumber: string): Promise<Asset | null> {
    return this.assetsRepository.findOne({
      where: { serialNumber }
    });
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<AssetResponseDto> {
    const asset = await this.assetsRepository.findOne({
      where: { id }
    });

    if (!asset) {
      throw new NotFoundException('Ativo não encontrado');
    }



    // Atualizar ativo
    Object.assign(asset, updateAssetDto);
    const updatedAsset = await this.assetsRepository.save(asset);

    return this.mapToResponseDto(updatedAsset);
  }

  async toggleStatus(id: string): Promise<AssetResponseDto> {
    const asset = await this.assetsRepository.findOne({
      where: { id }
    });

    if (!asset) {
      throw new NotFoundException('Ativo não encontrado');
    }

    // Alternar entre ativo e inativo
    if (asset.status === AssetStatus.ATIVO) {
      asset.status = AssetStatus.INATIVO;
    } else {
      asset.status = AssetStatus.ATIVO;
    }

    const updatedAsset = await this.assetsRepository.save(asset);
    return this.mapToResponseDto(updatedAsset);
  }

  async remove(id: string): Promise<void> {
    const asset = await this.assetsRepository.findOne({
      where: { id }
    });

    if (!asset) {
      throw new NotFoundException('Ativo não encontrado');
    }

    // Soft delete - apenas marcar como inativo
    asset.status = AssetStatus.INATIVO;
    await this.assetsRepository.save(asset);
  }

  async getStats(): Promise<any> {
    const total = await this.assetsRepository.count();
    const ativos = await this.assetsRepository.count({ where: { status: AssetStatus.ATIVO } });
    const inativos = await this.assetsRepository.count({ where: { status: AssetStatus.INATIVO } });
    const manutencao = await this.assetsRepository.count({ where: { status: AssetStatus.MANUTENCAO } });
    const foraServico = await this.assetsRepository.count({ where: { status: AssetStatus.FORA_SERVICO } });

    // Estatísticas por tipo
    const tipos = await this.assetsRepository
      .createQueryBuilder('asset')
      .select('asset.type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('asset.type')
      .getRawMany();

    // Estatísticas por prioridade
    const prioridades = await this.assetsRepository
      .createQueryBuilder('asset')
      .select('asset.priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('asset.priority')
      .getRawMany();

    // Ativos que precisam de inspeção
    const precisamInspecao = await this.assetsRepository
      .createQueryBuilder('asset')
      .where('asset.nextInspectionDate <= :today', { today: new Date() })
      .andWhere('asset.status = :status', { status: AssetStatus.ATIVO })
      .getCount();

    // Ativos que precisam de manutenção
    const precisamManutencao = await this.assetsRepository
      .createQueryBuilder('asset')
      .where('asset.nextMaintenanceDate <= :today', { today: new Date() })
      .andWhere('asset.status = :status', { status: AssetStatus.ATIVO })
      .getCount();

    return {
      total,
      ativos,
      inativos,
      manutencao,
      foraServico,
      tipos,
      prioridades,
      precisamInspecao,
      precisamManutencao,
      percentualAtivos: total > 0 ? (ativos / total) * 100 : 0
    };
  }

  async checkSerialNumberAvailability(serialNumber: string): Promise<{ available: boolean }> {
    const asset = await this.findBySerialNumber(serialNumber);
    return { available: !asset };
  }

  private mapToResponseDto(asset: Asset): AssetResponseDto {
    return {
      id: asset.id,
      name: asset.name,
      description: asset.description,
      serialNumber: asset.serialNumber,
      model: asset.model,
      manufacturer: asset.manufacturer,
      type: asset.type,
      status: asset.status,
      priority: asset.priority,
      installationDate: asset.installationDate,
      lastInspectionDate: asset.lastInspectionDate,
      nextInspectionDate: asset.nextInspectionDate,
      lastMaintenanceDate: asset.lastMaintenanceDate,
      nextMaintenanceDate: asset.nextMaintenanceDate,
      lifespanYears: asset.lifespanYears,
      purchaseValue: asset.purchaseValue,
      location: asset.location,
      coordinates: asset.coordinates,
      specifications: asset.specifications,
      maintenanceHistory: asset.maintenanceHistory,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };
  }
}
