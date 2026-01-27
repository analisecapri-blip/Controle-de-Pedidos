# GUIA DE TROUBLESHOOTING - IMPORTAÇÃO DE EXCEL

## ❌ Problemas Comuns e Soluções

### 1. "O arquivo Excel está vazio"

**Causa**: O arquivo foi selecionado mas não contém dados na primeira aba.

**Soluções**:
- Verifique se o arquivo realmente contém dados
- Certifique-se de que não há apenas linhas em branco
- Tente salvar o arquivo novamente em formato .xlsx ou .csv
- Verifique se os dados estão na primeira aba da pasta de trabalho

---

### 2. "Colunas não encontradas. Esperado: Pedido, Transportadora e Saldo"

**Causa**: O arquivo não contém as colunas esperadas com os nomes exatos (ou variações).

**Soluções**:
- Revise os nomes das colunas em seu arquivo Excel
- Verifique que tem exatamente estas colunas:
  - Pedido (ou pedido, PEDIDO)
  - Transportadora (ou transportador, transportadora)
  - Saldo (ou saldo)
- Remova espaços extras nos nomes das colunas
- Se usar idioma diferente, traduza os nomes das colunas

**Exemplo de Nomes Válidos**:
```
✅ Pedido | Transportadora | Saldo
✅ PEDIDO | TRANSPORTADORA | SALDO
✅ pedido | transportador | saldo
✅ Pedido | Transportador | Saldo
```

---

### 3. "Nenhum dado válido encontrado no Excel"

**Causa**: Todas as linhas foram filtradas (provavelmente por não ter "Pedido").

**Soluções**:
- Verifique se a coluna "Pedido" tem valores em todas as linhas
- Remova linhas em branco do meio dos dados
- Certifique-se que o primeiro valor não é um cabeçalho duplicado

---

### 4. "Todos os romaneios do Excel já existem"

**Causa**: Todos os números de Pedido já estão registrados no sistema.

**Soluções**:
- Use novos números de pedido
- Se quiser reimportar, delete os romaneios antigos primeiro
- Verifique se não está tentando importar o mesmo arquivo duas vezes

---

### 5. Página não carrega ou diz "erro de conexão"

**Causa**: Problema com a conexão ou biblioteca XLSX não foi carregada.

**Soluções**:
- Recarregue a página (F5 ou Ctrl+R)
- Verifique sua conexão de internet
- Verifique o console do navegador (F12) para mais detalhes
- Tente em outro navegador

---

### 6. Arquivo foi selecionado mas nada aconteceu

**Causa**: O arquivo pode estar corrompido ou em formato não suportado.

**Soluções**:
- Tente usar formato .csv (mais simples)
- Salve o arquivo Excel novamente em .xlsx
- Certifique-se que é arquivo Excel e não outra coisa
- Tente com um arquivo de exemplo (exemplo_dados.csv)

---

### 7. Prévia mostra dados mas botão "CONFIRMAR" não funciona

**Causa**: Falta definir a data e hora de entrega.

**Soluções**:
- Clique no campo "Data e Hora de Entrega"
- Selecione uma data e hora
- O botão "CONFIRMAR IMPORTAÇÃO" deve ficar habilitado

---

### 8. Dados foram importados mas não aparecem na fila

**Causa**: A página não foi atualizada automaticamente.

**Soluções**:
- Clique em outra aba e volte para "Abastecimento"
- Recarregue a página (F5)
- Clique em "Fila FIFO" para ver os novos romaneios

---

### 9. Importou apenas alguns registros, não todos

**Causa**: Alguns registros tinham dados inválidos e foram ignorados.

**Soluções**:
- A mensagem de sucesso indica quantos foram importados
- Verifique os dados do Excel para linhas vazias ou incompletas
- Procure por valores duplicados na coluna "Pedido"
- Se tiver problemas, importe apenas dados válidos

---

### 10. Mensagem diz "X duplicados ignorados"

**Causa**: Alguns romaneios do Excel já existiam no sistema.

**Soluções**:
- Isso é normal e esperado
- Apenas novos romaneios são adicionados
- Duplicados são silenciosamente ignorados
- Se precisa reimportar, delete os romaneios antigos

---

## 🔍 Como Verificar o Console para Erros

Se suspeitar de problema técnico:

1. Pressione **F12** para abrir DevTools
2. Clique na aba **"Console"**
3. Procure por mensagens de erro em vermelho
4. Tire uma screenshot e compartilhe com o desenvolvedor

---

## 📋 Checklist de Validação

Antes de importar, verifique:

- [ ] Arquivo é .xlsx, .xls ou .csv?
- [ ] Arquivo contém dados (não está vazio)?
- [ ] Primeiro linha tem os headers: Pedido, Transportadora, Saldo?
- [ ] Coluna "Pedido" não tem valores vazios?
- [ ] Não há espaços extras nos nomes das colunas?
- [ ] Data de entrega é válida?
- [ ] Está logado como Admin?
- [ ] Está na aba "Abastecimento de Romaneios"?

---

## 💡 Dicas de Debug

1. **Teste com arquivo de exemplo**
   - Use `exemplo_dados.csv` fornecido
   - Se funcionar, problema está em seus dados
   - Se não funcionar, problema está no sistema

2. **Reduza a quantidade de dados**
   - Tente com apenas 5 registros
   - Aumente gradualmente para encontrar o problema

3. **Copie dados para novo arquivo**
   - Crie um novo Excel
   - Cole apenas dados válidos
   - Tente importar novamente

4. **Verifique nomes de colunas letra por letra**
   - Abra em editor de texto se necessário
   - Procure por caracteres especiais ocultos

---

## 📞 Quando Contactar Suporte

Contacte o desenvolvedor se:
- Erro não está listado aqui
- Problema persiste após tentar soluções
- Precisa de funcionalidade adicional
- Arquivo crítico foi corrompido

**Informações úteis a fornecer**:
- Print do erro
- Arquivo de exemplo que causa problema
- Versão do navegador (F12 → Console)
- Data/hora do problema
- Passos exatos para reproduzir

---

**Versão**: 1.0  
**Última atualização**: 26 de janeiro de 2026  
**Desenvolvedor**: Sistema de Controle de Romaneios
