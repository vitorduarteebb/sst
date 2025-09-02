const axios = require('axios');

async function testLogin() {
  console.log('Testing login...');
  try {
    const response = await axios.post('http://localhost:3001/api/v1/auth/login', {
      email: 'admin@sst.com',
      password: 'password'
    });
    
    console.log('Login successful:', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    console.error('Error details:', error);
    return null;
  }
}

async function testUsersEndpoint(token) {
  if (!token) {
    console.log('No token available');
    return;
  }
  
  console.log('Testing users endpoint with token:', token.substring(0, 20) + '...');
  try {
    const response = await axios.get('http://localhost:3001/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Users endpoint successful:', response.data);
  } catch (error) {
    console.error('Users endpoint failed:', error.response?.data || error.message);
    console.error('Error details:', error);
  }
}

async function main() {
  console.log('Starting test...');
  const token = await testLogin();
  if (token) {
    await testUsersEndpoint(token);
  }
  console.log('Test completed.');
}

main().catch(console.error);
