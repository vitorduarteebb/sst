#!/bin/bash

echo "🚀 UPLOAD DIRETO PARA VPS"
echo "========================"

VPS_IP="145.223.29.139"

echo "📡 Fazendo upload dos arquivos..."

# Criar diretório temporário
mkdir -p temp-upload

# Copiar arquivos necessários
cp -r backend temp-upload/
cp -r frontend temp-upload/
cp -r nginx temp-upload/
cp docker-compose.yml temp-upload/
cp deploy.sh temp-upload/
cp README.md temp-upload/

# Fazer upload
scp -r temp-upload/* root@$VPS_IP:/root/sst/

# Limpar
rm -rf temp-upload

echo "✅ Upload concluído!"
echo "🔧 Conectando na VPS para fazer deployment..."

# Conectar na VPS e executar deployment
ssh root@$VPS_IP << 'EOF'
cd /root/sst
chmod +x deploy.sh
./deploy.sh
EOF

echo "🎉 Deployment finalizado!"
echo "🌐 Acesse: https://145.223.29.139"
