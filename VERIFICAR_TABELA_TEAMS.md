# ✅ CHECKLIST - VERIFICAR SE TABELA ESTÁ CORRETA

## Depois de Executar o SQL

### Verifique no Supabase

#### 1. A tabela existe?
Vá em: **Database** → **Tables**  
Procure por: `teams`  
✅ Se vir `teams`, a tabela existe

#### 2. As colunas estão corretas?
Clique em `teams`  
Procure pelas colunas:
- [ ] `id` (BIGINT, Primary Key)
- [ ] `name` (VARCHAR, NOT NULL, UNIQUE)
- [ ] `leader_id` (BIGINT, NULL)
- [ ] `created_at` (TIMESTAMP)
- [ ] `updated_at` (TIMESTAMP)

Se faltarem colunas, execute o SQL novamente.

#### 3. As relações estão corretas?
Procure por "Foreign Keys"  
Deve haver:
- `leader_id` → `leaders.id` (ON DELETE SET NULL)

---

## Se Tudo Está Correto

### Recarregue a Aplicação
```
F5 ou Ctrl+R
```

### Faça Login Novamente
```
Logout
Login como Admin
```

### Teste
```
1. Histórico e Configurações
2. Equipes de Destino
3. Digite um nome: "Teste"
4. Deixe "Líder" em branco
5. Clique "Adicionar"
6. Deve funcionar ✅
```

---

## Se Continuar com Erro

### Opção 1: Limpar Cache do Navegador
- Pressione: `Ctrl + Shift + Delete`
- Selecione: "Todos os tempos"
- Marque: "Cookies e dados do site"
- Clique: "Limpar dados"
- Recarregue

### Opção 2: Verificar Console
- Pressione: `F12`
- Clique em: **Console**
- Procure por mensagens de erro em vermelho
- Copie o erro completo e revise-o

### Opção 3: Criar Tabela do Zero
1. Delete a tabela `teams` manualmente
   - Clique em `teams`
   - Menu → "Delete table"
2. Execute o SQL novamente
3. Recarregue a aplicação

---

## Comandos SQL de Verificação

Se quiser verificar pelo Supabase, execute:

```sql
-- Ver estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'teams';
```

Resultado esperado:
```
column_name   | data_type                    | is_nullable
id            | bigint                       | NO
name          | character varying            | NO
leader_id     | bigint                       | YES
created_at    | timestamp with time zone     | YES
updated_at    | timestamp with time zone     | YES
```

---

## Teste Final

Execute na aplicação:

### Admin Cria Equipe
```
1. Login como Admin
2. Histórico → Equipes
3. Nome: "Equipe Teste"
4. Líder: (deixe vazio)
5. Clique: Adicionar
6. Resultado esperado: ✅ Equipe criada com sucesso!
```

### Recarregue
```
Pressione: F5
```

### Equipe Continua?
```
Se a equipe ainda aparece: ✅ SUCESSO!
Se desapareceu: ❌ Problema persiste
```

---

## Resumo Rápido

| Verificação | Status |
|------------|--------|
| Tabela `teams` existe | ✅ ou ❌ |
| Coluna `id` existe | ✅ ou ❌ |
| Coluna `name` existe | ✅ ou ❌ |
| Coluna `leader_id` existe | ✅ ou ❌ |
| Coluna `created_at` existe | ✅ ou ❌ |
| Coluna `updated_at` existe | ✅ ou ❌ |
| Foreign Key configurada | ✅ ou ❌ |
| Índice criado | ✅ ou ❌ |
| Aplicação recarregada | ✅ ou ❌ |
| Admin consegue criar equipe | ✅ ou ❌ |
| Equipe persiste após reload | ✅ ou ❌ |

Se todos forem ✅, está tudo perfeito!

---

**Se ainda tiver problema**: Revise `SOLUCAO_RAPIDA_ERRO.txt`
