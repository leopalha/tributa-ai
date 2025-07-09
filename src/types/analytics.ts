export type PeriodoAnalise = 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano' | 'personalizado';

export type TipoGrafico = 'linha' | 'barra' | 'pizza' | 'area' | 'scatter' | 'radar';

export type CategoriaInsight = 'tendencia' | 'anomalia' | 'oportunidade' | 'risco';

export interface MetricaAnalytics {
  id: string;
  nome: string;
  valor: number;
  unidade: string;
  tendencia: 'up' | 'down' | 'stable';
  variacao: number;
  meta?: number;
  categoria: string;
  descricao?: string;
  atualizadoEm: string;
}

export interface SerieGrafico {
  nome: string;
  dados: Array<{
    x: string | number;
    y: number;
  }>;
  cor?: string;
}

export interface GraficoAnalytics {
  id: string;
  titulo: string;
  tipo: 'linha' | 'barra' | 'pizza' | 'area' | 'scatter';
  series: SerieGrafico[];
  categorias?: string[];
  config?: {
    empilhado?: boolean;
    mostrarLegenda?: boolean;
    mostrarRotulos?: boolean;
    formatoValor?: string;
    cores?: string[];
    eixoY?: {
      titulo?: string;
      min?: number;
      max?: number;
      formato?: string;
    };
    eixoX?: {
      titulo?: string;
      formato?: string;
    };
  };
}

export interface Insight {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'credito' | 'obrigacao' | 'risco' | 'oportunidade';
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'novo' | 'visto' | 'arquivado';
  dataCriacao: string;
  metricas?: {
    nome: string;
    valor: number;
    unidade: string;
  }[];
  recomendacoes?: {
    descricao: string;
    impacto: string;
    dificuldade: 'alta' | 'media' | 'baixa';
  }[];
}

export interface RelatorioAnalytics {
  id: string;
  titulo: string;
  descricao: string;
  periodo: PeriodoAnalise;
  dataInicio: string;
  dataFim: string;
  dataCriacao: string;
  criadoPor: {
    id: string;
    nome: string;
  };
  metricas: MetricaAnalytics[];
  graficos: GraficoAnalytics[];
  insights?: Insight[];
  filtros?: Record<string, unknown>;
}

export interface ComponenteDashboard {
  id: string;
  tipo: 'metrica' | 'grafico' | 'insight' | 'lista';
  titulo: string;
  tamanho: {
    w: number;
    h: number;
  };
  posicao: {
    x: number;
    y: number;
  };
  config: {
    metricaId?: string;
    graficoId?: string;
    filtros?: Record<string, unknown>;
    atualizacaoAutomatica?: boolean;
    intervaloAtualizacao?: number;
  };
}

export interface DashboardAnalytics {
  id: string;
  titulo: string;
  descricao?: string;
  componentes: ComponenteDashboard[];
  layout: {
    colunas: number;
    espacamento: number;
    margens: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  filtrosGlobais?: Record<string, unknown>;
  compartilhado?: boolean;
  permissoes?: {
    visualizar: string[];
    editar: string[];
  };
  criadoPor: {
    id: string;
    nome: string;
  };
  dataCriacao: string;
  dataAtualizacao: string;
}
