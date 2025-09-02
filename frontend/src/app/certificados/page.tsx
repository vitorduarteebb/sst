'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { certificateService, Certificado, CreateCertificadoData, EmitirCertificadoData } from '../../services/certificateService';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  QrCodeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const mockCertificados: Certificado[] = [
  {
    id: '1',
    numero: 'CERT-2024-001',
    titulo: 'Certificado NR-10 - Segurança em Instalações Elétricas',
    descricao: 'Certificado de conclusão do treinamento NR-10 com carga horária de 40 horas.',
    tipo: 'nr10',
    participante: {
      id: '1',
      nome: 'João Silva Santos',
      email: 'joao.silva@empresa.com',
      cpf: '123.456.789-00'
    },
    treinamento: {
      id: '1',
      titulo: 'NR-10 - Segurança em Instalações e Serviços com Eletricidade',
      instrutor: 'Eng. Carlos Silva',
      cargaHoraria: 40
    },
    dataEmissao: '2024-01-26',
    dataValidade: '2025-01-26',
    status: 'emitido',
    hash: 'a1b2c3d4e5f6789012345678901234567890abcdef',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sst.com.br/validar/CERT-2024-001',
    linkValidacao: 'https://sst.com.br/validar/CERT-2024-001',
    observacoes: 'Participante aprovado com excelente desempenho.',
    nota: 95,
    aprovado: true,
    createdAt: '2024-01-26'
  },
  {
    id: '2',
    numero: 'CERT-2024-002',
    titulo: 'Certificado NR-20 - Trabalho com Inflamáveis',
    descricao: 'Certificado de conclusão do treinamento NR-20 com carga horária de 32 horas.',
    tipo: 'nr20',
    participante: {
      id: '2',
      nome: 'Maria Santos Costa',
      email: 'maria.santos@empresa.com',
      cpf: '987.654.321-00'
    },
    treinamento: {
      id: '2',
      titulo: 'NR-20 - Segurança e Saúde no Trabalho com Inflamáveis',
      instrutor: 'Eng. Ana Costa',
      cargaHoraria: 32
    },
    dataEmissao: '2024-01-20',
    dataValidade: '2025-01-20',
    status: 'emitido',
    hash: 'b2c3d4e5f6789012345678901234567890abcdefa1',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sst.com.br/validar/CERT-2024-002',
    linkValidacao: 'https://sst.com.br/validar/CERT-2024-002',
    observacoes: 'Participante aprovado com bom desempenho.',
    nota: 88,
    aprovado: true,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    numero: 'CERT-2024-003',
    titulo: 'Certificado Brigada de Incêndio',
    descricao: 'Certificado de conclusão do treinamento de Brigada de Incêndio com carga horária de 16 horas.',
    tipo: 'brigada',
    participante: {
      id: '3',
      nome: 'Pedro Oliveira Lima',
      email: 'pedro.oliveira@empresa.com',
      cpf: '456.789.123-00'
    },
    treinamento: {
      id: '3',
      titulo: 'Brigada de Incêndio - Teoria e Prática',
      instrutor: 'Sgt. Roberto Lima',
      cargaHoraria: 16
    },
    dataEmissao: '2024-01-15',
    dataValidade: '2025-01-15',
    status: 'emitido',
    hash: 'c3d4e5f6789012345678901234567890abcdefa1b2',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sst.com.br/validar/CERT-2024-003',
    linkValidacao: 'https://sst.com.br/validar/CERT-2024-003',
    observacoes: 'Participante aprovado com excelente desempenho prático.',
    nota: 92,
    aprovado: true,
    createdAt: '2024-01-15'
  },
  {
    id: '4',
    numero: 'CERT-2024-004',
    titulo: 'Certificado Primeiros Socorros',
    descricao: 'Certificado de conclusão do treinamento de Primeiros Socorros com carga horária de 8 horas.',
    tipo: 'primeiros_socorros',
    participante: {
      id: '4',
      nome: 'Lucia Ferreira Rocha',
      email: 'lucia.ferreira@empresa.com',
      cpf: '789.123.456-00'
    },
    treinamento: {
      id: '4',
      titulo: 'Primeiros Socorros - Básico',
      instrutor: 'Dr. Mariana Alves',
      cargaHoraria: 8
    },
    dataEmissao: '2024-01-10',
    dataValidade: '2025-01-10',
    status: 'vencido',
    hash: 'd4e5f6789012345678901234567890abcdefa1b2c3',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sst.com.br/validar/CERT-2024-004',
    linkValidacao: 'https://sst.com.br/validar/CERT-2024-004',
    observacoes: 'Participante aprovado com bom desempenho.',
    nota: 85,
    aprovado: true,
    createdAt: '2024-01-10'
  },
  {
    id: '5',
    numero: 'CERT-2024-005',
    titulo: 'Certificado NR-35 - Trabalho em Altura',
    descricao: 'Certificado de conclusão do treinamento NR-35 com carga horária de 24 horas.',
    tipo: 'nr35',
    participante: {
      id: '5',
      nome: 'Carlos Mendes Silva',
      email: 'carlos.mendes@empresa.com',
      cpf: '321.654.987-00'
    },
    treinamento: {
      id: '5',
      titulo: 'NR-35 - Trabalho em Altura',
      instrutor: 'Eng. Roberto Santos',
      cargaHoraria: 24
    },
    dataEmissao: '',
    dataValidade: '',
    status: 'pendente',
    hash: '',
    qrCode: '',
    linkValidacao: '',
    observacoes: 'Aguardando conclusão do treinamento.',
    nota: 0,
    aprovado: false,
    createdAt: '2024-01-05'
  }
];

const mockParticipantes = [
  { id: '1', nome: 'João Silva Santos', email: 'joao.silva@empresa.com', cpf: '123.456.789-00' },
  { id: '2', nome: 'Maria Santos Costa', email: 'maria.santos@empresa.com', cpf: '987.654.321-00' },
  { id: '3', nome: 'Pedro Oliveira Lima', email: 'pedro.oliveira@empresa.com', cpf: '456.789.123-00' },
  { id: '4', nome: 'Lucia Ferreira Rocha', email: 'lucia.ferreira@empresa.com', cpf: '789.123.456-00' },
  { id: '5', nome: 'Carlos Mendes Silva', email: 'carlos.mendes@empresa.com', cpf: '321.654.987-00' }
];

const mockTreinamentos = [
  { id: '1', titulo: 'NR-10 - Segurança em Instalações e Serviços com Eletricidade', instrutor: 'Eng. Carlos Silva', cargaHoraria: 40 },
  { id: '2', titulo: 'NR-20 - Segurança e Saúde no Trabalho com Inflamáveis', instrutor: 'Eng. Ana Costa', cargaHoraria: 32 },
  { id: '3', titulo: 'Brigada de Incêndio - Teoria e Prática', instrutor: 'Sgt. Roberto Lima', cargaHoraria: 16 },
  { id: '4', titulo: 'Primeiros Socorros - Básico', instrutor: 'Dr. Mariana Alves', cargaHoraria: 8 },
  { id: '5', titulo: 'NR-35 - Trabalho em Altura', instrutor: 'Eng. Roberto Santos', cargaHoraria: 24 }
];

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCertificado, setEditingCertificado] = useState<Certificado | null>(null);
  const [showEmitirModal, setShowEmitirModal] = useState(false);
  const [selectedCertificado, setSelectedCertificado] = useState<Certificado | null>(null);

  // Carregar certificados do backend
  useEffect(() => {
    const loadCertificados = async () => {
      try {
        setLoading(true);
        const data = await certificateService.getAll({
          status: statusFilter !== 'todos' ? statusFilter : undefined,
          tipo: tipoFilter !== 'todos' ? tipoFilter : undefined,
          participante: searchTerm || undefined
        });
        setCertificados(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar certificados:', err);
        // Fallback para dados mock se o backend não estiver disponível
        setCertificados(certificateService.getMockData());
        setError('Erro ao conectar com o servidor. Usando dados de demonstração.');
      } finally {
        setLoading(false);
      }
    };

    loadCertificados();
  }, [statusFilter, tipoFilter, searchTerm]);

  const filteredCertificados = certificados.filter(certificado => {
    const matchesSearch = certificado.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificado.participante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificado.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || certificado.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || certificado.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const handleCreateCertificado = async (certificadoData: CreateCertificadoData) => {
    try {
      const newCertificado = await certificateService.create(certificadoData);
      setCertificados([...certificados, newCertificado]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Erro ao criar certificado:', err);
      alert('Erro ao criar certificado. Tente novamente.');
    }
  };

  const handleUpdateCertificado = async (certificadoData: Certificado) => {
    try {
      const updatedCertificado = await certificateService.update(certificadoData.id, {
        titulo: certificadoData.titulo,
        descricao: certificadoData.descricao,
        tipo: certificadoData.tipo,
        participante: certificadoData.participante,
        treinamento: certificadoData.treinamento,
        observacoes: certificadoData.observacoes
      });
      setCertificados(certificados.map(cert => cert.id === certificadoData.id ? updatedCertificado : cert));
      setEditingCertificado(null);
    } catch (err) {
      console.error('Erro ao atualizar certificado:', err);
      alert('Erro ao atualizar certificado. Tente novamente.');
    }
  };

  const handleDeleteCertificado = async (certificadoId: string) => {
    if (confirm('Tem certeza que deseja excluir este certificado?')) {
      try {
        await certificateService.delete(certificadoId);
        setCertificados(certificados.filter(certificado => certificado.id !== certificadoId));
      } catch (err) {
        console.error('Erro ao excluir certificado:', err);
        alert('Erro ao excluir certificado. Tente novamente.');
      }
    }
  };

  const handleEmitirCertificado = async (certificado: Certificado) => {
    try {
      const emitirData: EmitirCertificadoData = {
        certificadoId: certificado.id,
        nota: Math.floor(Math.random() * 20) + 80, // Nota entre 80-100
        observacoes: certificado.observacoes
      };
      
      const certificadoEmitido = await certificateService.emitir(emitirData);
      setCertificados(certificados.map(c => c.id === certificado.id ? certificadoEmitido : c));
      setShowEmitirModal(false);
      setSelectedCertificado(null);
    } catch (err) {
      console.error('Erro ao emitir certificado:', err);
      alert('Erro ao emitir certificado. Tente novamente.');
    }
  };

  const generateHash = (numero: string) => {
    return btoa(numero + Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'emitido': return 'bg-green-100 text-green-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      case 'cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'emitido': return 'Emitido';
      case 'vencido': return 'Vencido';
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

  const isVencido = (dataValidade: string) => {
    if (!dataValidade) return false;
    return new Date(dataValidade) < new Date();
  };

  const diasParaVencer = (dataValidade: string) => {
    if (!dataValidade) return 0;
    const hoje = new Date();
    const vencimento = new Date(dataValidade);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Certificados</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os certificados digitais do sistema</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número, participante ou título..."
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
                <option value="emitido">Emitido</option>
                <option value="vencido">Vencido</option>
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
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Certificado
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando certificados...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          </div>
        )}

        {/* Certificates Cards */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCertificados.map((certificado) => (
            <div key={certificado.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{certificado.titulo}</h3>
                    <p className="text-sm text-gray-500">{certificado.numero}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(certificado.status)}`}>
                    {getStatusLabel(certificado.status)}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {getTipoLabel(certificado.tipo)}
                  </span>
                </div>
              </div>

              {/* Participant Info */}
              <div className="mb-4">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Participante:</span> {certificado.participante.nome}
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-6">
                  {certificado.participante.email} • CPF: {certificado.participante.cpf}
                </div>
              </div>

              {/* Training Info */}
              <div className="mb-4">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Treinamento:</span> {certificado.treinamento.titulo}
                  </div>
                </div>
                <div className="text-xs text-gray-500 ml-6">
                  Instrutor: {certificado.treinamento.instrutor} • {certificado.treinamento.cargaHoraria}h
                </div>
              </div>

              {/* Dates */}
              {certificado.dataEmissao && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Emissão:</span> {new Date(certificado.dataEmissao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">Validade:</span> {new Date(certificado.dataValidade).toLocaleDateString('pt-BR')}
                    </span>
                    {isVencido(certificado.dataValidade) ? (
                      <span className="ml-2 px-1 text-xs bg-red-100 text-red-800 rounded">Vencido</span>
                    ) : (
                      <span className="ml-2 px-1 text-xs bg-green-100 text-green-800 rounded">
                        {diasParaVencer(certificado.dataValidade)} dias restantes
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Grade and Approval */}
              {certificado.nota && (
                <div className="mb-4">
                  <div className="flex items-center">
                    <CheckBadgeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Nota:</span> {certificado.nota}/100
                      <span className={`ml-2 px-1 text-xs rounded ${
                        certificado.aprovado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {certificado.aprovado ? 'Aprovado' : 'Reprovado'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hash and QR Code */}
              {certificado.hash && (
                <div className="mb-4">
                  <div className="flex items-center">
                    <QrCodeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Hash:</span> {certificado.hash.substring(0, 20)}...
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 ml-6">
                    <a href={certificado.linkValidacao} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Link de Validação
                    </a>
                  </div>
                </div>
              )}

              {/* Observations */}
              {certificado.observacoes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{certificado.observacoes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Criado em {new Date(certificado.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex items-center gap-2">
                  {certificado.status === 'pendente' && (
                    <button
                      onClick={() => {
                        setSelectedCertificado(certificado);
                        setShowEmitirModal(true);
                      }}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Emitir Certificado"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                    </button>
                  )}
                  {certificado.status === 'emitido' && (
                    <>
                      <button
                        onClick={() => window.open(certificado.qrCode, '_blank')}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Ver QR Code"
                      >
                        <QrCodeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(certificado.linkValidacao, '_blank')}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title="Validar Certificado"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const blob = await certificateService.downloadPDF(certificado.id);
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${certificado.numero}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                          } catch (err) {
                            console.error('Erro ao baixar PDF:', err);
                            alert('Erro ao baixar PDF. Tente novamente.');
                          }
                        }}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Download PDF"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setEditingCertificado(certificado)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="Editar"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCertificado(certificado.id)}
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
        {!loading && filteredCertificados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <DocumentTextIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum certificado encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando o primeiro certificado'
              }
            </p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingCertificado) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingCertificado ? 'Editar Certificado' : 'Novo Certificado'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const certificadoData = {
                  titulo: formData.get('titulo') as string,
                  descricao: formData.get('descricao') as string,
                  tipo: formData.get('tipo') as 'nr10' | 'nr20' | 'nr35' | 'brigada' | 'primeiros_socorros' | 'outros',
                  participante: {
                    id: formData.get('participante') as string,
                    nome: mockParticipantes.find(p => p.id === formData.get('participante'))?.nome || '',
                    email: mockParticipantes.find(p => p.id === formData.get('participante'))?.email || '',
                    cpf: mockParticipantes.find(p => p.id === formData.get('participante'))?.cpf || ''
                  },
                  treinamento: {
                    id: formData.get('treinamento') as string,
                    titulo: mockTreinamentos.find(t => t.id === formData.get('treinamento'))?.titulo || '',
                    instrutor: mockTreinamentos.find(t => t.id === formData.get('treinamento'))?.instrutor || '',
                    cargaHoraria: mockTreinamentos.find(t => t.id === formData.get('treinamento'))?.cargaHoraria || 0
                  },
                  observacoes: formData.get('observacoes') as string
                };

                if (editingCertificado) {
                  handleUpdateCertificado({ ...editingCertificado, ...certificadoData });
                } else {
                  handleCreateCertificado(certificadoData);
                }
              }}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      defaultValue={editingCertificado?.titulo}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <textarea
                      name="descricao"
                      defaultValue={editingCertificado?.descricao}
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
                      defaultValue={editingCertificado?.tipo}
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
                      Participante *
                    </label>
                    <select
                      name="participante"
                      defaultValue={editingCertificado?.participante.id}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o participante</option>
                      {mockParticipantes.map(participante => (
                        <option key={participante.id} value={participante.id}>{participante.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Treinamento *
                    </label>
                    <select
                      name="treinamento"
                      defaultValue={editingCertificado?.treinamento.id}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione o treinamento</option>
                      {mockTreinamentos.map(treinamento => (
                        <option key={treinamento.id} value={treinamento.id}>{treinamento.titulo}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      name="observacoes"
                      defaultValue={editingCertificado?.observacoes}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingCertificado ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingCertificado(null);
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

        {/* Emitir Certificado Modal */}
        {showEmitirModal && selectedCertificado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Emitir Certificado</h2>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Você está prestes a emitir o certificado <strong>{selectedCertificado.numero}</strong> para <strong>{selectedCertificado.participante.nome}</strong>.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      <strong>Atenção:</strong> Esta ação irá gerar um hash único, QR Code e link de validação. 
                      O certificado será válido por 1 ano a partir da data de emissão.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEmitirCertificado(selectedCertificado)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Confirmar Emissão
                </button>
                <button
                  onClick={() => {
                    setShowEmitirModal(false);
                    setSelectedCertificado(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
