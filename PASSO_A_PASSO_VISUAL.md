# 🖱️ GUIA COM SCREENSHOTS - CRIAR EQUIPES

## 1️⃣ Aceder o Supabase Dashboard

### Passo 1: Abra o link
```
https://supabase.com/dashboard
```

### Passo 2: Selecione o Projeto
```
┌─────────────────────────────────────────────┐
│  Seus Projetos                              │
├─────────────────────────────────────────────┤
│  [bubmmabeagyyoupcgopg]  ← CLIQUE AQUI      │
│  (ou o nome do seu projeto)                 │
└─────────────────────────────────────────────┘
```

---

## 2️⃣ Abra SQL Editor

### No menu lateral esquerdo:
```
┌──────────────────┐
│ 🏠 Home          │
│ 📊 Database      │
│ 📝 SQL Editor    │ ← CLIQUE AQUI
│ 🔑 Auth          │
│ 📦 Storage       │
│ ⚙️  Configurações│
└──────────────────┘
```

---

## 3️⃣ Criar Nova Query

### Procure por "+ New Query"
```
┌──────────────────────────────────────────┐
│  SQL Editor                  [+ New Query]│ ← CLIQUE AQUI
├──────────────────────────────────────────┤
│ (você verá queries anteriores aqui)       │
└──────────────────────────────────────────┘
```

---

## 4️⃣ Copiar SQL

### Abra o arquivo: `SQL_CRIAR_TABELA_EQUIPES.sql`
```
📄 SQL_CRIAR_TABELA_EQUIPES.sql
```

### Copie TUDO que começa com:
```sql
-- Criar tabela de equipes
CREATE TABLE IF NOT EXISTS teams (
    ...
```

Até o final das criações (antes dos comentários opcionais):
```sql
CREATE INDEX IF NOT EXISTS idx_teams_leader_id ON teams(leader_id);
```

---

## 5️⃣ Cole no Editor SQL

### No editor que abriu:
```
┌────────────────────────────────────────────┐
│ [SQL Query]                                │
├────────────────────────────────────────────┤
│ -- Criar tabela de equipes                 │
│ CREATE TABLE IF NOT EXISTS teams (         │
│     id BIGINT PRIMARY KEY GENERATED...     │
│     ...                                    │
│     ...                                    │
│                                            │
│  [Run]  [Save]  [Format]                   │
└────────────────────────────────────────────┘
```

---

## 6️⃣ Executar a Query

### Clique no botão "Run"
```
┌────────────────────────────────────────┐
│                                        │
│  [Run] ← CLIQUE AQUI                   │
│                                        │
└────────────────────────────────────────┘
```

**Ou pressione**: `Ctrl + Enter`

---

## 7️⃣ Verificar Sucesso

### Se tudo deu certo:
```
┌─────────────────────────────────────────┐
│ ✅ Query executed successfully!         │
│ (nenhuma mensagem de erro)              │
└─────────────────────────────────────────┘
```

### Se deu erro:
```
┌─────────────────────────────────────────┐
│ ❌ Error: relation "teams" already     │
│    exists                               │
│ (Significa que a tabela já existe)      │
└─────────────────────────────────────────┘
```

---

## 8️⃣ Verificar a Tabela

### Clique em "Tables" no menu lateral
```
┌──────────────────────┐
│ 📊 Database          │ ← CLIQUE
├──────────────────────┤
│ 📋 Tables            │
│   ├─ admin_user      │
│   ├─ leaders         │
│   ├─ teams           │ ← PROCURE POR ISSO
│   ├─ romaneios       │
│   ├─ billings        │
│   └─ colaboradores   │
│ 🔌 Functions         │
└──────────────────────┘
```

**Se vir `teams` na lista, está tudo OK! ✅**

---

## 9️⃣ Voltar para o Aplicativo

### Recarregue a página do aplicativo
```
🔄 Pressione: F5 (Windows) ou Cmd+R (Mac)
```

### Ou simplesmente:
```
1. Feche o browser do Supabase
2. Volte para o aplicativo
3. Faça logout
4. Faça login novamente
```

---

## 🔟 Testar a Criação de Equipes

### Na aplicação, vá para:
```
┌─────────────────────────────────────┐
│ 👤 Admin (seu nome)                 │
│ [⚙️ Configurações]  [Sair]          │
├─────────────────────────────────────┤
│ [Abastecimento] [Fila] [Histórico...] │ ← CLIQUE EM HISTÓRICO...
├─────────────────────────────────────┤
│ (vários forms)                      │
│ ...                                 │
│ 📋 Equipes de Destino               │
│ ├─ [Atribuir a um Líder ▼]          │
│ ├─ [Nome da Equipe]                 │
│ └─ [Adicionar]                      │
└─────────────────────────────────────┘
```

### Teste:
```
1. Deixe "Líder" em branco (ou selecione um)
2. Digite um nome: "Teste"
3. Clique "Adicionar"
4. A equipe deve aparecer na lista abaixo
5. Recarregue (F5)
6. A equipe deve continuar lá ✅
```

---

## 📸 Resultado Esperado

### Depois de tudo configurado:

#### Admin vê isso:
```
┌──────────────────────────────────────────┐
│ 📋 Equipes de Destino                    │
├──────────────────────────────────────────┤
│ [Selecione um Líder ▼]  [Nome] [Adicionar]
│                                          │
│ Equipe A — João Silva         [Remover] │
│ Equipe B — Maria Santos       [Remover] │
│ Equipe Comum                  [Remover] │
└──────────────────────────────────────────┘
```

#### Líder João vê isso (ao separar):
```
┌──────────────────────────────────────────┐
│ Equipe Destino *                         │
│ [Selecione a Equipe]           ▼         │
│  • Equipe A (sua)                        │
│  • Equipe Comum (compartilhada)          │
│                                          │
│ (NÃO vê "Equipe B" de Maria)             │
└──────────────────────────────────────────┘
```

---

## 🎯 Passo a Passo Visual Completo

```
1. Supabase Dashboard
   ↓
2. Seleciona Projeto
   ↓
3. SQL Editor → New Query
   ↓
4. Copia SQL de SQL_CRIAR_TABELA_EQUIPES.sql
   ↓
5. Cola no editor
   ↓
6. Clica "Run"
   ↓
7. ✅ Sucesso!
   ↓
8. Volta para aplicativo
   ↓
9. F5 (recarregar)
   ↓
10. Login novamente
    ↓
11. Admin cria equipes
    ↓
12. Líderes usam na separação
    ↓
✅ TUDO FUNCIONANDO!
```

---

## 🆘 Se Tiver Dúvida

### "Qual é minha URL do Supabase?"
→ Procure por "Project URL" em Settings

### "Onde coloco o SQL?"
→ SQL Editor → New Query → Cola aqui

### "Cliquei Run mas não aconteceu nada"
→ Procure pela resposta embaixo do editor
→ Se disser "successfully", deu certo!

### "A query não rodar"
→ Copie tudo exatamente como está
→ Não mude nada no SQL
→ Clique Run novamente

---

**Arquivo SQL pronto**: `SQL_CRIAR_TABELA_EQUIPES.sql`  
**Dúvidas?**: Leia `GUIA_RAPIDO_EQUIPES.md`  
**Status**: ✅ Fácil de fazer!
