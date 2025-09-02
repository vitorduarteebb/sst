import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Interfaces
export interface Participante {
  id: string;
  nome: string;
  email: string;
  cpf: string;
}

export interface Treinamento {
  id: string;
  titulo: string;
  instrutor: string;
  cargaHoraria: number;
}

export interface Certificado {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  tipo: 'nr10' | 'nr20' | 'nr35' | 'brigada' | 'primeiros_socorros' | 'outros';
  participante: Participante;
  treinamento: Treinamento;
  dataEmissao: string;
  dataValidade: string;
  status: 'pendente' | 'emitido' | 'vencido' | 'cancelado';
  hash: string;
  qrCode: string;
  linkValidacao: string;
  observacoes?: string;
  nota?: number;
  aprovado: boolean;
  createdAt: string;
  pdfUrl?: string;
}

export interface CreateCertificadoData {
  titulo: string;
  descricao: string;
  tipo: 'nr10' | 'nr20' | 'nr35' | 'brigada' | 'primeiros_socorros' | 'outros';
  participante: Participante;
  treinamento: Treinamento;
  observacoes?: string;
}

export interface UpdateCertificadoData {
  titulo?: string;
  descricao?: string;
  tipo?: 'nr10' | 'nr20' | 'nr35' | 'brigada' | 'primeiros_socorros' | 'outros';
  participante?: Participante;
  treinamento?: Treinamento;
  observacoes?: string;
  nota?: number;
  aprovado?: boolean;
}

export interface EmitirCertificadoData {
  certificadoId: string;
  nota?: number;
  observacoes?: string;
}

export interface ValidarCertificadoData {
  numero: string;
  hash: string;
}

export interface ValidacaoResponse {
  valido: boolean;
  certificado?: Certificado;
  mensagem: string;
  dataValidacao: string;
}

export interface CertificadosStats {
  total: number;
  emitidos: number;
  pendentes: number;
  vencidos: number;
  cancelados: number;
  percentualEmitidos: number;
}

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros (sem redirecionamento automático)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redirecionar automaticamente, deixar o componente tratar o erro
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Serviço de Certificados
export const certificateService = {
  // Listar todos os certificados
  async getAll(filters?: {
    status?: string;
    tipo?: string;
    participante?: string;
  }): Promise<Certificado[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'todos') {
        params.append('status', filters.status);
      }
      if (filters?.tipo && filters.tipo !== 'todos') {
        params.append('tipo', filters.tipo);
      }
      if (filters?.participante) {
        params.append('participante', filters.participante);
      }

      const response = await api.get(`/certificados?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar certificados:', error);
      throw error;
    }
  },

  // Buscar certificado por ID
  async getById(id: string): Promise<Certificado> {
    try {
      const response = await api.get(`/certificados/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar certificado:', error);
      throw error;
    }
  },

  // Criar novo certificado
  async create(data: CreateCertificadoData): Promise<Certificado> {
    try {
      const response = await api.post('/certificados', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar certificado:', error);
      throw error;
    }
  },

  // Atualizar certificado
  async update(id: string, data: UpdateCertificadoData): Promise<Certificado> {
    try {
      const response = await api.patch(`/certificados/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar certificado:', error);
      throw error;
    }
  },

  // Excluir certificado
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/certificados/${id}`);
    } catch (error) {
      console.error('Erro ao excluir certificado:', error);
      throw error;
    }
  },

  // Emitir certificado
  async emitir(data: EmitirCertificadoData): Promise<Certificado> {
    try {
      const response = await api.post('/certificados/emitir', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao emitir certificado:', error);
      throw error;
    }
  },

  // Validar certificado
  async validar(data: ValidarCertificadoData): Promise<ValidacaoResponse> {
    try {
      const response = await api.post('/certificados/validar', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao validar certificado:', error);
      throw error;
    }
  },

  // Validar certificado público (sem autenticação)
  async validarPublico(numero: string, hash: string): Promise<ValidacaoResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/certificados-public/validar/${numero}?hash=${hash}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao validar certificado público:', error);
      throw error;
    }
  },

  // Gerar PDF do certificado
  async gerarPDF(id: string): Promise<{ pdfUrl: string }> {
    try {
      const response = await api.get(`/certificados/${id}/pdf`);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  },

  // Download do PDF do certificado
  async downloadPDF(id: string): Promise<Blob> {
    try {
      const response = await api.get(`/certificados/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      throw error;
    }
  },

  // Obter QR Code do certificado
  async getQRCode(numero: string): Promise<{ qrCode: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/certificados-public/qr/${numero}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      throw error;
    }
  },

  // Obter estatísticas dos certificados
  async getStats(): Promise<CertificadosStats> {
    try {
      const response = await api.get('/certificados/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  },

  // Função auxiliar para simular dados mock quando o backend não estiver disponível
  getMockData(): Certificado[] {
    return [
      {
        id: '1',
        numero: 'CERT-2024-001',
        titulo: 'Certificado NR-10 - Segurança em Instalações Elétricas',
        descricao: 'Certificado de conclusão do treinamento NR-10 com carga horária de 40 horas.',
        tipo: 'nr10',
        participante: {
          id: '1',
          nome: 'João Silva Santos',
          email: 'joao.silva@empresa.com',
          cpf: '123.456.789-00'
        },
        treinamento: {
          id: '1',
          titulo: 'NR-10 - Segurança em Instalações e Serviços com Eletricidade',
          instrutor: 'Eng. Carlos Silva',
          cargaHoraria: 40
        },
        dataEmissao: '2024-01-26',
        dataValidade: '2025-01-26',
        status: 'emitido',
        hash: 'a1b2c3d4e5f6789012345678901234567890abcdef',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sst.com.br/validar/CERT-2024-001',
        linkValidacao: 'https://sst.com.br/validar/CERT-2024-001',
        observacoes: 'Participante aprovado com excelente desempenho.',
        nota: 95,
        aprovado: true,
        createdAt: '2024-01-26'
      },
      {
        id: '2',
        numero: 'CERT-2024-002',
        titulo: 'Certificado NR-20 - Trabalho com Inflamáveis',
        descricao: 'Certificado de conclusão do treinamento NR-20 com carga horária de 32 horas.',
        tipo: 'nr20',
        participante: {
          id: '2',
          nome: 'Maria Santos Costa',
          email: 'maria.santos@empresa.com',
          cpf: '987.654.321-00'
        },
        treinamento: {
          id: '2',
          titulo: 'NR-20 - Segurança e Saúde no Trabalho com Inflamáveis',
          instrutor: 'Eng. Ana Costa',
          cargaHoraria: 32
        },
        dataEmissao: '2024-01-20',
        dataValidade: '2025-01-20',
        status: 'emitido',
        hash: 'b2c3d4e5f6789012345678901234567890abcdefa1',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sst.com.br/validar/CERT-2024-002',
        linkValidacao: 'https://sst.com.br/validar/CERT-2024-002',
        observacoes: 'Participante aprovado com bom desempenho.',
        nota: 88,
        aprovado: true,
        createdAt: '2024-01-20'
      },
      {
        id: '3',
        numero: 'CERT-2024-003',
        titulo: 'Certificado NR-35 - Trabalho em Altura',
        descricao: 'Certificado de conclusão do treinamento NR-35 com carga horária de 24 horas.',
        tipo: 'nr35',
        participante: {
          id: '3',
          nome: 'Pedro Oliveira Lima',
          email: 'pedro.oliveira@empresa.com',
          cpf: '456.789.123-00'
        },
        treinamento: {
          id: '3',
          titulo: 'NR-35 - Trabalho em Altura',
          instrutor: 'Eng. Roberto Santos',
          cargaHoraria: 24
        },
        dataEmissao: '',
        dataValidade: '',
        status: 'pendente',
        hash: '',
        qrCode: '',
        linkValidacao: '',
        observacoes: 'Aguardando conclusão do treinamento.',
        nota: 0,
        aprovado: false,
        createdAt: '2024-01-05'
      }
    ];
  }
};
