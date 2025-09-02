-- Script de inicialização do banco de dados SST Platform
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar tabelas principais
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    razao_social VARCHAR(255),
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS unidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    empresa_id UUID REFERENCES empresas(id),
    endereco TEXT,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'TECNICO', 'CLIENTE', 'AUDITOR')),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    empresa_id UUID REFERENCES empresas(id),
    unidade_id UUID REFERENCES unidades(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ordens_servico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA', 'CANCELADA')),
    prioridade VARCHAR(50) NOT NULL CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE')),
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('MANUTENCAO', 'INSPECAO', 'LIMPEZA', 'REPARO', 'INSTALACAO', 'OUTRO')),
    data_inicio TIMESTAMP,
    data_fim TIMESTAMP,
    responsavel_id UUID REFERENCES usuarios(id),
    unidade_id UUID REFERENCES unidades(id),
    empresa_id UUID REFERENCES empresas(id),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    servidor_id UUID,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('CHECKLIST', 'ORDEM_SERVICO', 'TREINAMENTO', 'INSPECAO')),
    documento_id VARCHAR(255) NOT NULL,
    responsavel_nome VARCHAR(255) NOT NULL,
    responsavel_cpf VARCHAR(14) NOT NULL,
    responsavel_cargo VARCHAR(255) NOT NULL,
    dados_assinatura TEXT NOT NULL,
    observacoes TEXT,
    data_assinatura TIMESTAMP NOT NULL,
    latitude VARCHAR(20),
    longitude VARCHAR(20),
    empresa_id UUID REFERENCES empresas(id),
    unidade_id UUID REFERENCES unidades(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDENTE', 'ENVIADO', 'CONFIRMADO', 'ERRO')),
    tentativas_sincronizacao INTEGER DEFAULT 0,
    ultima_tentativa TIMESTAMP,
    erro_sincronizacao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa ON usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ordens_servico_status ON ordens_servico(status);
CREATE INDEX IF NOT EXISTS idx_ordens_servico_responsavel ON ordens_servico(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_documento ON assinaturas(documento_id);

-- Inserir dados de exemplo
INSERT INTO empresas (id, nome, cnpj, razao_social, endereco, telefone, email) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Empresa ABC Ltda', '12.345.678/0001-90', 'Empresa ABC Ltda', 'Rua das Flores, 123 - São Paulo/SP', '(11) 99999-9999', 'contato@empresaabc.com')
ON CONFLICT (cnpj) DO NOTHING;

INSERT INTO unidades (id, nome, empresa_id, endereco, telefone) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Unidade Central', '550e8400-e29b-41d4-a716-446655440001', 'Rua das Flores, 123 - São Paulo/SP', '(11) 99999-9999')
ON CONFLICT DO NOTHING;

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_unidades_updated_at BEFORE UPDATE ON unidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ordens_servico_updated_at BEFORE UPDATE ON ordens_servico FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assinaturas_updated_at BEFORE UPDATE ON assinaturas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
