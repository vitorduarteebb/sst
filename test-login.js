const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔐 Testando login...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@sst.com',
      password: 'password'
    });

    console.log('✅ Login bem-sucedido!');
    console.log('Status:', loginResponse.status);
    console.log('Headers:', loginResponse.headers);
    console.log('Resposta completa:', JSON.stringify(loginResponse.data, null, 2));
    
    const token = loginResponse.data.access_token;
    console.log('Token extraído:', token ? token.substring(0, 50) + '...' : 'NULO');
    
    return token;
  } catch (error) {
    console.error('❌ Erro no login:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    throw error;
  }
}

async function testUsersEndpoint(token) {
  try {
    console.log('\n👥 Testando endpoint de usuários...');
    console.log('Token usado:', token ? token.substring(0, 50) + '...' : 'NULO');
    
    const usersResponse = await axios.get('http://localhost:3001/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Endpoint de usuários funcionando!');
    console.log('Status:', usersResponse.status);
    console.log('Usuários encontrados:', usersResponse.data.length);
    console.log('Primeiro usuário:', JSON.stringify(usersResponse.data[0], null, 2));
    
  } catch (error) {
    console.error('❌ Erro no endpoint de usuários:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    console.error('Message:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando testes...\n');
    const token = await testLogin();
    console.log('\n' + '='.repeat(50) + '\n');
    await testUsersEndpoint(token);
    console.log('\n✅ Testes concluídos!');
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

main();
