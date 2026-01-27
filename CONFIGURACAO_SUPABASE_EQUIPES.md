# 🔧 CONFIGURAÇÃO DO SUPABASE - TABELA DE EQUIPES

## ⚠️ IMPORTANTE: CRIE A TABELA ANTES DE USAR

O sistema foi atualizado para salvar equipes no Supabase. Para funcionar, você precisa criar uma tabela chamada `teams` no seu banco de dados Supabase.

---

## 📋 Passo a Passo para Criar a Tabela

### 1. Acesse o Dashboard do Supabase
- Acesse: https://supabase.com/dashboard
- Faça login com suas credenciais

### 2. Selecione seu Projeto
- Abra o projeto "bubmmabeagyyoupcgopg" (ou similar)

### 3. Acesse o Editor SQL
- Clique em **SQL Editor** no menu lateral esquerdo
- Clique em **+ New Query**

### 4. Execute o SQL Abaixo

Copie e cole o código SQL abaixo no editor:

```sql
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

-- Criar política RLS (Row Level Security) - Opcional, para segurança
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
```

### 5. Clique em "Run"
- Execute a query clicando no botão **Run** (ou Ctrl+Enter)
- Se não houver erros, a tabela foi criada com sucesso

### 6. Verifique a Tabela
- Clique em **Tables** no menu lateral
- Procure por `teams` na lista
- Você deve ver as colunas: `id`, `name`, `leader_id`, `created_at`, `updated_at`

---

## 📊 Estrutura da Tabela

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | BIGINT | ID único, auto-incrementado |
| `name` | VARCHAR(255) | Nome da equipe (único) |
| `leader_id` | BIGINT | ID do líder (pode ser NULL) |
| `created_at` | TIMESTAMP | Data/hora de criação |
| `updated_at` | TIMESTAMP | Data/hora da última atualização |

---

## 🔗 Relacionamento

- `leader_id` referencia a tabela `leaders`
- Uma equipe pode estar atribuída a um líder OU ser genérica (sem líder)
- Se o líder for deletado, a equipe fica sem atribuição (leader_id = NULL)

---

## ✅ Verificação

Após criar a tabela, teste no sistema:

1. Faça login como **Admin**
2. Vá para **Histórico e Configurações**
3. Na seção **Equipes de Destino**:
   - Tente criar uma nova equipe
   - Defina um líder (opcional)
   - Clique **Adicionar**
4. A equipe deve aparecer na lista
5. Um líder deve conseguir usar suas equipes na separação

---

## 🐛 Se Tiver Problemas

### "Tabela teams não existe"
- Verifique se executou o SQL corretamente
- Verifique se clicou em "Run"
- Tente recarregar a página (F5)

### "Erro de permissão"
- Verifique se a RLS (Row Level Security) está configurada corretamente
- Se não quer usar RLS, desabilite-a:
  ```sql
  ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
  ```

### "Equipe não aparece para o líder"
- Verifique se o líder foi selecionado corretamente
- Verifique se o `leader_id` corresponde ao ID do líder no banco

---

## 💡 Dicas

1. **Teste com SQL**: Execute um INSERT manualmente para testar
   ```sql
   INSERT INTO teams (name, leader_id) 
   VALUES ('Equipe A', 1);
   ```

2. **Verifique o banco**: Abra a tabela e veja os dados
   ```sql
   SELECT * FROM teams;
   ```

3. **Deletar e recriar**: Se algo der errado
   ```sql
   DROP TABLE teams;
   -- Depois execute o SQL novamente
   ```

---

## 📱 Depois de Criar a Tabela

1. Recarregue a página do aplicativo (F5)
2. Faça logout e login novamente
3. As equipes devem começar a funcionar normalmente

---

**Verificação Final**: ✅ Tabela criada no Supabase  
**Próximo Passo**: Recarregar a aplicação e testar
