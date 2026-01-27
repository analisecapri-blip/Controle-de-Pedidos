# NOVA FUNCIONALIDADE: IMPORTAÇÃO DE DADOS VIA EXCEL

## 📊 O que foi adicionado?

Na tela do **Admin**, na aba de **"Abastecimento de Romaneios"**, foi adicionada uma nova seção que permite importar dados de um arquivo Excel com as seguintes informações:
- **Pedido** (número do romaneio)
- **Transportadora** (nome da transportadora)
- **Saldo** (saldo do pedido)

## 🎯 Como Usar

### Passo 1: Preparar o Arquivo Excel
Crie um arquivo Excel (.xlsx, .xls ou .csv) com as seguintes colunas:

| Pedido | Transportadora | Saldo |
|--------|---|-------|
| 1001   | JadLog | 1500 |
| 1002   | Sedex  | 2000 |
| 1003   | Transportadora A | 1800 |

**Observações importantes:**
- Os nomes das colunas são insensíveis a maiúsculas/minúsculas
- Variações aceitas: "Pedido", "pedido", "PEDIDO"
- Variações para transportadora: "Transportadora", "Transportador", "transportador"
- Variações para saldo: "Saldo", "saldo"

### Passo 2: Acessar a Importação
1. Faça login como **Admin**
2. Clique na aba **"Abastecimento de Romaneios"**
3. Na seção **"Importar via Excel"**, clique em **"Selecionar arquivo"**

### Passo 3: Selecionar o Arquivo
- Escolha seu arquivo Excel
- O sistema irá processar automaticamente e mostrar uma prévia dos dados

### Passo 4: Definir Data e Hora de Entrega
- A data/hora será aplicada a **todos os romaneios** importados
- Selecione a data e hora desejadas no campo de entrada

### Passo 5: Confirmar Importação
- Clique em **"CONFIRMAR IMPORTAÇÃO"**
- Os dados serão salvos no sistema
- Você verá uma mensagem indicando quantos romaneios foram importados

## ✨ Recursos da Funcionalidade

✅ **Detecção Automática de Colunas** - Não importa a ordem das colunas no Excel  
✅ **Prévia dos Dados** - Veja até 10 registros antes de confirmar  
✅ **Validação Automática** - Ignora linhas vazias e dados inválidos  
✅ **Detecção de Duplicatas** - Romaneios duplicados são automaticamente ignorados  
✅ **Suporte para Múltiplos Formatos** - Funciona com .xlsx, .xls e .csv  
✅ **Integração com Supabase** - Os dados são sincronizados em tempo real  
✅ **Histórico de Operações** - Cada importação fica registrada no sistema  

## 📋 Exemplos de Uso

### Exemplo 1: Importação Simples
Arquivo: `vendas.xlsx`
```
Pedido    | Transportadora | Saldo
1001      | JadLog         | 1500
1002      | Sedex          | 2000
```
Resultado: 2 romaneios importados com sucesso

### Exemplo 2: Importação com Muitos Registros
Arquivo: `vendas_janeiro.xlsx`
```
(100 linhas de dados)
```
Resultado: Prévia mostra os 10 primeiros, depois mostra "... e mais 90 registros"

## 🔍 Comportamento

- **Campos Vazios**: Romaneios sem "Pedido" serão ignorados
- **Duplicatas**: Se um número de pedido já existe no sistema, será ignorado
- **Data de Entrega**: A mesma data/hora é atribuída a todos os romaneios
- **Transportadora e Saldo**: Armazenados como informações adicionais dos romaneios
- **Histórico**: Cada romaneio importado registra a operação no seu histórico

## 🛠️ Detalhes Técnicos

- **Biblioteca utilizada**: SheetJS (XLSX)
- **Armazenamento**: Supabase (banco de dados em nuvem)
- **Validação**: Realizada no cliente antes de enviar ao servidor
- **Performance**: Inserção em lote para otimizar operações

## ❌ Tratamento de Erros

Se algo der errado, você verá mensagens de erro claras:
- "O arquivo Excel está vazio"
- "Colunas não encontradas. Esperado: Pedido, Transportadora e Saldo"
- "Nenhum dado válido encontrado no Excel"
- Erros de conexão com o banco de dados

## 💡 Dicas

1. **Verifique as colunas** antes de enviar - confirme que tem "Pedido", "Transportadora" e "Saldo"
2. **Limpe dados vazios** - remova linhas em branco do Excel
3. **Use datas consistentes** - a data de entrega deve ser a mesma para o lote
4. **Faça backup** - guarde uma cópia do arquivo original

---

**Versão**: 1.0  
**Data**: 2026  
**Última atualização**: 26 de janeiro de 2026
