'use client';

import Layout from '../../components/Layout';

export default function ConfiguracoesPage() {
  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Salvar Configurações
          </button>
        </div>

        {/* Configurações do Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Configurações Gerais</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Nome da Empresa</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email de Contato</label>
                <input 
                  type="email" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contato@empresa.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Fuso Horário</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>America/Sao_Paulo</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Configurações de Notificações</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email de notificações</span>
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Notificações push</span>
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">WhatsApp</span>
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">SMS</span>
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Configurações de Segurança */}
        <div className="bg-white rounded-lg border shadow-sm mb-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Configurações de Segurança</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Autenticação de dois fatores</span>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors">
                Configurar
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Política de senhas</span>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors">
                Editar
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Sessões ativas</span>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors">
                Gerenciar
              </button>
            </div>
          </div>
        </div>

        {/* Backup e Restauração */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Backup e Restauração</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Último backup</span>
              <span className="text-sm text-gray-500">Nunca</span>
            </div>
            <div className="flex space-x-2">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                Fazer Backup
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                Restaurar
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                Exportar Dados
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
