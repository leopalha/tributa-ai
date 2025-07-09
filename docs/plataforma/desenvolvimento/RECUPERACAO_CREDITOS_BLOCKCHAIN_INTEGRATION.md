# Integração entre Recuperação de Créditos e Blockchain

## Visão Geral

Este documento descreve a integração entre o módulo de Recuperação de Créditos e a infraestrutura Blockchain do Tributa.AI. Esta integração permite a tokenização de créditos fiscais identificados e recuperados, transformando-os em ativos digitais que podem ser negociados no Marketplace da plataforma.

## Fluxo de Integração

1. **Identificação de Créditos**: O sistema de Recuperação de Créditos identifica oportunidades de créditos fiscais através de análise de documentos e obrigações fiscais.

2. **Validação de Créditos**: Os créditos identificados passam por um processo de validação, onde são verificados quanto à sua legitimidade e aplicabilidade.

3. **Tokenização**: Após validados, os créditos podem ser tokenizados, transformando-os em ativos digitais na blockchain.

4. **Registro na Blockchain**: Os tokens são registrados na blockchain, garantindo sua autenticidade, rastreabilidade e imutabilidade.

5. **Disponibilização no Marketplace**: Os créditos tokenizados ficam disponíveis para negociação no Marketplace da plataforma.

## Componentes Principais

### Serviços

- **RecuperacaoCreditosService**: Serviço responsável pela gestão de créditos fiscais identificados.
  - `tokenizarCredito()`: Método que inicia o processo de tokenização de um crédito.

- **BlockchainIntegrationService**: Serviço que gerencia a integração com a blockchain.
  - `registerAsset()`: Registra um ativo (crédito tokenizado) na blockchain.
  - `getAssetDetails()`: Obtém detalhes de um ativo registrado.

### Hooks

- **useRecuperacaoCreditos**: Hook que encapsula a lógica de recuperação de créditos.
  - `tokenizarCredito()`: Método que integra o serviço de recuperação de créditos com o serviço blockchain.

## Implementação Técnica

### Tokenização de Créditos

```typescript
// Hook de Recuperação de Créditos
const tokenizarCredito = async (creditoId: string, valor: number) => {
  // 1. Tokeniza o crédito usando o serviço de recuperação
  const tokenizacaoResult = await recuperacaoCreditosService.tokenizarCredito(creditoId, valor);
  
  // 2. Importa o serviço de integração blockchain
  const { blockchainIntegrationService } = await import('@/services/blockchain-integration.service');
  
  // 3. Registra o token na blockchain
  const blockchainResult = await blockchainIntegrationService.registerAsset({
    assetId: tokenizacaoResult.tokenId,
    assetType: 'TAX_CREDIT',
    assetValue: valor,
    metadata: {
      creditoId: creditoId,
      origem: 'recuperacao-creditos',
      dataTokenizacao: new Date().toISOString()
    }
  });
  
  // 4. Retorna o resultado combinado
  return {
    ...tokenizacaoResult,
    blockchainTxId: blockchainResult.transactionId,
    blockchainStatus: blockchainResult.status
  };
};
```

### Estrutura de Dados

Os créditos tokenizados seguem esta estrutura na blockchain:

```json
{
  "assetId": "token-123456",
  "assetType": "TAX_CREDIT",
  "assetValue": 10000.00,
  "metadata": {
    "creditoId": "credito-789012",
    "tipo": "PIS/COFINS",
    "periodo": "2023-01",
    "origem": "recuperacao-creditos",
    "dataTokenizacao": "2023-06-15T10:30:00Z"
  },
  "owner": "0x1234567890abcdef",
  "status": "ACTIVE",
  "createdAt": "2023-06-15T10:30:00Z",
  "transactionId": "0xabcdef1234567890"
}
```

## Fluxo de Trabalho do Usuário

1. O usuário acessa a página de Créditos Identificados
2. Seleciona um crédito validado
3. Clica no botão "Tokenizar Crédito"
4. Confirma o valor a ser tokenizado
5. O sistema executa o processo de tokenização
6. Após concluído, o usuário é notificado do sucesso
7. O crédito tokenizado aparece na carteira digital do usuário e no Marketplace

## Considerações de Segurança

- **Validação Dupla**: Antes da tokenização, o sistema realiza uma dupla validação do crédito.
- **Assinatura Digital**: Cada transação é assinada digitalmente para garantir autenticidade.
- **Controle de Acesso**: Apenas usuários autorizados podem iniciar o processo de tokenização.
- **Auditoria**: Todas as operações são registradas para fins de auditoria.

## Integração com Outros Módulos

- **Carteira Digital**: Os créditos tokenizados são exibidos na carteira digital do usuário.
- **Marketplace**: Os tokens podem ser listados para venda no Marketplace.
- **Sistema de Compensação**: Os tokens podem ser utilizados no sistema de compensação multilateral.

## Próximos Passos

1. **Automação Completa**: Automatizar todo o processo de tokenização, desde a identificação até o registro na blockchain.
2. **Melhorias na UX**: Aprimorar a experiência do usuário durante o processo de tokenização.
3. **Expansão de Metadados**: Incluir mais informações relevantes nos metadados dos tokens.
4. **Integração com Sistemas Externos**: Permitir a integração com sistemas externos de validação de créditos.

---

**Nota**: Este documento deve ser atualizado conforme novas funcionalidades são implementadas ou modificações são feitas na arquitetura do sistema. 