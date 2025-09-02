# Arquitetura Técnica - Plataforma SST

## Visão Geral

A Plataforma SST é uma solução completa para gestão de Segurança do Trabalho, construída com arquitetura moderna, escalável e segura. O sistema é composto por três camadas principais: backend API, frontend web e aplicativo mobile.

## Arquitetura de Alto Nível

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     Mobile      │
│   (Next.js)     │◄──►│    (NestJS)     │◄──►│   (Flutter)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   PostgreSQL    │    │   SQLite Local  │
│   (Vercel)      │    │   + PostGIS     │    │   + Sync Queue  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Stack Tecnológica

### Backend (NestJS)
- **Framework**: NestJS 10.x
- **Runtime**: Node.js 18+
- **Banco de Dados**: PostgreSQL 14+ com PostGIS
- **Cache/Filas**: Redis 7.x
- **ORM**: TypeORM 0.3.x
- **Autenticação**: JWT + Passport
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI 3.0
- **Testes**: Jest + Supertest

### Frontend (Next.js)
- **Framework**: Next.js 14.x (App Router)
- **Runtime**: React 18.x
- **Styling**: Tailwind CSS 3.x
- **Componentes**: Radix UI + shadcn/ui
- **Estado**: Zustand + React Query
- **Formulários**: React Hook Form + Zod
- **Mapas**: Leaflet + React Leaflet
- **Build**: Webpack 5 + Turbopack

### Mobile (Flutter)
- **Framework**: Flutter 3.10+
- **Linguagem**: Dart 3.x
- **Banco Local**: SQLite
- **Estado**: Riverpod/Bloc
- **HTTP**: Dio + Retrofit
- **Storage**: Shared Preferences + Hive
- **Câmera**: camera_plugin
- **GPS**: geolocator
- **Biometria**: local_auth

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Orquestração**: Kubernetes (opcional)
- **CI/CD**: GitHub Actions
- **Monitoramento**: Prometheus + Grafana
- **Logs**: ELK Stack
- **Storage**: AWS S3 / MinIO
- **CDN**: Cloudflare / AWS CloudFront

## Padrões Arquiteturais

### Backend
- **Arquitetura em Camadas**: Controller → Service → Repository
- **Injeção de Dependência**: NestJS DI Container
- **Event-Driven**: Event Emitter para comunicação entre módulos
- **CQRS**: Separação de comandos e consultas
- **Repository Pattern**: Abstração de acesso a dados
- **DTOs**: Data Transfer Objects para APIs
- **Interceptors**: Logging, caching, transformação
- **Guards**: Autenticação e autorização
- **Pipes**: Validação e transformação de dados

### Frontend
- **Component-Based**: Arquitetura baseada em componentes reutilizáveis
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **State Management**: Estado global com Zustand, local com React Query
- **Custom Hooks**: Lógica reutilizável encapsulada
- **Error Boundaries**: Tratamento de erros em componentes
- **Lazy Loading**: Code splitting e carregamento sob demanda
- **Progressive Enhancement**: Funcionalidade básica sempre disponível

### Mobile
- **Clean Architecture**: Separação clara de responsabilidades
- **Repository Pattern**: Abstração de fontes de dados
- **Offline-First**: Funcionamento sem conexão
- **Sync Strategy**: Sincronização inteligente quando online
- **Local Storage**: Cache local para performance
- **Background Processing**: Sincronização em background

## Estrutura de Módulos

### Backend Módulos
```
src/
├── modules/
│   ├── auth/           # Autenticação e autorização
│   ├── empresas/       # Gestão de empresas
│   ├── unidades/       # Gestão de unidades
│   ├── pessoas/        # Gestão de pessoas/colaboradores
│   ├── turmas/         # Gestão de turmas de treinamento
│   ├── certificados/   # Emissão e validação de certificados
│   ├── checklists/     # Modelos e execução de checklists
│   ├── ordens-servico/ # Gestão de ordens de serviço
│   ├── evidencias/     # Captura e gestão de evidências
│   ├── sincronizacao/  # Sincronização offline/online
│   ├── relatorios/     # Geração de relatórios
│   ├── notificacoes/   # Sistema de notificações
│   ├── api-publica/    # API pública para integrações
│   └── bi/            # Business Intelligence
├── common/             # Código compartilhado
├── config/            # Configurações
└── entities/          # Entidades do banco
```

### Frontend Módulos
```
src/
├── app/               # App Router do Next.js
├── components/        # Componentes reutilizáveis
│   ├── ui/           # Componentes base (shadcn/ui)
│   ├── layout/       # Componentes de layout
│   ├── forms/        # Componentes de formulário
│   ├── tables/       # Componentes de tabela
│   ├── charts/       # Componentes de gráficos
│   └── maps/         # Componentes de mapas
├── hooks/            # Custom hooks
├── lib/              # Utilitários e configurações
├── stores/           # Estado global (Zustand)
└── types/            # Definições de tipos TypeScript
```

## Banco de Dados

### PostgreSQL + PostGIS
- **Extensões**: PostGIS para georreferenciamento
- **Índices**: B-tree, GIN, GiST para performance
- **Partitioning**: Particionamento por data para tabelas grandes
- **Backup**: WAL + Point-in-time recovery
- **Replicação**: Master-Slave para leitura
- **Connection Pooling**: PgBouncer para escalabilidade

### Esquema Principal
```sql
-- Empresas e estrutura organizacional
empresas (id, razao_social, cnpj, ...)
unidades (id, empresa_id, nome, geo, ...)
pessoas (id, empresa_id, nome, cpf, ...)

-- Treinamentos
turmas (id, unidade_id, norma, carga_horaria, ...)
matriculas (id, turma_id, pessoa_id, status, ...)
provas (id, turma_id, nota_minima, ...)
avaliacoes (id, prova_id, pessoa_id, nota, ...)
presencas (id, turma_id, pessoa_id, gps, ...)

-- Certificados
certificados (id, pessoa_id, turma_id, hash_sha256, ...)

-- Checklists e OS
modelos_checklist (id, nome, versao, itens, ...)
ordens_servico (id, unidade_id, modelo_id, status, ...)
execucoes_os (id, os_id, inicio, fim, offline, ...)
respostas_checklist (id, execucao_id, item_id, valor, ...)

-- Evidências
evidencias (id, tipo, ref_type, ref_id, storage_key, ...)

-- Sincronização
change_journal (id, operacao, entidade, payload, ...)
```

## Segurança

### Autenticação
- **JWT**: Access tokens de curta duração (15min)
- **Refresh Tokens**: Renovação automática de sessão
- **Multi-factor**: 2FA opcional para usuários críticos
- **Session Management**: Controle de sessões por dispositivo

### Autorização
- **RBAC**: Role-Based Access Control
- **Scopes**: Permissões granulares por recurso
- **Row-Level Security**: Isolamento de dados por empresa
- **API Keys**: Chaves para integrações externas

### Criptografia
- **TLS 1.3**: Comunicação criptografada
- **AES-256**: Criptografia de dados sensíveis
- **SHA-256**: Hashing de certificados
- **Argon2**: Hashing de senhas

### LGPD
- **Consentimento**: Controle de consentimento do usuário
- **Anonimização**: Dados anonimizados para BI
- **Retenção**: Política de retenção e descarte
- **Portabilidade**: Exportação de dados pessoais

## Performance

### Backend
- **Caching**: Redis para dados frequentemente acessados
- **Connection Pooling**: Pool de conexões do banco
- **Query Optimization**: Índices e consultas otimizadas
- **Background Jobs**: Processamento assíncrono com Bull
- **Rate Limiting**: Proteção contra abuso da API

### Frontend
- **Code Splitting**: Carregamento sob demanda
- **Image Optimization**: Otimização automática de imagens
- **Lazy Loading**: Carregamento de componentes
- **Service Worker**: Cache offline e PWA
- **Bundle Analysis**: Otimização de bundles

### Mobile
- **Local Cache**: Dados frequentemente acessados
- **Image Compression**: Compressão local de imagens
- **Background Sync**: Sincronização inteligente
- **Offline Storage**: Funcionamento sem conexão

## Monitoramento e Observabilidade

### Logs
- **Structured Logging**: Logs em formato JSON
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Correlation IDs**: Rastreamento de requisições
- **Log Aggregation**: Centralização com ELK

### Métricas
- **Application Metrics**: Tempo de resposta, taxa de erro
- **Business Metrics**: OS por dia, certificados emitidos
- **Infrastructure Metrics**: CPU, memória, disco
- **Custom Dashboards**: Grafana para visualização

### Tracing
- **Distributed Tracing**: Rastreamento de requisições
- **Performance Profiling**: Análise de gargalos
- **Error Tracking**: Captura e análise de erros
- **User Experience**: Métricas de usuário

## Escalabilidade

### Horizontal
- **Load Balancing**: Distribuição de carga
- **Auto-scaling**: Escala automática baseada em demanda
- **Database Sharding**: Particionamento horizontal
- **Microservices**: Decomposição em serviços menores

### Vertical
- **Resource Optimization**: Otimização de recursos
- **Database Tuning**: Ajuste fino do banco
- **Caching Strategy**: Estratégia de cache em camadas
- **CDN**: Distribuição de conteúdo estático

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Diários + incrementais
- **File Storage**: Backup do S3/MinIO
- **Configuration**: Backup de configurações
- **Testing**: Teste regular de restauração

### High Availability
- **Multi-AZ**: Disponibilidade em múltiplas zonas
- **Failover**: Failover automático
- **Health Checks**: Verificação de saúde dos serviços
- **Circuit Breaker**: Proteção contra falhas em cascata

## Desenvolvimento

### Ambiente Local
- **Docker Compose**: Infraestrutura local
- **Hot Reload**: Recarregamento automático
- **Debug Tools**: Ferramentas de debug
- **Mock Services**: Serviços simulados

### CI/CD Pipeline
- **Code Quality**: Linting, formatting, type checking
- **Testing**: Unit, integration, e2e tests
- **Security Scanning**: Análise de vulnerabilidades
- **Automated Deployment**: Deploy automático

### Code Standards
- **TypeScript**: Tipagem estática
- **ESLint**: Linting de código
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits
- **Code Review**: Revisão obrigatória

## Considerações de Implementação

### Fase 1 - MVP (6-8 semanas)
- Cadastros básicos (empresas, unidades, pessoas)
- Gestão de turmas e matrículas
- Sistema de presença digital
- Emissão básica de certificados
- Portal do cliente básico

### Fase 2 - Funcionalidades Core (4-6 semanas)
- Checklists e ordens de serviço
- Execução offline de OS
- Captura de evidências
- Sistema de provas
- Relatórios básicos

### Fase 3 - Robustez (4-6 semanas)
- Sincronização avançada
- BI e dashboards
- Notificações
- API pública
- Testes e otimizações

### Fase 4 - Escala (contínua)
- Performance tuning
- Monitoramento avançado
- Segurança hardening
- Internacionalização
- Integrações externas

## Conclusão

A arquitetura da Plataforma SST foi projetada para ser:
- **Escalável**: Suportar crescimento de usuários e dados
- **Segura**: Proteger dados sensíveis e conformidade LGPD
- **Performática**: Resposta rápida e experiência fluida
- **Manutenível**: Código limpo e bem estruturado
- **Extensível**: Fácil adição de novas funcionalidades
- **Confiável**: Alta disponibilidade e recuperação de falhas

Esta arquitetura fornece uma base sólida para o desenvolvimento e evolução da plataforma, permitindo que ela cresça junto com as necessidades dos clientes e requisitos regulatórios.
