import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Configuração base do Axios com interceptors
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interfaces
export interface Asset {
  id: string;
  name: string;
  description?: string;
  serialNumber: string;
  model?: string;
  manufacturer?: string;
  type: 'extintor' | 'linha_vida' | 'tanque' | 'equipamento_eletrico' | 'equipamento_mecanico' | 'equipamento_quimico' | 'equipamento_biologico' | 'outros';
  status: 'ativo' | 'inativo' | 'manutencao' | 'fora_servico' | 'descontinuado';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  installationDate: string;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  lifespanYears?: number;
  purchaseValue?: number;
  location?: string;
  coordinates?: { lat: number; lng: number };
  specifications?: Record<string, any>;
  maintenanceHistory?: Array<{
    date: string;
    description: string;
    cost: number;
    technician: string;
    nextMaintenance: string;
  }>;
  inspectionHistory?: Array<{
    date: string;
    inspector: string;
    result: 'aprovado' | 'reprovado' | 'condicional';
    observations: string;
    nextInspection: string;
  }>;
  imageUrl?: string;
  qrCodeUrl?: string;
  manualUrl?: string;
  empresaId: string;
  unidadeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetData {
  name: string;
  description?: string;
  serialNumber: string;
  model?: string;
  manufacturer?: string;
  type: Asset['type'];
  priority?: Asset['priority'];
  installationDate: string;
  lifespanYears?: number;
  purchaseValue?: number;
  location?: string;
  coordinates?: { lat: number; lng: number };
  specifications?: Record<string, any>;
  empresaId: string;
  unidadeId: string;
}

export interface UpdateAssetData extends Partial<CreateAssetData> {
  status?: Asset['status'];
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

export interface AssetFilters {
  type?: string;
  status?: string;
  priority?: string;
  empresaId?: string;
  unidadeId?: string;
  needsInspection?: boolean;
  needsMaintenance?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AssetListResponse {
  assets: Asset[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Serviço de ativos
export const assetService = {
  // Listar ativos com filtros
  async getAssets(filters: AssetFilters = {}): Promise<AssetListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const { data } = await api.get(`/assets?${params.toString()}`);
    return data;
  },

  // Obter ativo por ID
  async getAssetById(id: string): Promise<Asset> {
    const { data } = await api.get(`/assets/${id}`);
    return data;
  },

  // Criar novo ativo
  async createAsset(assetData: CreateAssetData): Promise<Asset> {
    const { data } = await api.post('/assets', assetData);
    return data;
  },

  // Atualizar ativo
  async updateAsset(id: string, assetData: UpdateAssetData): Promise<Asset> {
    const { data } = await api.put(`/assets/${id}`, assetData);
    return data;
  },

  // Deletar ativo (soft delete)
  async deleteAsset(id: string): Promise<void> {
    await api.delete(`/assets/${id}`);
  },

  // Ativar/desativar ativo
  async toggleAssetStatus(id: string, status: Asset['status']): Promise<Asset> {
    const { data } = await api.patch(`/assets/${id}/status`, { status });
    return data;
  },

  // Registrar inspeção
  async registerInspection(id: string, inspectionData: {
    date: string;
    inspector: string;
    result: 'aprovado' | 'reprovado' | 'condicional';
    observations: string;
    nextInspection: string;
  }): Promise<Asset> {
    const { data } = await api.post(`/assets/${id}/inspections`, inspectionData);
    return data;
  },

  // Registrar manutenção
  async registerMaintenance(id: string, maintenanceData: {
    date: string;
    description: string;
    cost: number;
    technician: string;
    nextMaintenance: string;
  }): Promise<Asset> {
    const { data } = await api.post(`/assets/${id}/maintenance`, maintenanceData);
    return data;
  },

  // Obter ativos por empresa
  async getAssetsByEmpresa(empresaId: string, filters: Omit<AssetFilters, 'empresaId'> = {}): Promise<AssetListResponse> {
    return this.getAssets({ ...filters, empresaId });
  },

  // Obter ativos por unidade
  async getAssetsByUnidade(unidadeId: string, filters: Omit<AssetFilters, 'unidadeId'> = {}): Promise<AssetListResponse> {
    return this.getAssets({ ...filters, unidadeId });
  },

  // Obter ativos por tipo
  async getAssetsByType(type: Asset['type'], filters: Omit<AssetFilters, 'type'> = {}): Promise<AssetListResponse> {
    return this.getAssets({ ...filters, type });
  },

  // Obter ativos que precisam de inspeção
  async getAssetsNeedingInspection(filters: Omit<AssetFilters, 'needsInspection'> = {}): Promise<AssetListResponse> {
    return this.getAssets({ ...filters, needsInspection: true });
  },

  // Obter ativos que precisam de manutenção
  async getAssetsNeedingMaintenance(filters: Omit<AssetFilters, 'needsMaintenance'> = {}): Promise<AssetListResponse> {
    return this.getAssets({ ...filters, needsMaintenance: true });
  },

  // Buscar ativos por termo
  async searchAssets(searchTerm: string, filters: Omit<AssetFilters, 'search'> = {}): Promise<AssetListResponse> {
    return this.getAssets({ ...filters, search: searchTerm });
  },

  // Obter estatísticas de ativos
  async getAssetStats(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    manutencao: number;
    foraServico: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    needsInspection: number;
    needsMaintenance: number;
  }> {
    const { data } = await api.get('/assets/stats');
    return data;
  },

  // Verificar se número de série está disponível
  async checkSerialNumberAvailability(serialNumber: string): Promise<{ available: boolean }> {
    const { data } = await api.get(`/assets/check-serial?serialNumber=${encodeURIComponent(serialNumber)}`);
    return data;
  },

  // Upload de imagem do ativo
  async uploadAssetImage(id: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post(`/assets/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  // Gerar QR Code para ativo
  async generateAssetQRCode(id: string): Promise<{ qrCodeUrl: string }> {
    const { data } = await api.post(`/assets/${id}/qr-code`);
    return data;
  },

  // Obter ativos próximos (por coordenadas)
  async getAssetsNearby(lat: number, lng: number, radiusKm: number = 1): Promise<Asset[]> {
    const { data } = await api.get(`/assets/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
    return data;
  },

  // Exportar ativos para CSV/Excel
  async exportAssets(filters: AssetFilters = {}, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const { data } = await api.get(`/assets/export?${params.toString()}&format=${format}`, {
      responseType: 'blob',
    });

    return data;
  },

  // Importar ativos de CSV/Excel
  async importAssets(file: File): Promise<{
    success: number;
    errors: number;
    details: Array<{ row: number; error: string }>;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/assets/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  // Obter histórico completo de um ativo
  async getAssetHistory(id: string): Promise<{
    inspections: Array<any>;
    maintenance: Array<any>;
    orders: Array<any>;
    changes: Array<any>;
  }> {
    const { data } = await api.get(`/assets/${id}/history`);
    return data;
  },
};

export default assetService;
