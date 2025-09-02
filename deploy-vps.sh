#!/bin/bash

echo "🚀 DEPLOYMENT AUTOMÁTICO DO SISTEMA SST"
echo "========================================"

# Configurações
VPS_IP="145.223.29.139"
REPO_URL="https://github.com/vitorduarteebb/sst.git"

echo "📡 Conectando na VPS..."
ssh root@$VPS_IP << 'EOF'

echo "🔧 Atualizando sistema..."
apt update && apt upgrade -y

echo "📦 Instalando dependências..."
apt install -y docker.io docker-compose git curl wget nginx

echo "🐳 Iniciando Docker..."
systemctl start docker
systemctl enable docker

echo "📁 Preparando diretório..."
cd /root
rm -rf sst
mkdir sst
cd sst

echo "📥 Clonando repositório..."
git clone https://github.com/vitorduarteebb/sst.git .

echo "🔐 Gerando certificado SSL..."
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=BR/ST=SP/L=Sao Paulo/O=SST/OU=IT/CN=145.223.29.139"

echo "🛑 Parando containers existentes..."
docker-compose down -v 2>/dev/null || true

echo "🧹 Limpando imagens antigas..."
docker system prune -f

echo "🏗️ Construindo containers..."
docker-compose build --no-cache

echo "🚀 Iniciando serviços..."
docker-compose up -d

echo "🔥 Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "⏳ Aguardando serviços iniciarem..."
sleep 30

echo "🔍 Verificando status dos serviços..."
docker-compose ps

echo "✅ DEPLOYMENT CONCLUÍDO!"
echo "🌐 Frontend: https://145.223.29.139"
echo "🔧 Backend API: https://145.223.29.139/api/v1"
echo "📚 Swagger: https://145.223.29.139/api"
echo ""
echo "🔑 Credenciais padrão:"
echo "   Email: admin@sst.com"
echo "   Senha: admin123"

EOF

echo "✅ Deployment finalizado!"
echo "🌐 Acesse: https://145.223.29.139"
