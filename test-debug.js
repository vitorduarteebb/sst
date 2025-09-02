const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔐 Testando login...');
    console.log('URL:', 'http://localhost:3001/api/v1/auth/login');
    
    const response = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@sst.com',
      password: 'password'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login bem-sucedido!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erro no login:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return null;
  }
}

async function testUsersWithToken(token) {
  if (!token) {
    console.log('❌ Sem token, pulando teste de usuários');
    return;
  }

  try {
    console.log('\n👥 Testando endpoint de usuários...');
    console.log('Token:', token.substring(0, 50) + '...');
    
    const response = await axios.get('http://localhost:3001/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Usuários OK!');
    console.log('Status:', response.status);
    console.log('Quantidade:', response.data.length);
    
  } catch (error) {
    console.error('❌ Erro nos usuários:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando testes...\n');
  
  const token = await testLogin();
  await testUsersWithToken(token);
  
  console.log('\n✅ Testes concluídos!');
}

main().catch(console.error);
