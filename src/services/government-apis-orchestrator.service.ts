import { receitaFederalService } from './receita-federal-integration.service';
import { sefazService } from './sefaz-integration.service';
import { simpleNotificationService } from './notification-simple.service';

interface ComprehensiveAnalysisResult {
  cnpj: string;
  razaoSocial: string;
  analiseCompleta: boolean;
  dataAnalise: string;
  
  // Receita Federal
  receitaFederal: {
    situacaoCadastral: any;
    debitos: any;
    validacoesCredito: any[];
  };
  
  // SEFAZ Multi-Estado
  sefaz: {
    icms: Map<string, any>;
    substituicaoTributaria: Map<string, any>;
    diferencialAliquota: Map<string, any>;
    resumo: any;
  };
  
  // Oportunidades Identificadas
  oportunidades: {
    creditosRFB: {
      tipo: string;
      valor: number;
      descricao: string;
      viabilidade: number;
    }[];
    creditosSEFAZ: {
      uf: string;
      tipo: string;
      valor: number;
      descricao: string;
      viabilidade: number;
    }[];
    compensacoes: {
      creditoOrigem: string;
      debitoDestino: string;
      valorCompensacao: number;
      economia: number;
    }[];
  };
  
  // Resumo Financeiro
  resumoFinanceiro: {
    totalCreditos: number;
    totalDebitos: number;
    saldoLiquido: number;
    economiaEstimada: number;
    valorRecuperavel: number;
  };
  
  // Riscos e Alertas
  riscos: {
    nivel: 'BAIXO' | 'MEDIO' | 'ALTO';
    alertas: string[];
    recomendacoes: string[];
  };
}

interface MonitoringConfig {
  cnpj: string;
  frequencia: 'DIARIA' | 'SEMANAL' | 'MENSAL';
  alertas: {
    novosDebitos: boolean;
    vencimentos: boolean;
    oportunidades: boolean;
    mudancasSituacao: boolean;
  };
  ativo: boolean;
}

export class GovernmentAPIsOrchestratorService {
  private monitoramentos: Map<string, MonitoringConfig> = new Map();
  
  constructor() {
    this.carregarMonitoramentos();
    this.iniciarMonitoramentoAutomatico();
  }

  // Análise completa de um CNPJ em todas as APIs
  async analiseCompleta(cnpj: string, razaoSocial?: string): Promise<ComprehensiveAnalysisResult> {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    const inicio = Date.now();
    
    console.log(`[Orchestrator] Iniciando análise completa para ${cnpjLimpo}`);
    
    try {
      // Notificar início da análise
      simpleNotificationService.show({
        type: 'info',
        message: 'Iniciando análise completa nas APIs governamentais...'
      });

      // Executar análises em paralelo para melhor performance
      const [
        situacaoCadastralRFB,
        debitosRFB,
        analiseCompletaSEFAZ
      ] = await Promise.allSettled([
        receitaFederalService.consultarSituacaoCadastral(cnpjLimpo),
        receitaFederalService.consultarDebitos(cnpjLimpo),
        sefazService.analiseCompletaMultiEstado(cnpjLimpo)
      ]);

      // Processar resultados da Receita Federal
      const rfbData = {
        situacaoCadastral: situacaoCadastralRFB.status === 'fulfilled' ? situacaoCadastralRFB.value : null,
        debitos: debitosRFB.status === 'fulfilled' ? debitosRFB.value : null,
        validacoesCredito: []
      };

      // Processar resultados do SEFAZ
      const sefazData = analiseCompletaSEFAZ.status === 'fulfilled' 
        ? analiseCompletaSEFAZ.value 
        : {
            icms: new Map(),
            substituicaoTributaria: new Map(),
            diferencialAliquota: new Map(),
            resumo: { totalCreditos: 0, totalDebitos: 0, oportunidades: 0, estadosAnalisados: [] }
          };

      // Identificar oportunidades
      const oportunidades = await this.identificarOportunidades(rfbData, sefazData, cnpjLimpo);
      
      // Calcular resumo financeiro
      const resumoFinanceiro = this.calcularResumoFinanceiro(rfbData, sefazData, oportunidades);
      
      // Avaliar riscos
      const riscos = this.avaliarRiscos(rfbData, sefazData);

      const resultado: ComprehensiveAnalysisResult = {
        cnpj: cnpjLimpo,
        razaoSocial: razaoSocial || rfbData.situacaoCadastral?.razaoSocial || 'Não informado',
        analiseCompleta: true,
        dataAnalise: new Date().toISOString(),
        receitaFederal: rfbData,
        sefaz: sefazData,
        oportunidades,
        resumoFinanceiro,
        riscos
      };

      // Salvar resultado
      await this.salvarResultadoAnalise(resultado);
      
      // Notificar conclusão
      const tempoTotal = Date.now() - inicio;
      simpleNotificationService.show({
        type: 'success',
        message: `Análise completa concluída em ${(tempoTotal / 1000).toFixed(1)}s! ${oportunidades.creditosRFB.length + oportunidades.creditosSEFAZ.length} oportunidades identificadas.`
      });

      console.log(`[Orchestrator] Análise concluída em ${tempoTotal}ms`);
      return resultado;

    } catch (error) {
      console.error('[Orchestrator] Erro na análise completa:', error);
      
      simpleNotificationService.show({
        type: 'error',
        message: 'Erro durante a análise das APIs governamentais'
      });
      
      throw new Error('Falha na análise completa das APIs governamentais');
    }
  }

  // Identificar oportunidades de créditos e compensações
  private async identificarOportunidades(rfbData: any, sefazData: any, cnpj: string): Promise<any> {
    const oportunidades = {
      creditosRFB: [],
      creditosSEFAZ: [],
      compensacoes: []
    };

    // Oportunidades na Receita Federal
    if (rfbData.debitos?.debitos) {
      for (const debito of rfbData.debitos.debitos) {
        // Identificar possíveis créditos baseados no tipo de débito
        if (debito.codigo === '0220') { // IRPJ
          oportunidades.creditosRFB.push({
            tipo: 'IRPJ - Pagamento Indevido',
            valor: debito.valor * 0.15, // Estimativa de 15% do débito
            descricao: 'Possível pagamento em duplicidade ou cálculo incorreto',
            viabilidade: 75
          });
        }
        
        if (debito.codigo === '2506') { // CSLL
          oportunidades.creditosRFB.push({
            tipo: 'CSLL - Revisão de Base',
            valor: debito.valor * 0.12,
            descricao: 'Revisão de base de cálculo e adições indevidas',
            viabilidade: 70
          });
        }
      }
    }

    // Oportunidades no SEFAZ
    sefazData.icms?.forEach((icmsData: any, uf: string) => {
      // Créditos existentes
      icmsData.creditos?.forEach((credito: any) => {
        if (credito.saldo > 0) {
          oportunidades.creditosSEFAZ.push({
            uf,
            tipo: 'ICMS - Crédito Disponível',
            valor: credito.saldo,
            descricao: credito.descricao,
            viabilidade: 95
          });
        }
      });
    });

    // Oportunidades de diferencial de alíquota
    sefazData.diferencialAliquota?.forEach((diff: any, uf: string) => {
      if (diff.valorTotalDiferenca > 0) {
        oportunidades.creditosSEFAZ.push({
          uf,
          tipo: 'ICMS - Diferencial de Alíquota',
          valor: diff.valorTotalDiferenca,
          descricao: 'Diferencial de alíquota em operações interestaduais',
          viabilidade: 85
        });
      }
    });

    // Identificar oportunidades de compensação
    if (rfbData.debitos?.debitos && oportunidades.creditosSEFAZ.length > 0) {
      for (const debito of rfbData.debitos.debitos) {
        for (const credito of oportunidades.creditosSEFAZ) {
          const valorCompensacao = Math.min(debito.valor, credito.valor);
          if (valorCompensacao > 1000) { // Mínimo para compensação
            oportunidades.compensacoes.push({
              creditoOrigem: `${credito.tipo} (${credito.uf})`,
              debitoDestino: debito.descricao,
              valorCompensacao,
              economia: valorCompensacao * 0.15 // 15% de economia estimada
            });
          }
        }
      }
    }

    return oportunidades;
  }

  // Calcular resumo financeiro
  private calcularResumoFinanceiro(rfbData: any, sefazData: any, oportunidades: any): any {
    let totalCreditos = 0;
    let totalDebitos = 0;

    // Somar débitos RFB
    if (rfbData.debitos?.totalDebitos) {
      totalDebitos += rfbData.debitos.totalDebitos;
    }

    // Somar créditos SEFAZ
    sefazData.icms?.forEach((icmsData: any) => {
      totalCreditos += icmsData.creditos?.reduce((sum: number, c: any) => sum + c.saldo, 0) || 0;
    });

    // Somar oportunidades identificadas
    const valorRecuperavel = [
      ...oportunidades.creditosRFB,
      ...oportunidades.creditosSEFAZ
    ].reduce((sum, op) => sum + op.valor, 0);

    const economiaEstimada = oportunidades.compensacoes.reduce((sum: number, comp: any) => sum + comp.economia, 0);

    return {
      totalCreditos,
      totalDebitos,
      saldoLiquido: totalCreditos - totalDebitos,
      economiaEstimada,
      valorRecuperavel
    };
  }

  // Avaliar riscos
  private avaliarRiscos(rfbData: any, sefazData: any): any {
    const alertas: string[] = [];
    const recomendacoes: string[] = [];
    let nivel: 'BAIXO' | 'MEDIO' | 'ALTO' = 'BAIXO';

    // Verificar situação cadastral
    if (rfbData.situacaoCadastral?.situacao !== 'ATIVA') {
      alertas.push('Situação cadastral irregular na Receita Federal');
      nivel = 'ALTO';
      recomendacoes.push('Regularizar situação cadastral antes de qualquer procedimento');
    }

    // Verificar débitos altos
    if (rfbData.debitos?.totalDebitos > 500000) {
      alertas.push('Débitos elevados na Receita Federal');
      nivel = nivel === 'BAIXO' ? 'MEDIO' : nivel;
      recomendacoes.push('Priorizar negociação de débitos ou compensação');
    }

    // Verificar situação nos estados
    let estadosIrregulares = 0;
    sefazData.icms?.forEach((icmsData: any, uf: string) => {
      if (icmsData.situacao === 'IRREGULAR') {
        estadosIrregulares++;
        alertas.push(`Situação irregular no ICMS do ${uf}`);
      }
    });

    if (estadosIrregulares > 2) {
      nivel = 'ALTO';
      recomendacoes.push('Regularizar situação fiscal nos estados com pendências');
    }

    // Verificar prazos
    const agora = new Date();
    rfbData.debitos?.debitos?.forEach((debito: any) => {
      const vencimento = new Date(debito.vencimento);
      const diasAteVencimento = Math.ceil((vencimento.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diasAteVencimento <= 30 && diasAteVencimento > 0) {
        alertas.push(`Débito vencendo em ${diasAteVencimento} dias`);
        recomendacoes.push('Acompanhar vencimentos próximos para evitar multas');
      }
    });

    return { nivel, alertas, recomendacoes };
  }

  // Configurar monitoramento automático
  async configurarMonitoramento(config: MonitoringConfig): Promise<void> {
    this.monitoramentos.set(config.cnpj, config);
    await this.salvarMonitoramentos();
    
    simpleNotificationService.show({
      type: 'success',
      message: `Monitoramento configurado para ${config.cnpj}`
    });
  }

  // Executar monitoramento automático
  private async executarMonitoramento(cnpj: string): Promise<void> {
    const config = this.monitoramentos.get(cnpj);
    if (!config?.ativo) return;

    try {
      const resultado = await this.analiseCompleta(cnpj);
      
      // Verificar alertas configurados
      if (config.alertas.novosDebitos && resultado.receitaFederal.debitos?.debitos?.length > 0) {
        simpleNotificationService.addNotification({
          type: 'warning',
          title: 'Novos Débitos Identificados',
          message: `${resultado.receitaFederal.debitos.debitos.length} débitos encontrados para ${cnpj}`,
          relatedType: 'monitoring'
        });
      }

      if (config.alertas.oportunidades && resultado.oportunidades.creditosRFB.length > 0) {
        simpleNotificationService.addNotification({
          type: 'info',
          title: 'Novas Oportunidades',
          message: `${resultado.oportunidades.creditosRFB.length + resultado.oportunidades.creditosSEFAZ.length} oportunidades identificadas`,
          relatedType: 'monitoring'
        });
      }

    } catch (error) {
      console.error(`Erro no monitoramento de ${cnpj}:`, error);
    }
  }

  // Iniciar monitoramento automático
  private iniciarMonitoramentoAutomatico(): void {
    // Executar monitoramento a cada 6 horas
    setInterval(async () => {
      for (const [cnpj, config] of this.monitoramentos) {
        if (config.ativo) {
          await this.executarMonitoramento(cnpj);
          // Delay entre empresas para não sobrecarregar APIs
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }, 6 * 60 * 60 * 1000); // 6 horas
  }

  // Salvar resultado da análise
  private async salvarResultadoAnalise(resultado: ComprehensiveAnalysisResult): Promise<void> {
    try {
      const analises = JSON.parse(localStorage.getItem('analises_governo_completas') || '[]');
      analises.unshift(resultado);
      
      // Manter apenas as 50 análises mais recentes
      if (analises.length > 50) {
        analises.splice(50);
      }
      
      localStorage.setItem('analises_governo_completas', JSON.stringify(analises));
    } catch (error) {
      console.error('Erro ao salvar análise:', error);
    }
  }

  // Carregar monitoramentos salvos
  private carregarMonitoramentos(): void {
    try {
      const salvos = JSON.parse(localStorage.getItem('monitoramentos_governo') || '[]');
      salvos.forEach((config: MonitoringConfig) => {
        this.monitoramentos.set(config.cnpj, config);
      });
    } catch (error) {
      console.error('Erro ao carregar monitoramentos:', error);
    }
  }

  // Salvar monitoramentos
  private async salvarMonitoramentos(): Promise<void> {
    try {
      const configs = Array.from(this.monitoramentos.values());
      localStorage.setItem('monitoramentos_governo', JSON.stringify(configs));
    } catch (error) {
      console.error('Erro ao salvar monitoramentos:', error);
    }
  }

  // Obter histórico de análises
  getHistoricoAnalises(): ComprehensiveAnalysisResult[] {
    try {
      return JSON.parse(localStorage.getItem('analises_governo_completas') || '[]');
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    }
  }

  // Obter análise mais recente de um CNPJ
  getUltimaAnalise(cnpj: string): ComprehensiveAnalysisResult | null {
    const historico = this.getHistoricoAnalises();
    return historico.find(analise => analise.cnpj === cnpj.replace(/\D/g, '')) || null;
  }

  // Estatísticas gerais
  getEstatisticas(): any {
    const historico = this.getHistoricoAnalises();
    const totalEmpresas = new Set(historico.map(h => h.cnpj)).size;
    const totalOportunidades = historico.reduce((sum, h) => 
      sum + h.oportunidades.creditosRFB.length + h.oportunidades.creditosSEFAZ.length, 0);
    const valorTotal = historico.reduce((sum, h) => sum + h.resumoFinanceiro.valorRecuperavel, 0);

    return {
      totalEmpresas,
      totalAnalises: historico.length,
      totalOportunidades,
      valorTotalRecuperavel: valorTotal,
      monitoramentosAtivos: Array.from(this.monitoramentos.values()).filter(m => m.ativo).length
    };
  }
}

export const governmentAPIsOrchestrator = new GovernmentAPIsOrchestratorService();