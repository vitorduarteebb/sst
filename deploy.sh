#!/bin/bash

# Script de Deploy Automatizado para VPS
# Sistema SST Platform

set -e

echo "🚀 Iniciando deploy do Sistema SST Platform..."

# Configurações
VPS_IP="145.223.29.139"
VPS_USER="root"
PROJECT_DIR="/root/sst"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    error "Execute este script no diretório raiz do projeto!"
    exit 1
fi

# 1. Preparar arquivos locais
log "📦 Preparando arquivos para deploy..."

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    warning "Existem mudanças não commitadas. Commitando automaticamente..."
    git add .
    git commit -m "deploy: preparação automática para VPS"
fi

# Push para o repositório
log "📤 Enviando código para o repositório..."
git push origin main

# 2. Conectar na VPS e fazer deploy
log "🔗 Conectando na VPS ($VPS_IP)..."

ssh $VPS_USER@$VPS_IP << 'EOF'
set -e

# Configurações
PROJECT_DIR="/root/sst"
BACKUP_DIR="/root/backups/sst"

# Função para log
log() {
    echo -e "\033[0;32m[$(date +'%Y-%m-%d %H:%M:%S')]\033[0m $1"
}

error() {
    echo -e "\033[0;31m[ERRO]\033[0m $1"
}

# Criar backup se existir
if [ -d "$PROJECT_DIR" ]; then
    log "💾 Criando backup do sistema atual..."
    mkdir -p $BACKUP_DIR
    cp -r $PROJECT_DIR $BACKUP_DIR/sst_$(date +%Y%m%d_%H%M%S)
fi

# Parar containers existentes
log "🛑 Parando containers existentes..."
cd $PROJECT_DIR 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Limpar containers e imagens antigas
log "🧹 Limpando containers e imagens antigas..."
docker system prune -f
docker image prune -f

# Clonar/atualizar repositório
if [ ! -d "$PROJECT_DIR" ]; then
    log "📥 Clonando repositório..."
    git clone https://github.com/vitorduarteebb/sst.git $PROJECT_DIR
else
    log "📥 Atualizando repositório..."
    cd $PROJECT_DIR
    git fetch origin
    git reset --hard origin/main
fi

cd $PROJECT_DIR

# Configurar SSL
log "🔒 Configurando certificados SSL..."
mkdir -p nginx/ssl
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    log "📝 Gerando certificados SSL auto-assinados..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=BR/ST=SP/L=Sao Paulo/O=SST Platform/CN=145.223.29.139"
fi

# Configurar firewall
log "🔥 Configurando firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 3000
ufw allow 3001

# Build e start dos containers
log "🔨 Construindo e iniciando containers..."
docker-compose build --no-cache
docker-compose up -d

# Aguardar inicialização
log "⏳ Aguardando inicialização dos serviços..."
sleep 30

# Verificar status dos containers
log "🔍 Verificando status dos containers..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Verificar conectividade
log "🔗 Testando conectividade..."
sleep 10

# Testar backend
BACKEND_HEALTH=$(docker exec sst_nginx curl -s -o /dev/null -w "%{http_code}" http://backend:3001/api/v1/health 2>/dev/null || echo "000")
if [ "$BACKEND_HEALTH" = "200" ]; then
    log "✅ Backend funcionando corretamente"
else
    error "❌ Backend não está respondendo (HTTP $BACKEND_HEALTH)"
fi

# Testar frontend
FRONTEND_HEALTH=$(docker exec sst_nginx curl -s -o /dev/null -w "%{http_code}" http://frontend:3000 2>/dev/null || echo "000")
if [ "$FRONTEND_HEALTH" = "200" ]; then
    log "✅ Frontend funcionando corretamente"
else
    error "❌ Frontend não está respondendo (HTTP $FRONTEND_HEALTH)"
fi

# Mostrar logs se houver problemas
if [ "$BACKEND_HEALTH" != "200" ] || [ "$FRONTEND_HEALTH" != "200" ]; then
    log "📋 Últimos logs do backend:"
    docker logs --tail 20 sst_backend 2>/dev/null || true
    
    log "📋 Últimos logs do frontend:"
    docker logs --tail 20 sst_frontend 2>/dev/null || true
    
    log "📋 Últimos logs do nginx:"
    docker logs --tail 20 sst_nginx 2>/dev/null || true
fi

log "🎉 Deploy concluído!"
log "🌐 Acesse: https://145.223.29.139"
log "🔧 API: https://145.223.29.139/api/v1"

EOF

# Verificar resultado do deploy
if [ $? -eq 0 ]; then
    log "✅ Deploy realizado com sucesso!"
    log "🌐 Sistema disponível em: https://145.223.29.139"
    log "📊 Para monitorar: ssh root@145.223.29.139 'docker logs -f sst_frontend'"
else
    error "❌ Falha no deploy. Verifique os logs acima."
    exit 1
fi
