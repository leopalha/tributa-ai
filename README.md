# Tributa.AI - Plataforma de Gestão de Créditos Fiscais

## Visão Geral

Tributa.AI é uma plataforma completa para gestão, tokenização e negociação de créditos fiscais. A plataforma integra tecnologias modernas como blockchain, inteligência artificial e análise de dados para oferecer uma solução completa para empresas que desejam otimizar sua gestão tributária.

## Principais Funcionalidades

- **Carteira Digital**: Gerenciamento de saldo, depósitos, saques e tokenização de ativos
- **Sistema de Compensação**: Compensação bilateral e multilateral de créditos fiscais
- **Marketplace**: Plataforma para compra e venda de créditos fiscais tokenizados
- **Tokenização**: Conversão de créditos fiscais em tokens na blockchain
- **Análise Avançada**: Dashboards e relatórios detalhados sobre créditos e obrigações fiscais

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, Prisma
- **Blockchain**: Ethereum, Ethers.js
- **Banco de Dados**: PostgreSQL, Supabase
- **Testes**: Vitest, Jest

## Pré-requisitos

- Node.js (v18 ou superior)
- npm (v9 ou superior)
- PostgreSQL (v14 ou superior)
- MetaMask ou outra carteira Ethereum (para funcionalidades blockchain)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/sua-organizacao/tributa-ai-web.git
cd tributa-ai-web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/tributa_ai"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
BLOCKCHAIN_RPC_URL="https://mainnet.infura.io/v3/your-infura-key"
```

5. Execute as migrações do banco de dados:
```bash
npm run db:push
```

6. Popule o banco de dados com dados iniciais:
```bash
npm run db:seed
```

## Executando a Aplicação

### Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### Modo de Produção

Para construir e executar a aplicação em modo de produção:

```bash
npm run build
npm run deploy
```

## Estrutura do Projeto

```
tributa-ai-web/
├── src/                    # Código-fonte principal
│   ├── components/         # Componentes React
│   │   ├── wallet/         # Componentes da carteira digital
│   │   ├── marketplace/    # Componentes do marketplace
│   │   ├── compensacao/    # Componentes do sistema de compensação
│   │   └── ui/             # Componentes de UI reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Serviços e lógica de negócio
│   ├── hooks/              # Hooks personalizados
│   ├── types/              # Definições de tipos TypeScript
│   └── utils/              # Funções utilitárias
├── prisma/                 # Schema e migrações do Prisma
├── docs/                   # Documentação do projeto
│   └── plataforma/         # Documentação da plataforma
│       ├── desenvolvimento/ # Guias de desenvolvimento
│       └── status/         # Status do projeto
├── scripts/                # Scripts utilitários
└── tests/                  # Testes automatizados
```

## Módulos Principais

### Carteira Digital (Wallet)

A carteira digital permite aos usuários gerenciar seus fundos, realizar transações financeiras, tokenizar ativos e interagir com a blockchain.

Para acessar a carteira, navegue até `/dashboard/wallet` após fazer login.

### Sistema de Compensação

O sistema de compensação permite a compensação de créditos e débitos fiscais, tanto de forma bilateral (entre créditos e débitos de uma mesma empresa) quanto multilateral (entre múltiplas empresas).

Para acessar o sistema de compensação, navegue até `/dashboard/recuperacao/compensacao-bilateral` ou `/dashboard/recuperacao/compensacao-multilateral`.

### Marketplace

O marketplace permite a compra e venda de créditos fiscais tokenizados, com funcionalidades de negociação, lances e análise de mercado.

Para acessar o marketplace, navegue até `/dashboard/marketplace`.

## Testes

### Executando Testes Unitários

```bash
npm run test
```

### Executando Testes de Integração Blockchain

```bash
node scripts/test-blockchain.js
```

## Documentação

A documentação completa do projeto está disponível na pasta `docs/plataforma/`. Os principais documentos são:

- [WALLET_IMPLEMENTATION_GUIDE.md](docs/plataforma/desenvolvimento/WALLET_IMPLEMENTATION_GUIDE.md) - Guia de implementação da carteira digital
- [WALLET_BLOCKCHAIN_INTEGRATION.md](docs/plataforma/desenvolvimento/WALLET_BLOCKCHAIN_INTEGRATION.md) - Documentação da integração blockchain
- [SISTEMA_COMPENSACAO.md](docs/plataforma/desenvolvimento/SISTEMA_COMPENSACAO.md) - Documentação do sistema de compensação
- [PADRONIZACAO_MARKETPLACE.md](docs/plataforma/desenvolvimento/PADRONIZACAO_MARKETPLACE.md) - Guia de padronização do marketplace
- [STATUS_PROJETO_ATUAL.md](docs/plataforma/status/STATUS_PROJETO_ATUAL.md) - Status atual do projeto

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto é propriedade da Tributa.AI e não pode ser redistribuído sem autorização.

---

© 2024 Tributa.AI - Todos os direitos reservados. 