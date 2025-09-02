const express = require('express');
const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Servidor de teste funcionando!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = 3002;
app.listen(port, () => {
  console.log(`🚀 Servidor de teste rodando na porta ${port}`);
  console.log(`🌍 Teste: http://localhost:${port}/test`);
  console.log(`🌍 Health: http://localhost:${port}/health`);
});
