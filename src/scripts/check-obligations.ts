import { declaracaoService } from '@/services/declaracao.service';
import { addDays } from 'date-fns';
import { StatusDeclaracao } from '@/types/declaracao';

async function checkObligations() {
  try {
    const today = new Date();
    const sevenDaysFromNow = addDays(today, 7);

    // Busca obrigações que vencem nos próximos 7 dias
    const upcomingObligations = await declaracaoService.listarObrigacoes({
      status: 'PENDENTE' as StatusDeclaracao,
      periodoInicio: today.toISOString(),
      periodoFim: sevenDaysFromNow.toISOString(),
    });

    // Busca obrigações vencidas
    const overdueObligations = await declaracaoService.listarObrigacoes({
      status: 'REJEITADA' as StatusDeclaracao,
    });

    // Cria notificações para obrigações próximas do vencimento
    for (const obligation of upcomingObligations.items) {
      const daysUntilDue = Math.ceil(
        (new Date(obligation.dataVencimento).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      await declaracaoService.criarNotificacao({
        titulo: 'Obrigação Fiscal Próxima do Vencimento',
        mensagem: `A obrigação "${obligation.titulo}" vence em ${daysUntilDue} dias. Valor: ${obligation.moeda} ${obligation.valor.toFixed(2)}`,
        tipo: 'info',
      });
    }

    // Cria notificações para obrigações vencidas
    for (const obligation of overdueObligations.items) {
      const daysOverdue = Math.ceil(
        (today.getTime() - new Date(obligation.dataVencimento).getTime()) / (1000 * 60 * 60 * 24)
      );

      await declaracaoService.criarNotificacao({
        titulo: 'Obrigação Fiscal Vencida',
        mensagem: `A obrigação "${obligation.titulo}" está vencida há ${daysOverdue} dias. Valor: ${obligation.moeda} ${obligation.valor.toFixed(2)}`,
        tipo: 'warning',
      });
    }

    console.log('Verificação de obrigações concluída');
  } catch (error) {
    console.error('Erro ao verificar obrigações:', error);
  }
}

// Executa a verificação
checkObligations();
