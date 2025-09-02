# Setup e Execução - Plataforma SST

## 🚀 Início Rápido

### Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker** e **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))
- **Flutter** 3.10+ (para desenvolvimento mobile) ([Download](https://flutter.dev/))

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd SISTEMA-EPI
```

### 2. Iniciar Infraestrutura
```bash
# Iniciar PostgreSQL, Redis e ferramentas de administração
docker-compose up -d

# Verificar se os serviços estão rodando
docker-compose ps
```

### 3. Configurar Backend
```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp env.example .env

# Editar variáveis de ambiente (opcional)
# nano .env

# Iniciar em modo desenvolvimento
npm run start:dev
```

### 4. Configurar Frontend
```bash
cd frontend

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

### 5. Acessar Aplicação
- **Backend API**: http://localhost:3001
- **Documentação API**: http://localhost:3001/api/docs
- **Frontend**: http://localhost:3000
- **pgAdmin**: http://localhost:5050 (admin@sst.com / admin123)
- **Redis Commander**: http://localhost:8081

---

## 🏗️ Estrutura do Projeto

```
SISTEMA-EPI/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── entities/       # Entidades do banco
│   │   ├── modules/        # Módulos da aplicação
│   │   ├── config/         # Configurações
│   │   └── main.ts         # Ponto de entrada
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Aplicação Next.js
│   ├── src/
│   │   ├── app/            # App Router
│   │   ├── components/     # Componentes React
│   │   └── styles/         # Estilos CSS
│   ├── package.json
│   └── tailwind.config.js
├── mobile/                  # App Flutter (a ser criado)
├── docs/                    # Documentação
├── docker-compose.yml       # Infraestrutura local
└── README.md
```

---

## 🔧 Configuração Detalhada

### Variáveis de Ambiente

#### Backend (.env)
```bash
# Aplicação
NODE_ENV=development
PORT=3001

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=sst_platform

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=sua_chave_refresh_aqui
JWT_REFRESH_EXPIRES_IN=7d

# Storage (opcional para desenvolvimento)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=sst-platform-storage
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_NAME=Plataforma SST
```

### Banco de Dados

#### Primeira Execução
```bash
# O banco será criado automaticamente pelo Docker
# As extensões PostGIS serão habilitadas automaticamente
# As tabelas serão criadas quando o backend iniciar (synchronize: true)
```

#### Verificar Extensões
```sql
-- Conectar ao banco via pgAdmin ou psql
SELECT * FROM pg_extension WHERE extname LIKE 'postgis%';
```

#### Reset do Banco (desenvolvimento)
```bash
# Parar containers
docker-compose down

# Remover volumes
docker-compose down -v

# Reiniciar
docker-compose up -d
```

---

## 🧪 Desenvolvimento

### Backend

#### Comandos Úteis
```bash
# Desenvolvimento com hot reload
npm run start:dev

# Build de produção
npm run build

# Executar testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Verificar tipos TypeScript
npm run type-check

# Formatar código
npm run format

# Linting
npm run lint
```

#### Estrutura de Módulos
```bash
# Criar novo módulo
nest generate module nome-do-modulo
nest generate controller nome-do-modulo
nest generate service nome-do-modulo
```

#### Migrações (quando synchronize: false)
```bash
# Gerar migração
npm run migration:generate -- src/migrations/NomeMigracao

# Executar migrações
npm run migration:run

# Reverter migração
npm run migration:revert
```

### Frontend

#### Comandos Úteis
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm run start

# Linting
npm run lint

# Verificar tipos
npm run type-check
```

#### Estrutura de Componentes
```bash
# Componentes seguem Atomic Design
src/components/
├── ui/           # Atoms (Button, Input, etc.)
├── forms/        # Molecules (FormField, etc.)
├── layout/       # Organisms (Header, Sidebar, etc.)
└── pages/        # Templates e Pages
```

---

## 📱 Mobile (Flutter)

### Setup (quando implementado)
```bash
cd mobile

# Verificar ambiente Flutter
flutter doctor

# Instalar dependências
flutter pub get

# Executar no dispositivo/emulador
flutter run

# Build APK
flutter build apk

# Build iOS
flutter build ios
```

---

## 🐳 Docker

### Comandos Úteis
```bash
# Ver logs dos serviços
docker-compose logs -f postgres
docker-compose logs -f redis

# Executar comando no container
docker-compose exec postgres psql -U postgres -d sst_platform

# Parar todos os serviços
docker-compose down

# Rebuild das imagens
docker-compose build --no-cache
```

### Volumes e Dados
```bash
# Localizar volumes
docker volume ls

# Backup do banco
docker-compose exec postgres pg_dump -U postgres sst_platform > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U postgres sst_platform < backup.sql
```

---

## 🔍 Debug e Troubleshooting

### Problemas Comuns

#### Backend não inicia
```bash
# Verificar se o banco está rodando
docker-compose ps postgres

# Verificar logs
docker-compose logs postgres

# Verificar conectividade
docker-compose exec postgres pg_isready -U postgres
```

#### Frontend não carrega
```bash
# Verificar se o backend está rodando
curl http://localhost:3001/health

# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_API_URL
```

#### Problemas de CORS
```bash
# Verificar configuração no backend
# src/main.ts - app.enableCors()
```

#### Problemas de PostGIS
```bash
# Verificar extensões
docker-compose exec postgres psql -U postgres -d sst_platform -c "SELECT PostGIS_Version();"

# Verificar funções espaciais
docker-compose exec postgres psql -U postgres -d sst_platform -c "SELECT ST_Distance(ST_MakePoint(0,0), ST_MakePoint(1,1));"
```

### Logs e Monitoramento

#### Backend
```bash
# Logs em tempo real
npm run start:dev

# Logs estruturados aparecem no console
# Em produção, configurar para arquivo ou sistema de logs
```

#### Frontend
```bash
# Logs no console do navegador
# React DevTools para debugging
# Next.js built-in debugging
```

---

## 🚀 Deploy

### Desenvolvimento
- Backend: `npm run start:dev`
- Frontend: `npm run dev`
- Banco: Docker Compose local

### Produção
- Backend: `npm run build && npm run start:prod`
- Frontend: `npm run build && npm run start`
- Banco: PostgreSQL gerenciado
- Redis: Redis gerenciado
- Storage: S3 ou compatível

---

## 📚 Recursos Adicionais

### Documentação
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Ferramentas de Desenvolvimento
- **VS Code Extensions**:
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Docker
  - PostgreSQL

### Comunidade
- [NestJS Discord](https://discord.gg/nestjs)
- [Next.js Discord](https://discord.gg/nextjs)
- [Flutter Community](https://flutter.dev/community)

---

## 🆘 Suporte

### Issues
- Criar issue no repositório
- Incluir logs e passos para reprodução
- Verificar se é problema de configuração local

### Contribuição
- Fork do repositório
- Criar branch para feature
- Pull request com descrição clara
- Testes incluídos

---

## 📝 Notas de Desenvolvimento

### Padrões de Código
- **Backend**: NestJS conventions + ESLint + Prettier
- **Frontend**: Next.js conventions + ESLint + Prettier
- **Mobile**: Flutter conventions + Dart analyzer

### Commits
- Usar Conventional Commits
- Exemplo: `feat: adiciona sistema de certificados`
- Tipos: feat, fix, docs, style, refactor, test, chore

### Branches
- `main`: código estável
- `develop`: desenvolvimento ativo
- `feature/*`: novas funcionalidades
- `hotfix/*`: correções urgentes

---

*Este setup foi testado em Windows 10, macOS e Ubuntu 20.04. Para outras distribuições, pode ser necessário ajustar comandos.*
