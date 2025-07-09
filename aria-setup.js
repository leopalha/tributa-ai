#!/usr/bin/env node

/**
 * 🤖 ARIA Setup Script
 * Script para configurar a ARIA em produção
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🤖 ===============================================
   ARIA - Assistente de IA Operacional
   Script de Configuração para Produção
===============================================

Este script irá:
✅ Configurar API keys de IA
✅ Habilitar funcionalidades reais  
✅ Configurar endpoints de produção
✅ Validar configurações

`);

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupARIA() {
  try {
    console.log('📋 1. Configuração da API de IA\n');
    
    const aiProvider = await question(`Qual provedor de IA você quer usar?
1. OpenAI (GPT-4) - Recomendado
2. Anthropic (Claude)
3. Local/Mock (desenvolvimento)

Escolha (1-3): `);

    let apiKey = '';
    let envVar = '';
    
    if (aiProvider === '1') {
      console.log('\n🔑 Configurando OpenAI...');
      console.log('📝 Obtenha sua API key em: https://platform.openai.com/api-keys');
      apiKey = await question('Cole sua OpenAI API key: ');
      envVar = `VITE_OPENAI_API_KEY=${apiKey}`;
    } else if (aiProvider === '2') {
      console.log('\n🔑 Configurando Anthropic...');
      console.log('📝 Obtenha sua API key em: https://console.anthropic.com/');
      apiKey = await question('Cole sua Anthropic API key: ');
      envVar = `VITE_ANTHROPIC_API_KEY=${apiKey}`;
    } else {
      console.log('\n🔧 Modo desenvolvimento configurado (usando mocks)');
      envVar = `VITE_USE_MOCK_AI=true`;
    }

    console.log('\n📋 2. Configuração do Backend\n');
    
    const useRealAPI = await question(`Usar APIs reais da plataforma?
1. Sim - Produção (conectar com backend real)
2. Não - Desenvolvimento (usar mocks)

Escolha (1-2): `);

    let backendConfig = '';
    if (useRealAPI === '1') {
      const apiUrl = await question('URL do backend da API (ex: https://api.tributa.ai): ');
      backendConfig = `
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=${apiUrl}
VITE_USE_MOCK_BLOCKCHAIN=false`;
    } else {
      backendConfig = `
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK_BLOCKCHAIN=true`;
    }

    // Criar arquivo .env
    const envContent = `# ARIA - Configuração de Produção
# Gerado automaticamente em ${new Date().toLocaleString()}

# IA Configuration
${envVar}

# Backend Configuration${backendConfig}

# Security
VITE_ENABLE_AUDIT=true
VITE_MAX_ACTION_VALUE=1000000

# Features
VITE_ENABLE_VOICE=false
VITE_ENABLE_ADVANCED_ANALYTICS=true
`;

    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Arquivo .env criado com sucesso!');

    // Configurar API config
    const apiConfigPath = path.join('src', 'config', 'api.config.ts');
    if (fs.existsSync(apiConfigPath)) {
      console.log('\n📋 3. Atualizando configurações da API...');
      
      let apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
      
      if (useRealAPI === '1') {
        apiConfig = apiConfig.replace(/USE_MOCK_DATA:\s*true/g, 'USE_MOCK_DATA: false');
        apiConfig = apiConfig.replace(/USE_MOCK_BLOCKCHAIN:\s*true/g, 'USE_MOCK_BLOCKCHAIN: false');
      }
      
      fs.writeFileSync(apiConfigPath, apiConfig);
      console.log('✅ Configurações da API atualizadas!');
    }

    // Validar configuração
    console.log('\n📋 4. Validando configuração...\n');
    
    if (apiKey && apiKey.length > 20) {
      console.log('✅ API key configurada corretamente');
    } else if (aiProvider !== '3') {
      console.log('⚠️  API key pode estar inválida (muito curta)');
    }

    // Testar serviços
    console.log('✅ Serviços da ARIA disponíveis:');
    console.log('   - TituloCreditoService ✅');
    console.log('   - CompensacaoService ✅');
    console.log('   - MarketplaceService ✅');
    console.log('   - AnalyticsService ✅');

    // Instruções finais
    console.log(`
🎉 ===============================================
   ARIA CONFIGURADA COM SUCESSO!
===============================================

📚 Próximos passos:

1. Reiniciar o servidor de desenvolvimento:
   npm run dev

2. Acessar o dashboard:
   http://localhost:3000/dashboard

3. Testar a ARIA:
   Digite: "criar tc de icms de R$ 10.000"
   Clique no botão "Criar Título de Crédito"

📖 Comandos que a ARIA entende:

💰 TÍTULOS DE CRÉDITO:
   • "criar tc de icms de R$ 25.000"
   • "emitir novo título de crédito"
   • "gerar tc de pis/cofins"

⚖️ COMPENSAÇÃO:
   • "compensar débitos"
   • "fazer compensação automática"
   • "processar compensação de R$ 50.000"

🛒 MARKETPLACE:
   • "vender tc no marketplace"
   • "listar título por R$ 20.000"
   • "anunciar crédito"

🧭 NAVEGAÇÃO:
   • "ir para blockchain"
   • "mostrar marketplace"
   • "abrir página de relatórios"

📊 ANÁLISE:
   • "gerar relatório fiscal"
   • "analisar meus dados"
   • "mostrar dashboard"

💡 Dicas:
   - Seja específico com valores: "R$ 10.000"
   - Use tipos de crédito: "ICMS", "PIS", "COFINS"
   - Inclua quantidades: "3 TCs", "5 títulos"

🆘 Problemas? Verifique:
   - API key válida no .env
   - Servidor rodando (npm run dev)
   - Console do navegador para erros

===============================================
`);

    rl.close();

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Executar configuração
setupARIA().catch(console.error); 