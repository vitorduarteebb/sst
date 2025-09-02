'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CubeIcon, 
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();

  // Dados mockados para demonstração
  const stats = [
    {
      name: 'Total de Usuários',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Empresas Ativas',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: BuildingOfficeIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Ativos Cadastrados',
      value: '2,567',
      change: '+8%',
      changeType: 'positive',
      icon: CubeIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'OS Pendentes',
      value: '23',
      change: '-3%',
      changeType: 'negative',
      icon: ClipboardDocumentListIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Treinamentos Ativos',
      value: '45',
      change: '+15%',
      changeType: 'positive',
      icon: AcademicCapIcon,
      color: 'bg-indigo-500'
    },
    {
      name: 'Certificados Válidos',
      value: '1,890',
      change: '+22%',
      changeType: 'positive',
      icon: DocumentCheckIcon,
      color: 'bg-emerald-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'OS',
      description: 'Nova Ordem de Serviço criada para Unidade A',
      time: '2 minutos atrás',
      user: 'João Silva'
    },
    {
      id: 2,
      type: 'Treinamento',
      description: 'Treinamento NR10 concluído por 15 funcionários',
      time: '1 hora atrás',
      user: 'Maria Santos'
    },
    {
      id: 3,
      type: 'Certificado',
      description: 'Certificado emitido para Pedro Oliveira',
      time: '3 horas atrás',
      user: 'Ana Costa'
    },
    {
      id: 4,
      type: 'Ativo',
      description: 'Novo ativo cadastrado: Extintor CO2',
      time: '5 horas atrás',
      user: 'Carlos Lima'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: '5 certificados vencem em 30 dias',
      count: 5
    },
    {
      id: 2,
      type: 'danger',
      message: '2 ordens de serviço estão atrasadas',
      count: 2
    },
    {
      id: 3,
      type: 'info',
      message: 'Novo treinamento disponível: NR20',
      count: 1
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bem-vindo, {user?.nome || user?.email?.split('@')[0] || 'Usuário'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Aqui está um resumo das atividades do sistema SST
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última atualização</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Atividades Recentes
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {activity.type}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-gray-500">{activity.user}</p>
                    <span className="mx-2 text-gray-300">•</span>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Alertas e Notificações
          </h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  alert.type === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <ExclamationTriangleIcon className={`w-4 h-4 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'danger' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.count} item(s)</p>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Ver detalhes
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <ClipboardDocumentListIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Nova OS</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <AcademicCapIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Novo Treinamento</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <CubeIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Cadastrar Ativo</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <ChartBarIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Gerar Relatório</span>
          </button>
        </div>
      </div>
    </div>
  );
}
