import { api } from './api';
import { Empresa, CertificadoDigital } from '@/types/empresa';

export interface EmpresaFiltros {
  status?: string;
  setorAtividade?: string;
  regimeTributario?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface EmpresaPaginada {
  items: Empresa[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class EmpresaService {
  private static instance: EmpresaService;
  private baseUrl = '/empresas';

  private constructor() {}

  public static getInstance(): EmpresaService {
    if (!EmpresaService.instance) {
      EmpresaService.instance = new EmpresaService();
    }
    return EmpresaService.instance;
  }

  public async listar(filtros?: EmpresaFiltros): Promise<EmpresaPaginada> {
    return api.get(this.baseUrl, filtros);
  }

  public async obterPorId(id: string): Promise<Empresa> {
    return api.get(`${this.baseUrl}/${id}`);
  }

  public async criar(empresa: Omit<Empresa, 'id'>): Promise<Empresa> {
    return api.post(this.baseUrl, empresa);
  }

  public async atualizar(id: string, empresa: Partial<Empresa>): Promise<Empresa> {
    return api.put(`${this.baseUrl}/${id}`, empresa);
  }

  public async excluir(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}`);
  }

  public async validarCNPJ(cnpj: string): Promise<{
    valido: boolean;
    dados?: {
      razaoSocial: string;
      nomeFantasia?: string;
      dataAbertura: string;
      status: string;
      endereco: {
        cep: string;
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
      };
    };
  }> {
    return api.get(`${this.baseUrl}/validar-cnpj/${cnpj}`);
  }

  public async uploadCertificado(
    empresaId: string,
    arquivo: File,
    senha: string,
    onProgress?: (progress: number) => void
  ): Promise<CertificadoDigital> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('senha', senha);
    
    return api.upload(`${this.baseUrl}/${empresaId}/certificados`, arquivo, onProgress);
  }

  public async obterCertificados(empresaId: string): Promise<CertificadoDigital[]> {
    return api.get(`${this.baseUrl}/${empresaId}/certificados`);
  }

  public async revogarCertificado(empresaId: string, certificadoId: string): Promise<void> {
    return api.post(`${this.baseUrl}/${empresaId}/certificados/${certificadoId}/revogar`);
  }

  public async obterObrigacoes(empresaId: string): Promise<{
    tipo: string;
    periodicidade: string;
    proximoVencimento?: string;
    status: string;
  }[]> {
    return api.get(`${this.baseUrl}/${empresaId}/obrigacoes`);
  }

  public async obterIndicadores(empresaId: string): Promise<{
    obrigacoesEmDia: number;
    obrigacoesAtrasadas: number;
    declaracoesEntregues: number;
    declaracoesPendentes: number;
    creditosDisponiveis: number;
    debitosVencidos: number;
  }> {
    return api.get(`${this.baseUrl}/${empresaId}/indicadores`);
  }

  public async obterFiliais(empresaId: string): Promise<Empresa[]> {
    return api.get(`${this.baseUrl}/${empresaId}/filiais`);
  }

  public async vincularUsuario(empresaId: string, usuarioId: string, permissoes: string[]): Promise<void> {
    return api.post(`${this.baseUrl}/${empresaId}/usuarios/${usuarioId}`, { permissoes });
  }

  public async desvincularUsuario(empresaId: string, usuarioId: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${empresaId}/usuarios/${usuarioId}`);
  }

  public async obterUsuariosVinculados(empresaId: string): Promise<{
    id: string;
    nome: string;
    email: string;
    permissoes: string[];
  }[]> {
    return api.get(`${this.baseUrl}/${empresaId}/usuarios`);
  }
}

export const empresaService = EmpresaService.getInstance(); 