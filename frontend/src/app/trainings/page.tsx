'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TrainingsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Treinamentos</h1>
        <Button>
          Criar Treinamento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Total de Treinamentos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Em Andamento</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600">Agendados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Concluídos</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Treinamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Treinamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">Nenhum treinamento cadastrado</p>
            <p className="text-sm">Clique em "Criar Treinamento" para começar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
