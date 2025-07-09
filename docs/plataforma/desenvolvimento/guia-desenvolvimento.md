# Guia de Desenvolvimento - Tributa.AI

Este documento fornece informações sobre a estrutura e padrões de desenvolvimento da plataforma Tributa.AI.

## Estrutura do Projeto

O projeto segue a arquitetura App Router do Next.js 15.3.1, com a seguinte estrutura:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── registrar/
│   │   └── esqueci-senha/
│   ├── (dashboard)/
│   │   ├── declaracoes/
│   │   ├── empresas/
│   │   ├── obrigacoes/
│   │   ├── titulos/
│   │   ├── marketplace/
│   │   └── configuracoes/
│   ├── api/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ... (demais componentes UI)
│   └── dashboard/
│       ├── FeatureCard.tsx
│       ├── MetricsPanel.tsx
│       └── ... (componentes específicos)
├── hooks/
│   ├── useUser.ts
│   ├── useEmpresa.ts
│   └── ... (demais hooks)
├── providers/
│   ├── UserProvider.tsx
│   ├── EmpresaProvider.tsx
│   └── ... (demais providers)
├── lib/
│   ├── utils.ts
│   └── api.ts
├── types/
│   ├── user.ts
│   ├── empresa.ts
│   └── ... (demais tipos)
└── styles/
    └── globals.css
```

## Comando para Desenvolvimento

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

O servidor ficará disponível em http://localhost:3001.

## Design System

O projeto utiliza um sistema de design baseado no Tailwind CSS com componentes UI inspirados em shadcn/ui. As principais características:

- Paleta de cores unificada definida em `tailwind.config.js`
- Temas claro e escuro suportados através do `next-themes`
- Componentes reutilizáveis na pasta `src/components/ui`
- Design responsivo adaptado para mobile, tablet e desktop

## Contexto e Estado

O estado global é gerenciado através de Contextos do React:

- `UserProvider` - Autenticação e dados do usuário
- `EmpresaProvider` - Gerenciamento de empresas

## API e Comunicação

A comunicação com o backend é feita através de Axios configurado no arquivo `src/lib/api.ts`.

## Comandos Úteis

```bash
# Verificar padrões de código
npm run lint

# Compilar projeto para produção
npm run build

# Iniciar em modo de produção
npm run start

# Validar projeto (executa ESLint, TypeScript check e build)
./build-validate.sh
```

## Convenções

- Componentes: PascalCase
- Funções/hooks: camelCase
- Arquivos de componentes: PascalCase
- Arquivos utilitários: camelCase
- Estilos: Tailwind CSS quando possível
- Rotas: kebab-case

## Fluxo de Desenvolvimento

1. Inicie com `npm run dev`
2. Implemente suas mudanças
3. Execute o linter com `npm run lint`
4. Teste localmente
5. Execute o script de validação `./build-validate.sh`
6. Faça commit das alterações

## Recursos Úteis

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do shadcn/ui](https://ui.shadcn.com)
- [Repositório de ícones Lucide](https://lucide.dev)

## Contato

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento em `dev@tributa.ai`.

## Hyperledger Fabric e Blockchain

### Integração com a plataforma

O projeto Tributa.AI implementa uma integração robusta com o Hyperledger Fabric para garantir a segurança, transparência e rastreabilidade das operações de tokenização de créditos, negociação no marketplace e especialmente para a compensação fiscal.

#### Principais componentes:

1. **Chaincode (Smart Contracts)**
   - `compensacao.js`: Implementa a lógica de negócio para compensação de débitos fiscais usando créditos tokenizados
   - Funções principais: registrarCompensacao, atualizarStatusCompensacao, consultarCompensacao, verificarCompensacao

2. **APIs de Integração**
   - `/api/blockchain/fabric`: Endpoint para comunicação direta com a rede Fabric
   - `/api/blockchain/compensacao/registrar`: Registra uma compensação na blockchain
   - `/api/blockchain/compensacao/[id]/verificar`: Verifica a validade e integridade de uma compensação
   - `/api/blockchain/compensacao/[id]/historico`: Obtém o histórico completo de uma compensação

3. **Componentes de UI**
   - `StatusConexao`: Exibe o status atual da conexão com a rede blockchain
   - `CompensacaoBlockchain`: Exibe detalhes de uma compensação registrada na blockchain
   - `TransactionList`: Lista transações da blockchain
   - `NetworkStatus`: Dashboard de monitoramento da rede blockchain

4. **Serviços**
   - `BlockchainCompensacaoService`: Serviço para interagir com chaincodes no Hyperledger Fabric
   - `TokenStorage`: Armazenamento seguro de tokens e chaves da blockchain

### Arquitetura de Segurança

Para garantir a integridade e segurança das operações:

1. Todas as transações são registradas na blockchain com timestamp e assinatura digital
2. Implementamos validação em múltiplas camadas (aplicação e chaincode)
3. As chaves privadas são armazenadas de forma segura no TokenStorage (criptografado)
4. Auditoria completa de todas as operações (logs no banco de dados e na blockchain)

### Operações Suportadas

- Registro de compensações
- Verificação de integridade
- Consulta de histórico completo
- Validação de status
- Monitoramento da rede

### Próximos Passos

- Implementar a integração completa com uma rede Hyperledger Fabric em produção
- Adicionar suporte a certificados digitais para assinatura das operações
- Expandir os smart contracts para suportar leilões e compensação multilateral
- Implementar funcionalidades de governança na rede blockchain 