import { api } from './api';
import { Empresa, EmpresaFiltros, EmpresaPaginada, CertificadoDigital } from '@/types/empresa';

export class EmpresaService {
  private static instance: EmpresaService;
  private baseUrl = '/empresas';

  private constructor() {}

  public static getInstance(): EmpresaService {
    if (!EmpresaService.instance) {
      EmpresaService.instance = new EmpresaService();
    }
    return EmpresaService.instance;
  }

  public async getAll(filtros?: EmpresaFiltros): Promise<Empresa[]> {
    return api.get(this.baseUrl, { params: filtros });
  }

  public async getById(id: string): Promise<Empresa> {
    return api.get(`${this.baseUrl}/${id}`);
  }

  public async create(data: Omit<Empresa, 'id' | 'createdAt' | 'updatedAt'>): Promise<Empresa> {
    return api.post(this.baseUrl, data);
  }

  public async update(id: string, data: Partial<Empresa>): Promise<Empresa> {
    return api.put(`${this.baseUrl}/${id}`, data);
  }

  public async delete(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${id}`);
  }

  public async getPaginated(filtros?: EmpresaFiltros): Promise<EmpresaPaginada> {
    return api.get(`${this.baseUrl}/paginated`, { params: filtros });
  }

  public async validarCNPJ(cnpj: string): Promise<{
    valido: boolean;
    razaoSocial?: string;
    nomeFantasia?: string;
    endereco?: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    };
  }> {
    return api.get(`${this.baseUrl}/validar-cnpj`, { params: { cnpj } });
  }

  public async uploadCertificado(
    empresaId: string,
    arquivo: File,
    senha: string,
    onProgress?: (progress: number) => void
  ): Promise<CertificadoDigital> {
    const formData = new FormData();
    formData.append('file', arquivo);
    formData.append('senha', senha);

    return api.upload(`${this.baseUrl}/${empresaId}/certificados`, formData, onProgress);
  }

  public async obterCertificados(empresaId: string): Promise<CertificadoDigital[]> {
    return api.get(`${this.baseUrl}/${empresaId}/certificados`);
  }

  public async revogarCertificado(empresaId: string, certificadoId: string): Promise<void> {
    return api.post(`${this.baseUrl}/${empresaId}/certificados/${certificadoId}/revogar`);
  }

  public async obterObrigacoes(empresaId: string): Promise<
    {
      tipo: string;
      periodicidade: string;
      proximoVencimento?: string;
      status: string;
    }[]
  > {
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

  public async vincularUsuario(
    empresaId: string,
    usuarioId: string,
    permissoes: string[]
  ): Promise<void> {
    return api.post(`${this.baseUrl}/${empresaId}/usuarios/${usuarioId}`, { permissoes });
  }

  public async desvincularUsuario(empresaId: string, usuarioId: string): Promise<void> {
    return api.delete(`${this.baseUrl}/${empresaId}/usuarios/${usuarioId}`);
  }

  public async obterUsuariosVinculados(empresaId: string): Promise<
    {
      id: string;
      nome: string;
      email: string;
      permissoes: string[];
    }[]
  > {
    return api.get(`${this.baseUrl}/${empresaId}/usuarios`);
  }
}

export const empresaService = EmpresaService.getInstance();
