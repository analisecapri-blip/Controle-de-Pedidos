-- ========================================
-- CORRIGIR TABELA TEAMS NO SUPABASE
-- ========================================
-- Se recebeu erro "Could not find the 'leader_id' column"
-- Execute esse SQL para corrigir

-- OPÇÃO 1: Se a tabela teams existe mas está incompleta
-- Delete e recrie

DROP TABLE IF EXISTS teams CASCADE;

-- Agora recrie com todas as colunas corretas
CREATE TABLE teams (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL UNIQUE,
    leader_id BIGINT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES leaders(id) ON DELETE SET NULL
);

-- Criar índice
CREATE INDEX idx_teams_leader_id ON teams(leader_id);

-- Pronto! A tabela foi recriada com todas as colunas corretas
-- Agora teste criando uma equipe na aplicação

-- ========================================
-- VERIFICAR (Execute para testar)
-- ========================================
-- Descomente para verificar
/*
SELECT * FROM teams;
*/
