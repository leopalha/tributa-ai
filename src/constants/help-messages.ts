export const HELP_MESSAGES = {
  // Dashboard
  DASHBOARD: {
    STATS: {
      PENDING_OBLIGATIONS: {
        title: "Obrigações Pendentes",
        content: "Mostra o número total de obrigações fiscais que precisam ser cumpridas nos próximos 30 dias. Clique no card para ver a lista detalhada."
      },
      COMPLETED_OBLIGATIONS: {
        title: "Obrigações Concluídas",
        content: "Exibe o total de obrigações fiscais concluídas no mês atual. O percentual indica a variação em relação ao mês anterior."
      },
      COMPLIANCE_RATE: {
        title: "Taxa de Conformidade",
        content: "Indica o percentual de obrigações entregues dentro do prazo nos últimos 12 meses. Uma taxa alta significa melhor gestão fiscal."
      },
      TAX_SAVINGS: {
        title: "Economia Fiscal",
        content: "Valor total economizado através de planejamento tributário e otimização fiscal no ano corrente."
      }
    },
    LAYOUT: {
      title: "Personalização do Dashboard",
      content: "Você pode personalizar seu dashboard arrastando os cards para reorganizá-los. Use o botão de congelar/descongelar para fixar o layout desejado."
    }
  },

  // Obrigações
  OBLIGATIONS: {
    STATUS: {
      title: "Status da Obrigação",
      content: "• Pendente: Ainda não foi iniciada\n• Em Andamento: Está sendo processada\n• Concluída: Foi entregue com sucesso\n• Atrasada: Prazo foi excedido"
    },
    PRIORITY: {
      title: "Prioridade",
      content: "A prioridade é calculada com base no prazo, complexidade e impacto fiscal da obrigação."
    },
    DEADLINE: {
      title: "Prazo de Entrega",
      content: "Data limite para entrega da obrigação. Recomendamos iniciar o processo com antecedência para evitar atrasos."
    }
  },

  // Automação
  AUTOMATION: {
    PROCESS: {
      title: "Automação de Processos",
      content: "Automatize tarefas repetitivas para reduzir erros e economizar tempo. Selecione os processos que deseja automatizar."
    },
    RULES: {
      title: "Regras de Automação",
      content: "Configure regras personalizadas para cada processo automatizado, definindo condições e ações específicas."
    }
  },

  // Análise Preditiva
  PREDICTIVE: {
    ANALYSIS: {
      title: "Análise Preditiva",
      content: "Utilizamos inteligência artificial para prever tendências e identificar possíveis riscos fiscais com antecedência."
    },
    RECOMMENDATIONS: {
      title: "Recomendações",
      content: "Sugestões personalizadas baseadas na análise dos seus dados fiscais e histórico de obrigações."
    }
  },

  // Configurações
  SETTINGS: {
    NOTIFICATIONS: {
      title: "Configurar Notificações",
      content: "Personalize como e quando deseja receber alertas sobre prazos, atualizações e recomendações."
    },
    INTEGRATIONS: {
      title: "Integrações",
      content: "Conecte o sistema com outras ferramentas e plataformas para importar e exportar dados automaticamente."
    }
  }
} 