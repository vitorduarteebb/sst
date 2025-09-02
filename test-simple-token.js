const axios = require('axios');

async function test() {
  try {
    // Login
    console.log('1. Fazendo login...');
    const login = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@sst.com',
      password: 'password'
    });
    
    const token = login.data.access_token;
    console.log('2. Token obtido:', token ? 'OK' : 'ERRO');
    
    // Testar usuários
    console.log('3. Testando usuários...');
    const users = await axios.get('http://localhost:3001/api/v1/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('4. Usuários obtidos:', users.data.length);
    console.log('✅ TUDO OK!');
    
  } catch (error) {
    console.error('❌ ERRO:', error.response?.status, error.response?.data);
  }
}

test();
