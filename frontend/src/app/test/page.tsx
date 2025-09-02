'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';

export default function TestPage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const runTest = async () => {
    setTestResult('Iniciando teste...\n');
    
    try {
      // Teste 1: Verificar autenticação
      setTestResult(prev => prev + '1. Verificando autenticação...\n');
      setTestResult(prev => prev + `   - isAuthenticated: ${isAuthenticated}\n`);
      setTestResult(prev => prev + `   - authLoading: ${authLoading}\n`);
      setTestResult(prev => prev + `   - user: ${user ? 'EXISTE' : 'NÃO EXISTE'}\n`);
      
      // Teste 2: Verificar token
      setTestResult(prev => prev + '2. Verificando token...\n');
      const token = localStorage.getItem('access_token');
      setTestResult(prev => prev + `   - Token: ${token ? 'EXISTE' : 'NÃO EXISTE'}\n`);
      
      if (token) {
        setTestResult(prev => prev + `   - Token (primeiros 50 chars): ${token.substring(0, 50)}...\n`);
      }
      
      // Teste 3: Tentar carregar usuários
      if (isAuthenticated && !authLoading) {
        setTestResult(prev => prev + '3. Tentando carregar usuários...\n');
        const users = await userService.getUsers();
        setTestResult(prev => prev + `   - Usuários carregados: ${users.length}\n`);
        setTestResult(prev => prev + `   - Primeiro usuário: ${users[0]?.nome || 'NENHUM'}\n`);
      } else {
        setTestResult(prev => prev + '3. Pulando carregamento de usuários (não autenticado)\n');
      }
      
      setTestResult(prev => prev + '\n✅ Teste concluído!\n');
      
    } catch (error) {
      setTestResult(prev => prev + `\n❌ Erro no teste: ${error}\n`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Página de Teste</h1>
      
      <div className="mb-4">
        <button 
          onClick={runTest}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Executar Teste
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Resultado do Teste:</h2>
        <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
      </div>
      
      <div className="mt-4">
        <h2 className="font-bold mb-2">Status Atual:</h2>
        <ul className="list-disc list-inside">
          <li>Autenticado: {isAuthenticated ? 'SIM' : 'NÃO'}</li>
          <li>Carregando: {authLoading ? 'SIM' : 'NÃO'}</li>
          <li>Usuário: {user ? user.nome : 'NENHUM'}</li>
          <li>Token: {localStorage.getItem('access_token') ? 'EXISTE' : 'NÃO EXISTE'}</li>
        </ul>
      </div>
    </div>
  );
}
