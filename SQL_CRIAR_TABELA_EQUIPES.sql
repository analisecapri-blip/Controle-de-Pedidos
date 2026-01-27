-- ==========================================
-- CRIAR TABELA DE EQUIPES NO SUPABASE
-- ==========================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Abra SQL Editor
-- 4. Clique em "+ New Query"
-- 5. COPIE TODO O CONTEÚDO ABAIXO
-- 6. COLE no editor SQL
-- 7. Clique em "Run" ou pressione Ctrl+Enter
-- 8. Pronto! A tabela foi criada
--
-- ==========================================

-- Criar tabela de equipes
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL UNIQUE,
    leader_id BIGINT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES leaders(id) ON DELETE SET NULL
);

-- Criar índice para busca rápida por líder
CREATE INDEX IF NOT EXISTS idx_teams_leader_id ON teams(leader_id);

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- OPCIONAL - Para aplicações mais seguras
-- ==========================================
-- Descomente as linhas abaixo se desejar ativar RLS

/*
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Permitir que qualquer usuário autenticado possa ler equipes
CREATE POLICY "Equipes são públicas para leitura"
ON teams FOR SELECT
TO authenticated
USING (true);

-- Permitir que apenas admin possa criar/editar/deletar
CREATE POLICY "Apenas admin pode modificar equipes"
ON teams FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');
*/

-- ==========================================
-- TESTE: INSERIR DADOS DE EXEMPLO
-- OPCIONAL - Descomente para testar
-- ==========================================
-- Descomente as linhas abaixo para adicionar equipes de teste

/*
INSERT INTO teams (name, leader_id) VALUES 
('Equipe A', 1),
('Equipe B', 2),
('Equipe Genérica', NULL);
*/

-- ==========================================
-- VERIFICAR: VER AS EQUIPES CRIADAS
-- OPCIONAL - Descomente para visualizar
-- ==========================================
-- Descomente a linha abaixo para ver todas as equipes

/*
SELECT * FROM teams;
*/

-- ==========================================
-- DELETAR TABELA (se precisar recriar)
-- CUIDADO: Isso deleta TODOS os dados!
-- ==========================================
-- Descomente a linha abaixo APENAS se precisar recriar

/*
DROP TABLE teams;
*/
