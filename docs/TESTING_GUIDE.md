# 🧪 TESTING GUIDE - TRIBUTA.AI

## 📋 **INFORMAÇÕES DE TESTE**
**Framework:** Jest + React Testing Library + Playwright  
**Cobertura Atual:** 25%  
**Meta:** 80%  
**Estratégia:** Test Pyramid (Unit 70% + Integration 20% + E2E 10%)

---

## 📖 **ÍNDICE**
1. [Estratégia de Testes](#estratégia-testes)
2. [Configuração](#configuração)
3. [Testes Unitários](#testes-unitários)
4. [Testes de Integração](#testes-integração)
5. [Testes End-to-End](#testes-e2e)
6. [Testes de API](#testes-api)
7. [Testes de Performance](#testes-performance)
8. [Testes de Segurança](#testes-segurança)
9. [Coverage e Reporting](#coverage-reporting)
10. [CI/CD Integration](#cicd-integration)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 **ESTRATÉGIA DE TESTES** {#estratégia-testes}

### **Test Pyramid - Tributa.AI**
```
       /\
      /E2E\     <- 10% (críticos)
     /------\
    /Integration\ <- 20% (fluxos)
   /-----------\
  /Unit Tests  \ <- 70% (componentes)
 /_____________\
```

### **Cobertura por Domínio:**
- ✅ **Autenticação:** 90% (crítico)
- ✅ **Marketplace:** 80% (core business)
- ✅ **Títulos de Crédito:** 85% (core business)
- ⚠️ **Blockchain:** 60% (simulado)
- ⚠️ **APIs Governo:** 40% (mockado)
- ✅ **Utils/Helpers:** 95% (base)

### **Tipos de Teste:**
1. **🔬 Unit Tests** - Componentes isolados
2. **🔗 Integration Tests** - Interação entre módulos
3. **🎭 E2E Tests** - Fluxos completos de usuário
4. **🔌 API Tests** - Endpoints e contratos
5. **⚡ Performance Tests** - Load e stress
6. **🔒 Security Tests** - Vulnerabilidades
7. **📱 Visual Tests** - Screenshots e layouts

---

## ⚙️ **CONFIGURAÇÃO** {#configuração}

### **1. Dependências de Teste**
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.4.3",
    "@playwright/test": "^1.40.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "msw": "^2.0.0",
    "supertest": "^6.3.3",
    "@types/jest": "^29.5.8",
    "jest-coverage-badges": "^1.1.2"
  }
}
```

### **2. Jest Configuration**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    './src/services/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ]
};
```

### **3. Test Setup**
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock global objects
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));
```

---

## 🔬 **TESTES UNITÁRIOS** {#testes-unitários}

### **1. Componentes React**
```typescript
// src/components/__tests__/CreditTitle.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CreditTitle } from '../CreditTitle';
import { mockCreditTitle } from '@/test/mocks/data';

describe('CreditTitle Component', () => {
  it('should render credit title information correctly', () => {
    render(<CreditTitle creditTitle={mockCreditTitle} />);
    
    expect(screen.getByText('TC-2025-001')).toBeInTheDocument();
    expect(screen.getByText('R$ 25.000,00')).toBeInTheDocument();
    expect(screen.getByText('ICMS Diferencial')).toBeInTheDocument();
  });

  it('should handle tokenize action', async () => {
    const onTokenize = jest.fn();
    render(<CreditTitle creditTitle={mockCreditTitle} onTokenize={onTokenize} />);
    
    const tokenizeButton = screen.getByRole('button', { name: /tokenizar/i });
    fireEvent.click(tokenizeButton);
    
    expect(onTokenize).toHaveBeenCalledWith(mockCreditTitle.id);
  });

  it('should show loading state during tokenization', () => {
    render(<CreditTitle creditTitle={mockCreditTitle} isLoading={true} />);
    
    expect(screen.getByRole('button', { name: /tokenizando/i })).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display error message when tokenization fails', () => {
    const error = 'Falha na tokenização';
    render(<CreditTitle creditTitle={mockCreditTitle} error={error} />);
    
    expect(screen.getByText(error)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('error');
  });
});
```

### **2. Hooks Customizados**
```typescript
// src/hooks/__tests__/useMarketplace.test.ts
import { renderHook, act } from '@testing-library/react';
import { useMarketplace } from '../useMarketplace';
import { server } from '@/test/mocks/server';
import { rest } from 'msw';

describe('useMarketplace Hook', () => {
  it('should fetch marketplace items on mount', async () => {
    const { result } = renderHook(() => useMarketplace());
    
    expect(result.current.isLoading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toHaveLength(3);
  });

  it('should handle search functionality', async () => {
    const { result } = renderHook(() => useMarketplace());
    
    await act(async () => {
      result.current.search('ICMS');
    });
    
    expect(result.current.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'ICMS_DIFERENCIAL_ALIQUOTA' })
      ])
    );
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      rest.get('/api/marketplace', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    const { result } = renderHook(() => useMarketplace());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(result.current.error).toBe('Erro ao carregar marketplace');
    expect(result.current.items).toEqual([]);
  });
});
```

### **3. Serviços/Utils**
```typescript
// src/services/__tests__/marketplace.service.test.ts
import { MarketplaceService } from '../marketplace.service';
import { server } from '@/test/mocks/server';
import { rest } from 'msw';

describe('MarketplaceService', () => {
  describe('listItems', () => {
    it('should return marketplace items with pagination', async () => {
      const result = await MarketplaceService.listItems({ page: 1, limit: 10 });
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
      expect(result.items).toHaveLength(10);
      expect(result.pagination.page).toBe(1);
    });

    it('should apply filters correctly', async () => {
      const filters = { category: 'TRIBUTARIO', minValue: 1000 };
      const result = await MarketplaceService.listItems({ filters });
      
      result.items.forEach(item => {
        expect(item.category).toBe('TRIBUTARIO');
        expect(item.value).toBeGreaterThanOrEqual(1000);
      });
    });
  });

  describe('makeOffer', () => {
    it('should create offer successfully', async () => {
      const offerData = {
        creditTitleId: 'tc_123',
        amount: 20000,
        message: 'Oferta de compra'
      };

      const result = await MarketplaceService.makeOffer(offerData);
      
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('PENDING');
      expect(result.amount).toBe(20000);
    });

    it('should throw error for invalid offer', async () => {
      const invalidOffer = {
        creditTitleId: 'invalid',
        amount: -1000
      };

      await expect(MarketplaceService.makeOffer(invalidOffer))
        .rejects.toThrow('Dados da oferta inválidos');
    });
  });
});
```

---

## 🔗 **TESTES DE INTEGRAÇÃO** {#testes-integração}

### **1. Fluxo Completo - Marketplace**
```typescript
// src/__tests__/integration/marketplace-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarketplacePage } from '@/pages/marketplace';
import { AppProviders } from '@/components/providers';
import { mockUser, mockCreditTitles } from '@/test/mocks/data';

describe('Marketplace Integration Flow', () => {
  it('should complete full purchase flow', async () => {
    const user = userEvent.setup();
    
    render(
      <AppProviders initialUser={mockUser}>
        <MarketplacePage />
      </AppProviders>
    );

    // 1. Buscar título
    const searchInput = screen.getByPlaceholderText(/buscar títulos/i);
    await user.type(searchInput, 'ICMS');
    
    await waitFor(() => {
      expect(screen.getByText('TC-2025-001')).toBeInTheDocument();
    });

    // 2. Clicar no título
    const titleCard = screen.getByTestId('credit-title-tc_123');
    await user.click(titleCard);

    // 3. Fazer oferta
    const offerButton = screen.getByRole('button', { name: /fazer oferta/i });
    await user.click(offerButton);

    const amountInput = screen.getByLabelText(/valor da oferta/i);
    await user.type(amountInput, '22000');

    const submitButton = screen.getByRole('button', { name: /enviar oferta/i });
    await user.click(submitButton);

    // 4. Verificar sucesso
    await waitFor(() => {
      expect(screen.getByText(/oferta enviada com sucesso/i)).toBeInTheDocument();
    });

    // 5. Verificar na lista de ofertas
    const myOffersTab = screen.getByRole('tab', { name: /minhas ofertas/i });
    await user.click(myOffersTab);

    expect(screen.getByText('R$ 22.000,00')).toBeInTheDocument();
    expect(screen.getByText('PENDENTE')).toBeInTheDocument();
  });
});
```

### **2. Autenticação + Autorização**
```typescript
// src/__tests__/integration/auth-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthPage } from '@/pages/auth';
import { AppProviders } from '@/components/providers';

describe('Authentication Integration', () => {
  it('should login and access protected resources', async () => {
    const user = userEvent.setup();
    
    render(
      <AppProviders>
        <AuthPage />
      </AppProviders>
    );

    // 1. Login
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'test@empresa.com');
    await user.type(passwordInput, 'senha123');
    await user.click(loginButton);

    // 2. Verificar redirecionamento
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });

    // 3. Acessar recurso protegido
    const marketplaceLink = screen.getByRole('link', { name: /marketplace/i });
    await user.click(marketplaceLink);

    // 4. Verificar acesso autorizado
    await waitFor(() => {
      expect(screen.getByText(/marketplace de títulos/i)).toBeInTheDocument();
    });
  });

  it('should deny access to unauthorized users', async () => {
    const user = userEvent.setup();
    
    render(
      <AppProviders>
        <AuthPage />
      </AppProviders>
    );

    // Tentar acessar sem login
    window.history.pushState({}, '', '/admin');
    
    await waitFor(() => {
      expect(screen.getByText(/acesso negado/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🎭 **TESTES END-TO-END** {#testes-e2e}

### **1. Configuração Playwright**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### **2. Teste E2E - Fluxo Crítico**
```typescript
// tests/e2e/marketplace-purchase.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Marketplace Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Login
    await page.fill('[data-testid="email-input"]', 'investor@test.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete purchase journey', async ({ page }) => {
    // 1. Navegar para marketplace
    await page.click('text=Marketplace');
    await expect(page).toHaveURL('/marketplace');

    // 2. Filtrar por categoria
    await page.selectOption('[data-testid="category-filter"]', 'TRIBUTARIO');
    
    // 3. Buscar título específico
    await page.fill('[data-testid="search-input"]', 'ICMS');
    await page.press('[data-testid="search-input"]', 'Enter');

    // 4. Aguardar resultados
    await page.waitForSelector('[data-testid="credit-title-card"]');
    
    // 5. Clicar no primeiro resultado
    await page.click('[data-testid="credit-title-card"]');

    // 6. Verificar detalhes do título
    await expect(page.locator('h1')).toContainText('TC-2025-001');
    await expect(page.locator('[data-testid="title-value"]')).toContainText('R$ 25.000,00');

    // 7. Fazer oferta
    await page.click('[data-testid="make-offer-button"]');
    
    // 8. Preencher formulário de oferta
    await page.fill('[data-testid="offer-amount"]', '22000');
    await page.fill('[data-testid="offer-message"]', 'Oferta de compra imediata');
    
    // 9. Confirmar oferta
    await page.click('[data-testid="submit-offer-button"]');

    // 10. Verificar sucesso
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Oferta enviada com sucesso');

    // 11. Verificar na lista de ofertas
    await page.click('text=Minhas Ofertas');
    await expect(page.locator('[data-testid="offer-list"]'))
      .toContainText('R$ 22.000,00');
  });

  test('should handle offer rejection gracefully', async ({ page }) => {
    // Mock de oferta rejeitada
    await page.route('**/api/offers', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Oferta muito baixa' })
      });
    });

    await page.goto('/marketplace');
    await page.click('[data-testid="credit-title-card"]');
    await page.click('[data-testid="make-offer-button"]');
    await page.fill('[data-testid="offer-amount"]', '1000');
    await page.click('[data-testid="submit-offer-button"]');

    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Oferta muito baixa');
  });
});
```

### **3. Performance E2E**
```typescript
// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('marketplace should load within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/marketplace');
    await page.waitForSelector('[data-testid="marketplace-content"]');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('should handle 100 credit titles without performance degradation', async ({ page }) => {
    // Mock endpoint com 100 títulos
    await page.route('**/api/marketplace**', route => {
      const titles = Array.from({ length: 100 }, (_, i) => ({
        id: `tc_${i}`,
        title: `Título ${i}`,
        value: 10000 + i * 1000
      }));
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: titles, total: 100 })
      });
    });

    const startTime = Date.now();
    await page.goto('/marketplace');
    await page.waitForSelector('[data-testid="credit-title-card"]');
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(3000);
    
    // Verificar se todos os 100 itens foram renderizados
    const titleCards = await page.locator('[data-testid="credit-title-card"]').count();
    expect(titleCards).toBe(100);
  });
});
```

---

## 🔌 **TESTES DE API** {#testes-api}

### **1. Testes de Endpoint**
```typescript
// tests/api/marketplace.api.test.ts
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { generateTestToken } from '@/test/utils/auth';

describe('/api/marketplace', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await generateTestToken({ role: 'INVESTIDOR_QUALIFICADO' });
  });

  afterEach(async () => {
    await prisma.offer.deleteMany();
    await prisma.creditTitle.deleteMany();
  });

  describe('GET /api/marketplace', () => {
    it('should return paginated marketplace items', async () => {
      const response = await request(app)
        .get('/api/marketplace')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.pagination.page).toBe(1);
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/marketplace')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ category: 'TRIBUTARIO' });

      expect(response.status).toBe(200);
      response.body.items.forEach((item: any) => {
        expect(item.category).toBe('TRIBUTARIO');
      });
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/marketplace');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Token não fornecido');
    });
  });

  describe('POST /api/marketplace/offers', () => {
    it('should create offer successfully', async () => {
      const offerData = {
        creditTitleId: 'tc_test_123',
        amount: 20000,
        message: 'Oferta de teste'
      };

      const response = await request(app)
        .post('/api/marketplace/offers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(offerData);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.amount).toBe(20000);
      expect(response.body.data.status).toBe('PENDING');
    });

    it('should validate offer data', async () => {
      const invalidOffer = {
        creditTitleId: '',
        amount: -1000
      };

      const response = await request(app)
        .post('/api/marketplace/offers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidOffer);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('validation');
    });

    it('should handle rate limiting', async () => {
      const offerData = {
        creditTitleId: 'tc_test_123',
        amount: 20000
      };

      // Fazer múltiplas requests rapidamente
      const promises = Array.from({ length: 10 }, () =>
        request(app)
          .post('/api/marketplace/offers')
          .set('Authorization', `Bearer ${authToken}`)
          .send(offerData)
      );

      const responses = await Promise.all(promises);
      
      // Pelo menos uma deve ser rate limited
      const rateLimited = responses.some(res => res.status === 429);
      expect(rateLimited).toBe(true);
    });
  });
});
```

### **2. Contract Testing**
```typescript
// tests/api/contracts/marketplace.contract.test.ts
import { generateOpenAPISpec } from '@/lib/openapi';
import SwaggerParser from '@apidevtools/swagger-parser';
import { validateResponse } from '@/test/utils/openapi';

describe('API Contract Tests', () => {
  let apiSpec: any;

  beforeAll(async () => {
    apiSpec = await generateOpenAPISpec();
    await SwaggerParser.validate(apiSpec);
  });

  it('marketplace endpoints should match OpenAPI spec', async () => {
    const response = await request(app)
      .get('/api/marketplace')
      .set('Authorization', `Bearer ${authToken}`);

    const isValid = validateResponse(
      apiSpec,
      '/api/marketplace',
      'get',
      response.status,
      response.body
    );

    expect(isValid).toBe(true);
  });

  it('error responses should match schema', async () => {
    const response = await request(app)
      .get('/api/marketplace/invalid-id');

    expect(response.status).toBe(404);
    expect(response.body).toMatchSchema({
      type: 'object',
      properties: {
        error: { type: 'string' },
        code: { type: 'string' }
      },
      required: ['error']
    });
  });
});
```

---

## ⚡ **TESTES DE PERFORMANCE** {#testes-performance}

### **1. Load Testing com Artillery**
```yaml
# tests/performance/load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 20
      name: "Load test"
    - duration: 60
      arrivalRate: 50
      name: "Stress test"
  processor: "./auth-processor.js"

scenarios:
  - name: "Marketplace browsing"
    weight: 70
    flow:
      - function: "authenticate"
      - get:
          url: "/api/marketplace"
          headers:
            Authorization: "Bearer {{ token }}"
      - think: 2
      - get:
          url: "/api/marketplace/{{ $randomString() }}"
          headers:
            Authorization: "Bearer {{ token }}"

  - name: "Making offers"
    weight: 30
    flow:
      - function: "authenticate"
      - post:
          url: "/api/marketplace/offers"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            creditTitleId: "{{ $randomString() }}"
            amount: "{{ $randomInt(10000, 100000) }}"
```

### **2. Memory Leak Detection**
```typescript
// tests/performance/memory-leak.test.ts
import { performance, PerformanceObserver } from 'perf_hooks';

describe('Memory Leak Tests', () => {
  it('should not leak memory during marketplace operations', async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Simular 1000 operações de marketplace
    for (let i = 0; i < 1000; i++) {
      await MarketplaceService.listItems({ page: 1, limit: 10 });
      
      // Forçar garbage collection a cada 100 iterações
      if (i % 100 === 0 && global.gc) {
        global.gc();
      }
    }
    
    // Aguardar e medir memória final
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (global.gc) global.gc();
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (< 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });
});
```

---

## 🔒 **TESTES DE SEGURANÇA** {#testes-segurança}

### **1. Security Testing**
```typescript
// tests/security/auth.security.test.ts
import request from 'supertest';
import { app } from '@/app';

describe('Security Tests', () => {
  describe('Authentication Security', () => {
    it('should prevent brute force attacks', async () => {
      const attempts = Array.from({ length: 10 }, () =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrong-password'
          })
      );

      const responses = await Promise.all(attempts);
      
      // Últimas tentativas devem ser bloqueadas
      expect(responses[9].status).toBe(429);
      expect(responses[9].body.error).toContain('Too many attempts');
    });

    it('should prevent SQL injection in search', async () => {
      const maliciousQuery = "'; DROP TABLE users; --";
      
      const response = await request(app)
        .get('/api/marketplace')
        .query({ search: maliciousQuery });

      expect(response.status).not.toBe(500);
      // Sistema deve sanitizar e retornar resultados vazios ou erro controlado
      expect(response.status).toBeOneOf([200, 400]);
    });

    it('should prevent XSS in form inputs', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      
      const response = await request(app)
        .post('/api/marketplace/offers')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          creditTitleId: 'tc_123',
          amount: 1000,
          message: xssPayload
        });

      // Verificar se payload foi sanitizado
      if (response.status === 201) {
        expect(response.body.data.message).not.toContain('<script>');
      }
    });
  });

  describe('Authorization Security', () => {
    it('should prevent privilege escalation', async () => {
      const userToken = await generateTestToken({ role: 'USER' });
      
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Insufficient permissions');
    });

    it('should validate JWT tokens properly', async () => {
      const invalidToken = 'invalid.jwt.token';
      
      const response = await request(app)
        .get('/api/marketplace')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
    });
  });
});
```

### **2. OWASP Security Tests**
```typescript
// tests/security/owasp.test.ts
describe('OWASP Top 10 Security Tests', () => {
  it('A01: Broken Access Control', async () => {
    // Testar acesso direto a recursos sem autorização
    const response = await request(app)
      .get('/api/admin/sensitive-data');
    
    expect(response.status).toBe(401);
  });

  it('A02: Cryptographic Failures', async () => {
    // Verificar se dados sensíveis estão criptografados
    const user = await prisma.user.findFirst();
    expect(user?.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash
  });

  it('A03: Injection', async () => {
    // Testar SQL injection, NoSQL injection, etc.
    const maliciousInput = "1' OR '1'='1";
    const response = await request(app)
      .get(`/api/credit-titles/${maliciousInput}`);
    
    expect(response.status).toBeOneOf([400, 404]);
  });
});
```

---

## 📊 **COVERAGE E REPORTING** {#coverage-reporting}

### **1. Coverage Configuration**
```json
{
  "jest": {
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html", "json"],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

### **2. Coverage Scripts**
```bash
#!/bin/bash
# scripts/test-coverage.sh

echo "🧪 Running comprehensive test suite with coverage..."

# Run unit tests
npm run test:unit -- --coverage

# Run integration tests
npm run test:integration -- --coverage

# Merge coverage reports
npm run coverage:merge

# Generate badges
npm run coverage:badges

# Check coverage thresholds
npm run coverage:check

echo "📊 Coverage report generated at: coverage/lcov-report/index.html"
```

### **3. Test Reports**
```typescript
// scripts/generate-test-report.ts
import { generateReport } from 'jest-html-reporters';

async function generateTestReport() {
  const report = await generateReport({
    pageTitle: 'Tributa.AI Test Report',
    outputPath: './reports/test-report.html',
    includeFailureMsg: true,
    includeSuiteFailure: true
  });

  console.log('Test report generated:', report);
}

generateTestReport();
```

---

## 🔄 **CI/CD INTEGRATION** {#cicd-integration}

### **1. GitHub Actions Test Pipeline**
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: tributa_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run unit tests
      run: npm run test:unit -- --coverage

    - name: Run integration tests
      run: npm run test:integration

    - name: Run E2E tests
      run: |
        npm run build
        npm run start &
        npx playwright test
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: |
          coverage/
          playwright-report/
          test-results/
```

### **2. Pre-commit Hooks**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run test:quick",
      "pre-push": "npm run test:unit && npm run test:integration"
    }
  },
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix",
      "jest --findRelatedTests --passWithNoTests"
    ]
  }
}
```

---

## 🏆 **BEST PRACTICES** {#best-practices}

### **1. Nomenclatura de Testes**
```typescript
// ✅ Bom
describe('CreditTitle Component', () => {
  it('should display title information when data is provided', () => {});
  it('should show loading state while fetching data', () => {});
  it('should handle API errors gracefully', () => {});
});

// ❌ Ruim
describe('Test', () => {
  it('test1', () => {});
  it('test2', () => {});
});
```

### **2. Arrange-Act-Assert (AAA)**
```typescript
it('should calculate total value correctly', () => {
  // Arrange
  const creditTitle = { value: 1000, fees: 50 };
  const quantity = 2;
  
  // Act
  const total = calculateTotal(creditTitle, quantity);
  
  // Assert
  expect(total).toBe(2100);
});
```

### **3. Mock Strategy**
```typescript
// Usar mocks específicos para cada teste
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock apenas o necessário
jest.mock('@/services/api', () => ({
  ...jest.requireActual('@/services/api'),
  post: jest.fn()
}));
```

### **4. Test Data Builders**
```typescript
// test/builders/CreditTitleBuilder.ts
export class CreditTitleBuilder {
  private creditTitle = {
    id: 'tc_123',
    category: 'TRIBUTARIO',
    value: 10000,
    status: 'ACTIVE'
  };

  withValue(value: number) {
    this.creditTitle.value = value;
    return this;
  }

  withStatus(status: string) {
    this.creditTitle.status = status;
    return this;
  }

  build() {
    return { ...this.creditTitle };
  }
}

// Uso nos testes
const creditTitle = new CreditTitleBuilder()
  .withValue(25000)
  .withStatus('TOKENIZED')
  .build();
```

---

## 🔧 **TROUBLESHOOTING** {#troubleshooting}

### **Problemas Comuns:**

#### **🚫 Testes lentos**
```bash
# Identificar testes lentos
npm test -- --verbose --detectSlowTests

# Rodar em paralelo
npm test -- --maxWorkers=4

# Usar cache
npm test -- --cache
```

#### **💾 Memory issues**
```bash
# Aumentar heap size
NODE_OPTIONS="--max_old_space_size=4096" npm test

# Limpar cache
npm test -- --clearCache
```

#### **🔄 Flaky tests**
```typescript
// Usar retry para testes instáveis
jest.retryTimes(3);

// Aguardar elementos de forma robusta
await waitFor(() => {
  expect(screen.getByText('Loading...')).not.toBeInTheDocument();
}, { timeout: 5000 });
```

---

## 📞 **COMANDOS ÚTEIS**

```bash
# Executar todos os testes
npm test

# Testes por tipo
npm run test:unit
npm run test:integration
npm run test:e2e

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Específico
npm test -- CreditTitle.test.tsx

# Debug
npm run test:debug

# Performance
npm run test:performance
```

---

**📌 Este guia é atualizado constantemente. Versão atual: 1.0 (Janeiro 2025)**