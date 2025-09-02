'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

interface DashboardStats {
  totalEmpresas: number;
  totalUnidades: number;
  totalPessoas: number;
  totalTurmas: number;
  totalOS: number;
  totalCertificados: number;
  osPendentes: number;
  osEmAndamento: number;
  osConcluidas: number;
  turmasAtivas: number;
  certificadosVencendo: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmpresas: 0,
    totalUnidades: 0,
    totalPessoas: 0,
    totalTurmas: 0,
    totalOS: 0,
    totalCertificados: 0,
    osPendentes: 0,
    osEmAndamento: 0,
    osConcluidas: 0,
    turmasAtivas: 0,
    certificadosVencendo: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const loadDashboardData = async () => {
      try {
        // Em produção, fazer chamada para API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalEmpresas: 12,
          totalUnidades: 45,
          totalPessoas: 234,
          totalTurmas: 18,
          totalOS: 67,
          totalCertificados: 189,
          osPendentes: 23,
          osEmAndamento: 15,
          osConcluidas: 29,
          turmasAtivas: 8,
          certificadosVencendo: 12,
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="space-y-8">
          {/* Header do Dashboard */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Visão geral da Plataforma SST
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                🔄 Atualizar
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                📊 Relatórios
              </button>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Empresas */}
            <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Total de Empresas</h3>
                <span className="text-2xl">🏢</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalEmpresas}</div>
              <p className="text-xs text-gray-600 mt-1">
                +2 este mês
              </p>
            </div>

            {/* Unidades */}
            <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Total de Unidades</h3>
                <span className="text-2xl">📍</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalUnidades}</div>
              <p className="text-xs text-gray-600 mt-1">
                +5 este mês
              </p>
            </div>

            {/* Pessoas */}
            <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Total de Colaboradores</h3>
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalPessoas}</div>
              <p className="text-xs text-gray-600 mt-1">
                +18 este mês
              </p>
            </div>

            {/* Turmas */}
            <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Turmas Ativas</h3>
                <span className="text-2xl">🎓</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">{stats.turmasAtivas}</div>
              <p className="text-xs text-gray-600 mt-1">
                Em andamento
              </p>
            </div>
          </div>

          {/* Seção de Status das OS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">📋</span>
                <h3 className="text-lg font-semibold text-gray-900">Ordens Pendentes</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{stats.osPendentes}</div>
              <p className="text-sm text-gray-600 mt-2">Aguardando aprovação</p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">⏰</span>
                <h3 className="text-lg font-semibold text-gray-900">Em Andamento</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats.osEmAndamento}</div>
              <p className="text-sm text-gray-600 mt-2">Executando</p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">✅</span>
                <h3 className="text-lg font-semibold text-gray-900">Concluídas</h3>
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.osConcluidas}</div>
              <p className="text-sm text-gray-600 mt-2">Finalizadas este mês</p>
            </div>
          </div>

          {/* Seção de Alertas */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">⚠️</span>
              <h3 className="text-lg font-semibold text-gray-900">Alertas e Notificações</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">⚠️</span>
                  <span className="text-sm font-medium text-red-800">
                    {stats.certificadosVencendo} certificados vencendo em 30 dias
                  </span>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors">
                  Ver Detalhes
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-3">⏰</span>
                  <span className="text-sm font-medium text-yellow-800">
                    {stats.osPendentes} ordens de serviço pendentes
                  </span>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors">
                  Revisar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
