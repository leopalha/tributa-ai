// Sistema de Workflows do Marketplace Tributa.AI
// Garante que todas as etapas sejam cumpridas para validar transações de títulos de crédito

import {
  WorkflowCompra,
  EtapaWorkflow,
  StatusWorkflow,
  TituloCredito,
  DocumentoWorkflow,
  TipoDocumentoWorkflow,
  StatusDocumentoWorkflow,
  HistoricoWorkflow,
  CONFIGURACOES_MARKETPLACE,
} from '@/types/marketplace';

export interface ValidacaoEtapa {
  etapa: EtapaWorkflow;
  obrigatorio: boolean;
  documentosNecessarios: TipoDocumentoWorkflow[];
  validadores: string[];
  tempoLimite?: number; // em horas
  dependeDe?: EtapaWorkflow[];
}

export interface ResultadoValidacao {
  aprovado: boolean;
  motivo?: string;
  documentosPendentes?: TipoDocumentoWorkflow[];
  proximaEtapa?: EtapaWorkflow;
  observacoes?: string;
}

export interface NotificacaoWorkflow {
  id: string;
  workflowId: string;
  destinatario: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  acoes?: AcaoNotificacao[];
}

export enum TipoNotificacao {
  ETAPA_INICIADA = 'etapa_iniciada',
  DOCUMENTO_PENDENTE = 'documento_pendente',
  VALIDACAO_APROVADA = 'validacao_aprovada',
  VALIDACAO_REJEITADA = 'validacao_rejeitada',
  PRAZO_VENCENDO = 'prazo_vencendo',
  WORKFLOW_CONCLUIDO = 'workflow_concluido',
  ERRO_PROCESSO = 'erro_processo',
  ACAO_REQUERIDA = 'acao_requerida',
}

export interface AcaoNotificacao {
  id: string;
  label: string;
  tipo: 'primary' | 'secondary' | 'warning' | 'danger';
  url?: string;
  callback?: () => void;
}

export class MarketplaceWorkflowService {
  private static instance: MarketplaceWorkflowService;
  private workflows: Map<string, WorkflowCompra> = new Map();
  private validacoes: Map<EtapaWorkflow, ValidacaoEtapa> = new Map();
  private notificacoes: NotificacaoWorkflow[] = [];

  private constructor() {
    this.inicializarValidacoes();
  }

  public static getInstance(): MarketplaceWorkflowService {
    if (!MarketplaceWorkflowService.instance) {
      MarketplaceWorkflowService.instance = new MarketplaceWorkflowService();
    }
    return MarketplaceWorkflowService.instance;
  }

  // === CONFIGURAÇÃO DAS VALIDAÇÕES ===

  private inicializarValidacoes(): void {
    // Etapa 1: Iniciado
    this.validacoes.set(EtapaWorkflow.INICIADO, {
      etapa: EtapaWorkflow.INICIADO,
      obrigatorio: true,
      documentosNecessarios: [],
      validadores: ['sistema'],
      tempoLimite: 1,
    });

    // Etapa 2: Validação do Comprador
    this.validacoes.set(EtapaWorkflow.VALIDACAO_COMPRADOR, {
      etapa: EtapaWorkflow.VALIDACAO_COMPRADOR,
      obrigatorio: true,
      documentosNecessarios: [
        TipoDocumentoWorkflow.IDENTIDADE_COMPRADOR,
        TipoDocumentoWorkflow.COMPROVANTE_RESIDENCIA,
        TipoDocumentoWorkflow.COMPROVANTE_RENDA,
      ],
      validadores: ['compliance', 'kyc'],
      tempoLimite: 24,
      dependeDe: [EtapaWorkflow.INICIADO],
    });

    // Etapa 3: Validação do Título
    this.validacoes.set(EtapaWorkflow.VALIDACAO_TITULO, {
      etapa: EtapaWorkflow.VALIDACAO_TITULO,
      obrigatorio: true,
      documentosNecessarios: [
        TipoDocumentoWorkflow.TITULO_ORIGINAL,
        TipoDocumentoWorkflow.CERTIDOES_NEGATIVAS,
      ],
      validadores: ['juridico', 'tributario'],
      tempoLimite: 48,
      dependeDe: [EtapaWorkflow.VALIDACAO_COMPRADOR],
    });

    // Etapa 4: Validação Jurídica
    this.validacoes.set(EtapaWorkflow.VALIDACAO_JURIDICA, {
      etapa: EtapaWorkflow.VALIDACAO_JURIDICA,
      obrigatorio: true,
      documentosNecessarios: [
        TipoDocumentoWorkflow.PROCURACAO,
        TipoDocumentoWorkflow.CONTRATO_SOCIAL,
      ],
      validadores: ['advogado', 'juridico_senior'],
      tempoLimite: 72,
      dependeDe: [EtapaWorkflow.VALIDACAO_TITULO],
    });

    // Etapa 5: Validação Financeira
    this.validacoes.set(EtapaWorkflow.VALIDACAO_FINANCEIRA, {
      etapa: EtapaWorkflow.VALIDACAO_FINANCEIRA,
      obrigatorio: true,
      documentosNecessarios: [
        TipoDocumentoWorkflow.COMPROVANTE_RENDA,
        TipoDocumentoWorkflow.TERMO_COMPRA,
      ],
      validadores: ['financeiro', 'risco'],
      tempoLimite: 24,
      dependeDe: [EtapaWorkflow.VALIDACAO_JURIDICA],
    });

    // Etapa 6: Assinatura do Contrato
    this.validacoes.set(EtapaWorkflow.ASSINATURA_CONTRATO, {
      etapa: EtapaWorkflow.ASSINATURA_CONTRATO,
      obrigatorio: true,
      documentosNecessarios: [TipoDocumentoWorkflow.CONTRATO_TRANSFERENCIA],
      validadores: ['comprador', 'vendedor', 'testemunha'],
      tempoLimite: 48,
      dependeDe: [EtapaWorkflow.VALIDACAO_FINANCEIRA],
    });

    // Etapa 7: Pagamento
    this.validacoes.set(EtapaWorkflow.PAGAMENTO, {
      etapa: EtapaWorkflow.PAGAMENTO,
      obrigatorio: true,
      documentosNecessarios: [TipoDocumentoWorkflow.COMPROVANTE_PAGAMENTO],
      validadores: ['financeiro', 'banco'],
      tempoLimite: 72,
      dependeDe: [EtapaWorkflow.ASSINATURA_CONTRATO],
    });

    // Etapa 8: Transferência de Titularidade
    this.validacoes.set(EtapaWorkflow.TRANSFERENCIA_TITULARIDADE, {
      etapa: EtapaWorkflow.TRANSFERENCIA_TITULARIDADE,
      obrigatorio: true,
      documentosNecessarios: [],
      validadores: ['cartorio', 'registro'],
      tempoLimite: 120,
      dependeDe: [EtapaWorkflow.PAGAMENTO],
    });

    // Etapa 9: Tokenização
    this.validacoes.set(EtapaWorkflow.TOKENIZACAO, {
      etapa: EtapaWorkflow.TOKENIZACAO,
      obrigatorio: false,
      documentosNecessarios: [],
      validadores: ['blockchain', 'tecnologia'],
      tempoLimite: 24,
      dependeDe: [EtapaWorkflow.TRANSFERENCIA_TITULARIDADE],
    });

    // Etapa 10: Conclusão
    this.validacoes.set(EtapaWorkflow.CONCLUSAO, {
      etapa: EtapaWorkflow.CONCLUSAO,
      obrigatorio: true,
      documentosNecessarios: [],
      validadores: ['sistema'],
      tempoLimite: 1,
      dependeDe: [EtapaWorkflow.TRANSFERENCIA_TITULARIDADE],
    });
  }

  // === GESTÃO DE WORKFLOWS ===

  public async iniciarWorkflow(
    titulo: TituloCredito,
    compradorId: string,
    vendedorId: string,
    valor: number
  ): Promise<WorkflowCompra> {
    const workflowId = `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const workflow: WorkflowCompra = {
      id: workflowId,
      tituloId: titulo.id,
      compradorId,
      vendedorId,
      etapa: EtapaWorkflow.INICIADO,
      status: StatusWorkflow.EM_ANDAMENTO,
      valor,
      dataInicio: new Date(),
      historico: [],
      documentos: [],
      observacoes: `Workflow iniciado para compra do título: ${titulo.titulo}`,
    };

    // Adicionar entrada no histórico
    this.adicionarHistorico(
      workflow,
      EtapaWorkflow.INICIADO,
      StatusWorkflow.EM_ANDAMENTO,
      'sistema',
      'Workflow iniciado automaticamente'
    );

    // Preparar documentos necessários
    await this.prepararDocumentosIniciais(workflow);

    // Salvar workflow
    this.workflows.set(workflowId, workflow);

    // Enviar notificação
    await this.enviarNotificacao(workflow, TipoNotificacao.ETAPA_INICIADA, compradorId);

    // Avançar para próxima etapa automaticamente
    await this.avancarEtapa(workflowId);

    return workflow;
  }

  public async avancarEtapa(workflowId: string, validadoPor?: string): Promise<ResultadoValidacao> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow não encontrado');
    }

    const etapaAtual = workflow.etapa;
    const validacao = this.validacoes.get(etapaAtual);

    if (!validacao) {
      throw new Error(`Validação não encontrada para etapa: ${etapaAtual}`);
    }

    // Verificar dependências
    const dependenciasOk = await this.verificarDependencias(workflow, validacao);
    if (!dependenciasOk.aprovado) {
      return dependenciasOk;
    }

    // Verificar documentos
    const documentosOk = await this.verificarDocumentos(workflow, validacao);
    if (!documentosOk.aprovado) {
      return documentosOk;
    }

    // Executar validações específicas da etapa
    const validacaoEtapa = await this.executarValidacaoEtapa(workflow, validacao, validadoPor);
    if (!validacaoEtapa.aprovado) {
      workflow.status = StatusWorkflow.REJEITADO;
      this.adicionarHistorico(
        workflow,
        etapaAtual,
        StatusWorkflow.REJEITADO,
        validadoPor || 'sistema',
        validacaoEtapa.motivo
      );
      await this.enviarNotificacao(
        workflow,
        TipoNotificacao.VALIDACAO_REJEITADA,
        workflow.compradorId
      );
      return validacaoEtapa;
    }

    // Aprovar etapa atual
    this.adicionarHistorico(
      workflow,
      etapaAtual,
      StatusWorkflow.APROVADO,
      validadoPor || 'sistema',
      'Etapa aprovada'
    );

    // Determinar próxima etapa
    const proximaEtapa = this.obterProximaEtapa(etapaAtual);

    if (proximaEtapa) {
      workflow.etapa = proximaEtapa;
      workflow.status = StatusWorkflow.EM_ANDAMENTO;
      this.adicionarHistorico(
        workflow,
        proximaEtapa,
        StatusWorkflow.EM_ANDAMENTO,
        'sistema',
        'Avançado para próxima etapa'
      );

      // Preparar documentos da próxima etapa
      await this.prepararDocumentosEtapa(workflow, proximaEtapa);

      // Enviar notificação
      await this.enviarNotificacao(workflow, TipoNotificacao.ETAPA_INICIADA, workflow.compradorId);
    } else {
      // Workflow concluído
      workflow.status = StatusWorkflow.CONCLUIDO;
      workflow.dataFim = new Date();
      this.adicionarHistorico(
        workflow,
        EtapaWorkflow.CONCLUSAO,
        StatusWorkflow.CONCLUIDO,
        'sistema',
        'Workflow concluído com sucesso'
      );

      // Enviar notificação de conclusão
      await this.enviarNotificacao(
        workflow,
        TipoNotificacao.WORKFLOW_CONCLUIDO,
        workflow.compradorId
      );
      await this.enviarNotificacao(
        workflow,
        TipoNotificacao.WORKFLOW_CONCLUIDO,
        workflow.vendedorId
      );
    }

    return {
      aprovado: true,
      proximaEtapa,
      observacoes: 'Etapa avançada com sucesso',
    };
  }

  // === VALIDAÇÕES ESPECÍFICAS ===

  private async verificarDependencias(
    workflow: WorkflowCompra,
    validacao: ValidacaoEtapa
  ): Promise<ResultadoValidacao> {
    if (!validacao.dependeDe || validacao.dependeDe.length === 0) {
      return { aprovado: true };
    }

    for (const etapaDependencia of validacao.dependeDe) {
      const etapaAprovada = workflow.historico.some(
        h => h.etapa === etapaDependencia && h.status === StatusWorkflow.APROVADO
      );

      if (!etapaAprovada) {
        return {
          aprovado: false,
          motivo: `Etapa dependente não foi aprovada: ${etapaDependencia}`,
        };
      }
    }

    return { aprovado: true };
  }

  private async verificarDocumentos(
    workflow: WorkflowCompra,
    validacao: ValidacaoEtapa
  ): Promise<ResultadoValidacao> {
    const documentosPendentes: TipoDocumentoWorkflow[] = [];

    for (const tipoDoc of validacao.documentosNecessarios) {
      const documento = workflow.documentos.find(
        d => d.tipo === tipoDoc && d.status === StatusDocumentoWorkflow.APROVADO
      );

      if (!documento) {
        documentosPendentes.push(tipoDoc);
      }
    }

    if (documentosPendentes.length > 0) {
      return {
        aprovado: false,
        motivo: 'Documentos pendentes de aprovação',
        documentosPendentes,
      };
    }

    return { aprovado: true };
  }

  private async executarValidacaoEtapa(
    workflow: WorkflowCompra,
    validacao: ValidacaoEtapa,
    validadoPor?: string
  ): Promise<ResultadoValidacao> {
    switch (validacao.etapa) {
      case EtapaWorkflow.VALIDACAO_COMPRADOR:
        return await this.validarComprador(workflow);

      case EtapaWorkflow.VALIDACAO_TITULO:
        return await this.validarTitulo(workflow);

      case EtapaWorkflow.VALIDACAO_JURIDICA:
        return await this.validarJuridico(workflow);

      case EtapaWorkflow.VALIDACAO_FINANCEIRA:
        return await this.validarFinanceiro(workflow);

      case EtapaWorkflow.ASSINATURA_CONTRATO:
        return await this.validarAssinaturas(workflow);

      case EtapaWorkflow.PAGAMENTO:
        return await this.validarPagamento(workflow);

      case EtapaWorkflow.TRANSFERENCIA_TITULARIDADE:
        return await this.validarTransferencia(workflow);

      case EtapaWorkflow.TOKENIZACAO:
        return await this.validarTokenizacao(workflow);

      default:
        return { aprovado: true };
    }
  }

  // === VALIDAÇÕES ESPECÍFICAS POR ETAPA ===

  private async validarComprador(workflow: WorkflowCompra): Promise<ResultadoValidacao> {
    console.log('Validando KYC do comprador...', workflow.compradorId);
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      aprovado: true,
      observacoes: 'Comprador validado com sucesso - KYC aprovado',
    };
  }

  private async validarTitulo(workflow: WorkflowCompra): Promise<ResultadoValidacao> {
    console.log('Validando autenticidade do título...', workflow.tituloId);
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      aprovado: true,
      observacoes: 'Título validado - documentos autênticos e sem impedimentos',
    };
  }

  private async validarJuridico(workflow: WorkflowCompra): Promise<ResultadoValidacao> {
    console.log('Validação jurídica em andamento...', workflow.id);
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      aprovado: true,
      observacoes: 'Análise jurídica aprovada - sem impedimentos legais',
    };
  }

  private async validarFinanceiro(workflow: WorkflowCompra): Promise<ResultadoValidacao> {
    console.log('Validação financeira...', workflow.valor);
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      aprovado: true,
      observacoes: 'Capacidade financeira confirmada - risco aprovado',
    };
  }

  private async validarAssinaturas(workflow: WorkflowCompra): Promise<ResultadoValidacao> {
    console.log('Validando assinaturas do contrato...', workflow.id);
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      aprovado: true,
      observacoes: 'Contrato assinado digitalmente por todas as partes',
    };
  }

  private async validarPagamento(workflow: WorkflowCompra): Promise<ResultadoValidacao> {
    console.log('Validando pagamento...', workflow.valor);
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      aprovado: true,
      observacoes: 'Pagamento confirmado - valores corretos recebidos',
    };
  }

  private async validarTransferencia(workflow: WorkflowCompra): Promise<ResultadoValidacao> {
    console.log('Validando transferência de titularidade...', workflow.tituloId);
    await new Promise(resolve => setTimeout(resolve, 4000));

    return {
      aprovado: true,
      observacoes: 'Titularidade transferida e registrada oficialmente',
    };
  }

  private async validarTokenizacao(workflow: WorkflowCompra): Promise<ResultadoValidacao> {
    console.log('Validando tokenização...', workflow.tituloId);
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      aprovado: true,
      observacoes: 'Título tokenizado com sucesso na blockchain',
    };
  }

  // === UTILITÁRIOS ===

  private obterProximaEtapa(etapaAtual: EtapaWorkflow): EtapaWorkflow | null {
    const etapas = Object.values(EtapaWorkflow);
    const indiceAtual = etapas.indexOf(etapaAtual);

    if (indiceAtual >= 0 && indiceAtual < etapas.length - 1) {
      return etapas[indiceAtual + 1];
    }

    return null;
  }

  private adicionarHistorico(
    workflow: WorkflowCompra,
    etapa: EtapaWorkflow,
    status: StatusWorkflow,
    usuario: string,
    observacoes?: string
  ): void {
    const entrada: HistoricoWorkflow = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      data: new Date(),
      etapa,
      status,
      usuario,
      observacoes,
    };

    workflow.historico.push(entrada);
  }

  private async prepararDocumentosIniciais(workflow: WorkflowCompra): Promise<void> {
    const todosDocumentos = Array.from(this.validacoes.values())
      .flatMap(v => v.documentosNecessarios)
      .filter((doc, index, array) => array.indexOf(doc) === index);

    for (const tipo of todosDocumentos) {
      const documento: DocumentoWorkflow = {
        id: `doc_pending_${tipo}`,
        tipo,
        nome: `${tipo}.pdf`,
        url: '',
        obrigatorio: CONFIGURACOES_MARKETPLACE.DOCUMENTOS_OBRIGATORIOS.includes(tipo),
        status: StatusDocumentoWorkflow.PENDENTE,
        observacoes: 'Aguardando envio',
      };

      workflow.documentos.push(documento);
    }
  }

  private async prepararDocumentosEtapa(
    workflow: WorkflowCompra,
    etapa: EtapaWorkflow
  ): Promise<void> {
    const validacao = this.validacoes.get(etapa);
    if (!validacao) return;

    const documentosPendentes = validacao.documentosNecessarios.filter(
      tipo =>
        !workflow.documentos.some(
          d => d.tipo === tipo && d.status === StatusDocumentoWorkflow.APROVADO
        )
    );

    if (documentosPendentes.length > 0) {
      await this.enviarNotificacao(
        workflow,
        TipoNotificacao.DOCUMENTO_PENDENTE,
        workflow.compradorId,
        `Documentos necessários para ${etapa}: ${documentosPendentes.join(', ')}`
      );
    }
  }

  private async enviarNotificacao(
    workflow: WorkflowCompra,
    tipo: TipoNotificacao,
    destinatario: string,
    mensagemCustom?: string
  ): Promise<void> {
    const notificacao: NotificacaoWorkflow = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      workflowId: workflow.id,
      destinatario,
      tipo,
      titulo: this.obterTituloNotificacao(tipo, workflow),
      mensagem: mensagemCustom || this.obterMensagemNotificacao(tipo, workflow),
      data: new Date(),
      lida: false,
      acoes: this.obterAcoesNotificacao(tipo, workflow),
    };

    this.notificacoes.push(notificacao);
    console.log('📧 Notificação enviada:', notificacao);
  }

  private obterTituloNotificacao(tipo: TipoNotificacao, workflow: WorkflowCompra): string {
    switch (tipo) {
      case TipoNotificacao.ETAPA_INICIADA:
        return `Nova etapa iniciada: ${workflow.etapa}`;
      case TipoNotificacao.DOCUMENTO_PENDENTE:
        return 'Documentos pendentes';
      case TipoNotificacao.VALIDACAO_APROVADA:
        return 'Etapa aprovada';
      case TipoNotificacao.VALIDACAO_REJEITADA:
        return 'Etapa rejeitada';
      case TipoNotificacao.WORKFLOW_CONCLUIDO:
        return 'Compra concluída com sucesso!';
      default:
        return 'Atualização do workflow';
    }
  }

  private obterMensagemNotificacao(tipo: TipoNotificacao, workflow: WorkflowCompra): string {
    switch (tipo) {
      case TipoNotificacao.ETAPA_INICIADA:
        return `A etapa "${workflow.etapa}" foi iniciada e aguarda sua ação.`;
      case TipoNotificacao.DOCUMENTO_PENDENTE:
        return 'Há documentos pendentes que precisam ser enviados para continuar o processo.';
      case TipoNotificacao.VALIDACAO_APROVADA:
        return `A etapa "${workflow.etapa}" foi aprovada. O processo avançará automaticamente.`;
      case TipoNotificacao.VALIDACAO_REJEITADA:
        return `A etapa "${workflow.etapa}" foi rejeitada. Verifique os motivos e tome as ações necessárias.`;
      case TipoNotificacao.WORKFLOW_CONCLUIDO:
        return 'Parabéns! A compra do título de crédito foi concluída com sucesso.';
      default:
        return 'Há uma atualização no seu processo de compra.';
    }
  }

  private obterAcoesNotificacao(
    tipo: TipoNotificacao,
    workflow: WorkflowCompra
  ): AcaoNotificacao[] {
    switch (tipo) {
      case TipoNotificacao.DOCUMENTO_PENDENTE:
        return [
          {
            id: 'upload_docs',
            label: 'Enviar Documentos',
            tipo: 'primary',
            url: `/workflow/${workflow.id}/documentos`,
          },
        ];
      case TipoNotificacao.VALIDACAO_REJEITADA:
        return [
          {
            id: 'ver_motivos',
            label: 'Ver Motivos',
            tipo: 'warning',
            url: `/workflow/${workflow.id}/historico`,
          },
        ];
      default:
        return [
          {
            id: 'ver_workflow',
            label: 'Ver Detalhes',
            tipo: 'primary',
            url: `/workflow/${workflow.id}`,
          },
        ];
    }
  }

  // === MÉTODOS PÚBLICOS ===

  public obterWorkflow(workflowId: string): WorkflowCompra | null {
    return this.workflows.get(workflowId) || null;
  }

  public listarWorkflows(usuarioId: string): WorkflowCompra[] {
    return Array.from(this.workflows.values()).filter(
      w => w.compradorId === usuarioId || w.vendedorId === usuarioId
    );
  }

  public obterNotificacoes(usuarioId: string): NotificacaoWorkflow[] {
    return this.notificacoes.filter(n => n.destinatario === usuarioId);
  }

  public marcarNotificacaoComoLida(notificacaoId: string): void {
    const notificacao = this.notificacoes.find(n => n.id === notificacaoId);
    if (notificacao) {
      notificacao.lida = true;
    }
  }
}

// Singleton instance
export const workflowService = MarketplaceWorkflowService.getInstance();

export default MarketplaceWorkflowService;
