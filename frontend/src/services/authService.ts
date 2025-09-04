const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://145.223.29.139/api/v1';

// Interfaces
export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    role: string;
    cpf: string;
    telefone?: string;
    empresaId: string;
    unidadeId?: string;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
  };
  expires_in: number;
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  cpf: string;
  telefone?: string;
  role: string;
  empresaId: string;
  unidadeId?: string;
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

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`HTTP ${response.status}: ${errorData.message || 'Erro na requisição'}`);
  }

  return response.json();
}

// Serviço de autenticação
export const authService = {
  // Login
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 Tentando login...', loginData);
      const data = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });
      console.log('✅ Login bem-sucedido:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  },

  // Registro
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const data = await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(registerData),
      });
      return data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  // Verificar token
  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return false;

      await makeRequest('/auth/verify');
      return true;
    } catch (error) {
      console.error('Token inválido:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      return false;
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const user = await makeRequest('/auth/me');
      return user;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      throw error;
    }
  },

  // Atualizar perfil
  async updateProfile(userData: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> {
    try {
      const data = await makeRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await makeRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  },

  // Recuperar senha
  async forgotPassword(email: string): Promise<void> {
    try {
      await makeRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw error;
    }
  },

  // Redefinir senha
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await makeRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    }
  }
};
