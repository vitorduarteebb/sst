import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interfaces
export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
  };
  contato: {
    telefone: string;
    email: string;
    website?: string;
  };
  responsavelTecnico: {
    nome: string;
    crea?: string;
    telefone: string;
    email: string;
  };
  status: 'ativa' | 'inativa' | 'suspensa';
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmpresaData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
  };
  contato: {
    telefone: string;
    email: string;
    website?: string;
  };
  responsavelTecnico: {
    nome: string;
    crea?: string;
    telefone: string;
    email: string;
  };
}

export interface UpdateEmpresaData extends Partial<CreateEmpresaData> {
  status?: 'ativa' | 'inativa' | 'suspensa';
}

export interface EmpresaFilters {
  status?: string;
  estado?: string;
  cidade?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EmpresaListResponse {
  empresas: Empresa[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Serviço de empresas
export const empresaService = {
  // Listar empresas com filtros
  async getEmpresas(filters: EmpresaFilters = {}): Promise<EmpresaListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const { data } = await api.get(`/empresas?${params.toString()}`);
    return data;
  },

  // Obter empresa por ID
  async getEmpresaById(id: string): Promise<Empresa> {
    const { data } = await api.get(`/empresas/${id}`);
    return data;
  },

  // Criar nova empresa
  async createEmpresa(empresaData: CreateEmpresaData): Promise<Empresa> {
    const { data } = await api.post('/empresas', empresaData);
    return data;
  },

  // Atualizar empresa
  async updateEmpresa(id: string, empresaData: UpdateEmpresaData): Promise<Empresa> {
    const { data } = await api.put(`/empresas/${id}`, empresaData);
    return data;
  },

  // Deletar empresa (soft delete)
  async deleteEmpresa(id: string): Promise<void> {
    await api.delete(`/empresas/${id}`);
  },

  // Ativar/desativar empresa
  async toggleEmpresaStatus(id: string, status: 'ativa' | 'inativa' | 'suspensa'): Promise<Empresa> {
    const { data } = await api.patch(`/empresas/${id}/status`, { status });
    return data;
  },

  // Buscar empresas por termo
  async searchEmpresas(searchTerm: string, filters: Omit<EmpresaFilters, 'search'> = {}): Promise<EmpresaListResponse> {
    return this.getEmpresas({ ...filters, search: searchTerm });
  },

  // Obter empresas por estado
  async getEmpresasByEstado(estado: string, filters: Omit<EmpresaFilters, 'estado'> = {}): Promise<EmpresaListResponse> {
    return this.getEmpresas({ ...filters, estado });
  },

  // Obter empresas por cidade
  async getEmpresasByCidade(cidade: string, filters: Omit<EmpresaFilters, 'cidade'> = {}): Promise<EmpresaListResponse> {
    return this.getEmpresas({ ...filters, cidade });
  },

  // Obter estatísticas de empresas
  async getEmpresaStats(): Promise<{
    total: number;
    ativas: number;
    inativas: number;
    suspensas: number;
    byEstado: Record<string, number>;
    byCidade: Record<string, number>;
  }> {
    const { data } = await api.get('/empresas/stats');
    return data;
  },

  // Verificar se CNPJ está disponível
  async checkCnpjAvailability(cnpj: string): Promise<{ available: boolean }> {
    const { data } = await api.get(`/empresas/check-cnpj?cnpj=${encodeURIComponent(cnpj)}`);
    return data;
  },

  // Obter empresas próximas (por coordenadas)
  async getEmpresasNearby(lat: number, lng: number, radiusKm: number = 10): Promise<Empresa[]> {
    const { data } = await api.get(`/empresas/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
    return data;
  },

  // Exportar empresas para CSV/Excel
  async exportEmpresas(filters: EmpresaFilters = {}, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const { data } = await api.get(`/empresas/export?${params.toString()}&format=${format}`, {
      responseType: 'blob',
    });

    return data;
  },

  // Importar empresas de CSV/Excel
  async importEmpresas(file: File): Promise<{
    success: number;
    errors: number;
    details: Array<{ row: number; error: string }>;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/empresas/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },
};

export default empresaService;
