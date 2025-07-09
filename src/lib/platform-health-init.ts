/**
 * 🚀 INICIALIZADOR DO SISTEMA DE SAÚDE DA PLATAFORMA
 *
 * Este script inicializa automaticamente o sistema de saúde quando a aplicação é carregada.
 * Garante que o monitoramento esteja sempre ativo e funcionando.
 */

import platformHealthService from '@/services/platform-health.service';

// Flag para controlar se o sistema já foi inicializado
let isInitialized = false;

/**
 * Inicializa o sistema de saúde da plataforma
 */
export function initializePlatformHealth() {
  if (isInitialized) {
    console.log('🏥 Sistema de Saúde já inicializado');
    return;
  }

  try {
    console.log('🚀 Inicializando Sistema de Saúde da Plataforma...');

    // O serviço já inicia automaticamente no construtor
    // Aqui podemos adicionar configurações adicionais se necessário

    // Verifica se o serviço está funcionando
    const status = platformHealthService.getPlatformStatus();
    console.log('📊 Status inicial da plataforma:', status);

    // Registra eventos de inicialização
    console.log('✅ Sistema de Saúde inicializado com sucesso');
    console.log('🔍 Monitoramento contínuo ativado');
    console.log('🔄 Integrações automáticas configuradas');

    isInitialized = true;

    // Adiciona listener para cleanup quando a aplicação for fechada
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        console.log('🛑 Parando Sistema de Saúde...');
        platformHealthService.stopMonitoring();
      });
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Sistema de Saúde:', error);
    throw error;
  }
}

/**
 * Obtém o status do sistema de saúde
 */
export function getPlatformHealthStatus() {
  if (!isInitialized) {
    return {
      initialized: false,
      message: 'Sistema de Saúde não inicializado',
    };
  }

  return {
    initialized: true,
    status: platformHealthService.getPlatformStatus(),
    message: 'Sistema de Saúde funcionando normalmente',
  };
}

/**
 * Força a inicialização do sistema (útil para testes)
 */
export function forceInitializePlatformHealth() {
  isInitialized = false;
  initializePlatformHealth();
}

// Auto-inicialização quando o módulo é importado
if (typeof window !== 'undefined') {
  // Inicializa após o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlatformHealth);
  } else {
    // DOM já está pronto
    setTimeout(initializePlatformHealth, 100);
  }
} else {
  // Ambiente servidor (SSR)
  console.log('🏥 Sistema de Saúde - Ambiente servidor detectado');
}

export default {
  initializePlatformHealth,
  getPlatformHealthStatus,
  forceInitializePlatformHealth,
};
