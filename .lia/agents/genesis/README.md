# 🚀 GENESIS LIA - Agente Autoprogramador

## 📋 Visão Geral

O **GENESIS** é um agente autoprogramador autônomo que opera em background no projeto **TRIBUTA.AI**. Ele executa tarefas de desenvolvimento, correção de erros, otimização e manutenção de código 24/7.

### 🎯 Principais Funcionalidades

- ✅ **Correção automática de erros** TypeScript/ESLint
- ⚡ **Otimização de performance** e bundle size
- 🎨 **Correção de problemas** de CSS/Tailwind
- 🧹 **Limpeza de código** e arquivos desnecessários
- 📊 **Monitoramento contínuo** da saúde do sistema
- 🔄 **Processamento de tarefas** em fila
- 💾 **Backup automático** antes de modificações

## 🚀 Início Rápido

### Método 1: Scripts Batch (Mais Fácil)

1. **Iniciar Genesis:**
   ```batch
   start-genesis.bat
   ```

2. **Verificar Status:**
   ```batch
   start-genesis-status.bat
   ```

3. **Ver Logs:**
   ```batch
   start-genesis-logs.bat
   ```

4. **Parar Genesis:**
   ```batch
   start-genesis-stop.bat
   ```

### Método 2: PowerShell Direto

```powershell
# Iniciar em background
.\.lia\cloud\genesis\genesis-control.ps1 -Action start -Detached

# Verificar status
.\.lia\cloud\genesis\genesis-control.ps1 -Action status

# Ver logs
.\.lia\cloud\genesis\genesis-control.ps1 -Action logs

# Verificar saúde
.\.lia\cloud\genesis\genesis-control.ps1 -Action health

# Parar serviço
.\.lia\cloud\genesis\genesis-control.ps1 -Action stop
```

### Método 3: Node.js Direto

```bash
# Iniciar
node .lia/cloud/genesis/start-genesis-background.js start

# Parar
node .lia/cloud/genesis/start-genesis-background.js stop
```

## 📊 Monitoramento

### Status em Tempo Real

O Genesis mantém arquivos de status que são atualizados continuamente:

- **📊 Status Geral:** `.lia/cloud/genesis/status/background-service.json`
- **🏥 Saúde do Sistema:** `.lia/cloud/genesis/status/health.json`
- **📝 Logs:** `.lia/cloud/genesis/logs/background-service.log`
- **🆔 PID:** `.lia/cloud/genesis/status/service.pid`

### Métricas Disponíveis

- **Uptime** do serviço
- **Uso de memória** e CPU
- **Número de tarefas** processadas
- **Taxa de sucesso** das operações
- **Status de saúde** dos componentes

## 🎯 Sistema de Tarefas

### Tarefas Automáticas

O Genesis executa automaticamente:

- **A cada 10 minutos:** Verificação de erros TypeScript
- **A cada 30 minutos:** Otimização de performance
- **A cada hora:** Correção de problemas de estilo

### Adicionar Tarefas Manualmente

```javascript
// Exemplo de como adicionar tarefas via script
const { GenesisBackgroundService } = require('./.lia/cloud/genesis/start-genesis-background.js');

const service = new GenesisBackgroundService();

// Adicionar tarefa de correção de erros
await service.addErrorCorrectionTask('Corrigir erros TypeScript no componente X');

// Adicionar tarefa de otimização
await service.addOptimizationTask('Otimizar bundle size');

// Adicionar tarefa de geração de código
await service.addCodeGenerationTask('Gerar componente Y');
```

### Tipos de Tarefas Suportadas

1. **error_correction** - Correção de erros
2. **performance_optimization** - Otimização de performance
3. **code_generation** - Geração de código
4. **style_fix** - Correção de estilos
5. **file_cleanup** - Limpeza de arquivos

## ⚙️ Configuração

### Arquivo Principal: `.lia/cloud/genesis/config/genesis-config.json`

```json
{
  "genesis": {
    "mode": "autonomous",
    "execution": {
      "enabled": true,
      "interval_seconds": 300,
      "max_concurrent_tasks": 3
    },
    "capabilities": [
      "error_correction",
      "performance_optimization",
      "code_generation"
    ],
    "monitoring": {
      "health_check_interval": 30,
      "log_rotation": true
    }
  }
}
```

### Personalização

Edite o arquivo de configuração para:

- Alterar **intervalos** de execução
- Habilitar/desabilitar **capacidades**
- Configurar **limites** de recursos
- Ajustar **monitoramento**

## 🔧 Integração com Cursor

### Executar via Terminal do Cursor

1. Abra o terminal no Cursor (`Ctrl+``)
2. Execute: `start-genesis.bat`
3. O Genesis rodará em background
4. Continue desenvolvendo normalmente

### Executar via Task do Cursor

Adicione ao `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Genesis LIA",
      "type": "shell",
      "command": "start-genesis.bat",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Genesis Status",
      "type": "shell", 
      "command": "start-genesis-status.bat",
      "group": "test"
    }
  ]
}
```

## 🛡️ Segurança e Limitações

### Restrições de Segurança

- ❌ Não deleta arquivos fora de diretórios temporários
- ❌ Não faz chamadas de rede externas
- ❌ Não modifica configurações do sistema
- ✅ Sempre faz backup antes de modificações importantes

### Limites de Recursos

- **Memória:** Máximo 512MB
- **CPU:** Máximo 50% de uso
- **Disco:** Máximo 100MB para logs/backups
- **Tarefas:** Máximo 3 simultâneas

## 🚨 Solução de Problemas

### Genesis não inicia

1. **Verificar Node.js:**
   ```bash
   node --version
   ```

2. **Verificar dependências:**
   ```bash
   npm install
   ```

3. **Verificar permissões PowerShell:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Genesis não processa tarefas

1. **Verificar arquivo de configuração:**
   - Arquivo: `.lia/cloud/genesis/config/genesis-config.json`
   - Verificar se `execution.enabled` está `true`

2. **Verificar logs:**
   ```batch
   start-genesis-logs.bat
   ```

3. **Verificar saúde:**
   ```powershell
   .\.lia\cloud\genesis\genesis-control.ps1 -Action health
   ```

### Alto uso de recursos

1. **Ajustar limites** no arquivo de configuração
2. **Reduzir frequência** de execução
3. **Desabilitar tarefas** menos críticas

## 📈 Métricas de Performance

### Objetivos do Sistema

- **Bundle Size:** < 500KB
- **Initial Load:** < 2 segundos
- **Type Coverage:** > 95%
- **Zero Duplicação** de código
- **Arquitetura Bloomberg-level**

### Monitoramento Contínuo

O Genesis monitora e otimiza automaticamente:

- ✅ Tamanho do bundle
- ✅ Tempo de build
- ✅ Erros TypeScript
- ✅ Qualidade do código
- ✅ Performance runtime

## 🔗 Integração com LIA

O Genesis é coordenado pelo sistema **LIA (Learning Intelligence Assistant)**:

- **LIA** define prioridades e estratégias
- **GENESIS** executa tarefas autonomamente
- **Comunicação** via arquivos de estado
- **Sincronização** automática

### Agentes LIA Relacionados

- **NEXUS** - Coordenador CTO-AI
- **EXECUTOR** - Desenvolvedor Frontend
- **HELIOS** - Engenheiro de Segurança
- **ATLAS** - Designer UI/UX
- **THANOS** - Otimizador de Código
- **GENESIS** - Autoprogramador (este)

## 📚 Logs e Debugging

### Níveis de Log

- **INFO** - Operações normais
- **WARN** - Situações de atenção
- **ERROR** - Erros que requerem intervenção
- **FATAL** - Erros críticos que param o serviço

### Debugging Avançado

```powershell
# Logs detalhados
.\.lia\cloud\genesis\genesis-control.ps1 -Action logs -Verbose

# Status completo
.\.lia\cloud\genesis\genesis-control.ps1 -Action health -Verbose
```

## 🎯 Roadmap

### Versão Atual (2.0.0)

- ✅ Execução em background
- ✅ Processamento de tarefas
- ✅ Monitoramento de saúde
- ✅ Integração com Cursor

### Próximas Versões

- 🔄 **2.1.0** - Integração Git automática
- 🔄 **2.2.0** - Machine Learning para otimizações
- 🔄 **2.3.0** - Interface web de monitoramento
- 🔄 **3.0.0** - Distribuição em múltiplas instâncias

---

## 📞 Suporte

Para problemas ou dúvidas:

1. **Verificar logs:** `start-genesis-logs.bat`
2. **Verificar saúde:** `start-genesis-status.bat`
3. **Consultar documentação** LIA em `.lia/docs/`
4. **Reportar issues** com logs completos

---

**🚀 GENESIS LIA - Desenvolvendo o futuro, autonomamente!**
