#!/usr/bin/env node

/**
 * 🏥 MONITOR DE SAÚDE DA PLATAFORMA - SCRIPT CLI
 * 
 * Script para monitorar o status da plataforma via linha de comando.
 * Útil para scripts de deploy, CI/CD e monitoramento externo.
 */

const https = require('https');
const http = require('http');

// Configurações
const CONFIG = {
  baseUrl: process.env.PLATFORM_URL || 'http://localhost:3000',
  timeout: 10000,
  retries: 3
};

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Faz requisição HTTP
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const timeout = setTimeout(() => {
      reject(new Error('Timeout'));
    }, CONFIG.timeout);

    const req = client.get(url, options, (res) => {
      clearTimeout(timeout);
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

/**
 * Verifica status da plataforma
 */
async function checkPlatformHealth() {
  try {
    console.log(`${colors.blue}🔍 Verificando saúde da plataforma...${colors.reset}`);
    console.log(`${colors.cyan}URL: ${CONFIG.baseUrl}/api/system/health${colors.reset}\n`);
    
    const response = await makeRequest(`${CONFIG.baseUrl}/api/system/health`);
    
    if (response.status === 200) {
      const data = response.data;
      
      console.log(`${colors.green}✅ PLATAFORMA SAUDÁVEL${colors.reset}`);
      console.log(`${colors.white}Status Geral: ${colors.green}${data.status.toUpperCase()}${colors.reset}`);
      console.log(`${colors.white}Uptime: ${colors.green}${data.uptime.toFixed(1)}%${colors.reset}`);
      console.log(`${colors.white}Timestamp: ${colors.cyan}${data.timestamp}${colors.reset}\n`);
      
      // Componentes
      console.log(`${colors.blue}📊 COMPONENTES (${data.components.length})${colors.reset}`);
      data.components.forEach(component => {
        const statusColor = component.status === 'healthy' ? colors.green : 
                           component.status === 'warning' ? colors.yellow : colors.red;
        console.log(`  ${statusColor}●${colors.reset} ${component.name}: ${statusColor}${component.status.toUpperCase()}${colors.reset} (${component.metrics.uptime}% uptime)`);
      });
      
      // Integrações
      console.log(`\n${colors.blue}🔗 INTEGRAÇÕES (${data.integrations.length})${colors.reset}`);
      data.integrations.forEach(integration => {
        const statusColor = integration.status === 'connected' ? colors.green : 
                           integration.status === 'syncing' ? colors.yellow : colors.red;
        console.log(`  ${statusColor}●${colors.reset} ${integration.name}: ${statusColor}${integration.status.toUpperCase()}${colors.reset}`);
      });
      
      // Alertas
      if (data.alerts && data.alerts.length > 0) {
        console.log(`\n${colors.yellow}🚨 ALERTAS ATIVOS (${data.alerts.length})${colors.reset}`);
        data.alerts.slice(0, 5).forEach(alert => {
          const severityColor = alert.severity === 'critical' ? colors.red : 
                                alert.severity === 'high' ? colors.yellow : colors.blue;
          console.log(`  ${severityColor}●${colors.reset} ${alert.component}: ${alert.message}`);
        });
      }
      
      // Métricas
      console.log(`\n${colors.blue}📈 MÉTRICAS${colors.reset}`);
      console.log(`  Tempo Resposta Médio: ${colors.cyan}${Math.round(data.metrics.averageResponseTime)}ms${colors.reset}`);
      console.log(`  Total Requisições: ${colors.cyan}${data.metrics.totalRequests.toLocaleString()}${colors.reset}`);
      console.log(`  Taxa de Erro: ${colors.cyan}${data.metrics.errorRate.toFixed(2)}%${colors.reset}`);
      
    } else if (response.status === 206) {
      console.log(`${colors.yellow}⚠️  PLATAFORMA COM AVISOS${colors.reset}`);
      console.log(`${colors.white}Status: ${colors.yellow}${response.data.status.toUpperCase()}${colors.reset}`);
      if (response.data.alerts) {
        console.log(`${colors.white}Alertas Ativos: ${colors.yellow}${response.data.alerts.length}${colors.reset}`);
      }
    } else {
      console.log(`${colors.red}❌ PLATAFORMA COM PROBLEMAS${colors.reset}`);
      console.log(`${colors.white}Status HTTP: ${colors.red}${response.status}${colors.reset}`);
      if (response.data.status) {
        console.log(`${colors.white}Status: ${colors.red}${response.data.status.toUpperCase()}${colors.reset}`);
      }
    }
    
    return response.status;
    
  } catch (error) {
    console.log(`${colors.red}❌ ERRO NA VERIFICAÇÃO${colors.reset}`);
    console.log(`${colors.white}Erro: ${colors.red}${error.message}${colors.reset}`);
    return 500;
  }
}

/**
 * Executa ação no sistema
 */
async function executeAction(action) {
  try {
    console.log(`${colors.blue}🔄 Executando ação: ${action}${colors.reset}`);
    
    const response = await makeRequest(`${CONFIG.baseUrl}/api/system/health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action })
    });
    
    if (response.status === 200) {
      console.log(`${colors.green}✅ Ação executada com sucesso${colors.reset}`);
      console.log(`${colors.white}Resposta: ${colors.cyan}${response.data.message}${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Erro na execução${colors.reset}`);
      console.log(`${colors.white}Status: ${colors.red}${response.status}${colors.reset}`);
    }
    
  } catch (error) {
    console.log(`${colors.red}❌ ERRO NA EXECUÇÃO${colors.reset}`);
    console.log(`${colors.white}Erro: ${colors.red}${error.message}${colors.reset}`);
  }
}

/**
 * Monitoramento contínuo
 */
async function continuousMonitoring(interval = 30000) {
  console.log(`${colors.blue}🔄 Iniciando monitoramento contínuo (${interval/1000}s)${colors.reset}`);
  console.log(`${colors.white}Pressione Ctrl+C para parar${colors.reset}\n`);
  
  const monitor = async () => {
    console.log(`${colors.cyan}[${new Date().toLocaleTimeString()}]${colors.reset}`);
    await checkPlatformHealth();
    console.log(`${colors.white}${'='.repeat(60)}${colors.reset}\n`);
  };
  
  await monitor();
  const intervalId = setInterval(monitor, interval);
  
  process.on('SIGINT', () => {
    clearInterval(intervalId);
    console.log(`\n${colors.blue}🛑 Monitoramento interrompido${colors.reset}`);
    process.exit(0);
  });
}

/**
 * Mostra ajuda
 */
function showHelp() {
  console.log(`${colors.blue}🏥 MONITOR DE SAÚDE DA PLATAFORMA${colors.reset}\n`);
  console.log(`${colors.white}Uso: node platform-health-monitor.js [comando] [opções]${colors.reset}\n`);
  console.log(`${colors.cyan}Comandos:${colors.reset}`);
  console.log(`  check          Verifica status da plataforma`);
  console.log(`  monitor        Monitoramento contínuo`);
  console.log(`  sync           Força sincronização de integrações`);
  console.log(`  restart        Reinicia componentes`);
  console.log(`  help           Mostra esta ajuda\n`);
  console.log(`${colors.cyan}Variáveis de ambiente:${colors.reset}`);
  console.log(`  PLATFORM_URL   URL da plataforma (padrão: http://localhost:3000)`);
}

// Execução principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';
  
  console.log(`${colors.blue}🏥 TRIBUTA.AI - Monitor de Saúde da Plataforma${colors.reset}\n`);
  
  switch (command) {
    case 'check':
      const status = await checkPlatformHealth();
      process.exit(status === 200 ? 0 : 1);
      break;
      
    case 'monitor':
      await continuousMonitoring();
      break;
      
    case 'sync':
      await executeAction('sync_all');
      break;
      
    case 'restart':
      await executeAction('restart_all');
      break;
      
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
      
    default:
      console.log(`${colors.red}❌ Comando não reconhecido: ${command}${colors.reset}`);
      showHelp();
      process.exit(1);
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error(`${colors.red}❌ Erro fatal:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = {
  checkPlatformHealth,
  executeAction,
  continuousMonitoring
}; 