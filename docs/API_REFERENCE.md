# 🔌 API REFERENCE - TRIBUTA.AI

## 📋 **INFORMAÇÕES DA API**
**Versão:** 1.0  
**Base URL:** `https://api.tributa.ai/v1`  
**Autenticação:** Bearer Token (JWT)  
**Formato:** JSON  
**Status:** 75% implementado (25% mockado)

---

## 📖 **ÍNDICE**
1. [Autenticação](#autenticação)
2. [Endpoints Principais](#endpoints-principais)
3. [Empresas](#empresas)
4. [Títulos de Crédito](#títulos-crédito)
5. [Marketplace](#marketplace)
6. [Recuperação de Créditos (RCT)](#recuperação-créditos)
7. [Blockchain](#blockchain)
8. [Relatórios](#relatórios)
9. [Códigos de Erro](#códigos-erro)
10. [Schemas](#schemas)
11. [Exemplos](#exemplos)

---

## 🔐 **AUTENTICAÇÃO** {#autenticação}

### **JWT Bearer Token**
Todas as requisições devem incluir o header:
```
Authorization: Bearer <seu_jwt_token>
```

### **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@empresa.com",
  "password": "sua_senha"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGVzdCByZWZyZXNo...",
    "expiresIn": 3600,
    "user": {
      "id": "usr_123",
      "email": "user@empresa.com",
      "name": "João Silva",
      "role": "EMPRESA"
    }
  }
}
```

### **Refresh Token**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "dGVzdCByZWZyZXNo..."
}
```

---

## 🌐 **ENDPOINTS PRINCIPAIS** {#endpoints-principais}

### **Status da API**
```http
GET /health
```
**Resposta:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "blockchain": "simulated",
    "government_apis": "85% mocked"
  }
}
```

---

## 🏢 **EMPRESAS** {#empresas}

### **Listar Empresas**
```http
GET /empresas
```
**Query Parameters:**
- `page` (int): Página (default: 1)
- `limit` (int): Itens por página (default: 20)
- `search` (string): Busca por CNPJ/Razão Social

**Resposta:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "emp_123",
        "cnpj": "12.345.678/0001-90",
        "razaoSocial": "Tech Solutions LTDA",
        "nomeFantasia": "TechSol",
        "email": "contato@techsol.com",
        "telefone": "(11) 99999-9999",
        "regimeTributario": "LUCRO_PRESUMIDO",
        "porte": "PEQUENA",
        "status": "ATIVA",
        "createdAt": "2025-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### **Criar Empresa**
```http
POST /empresas
Content-Type: application/json

{
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "Tech Solutions LTDA",
  "nomeFantasia": "TechSol",
  "email": "contato@techsol.com",
  "telefone": "(11) 99999-9999",
  "endereco": {
    "logradouro": "Rua das Tecnologias, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "regimeTributario": "LUCRO_PRESUMIDO",
  "porte": "PEQUENA"
}
```

### **Buscar Empresa por ID**
```http
GET /empresas/{id}
```

### **Atualizar Empresa**
```http
PUT /empresas/{id}
```

### **Deletar Empresa**
```http
DELETE /empresas/{id}
```

---

## 📄 **TÍTULOS DE CRÉDITO** {#títulos-crédito}

### **Listar Títulos**
```http
GET /titulos-credito
```
**Query Parameters:**
- `tipo` (string): Tipo do título (ICMS, PIS_COFINS, etc.)
- `status` (string): Status (ATIVO, VENCIDO, PAGO)
- `empresaId` (string): ID da empresa
- `valorMin` (number): Valor mínimo
- `valorMax` (number): Valor máximo

**Resposta:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "tc_456",
        "numero": "TC-2025-001",
        "tipo": "ICMS_DIFERENCIAL_ALIQUOTA",
        "valor": 25000.00,
        "valorOriginal": 30000.00,
        "vencimento": "2025-06-15",
        "status": "ATIVO",
        "empresaId": "emp_123",
        "empresa": {
          "cnpj": "12.345.678/0001-90",
          "razaoSocial": "Tech Solutions LTDA"
        },
        "createdAt": "2025-01-01T10:00:00Z",
        "tokenizado": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 89,
      "pages": 5
    }
  }
}
```

### **Criar Título de Crédito**
```http
POST /titulos-credito
Content-Type: application/json

{
  "numero": "TC-2025-001",
  "tipo": "ICMS_DIFERENCIAL_ALIQUOTA",
  "valor": 25000.00,
  "valorOriginal": 30000.00,
  "vencimento": "2025-06-15",
  "empresaId": "emp_123",
  "documentos": [
    {
      "tipo": "COMPROVANTE_CREDITO",
      "url": "https://storage.tributa.ai/docs/tc_456_comprovante.pdf"
    }
  ],
  "fundamentacaoLegal": {
    "lei": "Lei Complementar 87/1996",
    "artigo": "Art. 20",
    "descricao": "Crédito de ICMS por diferencial de alíquota"
  }
}
```

### **Tokenizar Título**
```http
POST /titulos-credito/{id}/tokenizar
Content-Type: application/json

{
  "valorMinimo": 20000.00,
  "fracoes": 100,
  "valorPorFracao": 200.00
}
```

---

## 🏪 **MARKETPLACE** {#marketplace}

### **Listar Anúncios**
```http
GET /marketplace/anuncios
```
**Query Parameters:**
- `categoria` (string): Categoria do título
- `tipoNegociacao` (string): VENDA_DIRETA, LEILAO
- `valorMin` (number): Valor mínimo
- `valorMax` (number): Valor máximo
- `status` (string): ATIVO, PAUSADO, VENDIDO

**Resposta:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ann_789",
        "titulo": "Crédito ICMS - Tech Solutions",
        "descricao": "Crédito de ICMS por diferencial de alíquota",
        "valor": 22000.00,
        "valorOriginal": 25000.00,
        "desconto": 12,
        "categoria": "TRIBUTARIO",
        "tipo": "ICMS_DIFERENCIAL_ALIQUOTA",
        "tipoNegociacao": "VENDA_DIRETA",
        "status": "ATIVO",
        "vendedor": {
          "id": "emp_123",
          "razaoSocial": "Tech Solutions LTDA",
          "rating": 4.8
        },
        "visualizacoes": 45,
        "interessados": 12,
        "dataPublicacao": "2025-01-01T10:00:00Z",
        "prazoOferta": "2025-01-31T23:59:59Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "pages": 8
    }
  }
}
```

### **Criar Anúncio**
```http
POST /marketplace/anuncios
Content-Type: application/json

{
  "tituloId": "tc_456",
  "titulo": "Crédito ICMS - Tech Solutions",
  "descricao": "Crédito de ICMS por diferencial de alíquota com documentação completa",
  "valor": 22000.00,
  "tipoNegociacao": "VENDA_DIRETA",
  "prazoOferta": "2025-01-31T23:59:59Z",
  "permiteFracionamento": true,
  "valorMinimoFracao": 1000.00
}
```

### **Fazer Oferta**
```http
POST /marketplace/anuncios/{id}/ofertas
Content-Type: application/json

{
  "valor": 21000.00,
  "quantidade": 1,
  "mensagem": "Oferta para compra imediata",
  "prazoValidade": "2025-01-15T23:59:59Z"
}
```

### **Aceitar Oferta**
```http
POST /marketplace/ofertas/{id}/aceitar
```

---

## 💰 **RECUPERAÇÃO DE CRÉDITOS (RCT)** {#recuperação-créditos}

### **Analisar Documentos**
```http
POST /rct/analise
Content-Type: multipart/form-data

empresaId: emp_123
periodo: 2024-01
arquivo: @documento_fiscal.xml
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "analiseId": "ana_321",
    "status": "PROCESSANDO",
    "progresso": 25,
    "estimativaConlusao": "2025-01-07T15:30:00Z",
    "creditosIdentificados": [],
    "valorEstimado": 0
  }
}
```

### **Buscar Resultado da Análise**
```http
GET /rct/analise/{analiseId}
```

**Resposta (após processamento):**
```json
{
  "success": true,
  "data": {
    "analiseId": "ana_321",
    "status": "CONCLUIDA",
    "progresso": 100,
    "creditosIdentificados": [
      {
        "tipo": "ICMS_DIFERENCIAL_ALIQUOTA",
        "valor": 15000.00,
        "competencia": "2024-01",
        "fundamentacao": "Art. 20 da LC 87/1996",
        "confianca": 0.95,
        "documentos": ["nfe_123.xml", "efd_2024_01.txt"]
      },
      {
        "tipo": "PIS_COFINS_MONOFASICO",
        "valor": 8500.00,
        "competencia": "2024-01",
        "fundamentacao": "Art. 3º da Lei 10.147/2000",
        "confianca": 0.88,
        "documentos": ["efd_contribuicoes_2024_01.txt"]
      }
    ],
    "valorTotal": 23500.00,
    "relatorio": "https://storage.tributa.ai/reports/ana_321_relatorio.pdf"
  }
}
```

### **Iniciar Processo de Recuperação**
```http
POST /rct/recuperacao
Content-Type: application/json

{
  "analiseId": "ana_321",
  "creditosSelecionados": [
    {
      "tipo": "ICMS_DIFERENCIAL_ALIQUOTA",
      "valor": 15000.00
    }
  ],
  "estrategia": "ADMINISTRATIVA",
  "observacoes": "Documentação completa disponível"
}
```

---

## ⛓️ **BLOCKCHAIN** {#blockchain}

### **Status da Rede**
```http
GET /blockchain/status
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "status": "SIMULATED",
    "network": "tributa-testnet",
    "blockHeight": 15420,
    "peers": 4,
    "version": "v1.0.0-simulated"
  }
}
```

### **Consultar Transação**
```http
GET /blockchain/transactions/{txId}
```

### **Registrar Título na Blockchain**
```http
POST /blockchain/titles
Content-Type: application/json

{
  "tituloId": "tc_456",
  "hash": "a1b2c3d4...",
  "metadata": {
    "tipo": "ICMS_DIFERENCIAL_ALIQUOTA",
    "valor": 25000.00,
    "empresa": "12.345.678/0001-90"
  }
}
```

---

## 📊 **RELATÓRIOS** {#relatórios}

### **Dashboard Principal**
```http
GET /dashboard/overview
```
**Resposta:**
```json
{
  "success": true,
  "data": {
    "titulosAtivos": 156,
    "valorTotalCarteira": 2850000.00,
    "vendasMes": 12,
    "receitaMes": 340000.00,
    "creditosIdentificados": 89,
    "valorCreditosPendentes": 1200000.00,
    "transacoesPendentes": 8,
    "avaliacaoMedia": 4.7
  }
}
```

### **Relatório de Performance**
```http
GET /relatorios/performance
```
**Query Parameters:**
- `periodo` (string): MENSAL, TRIMESTRAL, ANUAL
- `dataInicio` (date): Data início
- `dataFim` (date): Data fim

---

## ❌ **CÓDIGOS DE ERRO** {#códigos-erro}

### **Códigos HTTP**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### **Estrutura de Erro**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "cnpj",
        "message": "CNPJ inválido"
      }
    ]
  }
}
```

### **Códigos de Erro Customizados**
- `AUTH_INVALID_CREDENTIALS` - Credenciais inválidas
- `AUTH_TOKEN_EXPIRED` - Token expirado
- `EMPRESA_NOT_FOUND` - Empresa não encontrada
- `TITULO_NOT_FOUND` - Título não encontrado
- `TITULO_ALREADY_TOKENIZED` - Título já tokenizado
- `MARKETPLACE_INSUFFICIENT_FUNDS` - Fundos insuficientes
- `BLOCKCHAIN_NETWORK_ERROR` - Erro na rede blockchain
- `GOVERNMENT_API_UNAVAILABLE` - API governamental indisponível

---

## 📐 **SCHEMAS** {#schemas}

### **Empresa**
```typescript
interface Empresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    cidade: string;
    estado: string;
    cep: string;
    numero?: string;
    complemento?: string;
  };
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  porte: 'MEI' | 'MICRO' | 'PEQUENA' | 'MEDIA' | 'GRANDE';
  status: 'ATIVA' | 'SUSPENSA' | 'BAIXADA';
  createdAt: string;
  updatedAt: string;
}
```

### **Título de Crédito**
```typescript
interface TituloCredito {
  id: string;
  numero: string;
  tipo: TipoTitulo;
  valor: number;
  valorOriginal: number;
  vencimento: string;
  status: 'ATIVO' | 'VENCIDO' | 'PAGO' | 'CANCELADO';
  empresaId: string;
  empresa?: Empresa;
  documentos: DocumentoTitulo[];
  fundamentacaoLegal?: {
    lei: string;
    artigo: string;
    descricao: string;
  };
  tokenizado: boolean;
  tokenInfo?: {
    fracoes: number;
    valorPorFracao: number;
    vendidas: number;
  };
  createdAt: string;
  updatedAt: string;
}
```

### **Anúncio Marketplace**
```typescript
interface AnuncioMarketplace {
  id: string;
  tituloId: string;
  titulo: string;
  descricao: string;
  valor: number;
  valorOriginal: number;
  desconto: number;
  categoria: string;
  tipo: TipoTitulo;
  tipoNegociacao: 'VENDA_DIRETA' | 'LEILAO';
  status: 'ATIVO' | 'PAUSADO' | 'VENDIDO' | 'CANCELADO';
  vendedorId: string;
  vendedor?: {
    id: string;
    razaoSocial: string;
    rating: number;
  };
  visualizacoes: number;
  interessados: number;
  dataPublicacao: string;
  prazoOferta: string;
  permiteFracionamento: boolean;
  valorMinimoFracao?: number;
}
```

---

## 💡 **EXEMPLOS** {#exemplos}

### **Fluxo Completo: Empresa → Título → Marketplace**

```javascript
// 1. Criar empresa
const empresa = await fetch('/api/empresas', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Tech Solutions LTDA',
    email: 'contato@techsol.com',
    regimeTributario: 'LUCRO_PRESUMIDO'
  })
});

// 2. Criar título
const titulo = await fetch('/api/titulos-credito', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tipo: 'ICMS_DIFERENCIAL_ALIQUOTA',
    valor: 25000.00,
    empresaId: empresa.data.id
  })
});

// 3. Tokenizar título
await fetch(`/api/titulos-credito/${titulo.data.id}/tokenizar`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fracoes: 100,
    valorPorFracao: 250.00
  })
});

// 4. Publicar no marketplace
const anuncio = await fetch('/api/marketplace/anuncios', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tituloId: titulo.data.id,
    valor: 22000.00,
    tipoNegociacao: 'VENDA_DIRETA'
  })
});
```

### **Análise RCT com Upload de Documentos**

```javascript
// Upload e análise de documentos
const formData = new FormData();
formData.append('empresaId', 'emp_123');
formData.append('periodo', '2024-01');
formData.append('arquivo', fileInput.files[0]);

const analise = await fetch('/api/rct/analise', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});

// Polling para verificar progresso
const checkProgress = async (analiseId) => {
  const result = await fetch(`/api/rct/analise/${analiseId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  
  const data = await result.json();
  
  if (data.data.status === 'CONCLUIDA') {
    console.log('Créditos identificados:', data.data.creditosIdentificados);
    console.log('Valor total:', data.data.valorTotal);
  } else {
    console.log('Progresso:', data.data.progresso + '%');
    setTimeout(() => checkProgress(analiseId), 5000);
  }
};

checkProgress(analise.data.analiseId);
```

---

## 🔄 **Rate Limiting**
- **Limite geral:** 1000 requisições/hora por IP
- **Autenticado:** 5000 requisições/hora por usuário
- **Upload de arquivos:** 10 uploads/minuto
- **Header de resposta:** `X-RateLimit-Remaining`

## 📱 **SDKs Disponíveis**
- **JavaScript/TypeScript:** `@tributa-ai/sdk-js`
- **Python:** `tributa-ai-python-sdk`
- **PHP:** `tributa-ai/php-sdk`

## 🆘 **Suporte**
- **Documentação:** https://docs.tributa.ai
- **Status:** https://status.tributa.ai
- **Suporte:** api-support@tributa.ai

---

**📌 Esta documentação é atualizada constantemente. Versão atual: 1.0 (Janeiro 2025)**