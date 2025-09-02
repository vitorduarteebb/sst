'use client';

import Layout from '../../components/Layout';

export default function RelatoriosPage() {
  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Gerar Relatório
          </button>
        </div>

        {/* Tipos de Relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Relatórios de Treinamento</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                📊 Participação por Turma
              </button>
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                📈 Aprovação por Curso
              </button>
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                ⏰ Tempo de Conclusão
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Relatórios de Ativos</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                🏭 Status por Unidade
              </button>
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                🔧 Manutenções Pendentes
              </button>
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                📅 Calendário de Inspeções
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Relatórios de Usuários</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                👥 Distribuição por Função
              </button>
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                📍 Presença por Unidade
              </button>
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
                🎯 Performance Individual
              </button>
            </div>
          </div>
        </div>

        {/* Histórico de Relatórios */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Histórico de Relatórios Gerados</h3>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg">Nenhum relatório gerado</p>
              <p className="text-sm">Clique em "Gerar Relatório" para começar</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
