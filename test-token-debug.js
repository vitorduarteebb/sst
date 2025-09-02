const axios = require('axios');

async function testTokenDebug() {
  try {
    console.log('🔐 Testando login...');
    
    // 1. Fazer login
    const loginResponse = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@sst.com',
      password: 'password'
    });

    const token = loginResponse.data.access_token;
    console.log('✅ Login OK!');
    console.log('Token completo:', token);
    console.log('Token (primeiros 50 chars):', token.substring(0, 50) + '...');
    
    // 2. Testar endpoint de usuários com token
    console.log('\n👥 Testando endpoint de usuários...');
    console.log('URL:', 'http://localhost:3001/api/v1/users');
    console.log('Headers:', {
      'Authorization': `Bearer ${token.substring(0, 50)}...`,
      'Content-Type': 'application/json'
    });
    
    const usersResponse = await axios.get('http://localhost:3001/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Usuários OK!');
    console.log('Status:', usersResponse.status);
    console.log('Quantidade:', usersResponse.data.length);
    console.log('Primeiro usuário:', usersResponse.data[0]);
    
    // 3. Testar criação de usuário
    console.log('\n➕ Testando criação de usuário...');
    const newUser = {
      nome: 'Teste User',
      email: 'teste@teste.com',
      password: 'password',
      role: 'TECNICO',
      cpf: '12345678901',
      telefone: '11999999999',
      empresaId: '1',
      unidadeId: ''
    };
    
    const createResponse = await axios.post('http://localhost:3001/api/v1/users', newUser, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Usuário criado!');
    console.log('Status:', createResponse.status);
    console.log('Usuário criado:', createResponse.data);
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.status);
    console.error('❌ Erro data:', error.response?.data);
    console.error('❌ Erro message:', error.message);
  }
}

testTokenDebug();
