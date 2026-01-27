# 🔧 COMO CORRIGIR O ERRO: Could not find the 'leader_id' column

## ❌ O Erro
```
Erro ao criar equipe: Could not find the 'leader_id' column of 'teams' in the schema cache
```

## 🎯 O Que Significa
A tabela `teams` foi criada, mas sem a coluna `leader_id`. Precisa recriar.

---

## ✅ Como Corrigir (3 passos)

### Passo 1: Abra Supabase
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Clique em **SQL Editor**

### Passo 2: Nova Query
- Clique em **+ New Query**

### Passo 3: Execute o SQL de Correção

**Copie TODO o conteúdo deste arquivo:**
```
SQL_CORRIGIR_TABELA_TEAMS.sql
```

**Cole no editor SQL do Supabase**

**Clique em "Run"**

---

## 🎬 Depois de Executar

### Verifique
```
✅ Query executed successfully
```

### Recarregue a Aplicação
```
Pressione: F5
```

### Faça Login Novamente
```
Logout e Login
```

### Teste
```
1. Admin → Histórico → Equipes
2. Crie uma equipe
3. Deve funcionar agora ✅
```

---

## 🔍 Se Continuar com Erro

### Verifique se a tabela foi criada
No Supabase, vá em **Database** → **Tables**  
Procure por `teams`  
Verifique as colunas:
- [ ] id
- [ ] name
- [ ] leader_id
- [ ] created_at
- [ ] updated_at

Se não tiver `leader_id`, execute o SQL novamente.

---

## 💡 Dica

Se receber erro ao executar o SQL:
```
"relation "teams" already exists"
```

Significa que a tabela já existe. Isso é normal.  
O SQL irá:
1. Deletar a tabela antiga
2. Criar uma nova com as colunas corretas

---

**Tempo para corrigir**: ~2 minutos  
**Resultado**: ✅ Sistema de equipes funcionando
