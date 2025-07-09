# Integração Blockchain da Carteira Digital

## Visão Geral

Este documento descreve a implementação da integração blockchain na carteira digital (wallet) do Tributa.AI. A integração permite que os usuários conectem suas carteiras blockchain, visualizem seus tokens, realizem tokenização de ativos e executem operações de swap entre diferentes tokens.

## Arquitetura

A integração blockchain é composta pelos seguintes componentes:

1. **BlockchainIntegrationService**
   - Serviço central que gerencia todas as interações com a blockchain
   - Implementa conexão com carteiras (MetaMask, WalletConnect)
   - Gerencia contratos inteligentes para tokenização e swap

2. **Componentes da Carteira**
   - WalletTokenization: Interface para tokenização de ativos
   - WalletSwap: Interface para troca de tokens
   - WalletBlockchainTransactions: Visualização de transações na blockchain

3. **Contratos Inteligentes**
   - Contrato de Tokenização: Converte ativos reais em tokens na blockchain
   - Contrato de Swap: Permite a troca entre diferentes tokens
   - Contratos ERC20/ERC721/ERC1155: Padrões para diferentes tipos de tokens

## BlockchainIntegrationService

O `BlockchainIntegrationService` é o componente central que gerencia todas as interações com a blockchain. Ele fornece as seguintes funcionalidades:

### Conexão com Carteiras

```typescript
async connect(): Promise<boolean>
```
- Conecta à carteira do usuário (MetaMask, WalletConnect)
- Inicializa provider e signer
- Identifica a rede blockchain atual
- Inicializa contratos inteligentes

### Gerenciamento de Tokens

```typescript
async getTokenBalance(tokenAddress: string): Promise<string>
```
- Obtém o saldo de um token específico
- Formata o saldo de acordo com os decimais do token

### Tokenização de Ativos

```typescript
async tokenizeAsset(
  assetType: string,
  assetValue: number,
  assetDescription: string
): Promise<TokenizationRequest>
```
- Envia transação para o contrato de tokenização
- Acompanha o progresso da tokenização
- Retorna detalhes do token criado

### Operações de Swap

```typescript
async getSwapQuote(
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string
): Promise<SwapQuote>
```
- Obtém cotação para swap entre tokens
- Calcula taxas e impacto de preço

```typescript
async executeSwap(
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  minAmountOut: string,
  deadline: number
): Promise<{ success: boolean; transactionHash: string }>
```
- Aprova o gasto de tokens
- Executa o swap na blockchain
- Retorna resultado da operação

### Transações na Blockchain

```typescript
async getTransactions(): Promise<BlockchainTransaction[]>
```
- Obtém histórico de transações na blockchain
- Formata transações para exibição

## Fluxos de Trabalho

### Tokenização de Ativos

1. Usuário conecta sua carteira blockchain
2. Usuário preenche formulário com detalhes do ativo
3. Sistema envia transação para o contrato de tokenização
4. Sistema monitora o progresso da tokenização
5. Token é criado e adicionado à carteira do usuário

### Swap de Tokens

1. Usuário seleciona tokens de origem e destino
2. Sistema obtém cotação em tempo real
3. Usuário confirma a transação
4. Sistema aprova o gasto de tokens
5. Sistema executa o swap na blockchain
6. Tokens são atualizados na carteira do usuário

## Contratos Inteligentes

### Contrato de Tokenização

```solidity
// Exemplo simplificado
contract AssetTokenization {
    function tokenize(
        string memory assetType,
        uint256 assetValue,
        string memory assetDescription
    ) public returns (uint256 tokenId);
    
    function getTokenDetails(uint256 tokenId) public view returns (
        string memory assetType,
        uint256 assetValue,
        string memory assetDescription,
        address owner
    );
    
    event AssetTokenized(
        address indexed owner,
        uint256 indexed tokenId,
        string assetType,
        uint256 assetValue
    );
}
```

### Contrato de Swap

```solidity
// Exemplo simplificado
contract SwapRouter {
    function getAmountsOut(
        uint amountIn,
        address[] memory path
    ) public view returns (uint[] memory amounts);
    
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] memory path,
        address to,
        uint deadline
    ) public returns (uint[] memory amounts);
}
```

## Integração com Componentes da Carteira

### WalletTokenization

O componente `WalletTokenization` utiliza o `BlockchainIntegrationService` para:
- Verificar conexão com a carteira
- Listar tokens do usuário
- Enviar solicitações de tokenização
- Monitorar o progresso das solicitações

### WalletSwap

O componente `WalletSwap` utiliza o `BlockchainIntegrationService` para:
- Listar tokens disponíveis para swap
- Obter cotações em tempo real
- Executar operações de swap
- Monitorar o resultado das operações

### WalletBlockchainTransactions

O componente `WalletBlockchainTransactions` utiliza o `BlockchainIntegrationService` para:
- Listar transações na blockchain
- Exibir detalhes de cada transação
- Monitorar o status de confirmação

## Considerações de Segurança

1. **Aprovações de Gastos**
   - Limitar aprovações ao valor exato necessário
   - Evitar aprovações ilimitadas

2. **Validação de Transações**
   - Verificar slippage antes de executar swaps
   - Validar valores mínimos recebidos

3. **Proteção contra Ataques**
   - Implementar proteção contra front-running
   - Validar contratos antes de interagir

4. **Gestão de Chaves Privadas**
   - Nunca armazenar chaves privadas no frontend
   - Utilizar carteiras externas para gerenciamento de chaves

## Redes Suportadas

A integração blockchain suporta as seguintes redes:

1. **Ethereum Mainnet** (chainId: 1)
2. **Polygon** (chainId: 137)
3. **Binance Smart Chain** (chainId: 56)

## Próximos Passos

1. **Suporte a Mais Redes**
   - Adicionar suporte para Arbitrum, Optimism e outras L2
   - Implementar bridges entre diferentes redes

2. **Melhorias na Tokenização**
   - Implementar tokenização fracionada
   - Adicionar metadados mais detalhados aos tokens

3. **Agregadores de Liquidez**
   - Integrar com múltiplos DEXs
   - Implementar roteamento inteligente para melhores taxas

4. **Monitoramento Avançado**
   - Implementar notificações em tempo real para eventos na blockchain
   - Adicionar análise de risco para transações

## Conclusão

A integração blockchain da carteira digital permite que os usuários do Tributa.AI interajam com a tecnologia blockchain de forma transparente e intuitiva. A arquitetura modular facilita a expansão para novas funcionalidades e redes, mantendo a segurança e a usabilidade como prioridades.

---

**Nota**: Este documento deve ser atualizado conforme novas funcionalidades são implementadas ou modificações são feitas na arquitetura do sistema. 