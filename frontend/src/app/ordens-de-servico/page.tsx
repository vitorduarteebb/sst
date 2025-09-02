'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function OrdensDeServicoPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <Button>
          Criar OS
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Total de OS</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Em Execução</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Concluídas</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Ordens de Serviço */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">Nenhuma OS cadastrada</p>
            <p className="text-sm">Clique em "Criar OS" para começar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
