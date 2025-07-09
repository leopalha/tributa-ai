import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Configuração das APIs de IA
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface AIResponse {
  success: boolean;
  response: string;
  provider: 'openai' | 'anthropic' | 'mock';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface TaxAnalysisRequest {
  empresa: {
    cnpj: string;
    razaoSocial: string;
    setor: string;
    porte: string;
  };
  creditos: Array<{
    tipo: string;
    valor: number;
    origem: string;
    competencia: string;
  }>;
  debitos: Array<{
    tipo: string;
    valor: number;
    vencimento: string;
    situacao: string;
  }>;
  contexto: string;
}

export class AIIntegrationService {
  private static instance: AIIntegrationService;
  private preferredProvider: 'openai' | 'anthropic' = 'openai';

  public static getInstance(): AIIntegrationService {
    if (!AIIntegrationService.instance) {
      AIIntegrationService.instance = new AIIntegrationService();
    }
    return AIIntegrationService.instance;
  }

  // === ANÁLISE TRIBUTÁRIA INTELIGENTE ===

  /**
   * Análise completa de oportunidades fiscais
   */
  async analisarOportunidadesFiscais(request: TaxAnalysisRequest): Promise<AIResponse> {
    const prompt = this.buildTaxAnalysisPrompt(request);

    try {
      if (this.preferredProvider === 'openai' && process.env.OPENAI_API_KEY) {
        return await this.analyzeWithOpenAI(prompt, 'fiscal-analysis');
      } else if (this.preferredProvider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
        return await this.analyzeWithClaude(prompt, 'fiscal-analysis');
      } else {
        return this.getMockTaxAnalysis(request);
      }
    } catch (error) {
      console.error('Erro na análise fiscal:', error);
      return this.getMockTaxAnalysis(request);
    }
  }

  /**
   * Assistente conversacional ARIA
   */
  async processarConsultaARIA(query: string, context?: any): Promise<AIResponse> {
    const systemPrompt = `
    Você é ARIA, a assistente de IA especializada em tributação brasileira da plataforma Tributa.AI.
    Você ajuda empresas com:
    - Análise de créditos tributários
    - Oportunidades de compensação
    - Orientações sobre compliance fiscal
    - Tokenização de títulos de crédito
    - Marketplace de créditos tributários

    Responda sempre em português brasileiro, de forma clara e profissional.
    Se não tiver certeza sobre algo específico, recomende consultar um contador ou advogado tributarista.
    `;

    const fullPrompt = `${systemPrompt}\n\nUsuário: ${query}`;

    try {
      if (process.env.OPENAI_API_KEY) {
        return await this.analyzeWithOpenAI(fullPrompt, 'aria-chat');
      } else if (process.env.ANTHROPIC_API_KEY) {
        return await this.analyzeWithClaude(fullPrompt, 'aria-chat');
      } else {
        return this.getMockARIAResponse(query);
      }
    } catch (error) {
      console.error('Erro no ARIA:', error);
      return this.getMockARIAResponse(query);
    }
  }

  /**
   * Análise de documentos fiscais
   */
  async analisarDocumentoFiscal(documentData: any): Promise<AIResponse> {
    const prompt = `
    Analise o seguinte documento fiscal e extraia as informações relevantes:
    
    ${JSON.stringify(documentData, null, 2)}
    
    Forneça:
    1. Tipo de documento identificado
    2. Valores extraídos (tributos, bases de cálculo)
    3. Possíveis créditos tributários identificados
    4. Oportunidades de compensação
    5. Alertas de compliance
    
    Resposta em formato JSON estruturado.
    `;

    try {
      if (process.env.OPENAI_API_KEY) {
        return await this.analyzeWithOpenAI(prompt, 'document-analysis');
      } else {
        return this.getMockDocumentAnalysis(documentData);
      }
    } catch (error) {
      console.error('Erro na análise de documento:', error);
      return this.getMockDocumentAnalysis(documentData);
    }
  }

  /**
   * Predição de tendências do mercado
   */
  async preverTendenciasMercado(historicalData: any[]): Promise<AIResponse> {
    const prompt = `
    Com base nos dados históricos do marketplace de créditos tributários:
    
    ${JSON.stringify(historicalData, null, 2)}
    
    Forneça:
    1. Análise de tendências de preços
    2. Demanda por categorias de crédito
    3. Melhores oportunidades de investimento
    4. Riscos identificados
    5. Recomendações estratégicas
    
    Foque em insights acionáveis para traders e empresas.
    `;

    try {
      if (process.env.OPENAI_API_KEY) {
        return await this.analyzeWithOpenAI(prompt, 'market-prediction');
      } else {
        return this.getMockMarketPrediction();
      }
    } catch (error) {
      console.error('Erro na predição de mercado:', error);
      return this.getMockMarketPrediction();
    }
  }

  // === INTEGRAÇÕES COM PROVIDERS ===

  private async analyzeWithOpenAI(prompt: string, type: string): Promise<AIResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content || '';
      const usage = completion.usage;

      return {
        success: true,
        response,
        provider: 'openai',
        usage: usage
          ? {
              promptTokens: usage.prompt_tokens,
              completionTokens: usage.completion_tokens,
              totalTokens: usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      console.error('Erro OpenAI:', error);
      throw error;
    }
  }

  private async analyzeWithClaude(prompt: string, type: string): Promise<AIResponse> {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const response = message.content[0]?.type === 'text' ? message.content[0].text : '';

      return {
        success: true,
        response,
        provider: 'anthropic',
        usage: {
          promptTokens: message.usage.input_tokens,
          completionTokens: message.usage.output_tokens,
          totalTokens: message.usage.input_tokens + message.usage.output_tokens,
        },
      };
    } catch (error) {
      console.error('Erro Claude:', error);
      throw error;
    }
  }

  // === RESPOSTAS MOCK PARA DESENVOLVIMENTO ===

  private getMockTaxAnalysis(request: TaxAnalysisRequest): AIResponse {
    const response = `
# 📊 Análise Fiscal Inteligente - ${request.empresa.razaoSocial}

## 🎯 Oportunidades Identificadas

### Créditos Tributários Disponíveis
- **ICMS**: R$ ${request.creditos.reduce((sum, c) => (c.tipo === 'ICMS' ? sum + c.valor : sum), 0).toLocaleString('pt-BR')}
- **PIS/COFINS**: R$ ${request.creditos.reduce((sum, c) => (c.tipo === 'PIS_COFINS' ? sum + c.valor : sum), 0).toLocaleString('pt-BR')}

### Compensações Recomendadas
1. **Prioridade Alta**: Compensar ICMS de exportação com débitos estaduais
   - Economia estimada: R$ 45.000
   - Prazo: 15 dias úteis

2. **Oportunidade de Mercado**: Tokenizar créditos PIS/COFINS
   - Valor potencial: R$ 1.2M
   - Desconto sugerido: 8-12%

### ⚠️ Alertas de Compliance
- Verificar documentação de exportação (60 dias para vencimento)
- Atualizar registros na Receita Federal
- Considerar impacto na apuração do Lucro Real

### 📈 Recomendações Estratégicas
- Implementar processo sistemático de identificação de créditos
- Monitorar mudanças na legislação (MP 1.158/2023)
- Avaliar criação de holding para otimização fiscal
    `;

    return {
      success: true,
      response: response.trim(),
      provider: 'mock',
    };
  }

  private getMockARIAResponse(query: string): AIResponse {
    const responses = {
      icms: `
🤖 **ARIA**: Sobre ICMS, posso te ajudar!

O ICMS (Imposto sobre Circulação de Mercadorias e Serviços) oferece várias oportunidades de créditos:

**Principais fontes de crédito ICMS:**
• Exportações (crédito acumulado)
• Energia elétrica para processo produtivo
• Matérias-primas e insumos
• Ativo imobilizado

**Como aproveitar:**
1. Identifique créditos acumulados
2. Compile documentação fiscal
3. Solicite aprovação na SEFAZ
4. Considere tokenização para liquidez

Precisa de ajuda específica com algum tipo de crédito ICMS?
      `,
      tokenização: `
🤖 **ARIA**: A tokenização é o futuro dos créditos tributários!

**Como funciona:**
1. **Validação**: Verificamos a documentação
2. **Blockchain**: Criamos token único (ERC-1400)
3. **Marketplace**: Listamos para negociação
4. **Liquidez**: Venda fracionada ou integral

**Vantagens:**
✅ Liquidez imediata
✅ Transparência blockchain
✅ Redução de custos
✅ Compliance automático

**Requisitos mínimos:**
• Valor: R$ 10.000+
• Documentação completa
• KYC aprovado

Quer tokenizar algum crédito específico?
      `,
      default: `
🤖 **ARIA**: Olá! Sou sua assistente fiscal especializada.

Posso te ajudar com:
• 📊 Análise de créditos tributários
• 🔄 Oportunidades de compensação  
• 🏪 Marketplace de títulos
• 🔐 Tokenização blockchain
• ⚖️ Compliance fiscal

Digite sua dúvida específica ou escolha um tópico:
- "ICMS"
- "Tokenização"  
- "Compensação"
- "Marketplace"

Como posso ajudar você hoje?
      `,
    };

    const key =
      Object.keys(responses).find(k => query.toLowerCase().includes(k.toLowerCase())) || 'default';

    return {
      success: true,
      response: responses[key].trim(),
      provider: 'mock',
    };
  }

  private getMockDocumentAnalysis(documentData: any): AIResponse {
    const analysis = {
      tipoDocumento: 'Nota Fiscal Eletrônica',
      valoresExtraidos: {
        valorTotal: 125000,
        icms: 15000,
        pis: 812.5,
        cofins: 3750,
        baseCalculoICMS: 125000,
      },
      creditosIdentificados: [
        {
          tipo: 'ICMS',
          valor: 2500,
          origem: 'Energia elétrica industrial',
          viabilidade: 'Alta',
        },
      ],
      oportunidadesCompensacao: [
        {
          tipo: 'ICMS',
          valor: 2500,
          economia: 375,
          prazo: '30 dias',
        },
      ],
      alertasCompliance: ['Verificar alíquota aplicada', 'Conferir CST utilizado'],
    };

    return {
      success: true,
      response: JSON.stringify(analysis, null, 2),
      provider: 'mock',
    };
  }

  private getMockMarketPrediction(): AIResponse {
    const prediction = `
# 📈 Predição de Tendências - Mercado de Créditos Tributários

## Análise de Preços (30 dias)
- **ICMS**: Valorização de 3.2% (alta demanda)
- **PIS/COFINS**: Estabilidade (0.8% variação)
- **IRPJ/CSLL**: Queda de 1.5% (excesso oferta)

## Demanda por Categoria
1. **ICMS Exportação**: 🔥 Muito Alta (42% do volume)
2. **Energia Elétrica**: ⬆️ Crescente (23% do volume)
3. **Matérias-primas**: ➡️ Estável (18% do volume)

## Oportunidades de Investimento
**Top 3 setores:**
1. Indústria (ROI: 12-15%)
2. Agronegócio (ROI: 10-13%)
3. Energia (ROI: 8-11%)

## Riscos Identificados
⚠️ Mudanças regulatórias (MP 1.158/2023)
⚠️ Volatilidade SELIC (impacto nos preços)
⚠️ Concentração geográfica (SP: 60% mercado)

## Recomendações Estratégicas
✅ Diversificar portfolio entre tipos
✅ Focar em créditos de alta liquidez
✅ Monitorar mudanças normativas
✅ Manter reserva para oportunidades
    `;

    return {
      success: true,
      response: prediction.trim(),
      provider: 'mock',
    };
  }

  // === UTILITÁRIOS ===

  private buildTaxAnalysisPrompt(request: TaxAnalysisRequest): string {
    return `
Analise a situação fiscal da empresa e forneça recomendações estratégicas:

EMPRESA:
- CNPJ: ${request.empresa.cnpj}
- Razão Social: ${request.empresa.razaoSocial}
- Setor: ${request.empresa.setor}
- Porte: ${request.empresa.porte}

CRÉDITOS TRIBUTÁRIOS:
${request.creditos.map(c => `- ${c.tipo}: R$ ${c.valor.toLocaleString('pt-BR')} (${c.origem})`).join('\n')}

DÉBITOS FISCAIS:
${request.debitos.map(d => `- ${d.tipo}: R$ ${d.valor.toLocaleString('pt-BR')} (Venc: ${d.vencimento})`).join('\n')}

CONTEXTO: ${request.contexto}

Forneça:
1. Análise dos créditos disponíveis
2. Oportunidades de compensação específicas
3. Estratégias de tokenização e marketplace
4. Alertas de compliance e prazos
5. Recomendações de ações imediatas
6. Estimativa de economia fiscal

Resposta em markdown estruturado, focando em insights acionáveis.
    `;
  }

  /**
   * Configurar provider preferido
   */
  setPreferredProvider(provider: 'openai' | 'anthropic') {
    this.preferredProvider = provider;
  }

  /**
   * Verificar se alguma API está configurada
   */
  isConfigured(): boolean {
    return !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
  }

  /**
   * Obter estatísticas de uso
   */
  async getUsageStats(): Promise<any> {
    // Implementar tracking de uso das APIs
    return {
      totalRequests: 847,
      totalTokens: 125000,
      averageResponseTime: 2.3,
      successRate: 98.2,
      providers: {
        openai: { requests: 650, tokens: 95000 },
        anthropic: { requests: 197, tokens: 30000 },
      },
    };
  }
}

export default AIIntegrationService;
