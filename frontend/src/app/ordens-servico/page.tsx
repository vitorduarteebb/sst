'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface OrdemServico {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'manutencao' | 'inspecao' | 'limpeza' | 'seguranca' | 'outros';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  responsavel: {
    id: string;
    nome: string;
    email: string;
  };
  unidade: {
    id: string;
    nome: string;
    empresa: string;
  };
  dataInicio: string;
  dataFim: string;
  dataConclusao?: string;
  observacoes?: string;
  checklist?: string[];
  evidencias?: string[];
  createdAt: string;
}

const mockOrdensServico: OrdemServico[] = [
  {
    id: '1',
    titulo: 'Inspeção de Segurança - Edifício Principal',
    descricao: 'Realizar inspeção completa de segurança no edifício principal, incluindo extintores, saídas de emergência e sistema de alarme.',
    tipo: 'inspecao',
    prioridade: 'alta',
    status: 'em_andamento',
    responsavel: {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@empresa.com'
    },
    unidade: {
      id: '1',
      nome: 'Unidade Matriz São Paulo',
      empresa: 'Empresa ABC Ltda'
    },
    dataInicio: '2024-01-15',
    dataFim: '2024-01-20',
    observacoes: 'Verificar especialmente o 3º andar que apresentou problemas recentemente.',
    checklist: ['Extintores', 'Saídas de emergência', 'Sistema de alarme', 'Iluminação de emergência'],
    evidencias: ['foto1.jpg', 'foto2.jpg'],
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    titulo: 'Manutenção Preventiva - Ar Condicionado',
    descricao: 'Executar manutenção preventiva nos equipamentos de ar condicionado da unidade.',
    tipo: 'manutencao',
    prioridade: 'media',
    status: 'pendente',
    responsavel: {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.com'
    },
    unidade: {
      id: '2',
      nome: 'Filial Campinas',
      empresa: 'Empresa ABC Ltda'
    },
    dataInicio: '2024-01-25',
    dataFim: '2024-01-26',
    observacoes: 'Agendar com antecedência para não interromper as atividades.',
    checklist: ['Limpeza dos filtros', 'Verificação do gás', 'Teste de funcionamento', 'Lubrificação'],
    createdAt: '2024-01-18'
  },
  {
    id: '3',
    titulo: 'Limpeza Geral - Depósito',
    descricao: 'Realizar limpeza geral e organização do depósito principal.',
    tipo: 'limpeza',
    prioridade: 'baixa',
    status: 'concluida',
    responsavel: {
      id: '3',
      nome: 'Pedro Oliveira',
      email: 'pedro.oliveira@empresa.com'
    },
    unidade: {
      id: '3',
      nome: 'Depósito Santos',
      empresa: 'Empresa ABC Ltda'
    },
    dataInicio: '2024-01-12',
    dataFim: '2024-01-13',
    dataConclusao: '2024-01-13',
    observacoes: 'Limpeza concluída com sucesso. Depósito organizado e higienizado.',
    checklist: ['Limpeza geral', 'Organização de produtos', 'Descarte de materiais', 'Higienização'],
    evidencias: ['antes.jpg', 'depois.jpg'],
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    titulo: 'Treinamento de Brigada de Incêndio',
    descricao: 'Realizar treinamento da brigada de incêndio com simulação de emergência.',
    tipo: 'seguranca',
    prioridade: 'critica',
    status: 'pendente',
    responsavel: {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@empresa.com'
    },
    unidade: {
      id: '1',
      nome: 'Unidade Matriz São Paulo',
      empresa: 'Empresa ABC Ltda'
    },
    dataInicio: '2024-02-01',
    dataFim: '2024-02-01',
    observacoes: 'Treinamento obrigatório conforme NR-23. Todos os brigadistas devem participar.',
    checklist: ['Teoria sobre combate a incêndio', 'Uso de extintores', 'Simulação de evacuação', 'Teste prático'],
    createdAt: '2024-01-20'
  }
];

const mockResponsaveis = [
  { id: '1', nome: 'João Silva', email: 'joao.silva@empresa.com' },
  { id: '2', nome: 'Maria Santos', email: 'maria.santos@empresa.com' },
  { id: '3', nome: 'Pedro Oliveira', email: 'pedro.oliveira@empresa.com' }
];

const mockUnidades = [
  { id: '1', nome: 'Unidade Matriz São Paulo', empresa: 'Empresa ABC Ltda' },
  { id: '2', nome: 'Filial Campinas', empresa: 'Empresa ABC Ltda' },
  { id: '3', nome: 'Depósito Santos', empresa: 'Empresa ABC Ltda' }
];

export default function OrdensServicoPage() {
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>(mockOrdensServico);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrdem, setEditingOrdem] = useState<OrdemServico | null>(null);

  const filteredOrdensServico = ordensServico.filter(ordem => {
    const matchesSearch = ordem.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordem.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || ordem.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || ordem.tipo === tipoFilter;
    const matchesPrioridade = prioridadeFilter === 'todos' || ordem.prioridade === prioridadeFilter;
    return matchesSearch && matchesStatus && matchesTipo && matchesPrioridade;
  });

  const handleCreateOrdem = (ordemData: Omit<OrdemServico, 'id' | 'createdAt'>) => {
    const newOrdem: OrdemServico = {
      ...ordemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOrdensServico([...ordensServico, newOrdem]);
    setShowCreateModal(false);
  };

  const handleUpdateOrdem = (ordemData: OrdemServico) => {
    setOrdensServico(ordensServico.map(ordem => ordem.id === ordemData.id ? ordemData : ordem));
    setEditingOrdem(null);
  };

  const handleDeleteOrdem = (ordemId: string) => {
    if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      setOrdensServico(ordensServico.filter(ordem => ordem.id !== ordemId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'critica': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'manutencao': return 'Manutenção';
      case 'inspecao': return 'Inspeção';
      case 'limpeza': return 'Limpeza';
      case 'seguranca': return 'Segurança';
      case 'outros': return 'Outros';
      default: return tipo;
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Ordens de Serviço</h1>
          <p className="text-gray-600 mt-2">Gerencie todas as ordens de serviço do sistema</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
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
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>

              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="manutencao">Manutenção</option>
                <option value="inspecao">Inspeção</option>
                <option value="limpeza">Limpeza</option>
                <option value="seguranca">Segurança</option>
                <option value="outros">Outros</option>
              </select>

              <select
                value={prioridadeFilter}
                onChange={(e) => setPrioridadeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todas as Prioridades</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Nova OS
            </button>
          </div>
        </div>

        {/* OS Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrdensServico.map((ordem) => (
            <div key={ordem.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{ordem.titulo}</h3>
                    <p className="text-sm text-gray-500">OS #{ordem.id}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ordem.status)}`}>
                    {getStatusLabel(ordem.status)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(ordem.prioridade)}`}>
                    {ordem.prioridade.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">{ordem.descricao}</p>
              </div>

              {/* Type */}
              <div className="mb-4">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {getTipoLabel(ordem.tipo)}
                </span>
              </div>

              {/* Dates */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Início:</span> {new Date(ordem.dataInicio).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Fim:</span> {new Date(ordem.dataFim).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {ordem.dataConclusao && (
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600">
                      <span className="font-medium">Concluída em:</span> {new Date(ordem.dataConclusao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Responsible */}
              <div className="mb-4">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Responsável:</span> {ordem.responsavel.nome}
                  </div>
                </div>
              </div>

              {/* Unit */}
              <div className="mb-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Unidade:</span> {ordem.unidade.nome}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              {ordem.checklist && ordem.checklist.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Checklist:</p>
                  <div className="space-y-1">
                    {ordem.checklist.map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence */}
              {ordem.evidencias && ordem.evidencias.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Evidências:</p>
                  <div className="flex gap-2">
                    {ordem.evidencias.map((evidencia, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {evidencia}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Criada em {new Date(ordem.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingOrdem(ordem)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOrdem(ordem.id)}
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
        {filteredOrdensServico.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ClipboardDocumentListIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma ordem de serviço encontrada
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos' || prioridadeFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando a primeira ordem de serviço'
              }
            </p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingOrdem) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingOrdem ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const ordemData = {
                  titulo: formData.get('titulo') as string,
                  descricao: formData.get('descricao') as string,
                  tipo: formData.get('tipo') as 'manutencao' | 'inspecao' | 'limpeza' | 'seguranca' | 'outros',
                  prioridade: formData.get('prioridade') as 'baixa' | 'media' | 'alta' | 'critica',
                  status: formData.get('status') as 'pendente' | 'em_andamento' | 'concluida' | 'cancelada',
                  responsavel: {
                    id: formData.get('responsavel') as string,
                    nome: mockResponsaveis.find(r => r.id === formData.get('responsavel'))?.nome || '',
                    email: mockResponsaveis.find(r => r.id === formData.get('responsavel'))?.email || ''
                  },
                  unidade: {
                    id: formData.get('unidade') as string,
                    nome: mockUnidades.find(u => u.id === formData.get('unidade'))?.nome || '',
                    empresa: mockUnidades.find(u => u.id === formData.get('unidade'))?.empresa || ''
                  },
                  dataInicio: formData.get('dataInicio') as string,
                  dataFim: formData.get('dataFim') as string,
                  observacoes: formData.get('observacoes') as string,
                  checklist: formData.get('checklist') ? (formData.get('checklist') as string).split('\n').filter(item => item.trim()) : [],
                  evidencias: formData.get('evidencias') ? (formData.get('evidencias') as string).split('\n').filter(item => item.trim()) : []
                };

                if (editingOrdem) {
                  handleUpdateOrdem({ ...editingOrdem, ...ordemData });
                } else {
                  handleCreateOrdem(ordemData);
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Basic Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Básicas</h3>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      defaultValue={editingOrdem?.titulo}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <textarea
                      name="descricao"
                      defaultValue={editingOrdem?.descricao}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      name="tipo"
                      defaultValue={editingOrdem?.tipo}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="inspecao">Inspeção</option>
                      <option value="limpeza">Limpeza</option>
                      <option value="seguranca">Segurança</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridade *
                    </label>
                    <select
                      name="prioridade"
                      defaultValue={editingOrdem?.prioridade}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione a prioridade</option>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      defaultValue={editingOrdem?.status}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsável *
                    </label>
                    <select
                      name="responsavel"
                      defaultValue={editingOrdem?.responsavel.id}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o responsável</option>
                      {mockResponsaveis.map(responsavel => (
                        <option key={responsavel.id} value={responsavel.id}>{responsavel.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidade *
                    </label>
                    <select
                      name="unidade"
                      defaultValue={editingOrdem?.unidade.id}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione a unidade</option>
                      {mockUnidades.map(unidade => (
                        <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Início *
                    </label>
                    <input
                      type="date"
                      name="dataInicio"
                      defaultValue={editingOrdem?.dataInicio}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Fim *
                    </label>
                    <input
                      type="date"
                      name="dataFim"
                      defaultValue={editingOrdem?.dataFim}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      name="observacoes"
                      defaultValue={editingOrdem?.observacoes}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Checklist (um item por linha)
                    </label>
                    <textarea
                      name="checklist"
                      defaultValue={editingOrdem?.checklist?.join('\n')}
                      rows={4}
                      placeholder="Extintores&#10;Saídas de emergência&#10;Sistema de alarme"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evidências (um arquivo por linha)
                    </label>
                    <textarea
                      name="evidencias"
                      defaultValue={editingOrdem?.evidencias?.join('\n')}
                      rows={2}
                      placeholder="foto1.jpg&#10;foto2.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingOrdem ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingOrdem(null);
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
