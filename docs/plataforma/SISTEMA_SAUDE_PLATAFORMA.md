# 🏥 SISTEMA DE SAÚDE DA PLATAFORMA - TRIBUTA.AI

## 📋 Visão Geral

O **Sistema de Saúde da Plataforma** é um sistema completo de monitoramento e integração que mantém todas as funcionalidades da plataforma Tributa.AI funcionando automaticamente. Este sistema monitora continuamente todos os componentes, integra APIs externas e garante que a plataforma permaneça "viva" e operacional.

## 🎯 Objetivo Principal

Criar um sistema que:
- **Monitora** todos os componentes da plataforma em tempo real
- **Integra** automaticamente todas as funcionalidades 
- **Mantém** o sistema funcionando sem intervenção manual
- **Alerta** sobre problemas antes que afetem os usuários
- **Recupera** automaticamente de falhas quando possível

## 🏗️ Arquitetura do Sistema

### Componentes Principais

#### 1. **Serviço de Saúde da Plataforma** (`platform-health.service.ts`)
- Monitoramento contínuo de todos os componentes
- Auto-recuperação de falhas
- Sincronização automática de integrações
- Geração de alertas inteligentes
- Coleta de métricas de performance

#### 2. **Dashboard de Saúde** (`SystemHealthPage.tsx`)
- Interface visual para monitoramento
- Controles de administração
- Visualização de métricas em tempo real
- Gerenciamento de alertas
- Ações de manutenção

#### 3. **Componentes Monitorados**
- **Servidor Principal**: Status HTTP, CPU, memória
- **Base de Dados**: Conectividade, performance de queries
- **Sistema de Bots**: Bots ativos, transações por minuto
- **Marketplace**: Leilões, ofertas, transações
- **Blockchain**: Rede, transações pendentes, consenso
- **Sistema Fiscal**: Declarações, integrações governamentais

#### 4. **Integrações Externas**
- **API Receita Federal**: Sincronização a cada 5 minutos
- **Banco Central**: Dados econômicos a cada 10 minutos
- **Sistema de Pagamentos**: Verificação a cada 2 minutos
- **Hyperledger Fabric**: Monitoramento a cada 1 minuto
- **Notificações**: Verificação a cada 30 segundos
- **IA Assistant (ARIA)**: Monitoramento a cada 10 segundos

## 🔧 Funcionalidades Principais

### 1. **Monitoramento Contínuo**
```typescript
// Verificação automática a cada 30 segundos
- Status de todos os componentes
- Métricas de performance (CPU, memória, resposta)
- Conectividade de integrações
- Fluxo de dados em tempo real
```

### 2. **Auto-Recuperação**
```typescript
// Ações automáticas em caso de falhas
- Reinício de componentes com falha
- Reconexão de integrações perdidas
- Limpeza de recursos bloqueados
- Rebalanceamento de carga
```

### 3. **Alertas Inteligentes**
```typescript
// Sistema de alertas por severidade
- CRÍTICO: Falhas que afetam funcionalidades essenciais
- ALTO: Problemas que podem causar degradação
- MÉDIO: Avisos de performance ou conectividade
- BAIXO: Informações de manutenção
```

### 4. **Métricas de Performance**
```typescript
// KPIs monitorados continuamente
- Uptime médio da plataforma
- Tempo de resposta médio
- Taxa de erro por componente
- Throughput de transações
- Utilização de recursos
```

## 📊 Dashboard de Administração

### Acesso
- **URL**: `/dashboard/admin/system-health`
- **Sidebar**: Administração → Sistema de Saúde
- **Permissão**: Apenas administradores

### Seções do Dashboard

#### 1. **Status Geral**
- Indicador visual do status geral da plataforma
- Contadores de componentes ativos/inativos
- Número de integrações conectadas
- Alertas ativos e não resolvidos

#### 2. **Métricas de Performance**
- Uptime médio de todos os componentes
- Tempo de resposta médio
- Total de requisições processadas
- Taxa de erro da plataforma

#### 3. **Status dos Componentes**
- Lista detalhada de todos os componentes
- Status individual com códigos de cor
- Métricas específicas (CPU, memória, requisições)
- Botões de ação (reiniciar, verificar)

#### 4. **Integrações e Conectividade**
- Status de todas as integrações externas
- Última sincronização de cada API
- Fluxo de dados e contadores de erro
- Botões de sincronização forçada

#### 5. **Alertas Recentes**
- Lista cronológica de alertas
- Classificação por severidade
- Status de resolução
- Timestamps detalhados

### Controles de Administração

#### Botões de Ação
- **🔄 Sincronizar Tudo**: Força sincronização de todas as integrações
- **⚡ Reiniciar Componentes**: Reinicia componentes com auto-restart
- **🔍 Atualizar**: Atualiza dados do dashboard
- **⏸️/▶️ Pausar/Iniciar**: Controla o monitoramento automático

## 🔄 Fluxo de Monitoramento

### Ciclo de Verificação (30 segundos)
1. **Verificação de Saúde**: Executa health check em todos os componentes
2. **Atualização de Métricas**: Coleta e atualiza métricas de performance
3. **Verificação de Integrações**: Testa conectividade com APIs externas
4. **Geração de Alertas**: Cria alertas para problemas detectados
5. **Auto-Recuperação**: Executa ações automáticas quando necessário
6. **Limpeza**: Remove alertas antigos e dados obsoletos

### Sincronização de Integrações
- **Receita Federal**: A cada 5 minutos
- **Banco Central**: A cada 10 minutos
- **Pagamentos**: A cada 2 minutos
- **Blockchain**: A cada 1 minuto
- **Notificações**: A cada 30 segundos
- **ARIA**: A cada 10 segundos

## 🚨 Sistema de Alertas

### Tipos de Alertas
- **ERROR**: Falhas críticas que requerem ação imediata
- **WARNING**: Problemas que podem afetar performance
- **INFO**: Informações de status e manutenção

### Severidade
- **CRÍTICO**: Componentes essenciais fora do ar
- **ALTO**: Degradação significativa de performance
- **MÉDIO**: Problemas menores ou avisos
- **BAIXO**: Informações de manutenção

### Ações Automáticas
- **Auto-restart**: Componentes com falha são reiniciados automaticamente
- **Reconexão**: Integrações perdidas são reconectadas
- **Escalação**: Alertas críticos são escalados após tempo limite
- **Notificação**: Administradores são notificados sobre problemas

## 📈 Métricas e KPIs

### Métricas de Sistema
- **Uptime**: Percentual de tempo que cada componente está ativo
- **Tempo de Resposta**: Latência média das requisições
- **CPU/Memória**: Utilização de recursos por componente
- **Throughput**: Número de transações por minuto

### Métricas de Integração
- **Conectividade**: Status de conexão com APIs externas
- **Fluxo de Dados**: Volume de dados sincronizados
- **Taxa de Erro**: Percentual de falhas nas integrações
- **Latência**: Tempo de resposta das APIs externas

### Métricas de Negócio
- **Transações**: Volume de negociações no marketplace
- **Usuários Ativos**: Número de usuários conectados
- **Declarações**: Quantidade de declarações fiscais processadas
- **Bots Ativos**: Número de bots em operação

## 🛠️ Configuração e Uso

### Instalação
O sistema é inicializado automaticamente quando a aplicação é iniciada:

```typescript
// Instância singleton do serviço
import platformHealthService from '@/services/platform-health.service';

// Inicia automaticamente no construtor
const service = new PlatformHealthService();
```

### Configuração
```typescript
// Intervalos de monitoramento (em millisegundos)
healthCheckInterval: 30000,     // 30 segundos
syncInterval: {
  receitaFederal: 300000,      // 5 minutos
  bancoCentral: 600000,        // 10 minutos
  pagamentos: 120000,          // 2 minutos
  blockchain: 60000,           // 1 minuto
  notificacoes: 30000,         // 30 segundos
  aria: 10000                  // 10 segundos
}
```

### APIs Disponíveis
```typescript
// Consulta status geral
platformHealthService.getPlatformStatus()

// Obtém componentes
platformHealthService.getComponents()

// Obtém integrações
platformHealthService.getIntegrations()

// Obtém alertas
platformHealthService.getAlerts(limit)

// Métricas de performance
platformHealthService.getPerformanceMetrics()

// Ações de manutenção
platformHealthService.forceSyncAll()
platformHealthService.restartAll()
```

## 🔐 Segurança e Permissões

### Controle de Acesso
- **Administradores**: Acesso completo ao dashboard e controles
- **Usuários**: Sem acesso ao sistema de saúde
- **APIs**: Autenticação para endpoints sensíveis

### Logs de Auditoria
- Todas as ações administrativas são registradas
- Histórico de reinicializações e manutenções
- Logs de acesso ao dashboard de saúde

## 🚀 Benefícios do Sistema

### Para Administradores
- **Visibilidade Total**: Visão completa do status da plataforma
- **Proatividade**: Problemas detectados antes de afetar usuários
- **Automação**: Redução de intervenções manuais
- **Controle**: Ferramentas para ações corretivas imediatas

### Para Usuários
- **Disponibilidade**: Plataforma sempre disponível
- **Performance**: Melhor experiência de uso
- **Confiabilidade**: Menor chance de falhas
- **Transparência**: Status da plataforma sempre atualizado

### Para o Negócio
- **Uptime**: Maximização do tempo de operação
- **Eficiência**: Redução de custos operacionais
- **Escalabilidade**: Fácil identificação de gargalos
- **Compliance**: Monitoramento de SLAs e métricas

## 📋 Roadmap e Melhorias

### Próximas Funcionalidades
- **Machine Learning**: Predição de falhas baseada em padrões
- **Notificações Push**: Alertas em tempo real para mobile
- **Relatórios Automáticos**: Relatórios de saúde periódicos
- **Integração com Slack**: Notificações em canais específicos

### Melhorias Planejadas
- **Dashboard Móvel**: Versão otimizada para dispositivos móveis
- **Histórico Avançado**: Análise de tendências e padrões
- **Testes Automatizados**: Testes de stress e carga
- **Backup Automático**: Backup de configurações e dados

## 🎯 Conclusão

O **Sistema de Saúde da Plataforma** é uma solução completa que garante a operação contínua e confiável da plataforma Tributa.AI. Com monitoramento em tempo real, auto-recuperação e alertas inteligentes, o sistema mantém a plataforma "viva" e operacional 24/7, proporcionando a melhor experiência possível para usuários e administradores.

---

**Desenvolvido para Tributa.AI** - Sistema de Saúde da Plataforma  
**Versão**: 1.0.0  
**Última Atualização**: Julho 2024 