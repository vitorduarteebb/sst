# Sistema SST Platform

Sistema completo de gestão de Segurança e Saúde no Trabalho (SST) com frontend Next.js, backend NestJS e PostgreSQL.

## 🚀 Deploy Automatizado

### Pré-requisitos
- Git instalado
- Acesso SSH à VPS (145.223.29.139)
- Docker e Docker Compose instalados na VPS

### Deploy com um comando

```bash
# Execute no diretório raiz do projeto
chmod +x deploy.sh
./deploy.sh
```

O script irá:
1. ✅ Commit automático das mudanças
2. ✅ Push para o repositório
3. ✅ Backup do sistema atual na VPS
4. ✅ Limpeza de containers antigos
5. ✅ Build e deploy dos novos containers
6. ✅ Configuração de SSL e firewall
7. ✅ Testes de conectividade
8. ✅ Verificação de logs

### Deploy Manual

Se preferir fazer o deploy manualmente:

```bash
# 1. Preparar código local
git add .
git commit -m "deploy: preparação para VPS"
git push origin main

# 2. Conectar na VPS
ssh root@145.223.29.139

# 3. Na VPS
cd /root/sst
git pull origin main
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d

# 4. Verificar status
docker ps
docker logs sst_frontend
docker logs sst_backend
```

## 🌐 Acesso ao Sistema

- **Frontend**: https://145.223.29.139
- **API Backend**: https://145.223.29.139/api/v1
- **Documentação Swagger**: https://145.223.29.139/api/v1/docs

## 👤 Credenciais de Teste

- **Admin**: admin@sst.com / password
- **Técnico**: tecnico@sst.com / password  
- **Cliente**: cliente@sst.com / password

## 📋 Funcionalidades

### Frontend (Next.js 14)
- ✅ Dashboard interativo
- ✅ Gestão de usuários
- ✅ Gestão de certificados
- ✅ Gestão de treinamentos
- ✅ Relatórios
- ✅ Configurações do sistema
- ✅ Autenticação JWT
- ✅ Interface responsiva

### Backend (NestJS)
- ✅ API RESTful
- ✅ Autenticação JWT
- ✅ Controle de acesso por roles
- ✅ Geração de PDFs
- ✅ Validação de dados
- ✅ Documentação Swagger
- ✅ Health checks

### Infraestrutura
- ✅ PostgreSQL 15
- ✅ Nginx como reverse proxy
- ✅ SSL/TLS configurado
- ✅ Firewall UFW
- ✅ Containers Docker
- ✅ Health checks automáticos

## 🔧 Comandos Úteis

### Na VPS
```bash
# Ver status dos containers
docker ps

# Ver logs em tempo real
docker logs -f sst_frontend
docker logs -f sst_backend
docker logs -f sst_nginx

# Reiniciar serviços
docker-compose restart frontend
docker-compose restart backend
docker-compose restart nginx

# Backup do banco
docker exec sst_postgres pg_dump -U sst_user sst_db > backup.sql

# Atualizar sistema
cd /root/sst
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Desenvolvimento Local
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run start:dev

# Banco de dados
docker run -d --name postgres -e POSTGRES_DB=sst_db -e POSTGRES_USER=sst_user -e POSTGRES_PASSWORD=sst_password_2024 -p 5432:5432 postgres:15-alpine
```

## 📁 Estrutura do Projeto

```
sst/
├── frontend/                 # Next.js 14
│   ├── src/
│   │   ├── app/             # App Router
│   │   ├── components/       # Componentes React
│   │   ├── contexts/        # Context API
│   │   ├── services/        # Serviços de API
│   │   └── types/           # Tipos TypeScript
│   ├── Dockerfile
│   └── next.config.js
├── backend/                  # NestJS
│   ├── src/
│   │   ├── modules/         # Módulos da aplicação
│   │   ├── auth/            # Autenticação
│   │   ├── common/          # Utilitários
│   │   └── main.ts
│   └── Dockerfile
├── nginx/                    # Configuração Nginx
│   ├── nginx.conf
│   └── ssl/                 # Certificados SSL
├── docker-compose.yml       # Orquestração
├── deploy.sh               # Script de deploy
└── README.md
```

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, JWT, Passport
- **Banco**: PostgreSQL 15
- **Proxy**: Nginx
- **Containerização**: Docker, Docker Compose
- **Deploy**: VPS Ubuntu 25.04

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Controle de acesso por roles
- ✅ HTTPS/SSL configurado
- ✅ Firewall UFW ativo
- ✅ Validação de dados
- ✅ Sanitização de inputs

## 📊 Monitoramento

- ✅ Health checks automáticos
- ✅ Logs estruturados
- ✅ Métricas de containers
- ✅ Backup automático configurado

## 🆘 Suporte

Em caso de problemas:

1. Verifique os logs: `docker logs sst_frontend`
2. Teste conectividade: `curl https://145.223.29.139`
3. Verifique status: `docker ps`
4. Reinicie serviços: `docker-compose restart`

## 📝 Licença

Este projeto é privado e de uso interno da empresa.
