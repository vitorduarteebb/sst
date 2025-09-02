'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
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
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    console.log('🔍 AuthContext - Token salvo:', savedToken ? 'EXISTE' : 'NÃO EXISTE');
    console.log('🔍 AuthContext - User salvo:', savedUser ? 'EXISTE' : 'NÃO EXISTE');

    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
        console.log('✅ AuthContext - Dados carregados do localStorage');
      } catch (error) {
        console.error('❌ AuthContext - Erro ao carregar dados do usuário:', error);
        logout();
      }
    } else {
      console.log('ℹ️ AuthContext - Nenhum dado salvo encontrado');
    }
    
    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    console.log('🔐 AuthContext - Fazendo login...');
    console.log('🔐 AuthContext - Token recebido:', newToken ? 'EXISTE' : 'NULO');
    console.log('🔐 AuthContext - User recebido:', userData);
    
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('✅ AuthContext - Login realizado com sucesso');
    console.log('✅ AuthContext - Token salvo no localStorage:', localStorage.getItem('access_token') ? 'SIM' : 'NÃO');
    
    setLoading(false);
  };

  const logout = () => {
    console.log('🚪 AuthContext - Fazendo logout...');
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    console.log('✅ AuthContext - Logout realizado');
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
