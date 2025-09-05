const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://145.223.29.139/api/v1';

// Interfaces
export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  role: string;
  empresaId: string;
  unidadeId?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  nome: string;
  email: string;
  password?: string;
  cpf: string;
  telefone?: string;
  role: string;
  empresaId: string;
  unidadeId?: string;
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  telefone?: string;
  role?: string;
  empresaId?: string;
  unidadeId?: string;
  ativo?: boolean;
}

// Função helper para fazer requisições
async function makeRequest(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('🌐 Fazendo requisição para:', `${API_URL}${url}`);
  console.log('📋 Headers:', headers);
  console.log('📦 Body:', options.body);

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  console.log('📡 Resposta recebida:', response.status, response.statusText);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Erro na requisição:', errorData);
    throw new Error(`HTTP ${response.status}: ${errorData.message || 'Erro na requisição'}`);
  }

  const data = await response.json();
  console.log('✅ Dados recebidos:', data);
  return data;
}

// Serviço de usuários
export const userService = {
  // Listar usuários
  async getUsers(): Promise<User[]> {
    try {
      return await makeRequest('/users');
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  // Obter usuário por ID
  async getUserById(id: string): Promise<User> {
    try {
      return await makeRequest(`/users/${id}`);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  // Criar usuário
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      return await makeRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  // Atualizar usuário
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      return await makeRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  // Deletar usuário
  async deleteUser(id: string): Promise<void> {
    try {
      await makeRequest(`/users/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  },

  // Ativar/Desativar usuário
  async toggleUserStatus(id: string, ativo: boolean): Promise<User> {
    try {
      return await makeRequest(`/users/${id}/toggle-status`, {
        method: 'PATCH',
        body: JSON.stringify({ ativo }),
      });
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      throw error;
    }
  },

  // Buscar usuários por empresa
  async getUsersByEmpresa(empresaId: string): Promise<User[]> {
    try {
      return await makeRequest(`/users/empresa/${empresaId}`);
    } catch (error) {
      console.error('Erro ao buscar usuários da empresa:', error);
      throw error;
    }
  },

  // Buscar usuários por unidade
  async getUsersByUnidade(unidadeId: string): Promise<User[]> {
    try {
      return await makeRequest(`/users/unidade/${unidadeId}`);
    } catch (error) {
      console.error('Erro ao buscar usuários da unidade:', error);
      throw error;
    }
  },

  // Buscar usuários por role
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      return await makeRequest(`/users/role/${role}`);
    } catch (error) {
      console.error('Erro ao buscar usuários por role:', error);
      throw error;
    }
  }
};
