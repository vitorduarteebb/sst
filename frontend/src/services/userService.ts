import { User, CreateUserData, UpdateUserData } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function makeRequest(url: string, options: RequestInit = {}) {
  // Temporariamente removendo autenticação para testar
  // const token = localStorage.getItem('access_token');
  console.log('🔍 makeRequest - URL:', url);
  // console.log('🔍 makeRequest - Token:', token ? 'EXISTE' : 'NÃO EXISTE');
  // if (token) {
  //   console.log('🔍 makeRequest - Token completo:', token);
  // }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Temporariamente comentado
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  //   console.log('🔍 makeRequest - Token adicionado ao header');
  //   console.log('🔍 makeRequest - Header Authorization:', `Bearer ${token.substring(0, 50)}...`);
  // }
  console.log('🔍 makeRequest - Headers completos:', headers);

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  console.log('🔍 makeRequest - Status:', response.status);
  console.log('🔍 makeRequest - OK:', response.ok);
  console.log('🔍 makeRequest - Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ makeRequest - Erro:', response.status, errorData);
    throw new Error(`HTTP ${response.status}: ${errorData.message || 'Erro na requisição'}`);
  }
  return response.json();
}

export const userService = {
  async getUsers(filters: any = {}): Promise<User[]> {
    console.log('👥 Tentando buscar usuários...');
    // console.log('👥 Token no localStorage:', localStorage.getItem('access_token') ? 'EXISTE' : 'NÃO EXISTE');
    
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const url = `/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const users = await makeRequest(url);
      console.log('✅ Usuários carregados:', users.length);
      return users;
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      throw error;
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      return await makeRequest(`/users/${id}`);
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async createUser(userData: CreateUserData): Promise<User> {
    console.log('➕ Tentando criar usuário...');
    // console.log('➕ Token no localStorage:', localStorage.getItem('access_token') ? 'EXISTE' : 'NÃO EXISTE');
    console.log('➕ Dados do usuário:', userData);
    
    try {
      const newUser = await makeRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      console.log('✅ Usuário criado:', newUser);
      return newUser;
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      throw error;
    }
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      return await makeRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await makeRequest(`/users/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error);
      throw error;
    }
  },

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      return await makeRequest(`/users/check-email?email=${email}`);
    } catch (error) {
      console.error('❌ Erro ao verificar email:', error);
      throw error;
    }
  },

  async checkCpfAvailability(cpf: string): Promise<{ available: boolean }> {
    try {
      return await makeRequest(`/users/check-cpf?cpf=${cpf}`);
    } catch (error) {
      console.error('❌ Erro ao verificar CPF:', error);
      throw error;
    }
  },
};

export default userService;
