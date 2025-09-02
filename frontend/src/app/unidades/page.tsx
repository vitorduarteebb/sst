'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface Unidade {
  id: string;
  nome: string;
  codigo: string;
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
  empresa: {
    id: string;
    nome: string;
  };
  tipo: 'matriz' | 'filial' | 'deposito' | 'escritorio';
  status: 'ativo' | 'inativo';
  capacidade: number;
  funcionarios: number;
  createdAt: string;
}

const mockUnidades: Unidade[] = [
  {
    id: '1',
    nome: 'Unidade Matriz São Paulo',
    codigo: 'SP-MATRIZ',
    endereco: {
      cep: '01234-567',
      logradouro: 'Rua das Flores',
      numero: '123',
      complemento: 'Sala 100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    contato: {
      telefone: '(11) 3333-4444',
      email: 'matriz@empresaabc.com.br',
      responsavel: 'João Silva'
    },
    empresa: {
      id: '1',
      nome: 'Empresa ABC Ltda'
    },
    tipo: 'matriz',
    status: 'ativo',
    capacidade: 500,
    funcionarios: 150,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    nome: 'Filial Campinas',
    codigo: 'CAMP-FILIAL',
    endereco: {
      cep: '13000-000',
      logradouro: 'Av. Francisco Glicério',
      numero: '456',
      bairro: 'Centro',
      cidade: 'Campinas',
      estado: 'SP'
    },
    contato: {
      telefone: '(19) 5555-6666',
      email: 'campinas@empresaabc.com.br',
      responsavel: 'Maria Santos'
    },
    empresa: {
      id: '1',
      nome: 'Empresa ABC Ltda'
    },
    tipo: 'filial',
    status: 'ativo',
    capacidade: 200,
    funcionarios: 75,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    nome: 'Depósito Santos',
    codigo: 'SANTOS-DEP',
    endereco: {
      cep: '11000-000',
      logradouro: 'Rua do Porto',
      numero: '789',
      bairro: 'Porto',
      cidade: 'Santos',
      estado: 'SP'
    },
    contato: {
      telefone: '(13) 7777-8888',
      email: 'santos@empresaabc.com.br',
      responsavel: 'Pedro Oliveira'
    },
    empresa: {
      id: '1',
      nome: 'Empresa ABC Ltda'
    },
    tipo: 'deposito',
    status: 'ativo',
    capacidade: 1000,
    funcionarios: 25,
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    nome: 'Escritório Rio de Janeiro',
    codigo: 'RJ-ESC',
    endereco: {
      cep: '20000-000',
      logradouro: 'Av. Rio Branco',
      numero: '321',
      complemento: 'Andar 15',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ'
    },
    contato: {
      telefone: '(21) 9999-0000',
      email: 'rj@empresaabc.com.br',
      responsavel: 'Ana Costa'
    },
    empresa: {
      id: '1',
      nome: 'Empresa ABC Ltda'
    },
    tipo: 'escritorio',
    status: 'inativo',
    capacidade: 100,
    funcionarios: 0,
    createdAt: '2024-02-15'
  }
];

const mockEmpresas = [
  { id: '1', nome: 'Empresa ABC Ltda' },
  { id: '2', nome: 'Empresa XYZ S.A.' },
  { id: '3', nome: 'Empresa DEF Ltda' }
];

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidade[]>(mockUnidades);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [empresaFilter, setEmpresaFilter] = useState<string>('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null);

  const filteredUnidades = unidades.filter(unidade => {
    const matchesSearch = unidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unidade.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || unidade.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || unidade.tipo === tipoFilter;
    const matchesEmpresa = empresaFilter === 'todos' || unidade.empresa.id === empresaFilter;
    return matchesSearch && matchesStatus && matchesTipo && matchesEmpresa;
  });

  const handleCreateUnidade = (unidadeData: Omit<Unidade, 'id' | 'createdAt'>) => {
    const newUnidade: Unidade = {
      ...unidadeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUnidades([...unidades, newUnidade]);
    setShowCreateModal(false);
  };

  const handleUpdateUnidade = (unidadeData: Unidade) => {
    setUnidades(unidades.map(unidade => unidade.id === unidadeData.id ? unidadeData : unidade));
    setEditingUnidade(null);
  };

  const handleDeleteUnidade = (unidadeId: string) => {
    if (confirm('Tem certeza que deseja excluir esta unidade?')) {
      setUnidades(unidades.filter(unidade => unidade.id !== unidadeId));
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'matriz': return 'bg-purple-100 text-purple-800';
      case 'filial': return 'bg-blue-100 text-blue-800';
      case 'deposito': return 'bg-orange-100 text-orange-800';
      case 'escritorio': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'matriz': return 'Matriz';
      case 'filial': return 'Filial';
      case 'deposito': return 'Depósito';
      case 'escritorio': return 'Escritório';
      default: return tipo;
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Unidades</h1>
          <p className="text-gray-600 mt-2">Gerencie todas as unidades das empresas</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>

              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="matriz">Matriz</option>
                <option value="filial">Filial</option>
                <option value="deposito">Depósito</option>
                <option value="escritorio">Escritório</option>
              </select>

              <select
                value={empresaFilter}
                onChange={(e) => setEmpresaFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todas as Empresas</option>
                {mockEmpresas.map(empresa => (
                  <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                ))}
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Nova Unidade
            </button>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnidades.map((unidade) => (
            <div key={unidade.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{unidade.nome}</h3>
                    <p className="text-sm text-gray-500">{unidade.codigo}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(unidade.tipo)}`}>
                    {getTipoLabel(unidade.tipo)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    unidade.status === 'ativo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {unidade.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              {/* Company */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium">Empresa:</p>
                <p className="text-sm text-gray-900">{unidade.empresa.nome}</p>
              </div>

              {/* Address */}
              <div className="mb-4">
                <div className="flex items-start mb-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                  <div className="text-sm text-gray-600">
                    <p>{unidade.endereco.logradouro}, {unidade.endereco.numero}</p>
                    {unidade.endereco.complemento && <p>{unidade.endereco.complemento}</p>}
                    <p>{unidade.endereco.bairro}, {unidade.endereco.cidade} - {unidade.endereco.estado}</p>
                    <p>CEP: {unidade.endereco.cep}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{unidade.contato.telefone}</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{unidade.contato.email}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Responsável:</span> {unidade.contato.responsavel}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-semibold text-gray-900">{unidade.capacidade}</div>
                  <div className="text-xs text-gray-600">Capacidade</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-semibold text-gray-900">{unidade.funcionarios}</div>
                  <div className="text-xs text-gray-600">Funcionários</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Criado em {new Date(unidade.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingUnidade(unidade)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUnidade(unidade.id)}
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

        {/* Empty State */}
        {filteredUnidades.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BuildingOffice2Icon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma unidade encontrada
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos' || empresaFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando a primeira unidade'
              }
            </p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingUnidade) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingUnidade ? 'Editar Unidade' : 'Nova Unidade'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const unidadeData = {
                  nome: formData.get('nome') as string,
                  codigo: formData.get('codigo') as string,
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
                  empresa: {
                    id: formData.get('empresa') as string,
                    nome: mockEmpresas.find(e => e.id === formData.get('empresa'))?.nome || ''
                  },
                  tipo: formData.get('tipo') as 'matriz' | 'filial' | 'deposito' | 'escritorio',
                  status: formData.get('status') as 'ativo' | 'inativo',
                  capacidade: parseInt(formData.get('capacidade') as string),
                  funcionarios: parseInt(formData.get('funcionarios') as string)
                };

                if (editingUnidade) {
                  handleUpdateUnidade({ ...editingUnidade, ...unidadeData });
                } else {
                  handleCreateUnidade(unidadeData);
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Básicas</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Unidade *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      defaultValue={editingUnidade?.nome}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código *
                    </label>
                    <input
                      type="text"
                      name="codigo"
                      defaultValue={editingUnidade?.codigo}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa *
                    </label>
                    <select
                      name="empresa"
                      defaultValue={editingUnidade?.empresa.id}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma empresa</option>
                      {mockEmpresas.map(empresa => (
                        <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      name="tipo"
                      defaultValue={editingUnidade?.tipo}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="matriz">Matriz</option>
                      <option value="filial">Filial</option>
                      <option value="deposito">Depósito</option>
                      <option value="escritorio">Escritório</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacidade *
                    </label>
                    <input
                      type="number"
                      name="capacidade"
                      defaultValue={editingUnidade?.capacidade}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Funcionários *
                    </label>
                    <input
                      type="number"
                      name="funcionarios"
                      defaultValue={editingUnidade?.funcionarios}
                      required
                      min="0"
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
                      defaultValue={editingUnidade?.endereco.cep}
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
                      defaultValue={editingUnidade?.endereco.logradouro}
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
                      defaultValue={editingUnidade?.endereco.numero}
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
                      defaultValue={editingUnidade?.endereco.complemento}
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
                      defaultValue={editingUnidade?.endereco.bairro}
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
                      defaultValue={editingUnidade?.endereco.cidade}
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
                      defaultValue={editingUnidade?.endereco.estado}
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
                      defaultValue={editingUnidade?.contato.telefone}
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
                      defaultValue={editingUnidade?.contato.email}
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
                      defaultValue={editingUnidade?.contato.responsavel}
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
                      defaultValue={editingUnidade?.status}
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
                    {editingUnidade ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingUnidade(null);
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
