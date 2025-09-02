#!/bin/bash

# Script de Deployment do Sistema SST
# VPS: 145.223.29.139

set -e

echo "🚀 Iniciando deployment do Sistema SST na VPS..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCESSO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    error "Execute este script no diretório raiz do projeto"
fi

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado"
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose não está instalado"
fi

log "📋 Verificando dependências..."

# Criar diretórios necessários
log "📁 Criando diretórios..."
mkdir -p nginx/ssl
mkdir -p logs

# Gerar certificado SSL self-signed
log "🔐 Gerando certificado SSL..."
if [ ! -f "nginx/ssl/cert.pem" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem \
        -out nginx/ssl/cert.pem \
        -subj "/C=BR/ST=SP/L=Sao Paulo/O=SST Platform/CN=145.223.29.139"
    success "Certificado SSL gerado"
else
    warning "Certificado SSL já existe"
fi

# Parar containers existentes
log "🛑 Parando containers existentes..."
docker-compose down --remove-orphans || true

# Remover imagens antigas
log "🧹 Limpando imagens antigas..."
docker system prune -f

# Build das imagens
log "🔨 Fazendo build das imagens..."
docker-compose build --no-cache

# Iniciar serviços
log "🚀 Iniciando serviços..."
docker-compose up -d

# Aguardar serviços ficarem prontos
log "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Verificar status dos containers
log "🔍 Verificando status dos containers..."
docker-compose ps

# Verificar logs
log "📋 Verificando logs..."
docker-compose logs --tail=20

# Testar conectividade
log "🧪 Testando conectividade..."

# Testar frontend
if curl -f -s http://localhost:3000 > /dev/null; then
    success "Frontend está respondendo"
else
    error "Frontend não está respondendo"
fi

# Testar backend
if curl -f -s http://localhost:3001/api/v1/health > /dev/null; then
    success "Backend está respondendo"
else
    error "Backend não está respondendo"
fi

# Testar nginx
if curl -f -s http://localhost:80 > /dev/null; then
    success "Nginx está respondendo"
else
    error "Nginx não está respondendo"
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
ufw --force reload

# Configurar monitoramento
log "📊 Configurando monitoramento..."
cat > /etc/systemd/system/sst-monitor.service << EOF
[Unit]
Description=SST System Monitor
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/docker-compose -f /root/sst/docker-compose.yml ps
Restart=always
RestartSec=60

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable sst-monitor
systemctl start sst-monitor

# Criar script de backup
log "💾 Configurando backup..."
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup do banco de dados
docker exec sst_postgres pg_dump -U sst_user sst_db > $BACKUP_DIR/db_backup_$DATE.sql

# Backup dos volumes
docker run --rm -v sst_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volumes_backup_$DATE.tar.gz -C /data .

# Limpar backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $DATE"
EOF

chmod +x backup.sh

# Configurar cron para backup diário
(crontab -l 2>/dev/null; echo "0 2 * * * /root/sst/backup.sh") | crontab -

# Criar script de atualização
cat > update.sh << 'EOF'
#!/bin/bash
cd /root/sst
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo "Sistema atualizado em $(date)"
EOF

chmod +x update.sh

# Informações finais
echo ""
echo "🎉 DEPLOYMENT CONCLUÍDO COM SUCESSO!"
echo ""
echo "📋 Informações do Sistema:"
echo "   🌐 Frontend: https://145.223.29.139"
echo "   🔧 Backend API: https://145.223.29.139/api/v1"
echo "   📚 Swagger: https://145.223.29.139/api/v1/docs"
echo ""
echo "🔧 Comandos úteis:"
echo "   📊 Status: docker-compose ps"
echo "   📋 Logs: docker-compose logs -f"
echo "   🔄 Restart: docker-compose restart"
echo "   💾 Backup: ./backup.sh"
echo "   🔄 Update: ./update.sh"
echo ""
echo "🔐 Credenciais padrão:"
echo "   👤 Admin: admin@sst.com / password"
echo "   👤 Técnico: tecnico@sst.com / password"
echo "   👤 Cliente: cliente@sst.com / password"
echo ""
echo "📞 Suporte: Em caso de problemas, verifique os logs com 'docker-compose logs'"
echo ""

success "Sistema SST deployado com sucesso na VPS!"
