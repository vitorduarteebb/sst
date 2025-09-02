export interface User {
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

export interface CreateUserData {
  nome: string;
  email: string;
  password?: string;
  role: string;
  cpf: string;
  telefone?: string;
  empresaId: string;
  unidadeId?: string;
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  role?: string;
  cpf?: string;
  telefone?: string;
  empresaId?: string;
  unidadeId?: string;
  ativo?: boolean;
}

export interface UserFilters {
  role?: string;
  status?: string;
  empresaId?: string;
  unidadeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
