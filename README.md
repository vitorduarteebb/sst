# 🏭 Sistema SST - Plataforma de Segurança e Saúde no Trabalho

## 📋 Visão Geral

Sistema completo para gestão de Segurança e Saúde no Trabalho (SST), incluindo:
- 👥 Gestão de Usuários
- 🏢 Gestão de Empresas e Unidades
- 📋 Ordens de Serviço
- 🎓 Treinamentos e Certificados
- 📊 Relatórios e Dashboards
- 🔐 Autenticação JWT + RBAC

## 🚀 Deployment na VPS

### 📋 Pré-requisitos

- **VPS**: Ubuntu 25.04 (145.223.29.139)
- **Recursos**: 1 CPU, 4GB RAM, 50GB SSD
- **Acesso**: SSH root

### 🔧 Instalação Automatizada

```bash
# 1. Conectar na VPS
ssh root@145.223.29.139

# 2. Instalar dependências
apt update && apt upgrade -y
apt install -y docker.io docker-compose git curl wget

# 3. Clonar o projeto
git clone https://github.com/seu-usuario/sst-platform.git
cd sst-platform

# 4. Executar deployment
chmod +x deploy.sh
./deploy.sh
```

### 🎯 URLs de Acesso

- **🌐 Frontend**: https://145.223.29.139
- **🔧 Backend API**: https://145.223.29.139/api/v1
- **📚 Swagger**: https://145.223.29.139/api/v1/docs

### 🔐 Credenciais Padrão

| Usuário | Email | Senha | Perfil |
|---------|-------|-------|--------|
| Admin | admin@sst.com | password | Administrador |
| Técnico | tecnico@sst.com | password | Técnico |
| Cliente | cliente@sst.com | password | Cliente |

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│   Porta 3000    │    │   Porta 3001    │    │   Porta 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲
         │                       │
         └───────────────────────┘
                    │
         ┌─────────────────┐
         │   Nginx         │
         │   (Reverse      │
         │    Proxy)       │
         │   Porta 80/443  │
         └─────────────────┘
```

## 📦 Serviços Docker

| Serviço | Container | Porta | Descrição |
|---------|-----------|-------|-----------|
| Frontend | sst_frontend | 3000 | Interface web Next.js |
| Backend | sst_backend | 3001 | API NestJS |
| Database | sst_postgres | 5432 | Banco PostgreSQL |
| Proxy | sst_nginx | 80/443 | Nginx reverse proxy |

## 🔧 Comandos Úteis

### 📊 Monitoramento
```bash
# Status dos containers
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 🔄 Gerenciamento
```bash
# Reiniciar todos os serviços
docker-compose restart

# Parar todos os serviços
docker-compose down

# Rebuild e reiniciar
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 💾 Backup
```bash
# Backup manual
./backup.sh

# Backup do banco apenas
docker exec sst_postgres pg_dump -U sst_user sst_db > backup.sql

# Restaurar backup
docker exec -i sst_postgres psql -U sst_user sst_db < backup.sql
```

### 🔄 Atualização
```bash
# Atualizar sistema
./update.sh

# Ou manualmente
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🛡️ Segurança

### 🔐 SSL/TLS
- Certificado SSL self-signed configurado
- Redirecionamento HTTP → HTTPS
- Headers de segurança configurados

### 🔥 Firewall
- UFW configurado automaticamente
- Portas abertas: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Rate limiting configurado

### 📊 Monitoramento
- Health checks configurados
- Logs centralizados
- Backup automático diário

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Container não inicia
```bash
# Verificar logs
docker-compose logs [servico]

# Verificar recursos
docker stats

# Reiniciar container
docker-compose restart [servico]
```

#### 2. Banco não conecta
```bash
# Verificar se PostgreSQL está rodando
docker-compose exec postgres pg_isready

# Verificar logs do banco
docker-compose logs postgres

# Testar conexão
docker-compose exec postgres psql -U sst_user -d sst_db
```

#### 3. Frontend não carrega
```bash
# Verificar se frontend está rodando
curl http://localhost:3000

# Verificar logs
docker-compose logs frontend

# Verificar nginx
docker-compose logs nginx
```

#### 4. API não responde
```bash
# Testar endpoint de health
curl http://localhost:3001/api/v1/health

# Verificar logs do backend
docker-compose logs backend

# Verificar variáveis de ambiente
docker-compose exec backend env
```

## 📈 Monitoramento e Logs

### 📊 Métricas
- CPU, RAM e disco monitorados
- Logs centralizados em `/var/log/nginx/`
- Health checks automáticos

### 📋 Logs Importantes
```bash
# Logs do Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs dos containers
docker-compose logs -f

# Logs do sistema
journalctl -u sst-monitor -f
```

## 🔄 CI/CD

### 📦 Deploy Automatizado
O script `deploy.sh` automatiza:
- ✅ Instalação de dependências
- ✅ Configuração de SSL
- ✅ Build das imagens Docker
- ✅ Configuração do firewall
- ✅ Configuração de backup
- ✅ Configuração de monitoramento

### 🔄 Atualizações
```bash
# Atualização automática
./update.sh

# Ou via Git
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📞 Suporte

### 🆘 Contatos
- **Email**: suporte@sst.com
- **Telefone**: (11) 99999-9999
- **Documentação**: https://145.223.29.139/api/v1/docs

### 🐛 Reportar Bugs
1. Verificar logs: `docker-compose logs`
2. Verificar status: `docker-compose ps`
3. Coletar informações do sistema
4. Abrir issue no GitHub

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**🎉 Sistema SST - Deployado com sucesso na VPS!**
