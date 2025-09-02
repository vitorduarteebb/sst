-- Script de inicialização do PostGIS para a Plataforma SST
-- Este script é executado automaticamente quando o container PostgreSQL é criado

-- Habilita a extensão PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Habilita a extensão PostGIS Topology
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Habilita a extensão PostGIS Raster (se necessário)
-- CREATE EXTENSION IF NOT EXISTS postgis_raster;

-- Habilita a extensão UUID-OSSP para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilita a extensão pg_trgm para busca por similaridade
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Habilita a extensão btree_gin para índices GIN
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- Cria o schema principal da aplicação
CREATE SCHEMA IF NOT EXISTS sst;

-- Define o schema padrão
SET search_path TO sst, public;

-- Cria função para atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Cria função para gerar ID público único
CREATE OR REPLACE FUNCTION generate_public_id(prefix TEXT DEFAULT 'CERT')
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_id := prefix || '-' || 
                  to_char(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' ||
                  lpad(counter::TEXT, 4, '0');
        
        -- Verifica se o ID já existe (implementar verificação específica por tabela)
        EXIT WHEN true; -- Placeholder - implementar verificação real
        
        counter := counter + 1;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Cria função para calcular hash SHA-256
CREATE OR REPLACE FUNCTION calculate_sha256(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Em produção, usar extensão pgcrypto
    -- RETURN encode(digest(input_text, 'sha256'), 'hex');
    
    -- Placeholder para desenvolvimento
    RETURN 'sha256:' || length(input_text);
END;
$$ LANGUAGE plpgsql;

-- Cria função para validar coordenadas GPS
CREATE OR REPLACE FUNCTION validate_gps_coordinates(lat DECIMAL, lng DECIMAL)
RETURNS BOOLEAN AS $$
BEGIN
    -- Valida latitude (-90 a 90)
    IF lat < -90 OR lat > 90 THEN
        RETURN FALSE;
    END IF;
    
    -- Valida longitude (-180 a 180)
    IF lng < -180 OR lng > 180 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Cria função para calcular distância entre dois pontos GPS
CREATE OR REPLACE FUNCTION calculate_gps_distance(
    lat1 DECIMAL, lng1 DECIMAL,
    lat2 DECIMAL, lng2 DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
    -- Usa PostGIS para calcular distância em metros
    RETURN ST_Distance(
        ST_SetSRID(ST_MakePoint(lng1, lat1), 4326),
        ST_SetSRID(ST_MakePoint(lng2, lat2), 4326)
    );
END;
$$ LANGUAGE plpgsql;

-- Cria função para buscar unidades próximas
CREATE OR REPLACE FUNCTION find_nearby_units(
    search_lat DECIMAL,
    search_lng DECIMAL,
    max_distance_meters INTEGER DEFAULT 10000
)
RETURNS TABLE(
    id UUID,
    nome TEXT,
    distancia DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nome,
        ST_Distance(
            ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326),
            u.geo
        ) as distancia
    FROM unidades u
    WHERE u.geo IS NOT NULL
      AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326),
          u.geo,
          max_distance_meters
      )
    ORDER BY distancia;
END;
$$ LANGUAGE plpgsql;

-- Cria índices espaciais para melhor performance
-- (serão criados automaticamente quando as tabelas forem criadas)

-- Log de inicialização
INSERT INTO pg_stat_statements_info (dealloc) VALUES (0) ON CONFLICT DO NOTHING;

-- Mensagem de confirmação
DO $$
BEGIN
    RAISE NOTICE 'PostGIS inicializado com sucesso para a Plataforma SST!';
    RAISE NOTICE 'Schema: %', current_setting('search_path');
    RAISE NOTICE 'PostGIS Version: %', PostGIS_Version();
END $$;
