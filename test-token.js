const axios = require('axios');

async function testToken() {
  try {
    console.log('🔐 Testando login...');
    
    // 1. Fazer login
    const loginResponse = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@sst.com',
      password: 'password'
    });

    const token = loginResponse.data.access_token;
    console.log('✅ Login OK!');
    console.log('Token:', token.substring(0, 50) + '...');
    
    // 2. Testar endpoint de usuários com token
    console.log('\n👥 Testando endpoint de usuários...');
    
    const usersResponse = await axios.get('http://localhost:3001/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Usuários OK!');
    console.log('Status:', usersResponse.status);
    console.log('Quantidade:', usersResponse.data.length);
    
    // 3. Testar sem token (deve dar 401)
    console.log('\n🚫 Testando sem token...');
    
    try {
      await axios.get('http://localhost:3001/api/v1/users');
      console.log('❌ ERRO: Deveria ter dado 401');
    } catch (error) {
      console.log('✅ OK: Deu 401 como esperado');
      console.log('Status:', error.response?.status);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testToken();
