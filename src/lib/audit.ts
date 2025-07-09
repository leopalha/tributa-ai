import { prisma } from '@/lib/prisma';
import { auditComplianceService, AuditEventTypeCompliance } from './audit-service';

/**
 * Tipos de eventos para auditoria (mantidos para compatibilidade)
 */
export enum AuditEventType {
  // Eventos de usuário
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_REGISTER = 'USER_REGISTER',
  USER_UPDATE = 'USER_UPDATE',

  // Eventos de transação
  TRANSACTION_CREATE = 'TRANSACTION_CREATE',
  TRANSACTION_UPDATE = 'TRANSACTION_UPDATE',
  TRANSACTION_DELETE = 'TRANSACTION_DELETE',

  // Eventos de compensação
  COMPENSACAO_CRIADA = 'COMPENSACAO_CRIADA',
  COMPENSACAO_APROVADA = 'COMPENSACAO_APROVADA',
  COMPENSACAO_REJEITADA = 'COMPENSACAO_REJEITADA',
  COMPENSATION_CREATE = 'COMPENSATION_CREATE',
  COMPENSATION_COMPLETE = 'COMPENSATION_COMPLETE',

  // Eventos de crédito
  CREDITO_TOKENIZADO = 'CREDITO_TOKENIZADO',
  CREDIT_CREATE = 'CREDIT_CREATE',
  CREDIT_UPDATE = 'CREDIT_UPDATE',
  CREDIT_DELETE = 'CREDIT_DELETE',

  // Eventos de débito
  DEBITO_REGISTRADO = 'DEBITO_REGISTRADO',
  DEBT_CREATE = 'DEBT_CREATE',
  DEBT_UPDATE = 'DEBT_UPDATE',
  DEBT_DELETE = 'DEBT_DELETE',

  // Eventos de marketplace
  MARKETPLACE_VENDA = 'MARKETPLACE_VENDA',
  MARKETPLACE_LEILAO = 'MARKETPLACE_LEILAO',
  MARKETPLACE_LIST = 'MARKETPLACE_LIST',
  MARKETPLACE_PURCHASE = 'MARKETPLACE_PURCHASE',
  MARKETPLACE_REMOVE = 'MARKETPLACE_REMOVE',
}

/**
 * Função de compatibilidade para código existente
 * Redireciona para o novo serviço de auditoria compliance
 */
export async function logAuditEvent({
  userId,
  eventType,
  entityId,
  details,
}: {
  userId: string;
  eventType: AuditEventType | string;
  entityId: string;
  details?: any;
}) {
  try {
    // Mapear eventos antigos para novos
    const actionMap: Record<string, AuditEventTypeCompliance> = {
      [AuditEventType.CREDIT_CREATE]: AuditEventTypeCompliance.CREDITO_CRIADO,
      [AuditEventType.CREDIT_UPDATE]: AuditEventTypeCompliance.CREDITO_MODIFICADO,
      [AuditEventType.CREDITO_TOKENIZADO]: AuditEventTypeCompliance.CREDITO_TOKENIZADO,
      [AuditEventType.MARKETPLACE_LIST]: AuditEventTypeCompliance.CREDITO_LISTADO,
      [AuditEventType.TRANSACTION_CREATE]: AuditEventTypeCompliance.TRANSACAO_INICIADA,
      [AuditEventType.TRANSACTION_UPDATE]: AuditEventTypeCompliance.TRANSACAO_CONCLUIDA,
      [AuditEventType.COMPENSACAO_CRIADA]: AuditEventTypeCompliance.COMPENSACAO_SOLICITADA,
      [AuditEventType.COMPENSACAO_APROVADA]: AuditEventTypeCompliance.COMPENSACAO_APROVADA,
      [AuditEventType.DEBITO_REGISTRADO]: AuditEventTypeCompliance.DEBITO_REGISTRADO,
    };

    const action = actionMap[eventType] || AuditEventTypeCompliance.CONFIG_ALTERADA;

    // Usar novo serviço de auditoria
    await auditComplianceService.logCompliance({
      userId,
      action,
      entityType: 'LEGACY',
      entityId,
      details: {
        metadata: details,
        legacyEventType: eventType,
        compliance: {
          retentionYears: 7,
          critical: false,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao registrar evento de auditoria:', error);
  }
}

/**
 * Função de compatibilidade para buscar eventos
 */
export async function getAuditEvents(params: any) {
  return auditComplianceService.searchLogs(params);
}
