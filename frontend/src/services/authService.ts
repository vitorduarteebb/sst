const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Validar token
  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // Obter perfil do usuário
  async getProfile(): Promise<any> {
    try {
      return await makeRequest('/auth/profile');
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  },

  // Renovar token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const data = await makeRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      return data;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw error;
    }
  },
};

export default authService;
