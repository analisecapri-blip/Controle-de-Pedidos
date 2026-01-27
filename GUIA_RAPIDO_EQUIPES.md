# 🎯 GUIA RÁPIDO - CRIAR E ATRIBUIR EQUIPES

## Problema Resolvido! ✅

O sistema foi atualizado para:
- ✅ Salvar equipes no Supabase (não apenas localmente)
- ✅ Permitir atribuir equipes aos líderes
- ✅ Mostrar equipes corretamente para cada líder
- ✅ Sincronizar em tempo real

---

## 📋 PASSO 1: Criar a Tabela no Supabase

**IMPORTANTE**: Você precisa criar uma tabela chamada `teams` no seu Supabase.

👉 **Leia**: `CONFIGURACAO_SUPABASE_EQUIPES.md` para instruções detalhadas

Resumo:
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Abra **SQL Editor**
4. Copie e execute o SQL fornecido no documento
5. A tabela `teams` será criada

---

## 👨‍💼 PASSO 2: Criar Equipes (Admin)

Após criar a tabela no Supabase:

1. **Faça login como Admin**
2. **Clique na aba "Histórico e Configurações"**
3. **Procure a seção "Equipes de Destino"**

```
┌─────────────────────────────────────────────────┐
│  Equipes de Destino                             │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Atribuir a um Líder (opcional)] ▼              │
│                                                 │
│ [Nome da Equipe]                                │
│                                                 │
│ [Adicionar]                                     │
│                                                 │
├─────────────────────────────────────────────────┤
│ Equipe A — João Silva                           │ [Remover]
│ Equipe B — Maria Santos                         │ [Remover]
│ Equipe Genérica                                 │ [Remover]
└─────────────────────────────────────────────────┘
```

### Como usar:

**Para criar uma equipe GENÉRICA** (para todos os líderes):
1. Deixe "Atribuir a um Líder" em branco
2. Digite o nome (ex: "Equipe A")
3. Clique "Adicionar"

**Para criar uma equipe ATRIBUÍDA A UM LÍDER**:
1. Clique no dropdown "Atribuir a um Líder"
2. Selecione um líder (ex: "João Silva")
3. Digite o nome (ex: "Equipe João")
4. Clique "Adicionar"

---

## 👥 PASSO 3: Líderes Usam as Equipes

Depois que as equipes são criadas:

1. **Líder faz login**
2. **Vai para aba "Separação de Romaneios"**
3. **Clica em "RETIRAR ROMANEIO"**
4. **No dropdown "Equipe Destino", seleciona a equipe**

```
┌────────────────────────────────────────────────┐
│  1. RETIRAR ROMANEIO                           │
├────────────────────────────────────────────────┤
│                                                │
│ Números dos Romaneios (um por linha) *         │
│ [1001]                                         │
│ [1002]                                         │
│                                                │
│ Equipe Destino *                               │
│ [Selecione a Equipe]                    ▼     │
│   Equipe A                                     │
│   Equipe João                                  │
│   Equipe Genérica                              │
│                                                │
│ [RETIRAR ROMANEIOS]                            │
└────────────────────────────────────────────────┘
```

O líder verá:
- ✅ Suas equipes atribuídas (ex: "Equipe João")
- ✅ Equipes genéricas sem líder atribuído (ex: "Equipe Genérica")
- ❌ Equipes de outros líderes (ex: NÃO verá "Equipe Maria")

---

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────────┐
│ ADMIN CRIA EQUIPES                      │
├─────────────────────────────────────────┤
│ 1. Equipe A (atribuída a João)          │
│ 2. Equipe B (atribuída a Maria)         │
│ 3. Equipe Comum (sem atribuição)        │
└────────────┬────────────────────────────┘
             │
             ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│ LÍDER JOÃO               │   │ LÍDER MARIA              │
├──────────────────────────┤   ├──────────────────────────┤
│ Vê:                      │   │ Vê:                      │
│ • Equipe A (sua)         │   │ • Equipe B (sua)         │
│ • Equipe Comum (todos)   │   │ • Equipe Comum (todos)   │
│                          │   │                          │
│ Não vê:                  │   │ Não vê:                  │
│ • Equipe B (de Maria)    │   │ • Equipe A (de João)     │
└──────────────────────────┘   └──────────────────────────┘
```

---

## ✨ Novidades

| Antes | Depois |
|-------|--------|
| Equipes em arquivo local | ✅ Equipes no Supabase |
| Não salvava | ✅ Salva permanentemente |
| Não associava aos líderes | ✅ Atribui aos líderes |
| Todos os líderes viam tudo | ✅ Cada líder vê seus dados |
| Perdia dados ao limpar cache | ✅ Dados sincronizados |

---

## 📞 Se Tiver Problemas

### "Equipe não aparece para o líder"
1. Verifique se a tabela `teams` foi criada
2. Verifique se o líder foi atribuído corretamente
3. Recarregue a página (F5)

### "Não consigo criar equipe"
1. Verifique se a tabela `teams` existe
2. Abra o console (F12) e procure por erros
3. Verifique se está logado como Admin

### "Vejo erro no console"
1. Abra F12 (DevTools)
2. Clique em **Console**
3. Procure por mensagens de erro em vermelho
4. Envie screenshot para o desenvolvedor

---

## 🎓 Exemplo Prático

### Cenário: Você tem 3 líderes

**Passo 1: Admin cria as equipes**
```
Equipe A → João Silva
Equipe B → Maria Santos
Equipe C → Pedro Oliveira
Equipe Comum → (sem líder - para todos)
```

**Passo 2: Líderes usam**
```
João Silva (ao separar) → Escolhe: Equipe A ou Equipe Comum
Maria Santos (ao separar) → Escolhe: Equipe B ou Equipe Comum
Pedro Oliveira (ao separar) → Escolhe: Equipe C ou Equipe Comum
```

**Resultado**:
- Cada líder trabalha com sua equipe
- Se um romaneio precisa ir para "Equipe Comum", qualquer um pode usar
- Dados organizados e rastreáveis

---

## 📋 Checklist Final

- [ ] Criei a tabela `teams` no Supabase
- [ ] Faiz login como Admin
- [ ] Vou em "Histórico e Configurações"
- [ ] Criei as equipes desejadas
- [ ] Atribuí equipes aos líderes
- [ ] Um líder faz login
- [ ] Ele consegue ver suas equipes no dropdown
- [ ] Tudo funciona!

---

**Status**: ✅ Sistema Atualizado e Pronto  
**Data**: 27 de janeiro de 2026  
**Versão**: 2.0
