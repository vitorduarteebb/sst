import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
  empresaId?: string;
  unidadeId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (token: string, user: User) => {
        localStorage.setItem('access_token', token);
        set({ user, isAuthenticated: true, isLoading: false, error: null });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
