'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { empresaService } from '../../services/empresaService';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  razaoSocial: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  contato: {
    telefone: string;
    email: string;
    responsavel: string;
  };
  status: 'ativo' | 'inativo';
  createdAt: string;
}

const mockEmpresas: Empresa[] = [
  {
    id: '1',
    nome: 'Empresa ABC Ltda',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Empresa ABC Comércio e Serviços Ltda',
    endereco: {
      cep: '01234-567',
      logradouro: 'Rua das Flores',
      numero: '123',
      complemento: 'Sala 45',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    contato: {
      telefone: '(11) 3333-4444',
      email: 'contato@empresaabc.com.br',
      responsavel: 'João Silva'
    },
    status: 'ativo',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    nome: 'Empresa XYZ S.A.',
    cnpj: '98.765.432/0001-10',
    razaoSocial: 'Empresa XYZ Indústria e Comércio S.A.',
    endereco: {
      cep: '04567-890',
      logradouro: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    contato: {
      telefone: '(11) 5555-6666',
      email: 'contato@xyz.com.br',
      responsavel: 'Maria Santos'
    },
    status: 'ativo',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    nome: 'Empresa DEF Ltda',
    cnpj: '11.222.333/0001-44',
    razaoSocial: 'Empresa DEF Serviços Ltda',
    endereco: {
      cep: '07890-123',
      logradouro: 'Rua das Palmeiras',
      numero: '456',
      bairro: 'Vila Madalena',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    contato: {
      telefone: '(11) 7777-8888',
      email: 'contato@def.com.br',
      responsavel: 'Pedro Oliveira'
    },
    status: 'inativo',
    createdAt: '2024-01-05'
  }
];

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  // Carregar empresas do backend
  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      console.log('🔍 EmpresasPage - Carregando empresas...');
      const response = await empresaService.getEmpresas();
      console.log('✅ EmpresasPage - Empresas carregadas:', response);
      setEmpresas(response.empresas || []);
    } catch (error) {
      console.error('❌ EmpresasPage - Erro ao carregar empresas:', error);
      // Fallback para dados mock em caso de erro
      setEmpresas(mockEmpresas);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmpresas = empresas.filter(empresa => {
    const matchesSearch = empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.cnpj.includes(searchTerm) ||
                         empresa.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || empresa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEmpresa = (empresaData: Omit<Empresa, 'id' | 'createdAt'>) => {
    const newEmpresa: Empresa = {
      ...empresaData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEmpresas([...empresas, newEmpresa]);
    setShowCreateModal(false);
  };

  const handleUpdateEmpresa = (empresaData: Empresa) => {
    setEmpresas(empresas.map(empresa => empresa.id === empresaData.id ? empresaData : empresa));
    setEditingEmpresa(null);
  };

  const handleDeleteEmpresa = async (empresaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        console.log('🗑️ EmpresasPage - Excluindo empresa:', empresaId);
        await empresaService.deleteEmpresa(empresaId);
        console.log('✅ EmpresasPage - Empresa excluída com sucesso');
        // Recarregar a lista após exclusão
        await loadEmpresas();
      } catch (error) {
        console.error('❌ EmpresasPage - Erro ao excluir empresa:', error);
        alert('Erro ao excluir empresa. Tente novamente.');
      }
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Empresas</h1>
          <p className="text-gray-600 mt-2">Gerencie todas as empresas do sistema</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CNPJ ou razão social..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Nova Empresa
            </button>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Carregando empresas...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmpresas.map((empresa) => (
            <div key={empresa.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{empresa.nome}</h3>
                    <p className="text-sm text-gray-500">{empresa.cnpj}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  empresa.status === 'ativo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {empresa.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              {/* Razão Social */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium">Razão Social:</p>
                <p className="text-sm text-gray-900">{empresa.razaoSocial}</p>
              </div>

              {/* Address */}
              <div className="mb-4">
                <div className="flex items-start mb-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                  <div className="text-sm text-gray-600">
                    <p>{empresa.endereco.logradouro}, {empresa.endereco.numero}</p>
                    {empresa.endereco.complemento && <p>{empresa.endereco.complemento}</p>}
                    <p>{empresa.endereco.bairro}, {empresa.endereco.cidade} - {empresa.endereco.estado}</p>
                    <p>CEP: {empresa.endereco.cep}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{empresa.contato.telefone}</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{empresa.contato.email}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Responsável:</span> {empresa.contato.responsavel}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Criado em {new Date(empresa.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingEmpresa(empresa)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEmpresa(empresa.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="Excluir"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {filteredEmpresas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BuildingOfficeIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'todos' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando a primeira empresa'
              }
            </p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingEmpresa) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const empresaData = {
                  nome: formData.get('nome') as string,
                  cnpj: formData.get('cnpj') as string,
                  razaoSocial: formData.get('razaoSocial') as string,
                  endereco: {
                    cep: formData.get('cep') as string,
                    logradouro: formData.get('logradouro') as string,
                    numero: formData.get('numero') as string,
                    complemento: formData.get('complemento') as string,
                    bairro: formData.get('bairro') as string,
                    cidade: formData.get('cidade') as string,
                    estado: formData.get('estado') as string,
                  },
                  contato: {
                    telefone: formData.get('telefone') as string,
                    email: formData.get('email') as string,
                    responsavel: formData.get('responsavel') as string,
                  },
                  status: formData.get('status') as 'ativo' | 'inativo'
                };

                if (editingEmpresa) {
                  handleUpdateEmpresa({ ...editingEmpresa, ...empresaData });
                } else {
                  handleCreateEmpresa(empresaData);
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Básicas</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Fantasia *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      defaultValue={editingEmpresa?.nome}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ *
                    </label>
                    <input
                      type="text"
                      name="cnpj"
                      defaultValue={editingEmpresa?.cnpj}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razão Social *
                    </label>
                    <input
                      type="text"
                      name="razaoSocial"
                      defaultValue={editingEmpresa?.razaoSocial}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Endereço</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      name="cep"
                      defaultValue={editingEmpresa?.endereco.cep}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logradouro *
                    </label>
                    <input
                      type="text"
                      name="logradouro"
                      defaultValue={editingEmpresa?.endereco.logradouro}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="numero"
                      defaultValue={editingEmpresa?.endereco.numero}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      defaultValue={editingEmpresa?.endereco.complemento}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      defaultValue={editingEmpresa?.endereco.bairro}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      defaultValue={editingEmpresa?.endereco.cidade}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <input
                      type="text"
                      name="estado"
                      defaultValue={editingEmpresa?.endereco.estado}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Contact */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Contato</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="text"
                      name="telefone"
                      defaultValue={editingEmpresa?.contato.telefone}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingEmpresa?.contato.email}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsável *
                    </label>
                    <input
                      type="text"
                      name="responsavel"
                      defaultValue={editingEmpresa?.contato.responsavel}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      defaultValue={editingEmpresa?.status}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingEmpresa ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingEmpresa(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
