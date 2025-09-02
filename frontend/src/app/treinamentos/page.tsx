'use client';

import { useState } from 'react';
import Layout from '../../components/Layout';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Treinamento {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'nr10' | 'nr20' | 'nr35' | 'brigada' | 'primeiros_socorros' | 'outros';
  cargaHoraria: number;
  modalidade: 'presencial' | 'online' | 'hibrido';
  instrutor: {
    id: string;
    nome: string;
    email: string;
    especialidade: string;
  };
  unidade: {
    id: string;
    nome: string;
    empresa: string;
  };
  dataInicio: string;
  dataFim: string;
  horarioInicio: string;
  horarioFim: string;
  vagas: number;
  vagasOcupadas: number;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  valor: number;
  observacoes?: string;
  materiais?: string[];
  certificado?: {
    emitido: boolean;
    dataEmissao?: string;
    validade?: string;
  };
  participantes?: {
    id: string;
    nome: string;
    email: string;
    presenca: boolean;
    nota?: number;
    aprovado?: boolean;
  }[];
  createdAt: string;
}

const mockTreinamentos: Treinamento[] = [
  {
    id: '1',
    titulo: 'NR-10 - Segurança em Instalações e Serviços com Eletricidade',
    descricao: 'Treinamento obrigatório para profissionais que trabalham com instalações elétricas, conforme exigência da NR-10.',
    tipo: 'nr10',
    cargaHoraria: 40,
    modalidade: 'presencial',
    instrutor: {
      id: '1',
      nome: 'Eng. Carlos Silva',
      email: 'carlos.silva@empresa.com',
      especialidade: 'Engenharia Elétrica'
    },
    unidade: {
      id: '1',
      nome: 'Unidade Matriz São Paulo',
      empresa: 'Empresa ABC Ltda'
    },
    dataInicio: '2024-02-15',
    dataFim: '2024-02-19',
    horarioInicio: '08:00',
    horarioFim: '17:00',
    vagas: 20,
    vagasOcupadas: 18,
    status: 'agendado',
    valor: 800.00,
    observacoes: 'Trazer EPIs obrigatórios: capacete, luvas isolantes e calçados de segurança.',
    materiais: ['Apostila NR-10', 'Simulador de instalações', 'EPIs de demonstração'],
    certificado: {
      emitido: false
    },
    participantes: [
      { id: '1', nome: 'João Silva', email: 'joao@empresa.com', presenca: false },
      { id: '2', nome: 'Maria Santos', email: 'maria@empresa.com', presenca: false }
    ],
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    titulo: 'NR-20 - Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis',
    descricao: 'Capacitação para trabalho com produtos inflamáveis e combustíveis, conforme NR-20.',
    tipo: 'nr20',
    cargaHoraria: 32,
    modalidade: 'hibrido',
    instrutor: {
      id: '2',
      nome: 'Eng. Ana Costa',
      email: 'ana.costa@empresa.com',
      especialidade: 'Segurança do Trabalho'
    },
    unidade: {
      id: '2',
      nome: 'Filial Campinas',
      empresa: 'Empresa ABC Ltda'
    },
    dataInicio: '2024-02-10',
    dataFim: '2024-02-12',
    horarioInicio: '09:00',
    horarioFim: '18:00',
    vagas: 15,
    vagasOcupadas: 12,
    status: 'em_andamento',
    valor: 650.00,
    observacoes: 'Parte teórica online, prática presencial obrigatória.',
    materiais: ['Manual NR-20', 'Vídeos instrutivos', 'Equipamentos de proteção'],
    certificado: {
      emitido: false
    },
    participantes: [
      { id: '3', nome: 'Pedro Oliveira', email: 'pedro@empresa.com', presenca: true, nota: 85, aprovado: true },
      { id: '4', nome: 'Lucia Ferreira', email: 'lucia@empresa.com', presenca: true, nota: 92, aprovado: true }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    titulo: 'Brigada de Incêndio - Teoria e Prática',
    descricao: 'Formação de brigadistas de incêndio com simulações práticas e uso de extintores.',
    tipo: 'brigada',
    cargaHoraria: 16,
    modalidade: 'presencial',
    instrutor: {
      id: '3',
      nome: 'Sgt. Roberto Lima',
      email: 'roberto.lima@empresa.com',
      especialidade: 'Bombeiro Civil'
    },
    unidade: {
      id: '1',
      nome: 'Unidade Matriz São Paulo',
      empresa: 'Empresa ABC Ltda'
    },
    dataInicio: '2024-01-25',
    dataFim: '2024-01-26',
    horarioInicio: '08:00',
    horarioFim: '17:00',
    vagas: 25,
    vagasOcupadas: 25,
    status: 'concluido',
    valor: 450.00,
    observacoes: 'Treinamento concluído com sucesso. Todos os participantes aprovados.',
    materiais: ['Manual de Brigada', 'Extintores de treinamento', 'Equipamentos de proteção'],
    certificado: {
      emitido: true,
      dataEmissao: '2024-01-26',
      validade: '2025-01-26'
    },
    participantes: [
      { id: '5', nome: 'Carlos Mendes', email: 'carlos@empresa.com', presenca: true, nota: 88, aprovado: true },
      { id: '6', nome: 'Fernanda Rocha', email: 'fernanda@empresa.com', presenca: true, nota: 95, aprovado: true }
    ],
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    titulo: 'Primeiros Socorros - Básico',
    descricao: 'Capacitação em primeiros socorros para emergências no ambiente de trabalho.',
    tipo: 'primeiros_socorros',
    cargaHoraria: 8,
    modalidade: 'presencial',
    instrutor: {
      id: '4',
      nome: 'Dr. Mariana Alves',
      email: 'mariana.alves@empresa.com',
      especialidade: 'Medicina do Trabalho'
    },
    unidade: {
      id: '3',
      nome: 'Depósito Santos',
      empresa: 'Empresa ABC Ltda'
    },
    dataInicio: '2024-03-05',
    dataFim: '2024-03-05',
    horarioInicio: '14:00',
    horarioFim: '18:00',
    vagas: 30,
    vagasOcupadas: 8,
    status: 'agendado',
    valor: 200.00,
    observacoes: 'Treinamento prático com manequins de simulação.',
    materiais: ['Manual de Primeiros Socorros', 'Manequins de simulação', 'Kit de emergência'],
    certificado: {
      emitido: false
    },
    participantes: [
      { id: '7', nome: 'Ricardo Santos', email: 'ricardo@empresa.com', presenca: false },
      { id: '8', nome: 'Patricia Lima', email: 'patricia@empresa.com', presenca: false }
    ],
    createdAt: '2024-01-25'
  }
];

const mockInstrutores = [
  { id: '1', nome: 'Eng. Carlos Silva', email: 'carlos.silva@empresa.com', especialidade: 'Engenharia Elétrica' },
  { id: '2', nome: 'Eng. Ana Costa', email: 'ana.costa@empresa.com', especialidade: 'Segurança do Trabalho' },
  { id: '3', nome: 'Sgt. Roberto Lima', email: 'roberto.lima@empresa.com', especialidade: 'Bombeiro Civil' },
  { id: '4', nome: 'Dr. Mariana Alves', email: 'mariana.alves@empresa.com', especialidade: 'Medicina do Trabalho' }
];

const mockUnidades = [
  { id: '1', nome: 'Unidade Matriz São Paulo', empresa: 'Empresa ABC Ltda' },
  { id: '2', nome: 'Filial Campinas', empresa: 'Empresa ABC Ltda' },
  { id: '3', nome: 'Depósito Santos', empresa: 'Empresa ABC Ltda' }
];

export default function TreinamentosPage() {
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>(mockTreinamentos);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [modalidadeFilter, setModalidadeFilter] = useState<string>('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTreinamento, setEditingTreinamento] = useState<Treinamento | null>(null);

  const filteredTreinamentos = treinamentos.filter(treinamento => {
    const matchesSearch = treinamento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treinamento.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || treinamento.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || treinamento.tipo === tipoFilter;
    const matchesModalidade = modalidadeFilter === 'todos' || treinamento.modalidade === modalidadeFilter;
    return matchesSearch && matchesStatus && matchesTipo && matchesModalidade;
  });

  const handleCreateTreinamento = (treinamentoData: Omit<Treinamento, 'id' | 'createdAt'>) => {
    const newTreinamento: Treinamento = {
      ...treinamentoData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      vagasOcupadas: 0,
      participantes: []
    };
    setTreinamentos([...treinamentos, newTreinamento]);
    setShowCreateModal(false);
  };

  const handleUpdateTreinamento = (treinamentoData: Treinamento) => {
    setTreinamentos(treinamentos.map(treinamento => treinamento.id === treinamentoData.id ? treinamentoData : treinamento));
    setEditingTreinamento(null);
  };

  const handleDeleteTreinamento = (treinamentoId: string) => {
    if (confirm('Tem certeza que deseja excluir este treinamento?')) {
      setTreinamentos(treinamentos.filter(treinamento => treinamento.id !== treinamentoId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'nr10': return 'NR-10';
      case 'nr20': return 'NR-20';
      case 'nr35': return 'NR-35';
      case 'brigada': return 'Brigada de Incêndio';
      case 'primeiros_socorros': return 'Primeiros Socorros';
      case 'outros': return 'Outros';
      default: return tipo;
    }
  };

  const getModalidadeLabel = (modalidade: string) => {
    switch (modalidade) {
      case 'presencial': return 'Presencial';
      case 'online': return 'Online';
      case 'hibrido': return 'Híbrido';
      default: return modalidade;
    }
  };

  const getVagasDisponiveis = (treinamento: Treinamento) => {
    return treinamento.vagas - treinamento.vagasOcupadas;
  };

  const getVagasPercentual = (treinamento: Treinamento) => {
    return (treinamento.vagasOcupadas / treinamento.vagas) * 100;
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Treinamentos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os treinamentos e capacitações do sistema</p>
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
                <option value="agendado">Agendado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>

              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="nr10">NR-10</option>
                <option value="nr20">NR-20</option>
                <option value="nr35">NR-35</option>
                <option value="brigada">Brigada de Incêndio</option>
                <option value="primeiros_socorros">Primeiros Socorros</option>
                <option value="outros">Outros</option>
              </select>

              <select
                value={modalidadeFilter}
                onChange={(e) => setModalidadeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todas as Modalidades</option>
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Treinamento
            </button>
          </div>
        </div>

        {/* Training Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTreinamentos.map((treinamento) => (
            <div key={treinamento.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <AcademicCapIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{treinamento.titulo}</h3>
                    <p className="text-sm text-gray-500">Treinamento #{treinamento.id}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(treinamento.status)}`}>
                    {getStatusLabel(treinamento.status)}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {getTipoLabel(treinamento.tipo)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">{treinamento.descricao}</p>
              </div>

              {/* Basic Info */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Carga Horária:</span> {treinamento.cargaHoraria}h
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Período:</span> {new Date(treinamento.dataInicio).toLocaleDateString('pt-BR')} a {new Date(treinamento.dataFim).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Horário:</span> {treinamento.horarioInicio} - {treinamento.horarioFim}
                  </span>
                </div>
              </div>

              {/* Instructor */}
              <div className="mb-4">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Instrutor:</span> {treinamento.instrutor.nome}
                  </div>
                </div>
              </div>

              {/* Unit */}
              <div className="mb-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Unidade:</span> {treinamento.unidade.nome}
                  </div>
                </div>
              </div>

              {/* Vacancies */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 font-medium">Vagas</span>
                  <span className="text-sm text-gray-600">{treinamento.vagasOcupadas}/{treinamento.vagas}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getVagasPercentual(treinamento)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{getVagasDisponiveis(treinamento)} vagas disponíveis</span>
                  <span>R$ {treinamento.valor.toFixed(2)}</span>
                </div>
              </div>

              {/* Modalidade */}
              <div className="mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  treinamento.modalidade === 'presencial' ? 'bg-blue-100 text-blue-800' :
                  treinamento.modalidade === 'online' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {getModalidadeLabel(treinamento.modalidade)}
                </span>
              </div>

              {/* Materials */}
              {treinamento.materiais && treinamento.materiais.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Materiais:</p>
                  <div className="flex gap-2 flex-wrap">
                    {treinamento.materiais.map((material, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate */}
              {treinamento.certificado && (
                <div className="mb-4">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Certificado:</span> 
                      {treinamento.certificado.emitido ? (
                        <span className="text-green-600 ml-1">Emitido</span>
                      ) : (
                        <span className="text-yellow-600 ml-1">Pendente</span>
                      )}
                    </div>
                  </div>
                  {treinamento.certificado.validade && (
                    <div className="text-xs text-gray-500 ml-6">
                      Válido até: {new Date(treinamento.certificado.validade).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              )}

              {/* Participants */}
              {treinamento.participantes && treinamento.participantes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">Participantes ({treinamento.participantes.length}):</p>
                  <div className="space-y-1">
                    {treinamento.participantes.slice(0, 3).map((participante) => (
                      <div key={participante.id} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        {participante.nome}
                        {participante.aprovado !== undefined && (
                          <span className={`ml-2 px-1 text-xs rounded ${
                            participante.aprovado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {participante.aprovado ? 'Aprovado' : 'Reprovado'}
                          </span>
                        )}
                      </div>
                    ))}
                    {treinamento.participantes.length > 3 && (
                      <div className="text-xs text-gray-500 ml-4">
                        +{treinamento.participantes.length - 3} mais...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Criado em {new Date(treinamento.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTreinamento(treinamento)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTreinamento(treinamento.id)}
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
        {filteredTreinamentos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AcademicCapIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum treinamento encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos' || modalidadeFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando o primeiro treinamento'
              }
            </p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingTreinamento) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingTreinamento ? 'Editar Treinamento' : 'Novo Treinamento'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const treinamentoData = {
                  titulo: formData.get('titulo') as string,
                  descricao: formData.get('descricao') as string,
                  tipo: formData.get('tipo') as 'nr10' | 'nr20' | 'nr35' | 'brigada' | 'primeiros_socorros' | 'outros',
                  cargaHoraria: parseInt(formData.get('cargaHoraria') as string),
                  modalidade: formData.get('modalidade') as 'presencial' | 'online' | 'hibrido',
                  instrutor: {
                    id: formData.get('instrutor') as string,
                    nome: mockInstrutores.find(i => i.id === formData.get('instrutor'))?.nome || '',
                    email: mockInstrutores.find(i => i.id === formData.get('instrutor'))?.email || '',
                    especialidade: mockInstrutores.find(i => i.id === formData.get('instrutor'))?.especialidade || ''
                  },
                  unidade: {
                    id: formData.get('unidade') as string,
                    nome: mockUnidades.find(u => u.id === formData.get('unidade'))?.nome || '',
                    empresa: mockUnidades.find(u => u.id === formData.get('unidade'))?.empresa || ''
                  },
                  dataInicio: formData.get('dataInicio') as string,
                  dataFim: formData.get('dataFim') as string,
                  horarioInicio: formData.get('horarioInicio') as string,
                  horarioFim: formData.get('horarioFim') as string,
                  vagas: parseInt(formData.get('vagas') as string),
                  valor: parseFloat(formData.get('valor') as string),
                  observacoes: formData.get('observacoes') as string,
                  materiais: formData.get('materiais') ? (formData.get('materiais') as string).split('\n').filter(item => item.trim()) : []
                };

                if (editingTreinamento) {
                  handleUpdateTreinamento({ ...editingTreinamento, ...treinamentoData });
                } else {
                  handleCreateTreinamento(treinamentoData);
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
                      defaultValue={editingTreinamento?.titulo}
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
                      defaultValue={editingTreinamento?.descricao}
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
                      defaultValue={editingTreinamento?.tipo}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="nr10">NR-10</option>
                      <option value="nr20">NR-20</option>
                      <option value="nr35">NR-35</option>
                      <option value="brigada">Brigada de Incêndio</option>
                      <option value="primeiros_socorros">Primeiros Socorros</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modalidade *
                    </label>
                    <select
                      name="modalidade"
                      defaultValue={editingTreinamento?.modalidade}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione a modalidade</option>
                      <option value="presencial">Presencial</option>
                      <option value="online">Online</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carga Horária (horas) *
                    </label>
                    <input
                      type="number"
                      name="cargaHoraria"
                      defaultValue={editingTreinamento?.cargaHoraria}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (R$) *
                    </label>
                    <input
                      type="number"
                      name="valor"
                      defaultValue={editingTreinamento?.valor}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instrutor *
                    </label>
                    <select
                      name="instrutor"
                      defaultValue={editingTreinamento?.instrutor.id}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o instrutor</option>
                      {mockInstrutores.map(instrutor => (
                        <option key={instrutor.id} value={instrutor.id}>{instrutor.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidade *
                    </label>
                    <select
                      name="unidade"
                      defaultValue={editingTreinamento?.unidade.id}
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
                      defaultValue={editingTreinamento?.dataInicio}
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
                      defaultValue={editingTreinamento?.dataFim}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário de Início *
                    </label>
                    <input
                      type="time"
                      name="horarioInicio"
                      defaultValue={editingTreinamento?.horarioInicio}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário de Fim *
                    </label>
                    <input
                      type="time"
                      name="horarioFim"
                      defaultValue={editingTreinamento?.horarioFim}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Vagas *
                    </label>
                    <input
                      type="number"
                      name="vagas"
                      defaultValue={editingTreinamento?.vagas}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      name="observacoes"
                      defaultValue={editingTreinamento?.observacoes}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materiais (um item por linha)
                    </label>
                    <textarea
                      name="materiais"
                      defaultValue={editingTreinamento?.materiais?.join('\n')}
                      rows={4}
                      placeholder="Apostila do curso&#10;Equipamentos de proteção&#10;Material didático"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingTreinamento ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingTreinamento(null);
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
