# 🎨 GUIA DE PADRONIZAÇÃO - TRIBUTA.AI

**Versão:** 1.0  
**Data:** Janeiro 2025  
**Status:** ✅ Oficial

---

## 📋 ÍNDICE

1. [Design System](#design-system)
2. [Componentes Padronizados](#componentes-padronizados)
3. [Padrões de Código](#padrões-de-código)
4. [Cores e Temas](#cores-e-temas)
5. [Tipografia](#tipografia)
6. [Espaçamento](#espaçamento)
7. [Ícones](#ícones)
8. [Formulários](#formulários)
9. [Tabelas e Listas](#tabelas-e-listas)
10. [Estados e Feedback](#estados-e-feedback)

---

## 🎨 DESIGN SYSTEM

### **Princípios de Design**

1. **Consistência** - Mesma experiência em toda plataforma
2. **Clareza** - Interface limpa e intuitiva
3. **Eficiência** - Fluxos otimizados
4. **Acessibilidade** - WCAG 2.1 AA
5. **Responsividade** - Mobile-first

### **Arquivos Base**
- `/src/styles/design-system.css` - Variáveis CSS globais
- `/src/styles/globals.css` - Estilos globais com Tailwind
- `/src/lib/utils.ts` - Utilitários (cn, formatters)

---

## 🧩 COMPONENTES PADRONIZADOS

### **1. Page Header**
```tsx
import { StandardizedPageHeader } from '@/components/ui/standardized-page-header'

<StandardizedPageHeader
  title="Título da Página"
  description="Descrição opcional"
  icon={<IconComponent />}
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Página Atual' }
  ]}
  actions={[
    {
      label: "Ação Principal",
      onClick: handleAction,
      icon: <Plus className="h-4 w-4" />
    }
  ]}
/>
```

### **2. Stat Cards**
```tsx
import { StandardizedStatCard } from '@/components/ui/standardized-stat-card'

<StandardizedStatCard
  title="Métrica"
  value="R$ 1.234"
  description="Descrição"
  icon={<DollarSign />}
  variant="primary" // default | primary | success | warning | error
  trend={{
    value: 12.5,
    isPositive: true
  }}
/>
```

### **3. Empty States**
```tsx
import { StandardizedEmptyState } from '@/components/ui/standardized-empty-state'

<StandardizedEmptyState
  icon={<FileText />}
  title="Nenhum item encontrado"
  description="Comece criando seu primeiro item"
  action={{
    label: "Criar Novo",
    onClick: handleCreate
  }}
/>
```

---

## 💻 PADRÕES DE CÓDIGO

### **Estrutura de Componentes**
```tsx
// 1. Imports organizados
import React from 'react'
import { ComponentesUI } from '@/components/ui'
import { utils } from '@/lib/utils'
import { icons } from 'lucide-react'

// 2. Interfaces/Types
interface ComponentProps {
  // Props tipadas
}

// 3. Componente principal
export function Component({ props }: ComponentProps) {
  // 4. Estados
  const [state, setState] = useState()
  
  // 5. Effects
  useEffect(() => {}, [])
  
  // 6. Handlers
  const handleAction = () => {}
  
  // 7. Render
  return (
    <div className="...">
      {/* Conteúdo */}
    </div>
  )
}
```

### **Nomenclatura**
- **Componentes:** PascalCase (`UserProfile.tsx`)
- **Funções:** camelCase (`getUserData()`)
- **Constantes:** UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Arquivos:** kebab-case (`user-profile.tsx`)
- **CSS Classes:** kebab-case (`header-title`)

---

## 🎨 CORES E TEMAS

### **Paleta Principal**
```css
/* Primary - Azul */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Success - Verde */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;

/* Warning - Amarelo */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error - Vermelho */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* Gray Scale */
--gray-50: #f9fafb;
--gray-500: #6b7280;
--gray-900: #111827;
```

### **Uso de Cores**
- **Primary:** Ações principais, links, foco
- **Success:** Confirmações, status positivo
- **Warning:** Alertas, atenção necessária
- **Error:** Erros, ações destrutivas
- **Gray:** Textos, bordas, backgrounds

---

## 📝 TIPOGRAFIA

### **Hierarquia de Títulos**
```css
.heading-1 { font-size: 2.25rem; font-weight: 700; } /* 36px */
.heading-2 { font-size: 1.875rem; font-weight: 700; } /* 30px */
.heading-3 { font-size: 1.5rem; font-weight: 600; }   /* 24px */
.heading-4 { font-size: 1.25rem; font-weight: 600; }  /* 20px */
```

### **Corpo de Texto**
```css
.body-large { font-size: 1.125rem; }  /* 18px */
.body-base { font-size: 1rem; }       /* 16px */
.body-small { font-size: 0.875rem; }  /* 14px */
.caption { font-size: 0.75rem; }      /* 12px */
```

### **Uso Recomendado**
- **Títulos de Página:** `heading-1` ou `text-3xl font-bold`
- **Seções:** `heading-2` ou `text-2xl font-bold`
- **Cards:** `heading-3` ou `text-xl font-semibold`
- **Labels:** `body-small` ou `text-sm`
- **Helpers:** `caption` ou `text-xs`

---

## 📏 ESPAÇAMENTO

### **Sistema de Espaçamento**
```css
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
```

### **Tailwind Classes**
- **Padding:** `p-2` (8px), `p-4` (16px), `p-6` (24px)
- **Margin:** `m-2`, `m-4`, `m-6`
- **Gap:** `gap-2`, `gap-4`, `gap-6`
- **Space:** `space-x-4`, `space-y-4`

---

## 🎯 ÍCONES

### **Biblioteca Principal**
```tsx
import { Icon } from 'lucide-react'
```

### **Tamanhos Padrão**
- **Small:** `h-4 w-4` (16px)
- **Medium:** `h-5 w-5` (20px)
- **Large:** `h-6 w-6` (24px)
- **XL:** `h-8 w-8` (32px)

### **Uso em Botões**
```tsx
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Adicionar
</Button>
```

---

## 📋 FORMULÁRIOS

### **Estrutura de Formulário**
```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="campo">Label do Campo</Label>
    <Input 
      id="campo"
      type="text"
      placeholder="Placeholder..."
      value={value}
      onChange={handleChange}
    />
    <p className="text-sm text-muted-foreground">
      Texto de ajuda
    </p>
  </div>
  
  <Button type="submit">
    Enviar
  </Button>
</form>
```

### **Validação Visual**
- **Normal:** Border gray-300
- **Foco:** Border primary-500 + shadow
- **Erro:** Border error-500
- **Sucesso:** Border success-500

---

## 📊 TABELAS E LISTAS

### **Tabela Padrão**
```tsx
<div className="rounded-lg border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Coluna 1</TableHead>
        <TableHead>Coluna 2</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Dado 1</TableCell>
        <TableCell>Dado 2</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```

### **Lista de Cards**
```tsx
<div className="space-y-4">
  {items.map(item => (
    <Card key={item.id} className="p-4">
      {/* Conteúdo do card */}
    </Card>
  ))}
</div>
```

---

## 🔄 ESTADOS E FEEDBACK

### **Loading States**
```tsx
// Spinner simples
<div className="flex items-center justify-center p-8">
  <Loader2 className="h-8 w-8 animate-spin" />
</div>

// Skeleton
<div className="space-y-4">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

### **Toasts/Notificações**
```tsx
import { toast } from 'sonner'

// Sucesso
toast.success('Ação realizada com sucesso!')

// Erro
toast.error('Erro ao processar')

// Info
toast.info('Informação importante')

// Loading
toast.loading('Processando...')
```

### **Estados Vazios**
```tsx
<StandardizedEmptyState
  icon={<Inbox />}
  title="Nada por aqui"
  description="Quando houver dados, eles aparecerão aqui"
/>
```

---

## 🎯 BOAS PRÁTICAS

### **1. Consistência Visual**
- Use sempre os componentes padronizados
- Mantenha espaçamentos consistentes
- Siga a paleta de cores definida
- Use os tamanhos de fonte corretos

### **2. Acessibilidade**
- Sempre use labels em formulários
- Adicione `alt` em imagens
- Use cores com contraste adequado
- Implemente navegação por teclado

### **3. Performance**
- Use lazy loading para imagens
- Implemente paginação em listas grandes
- Otimize re-renders com memo/callback
- Minimize bundle size

### **4. Responsividade**
- Mobile-first approach
- Use grid system do Tailwind
- Teste em diferentes tamanhos
- Considere touch targets móveis

---

## 📚 EXEMPLOS PRÁTICOS

### **Página Completa Padronizada**
```tsx
export default function ExamplePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <StandardizedPageHeader
        title="Minha Página"
        description="Descrição da funcionalidade"
        icon={<FileText />}
        actions={[
          {
            label: "Nova Ação",
            onClick: handleNew,
            icon: <Plus className="h-4 w-4" />
          }
        ]}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StandardizedStatCard
          title="Métrica 1"
          value="123"
          icon={<Activity />}
          trend={{ value: 12, isPositive: true }}
        />
        {/* Mais cards... */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seção Principal</CardTitle>
          <CardDescription>
            Descrição da seção
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Conteúdo */}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🚀 CHECKLIST DE PADRONIZAÇÃO

Antes de fazer commit, verifique:

- [ ] Usou componentes padronizados?
- [ ] Seguiu a paleta de cores?
- [ ] Manteve espaçamentos consistentes?
- [ ] Adicionou estados de loading/erro?
- [ ] Testou responsividade?
- [ ] Verificou acessibilidade?
- [ ] Código está tipado (TypeScript)?
- [ ] Seguiu nomenclaturas padrão?

---

**Última atualização:** Janeiro 2025  
**Mantido por:** Equipe de Desenvolvimento Tributa.AI