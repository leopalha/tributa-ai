import { api } from './api';
import { Titulo, TituloCreate, TituloUpdate, TituloFiltros } from '@/types/titulo';
import { MarketplaceStats } from '@/types/marketplace';

export class TituloService {
  private static instance: TituloService;
  private baseUrl = '/tcs';

  private constructor() {}

  public static getInstance(): TituloService {
    if (!TituloService.instance) {
      TituloService.instance = new TituloService();
    }
    return TituloService.instance;
  }

  public async listarTitulos(filtros?: TituloFiltros): Promise<Titulo[]> {
    return api.get(`${this.baseUrl}/titulos`, { params: filtros });
  }

  public async obterTitulo(id: string): Promise<Titulo> {
    return api.get(`${this.baseUrl}/titulos/${id}`);
  }

  public async criarTitulo(titulo: TituloCreate): Promise<Titulo> {
    return api.post(`${this.baseUrl}/titulos`, titulo);
  }

  public async atualizarTitulo(id: string, titulo: TituloUpdate): Promise<Titulo> {
    return api.put(`${this.baseUrl}/titulos/${id}`, titulo);
  }

  public async excluirTitulo(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/titulos/${id}`);
  }

  public async atualizarStatusTitulo(id: string, status: Titulo['status']): Promise<Titulo> {
    return api.patch(`${this.baseUrl}/titulos/${id}/status`, { status });
  }

  public async obterEstatisticas(): Promise<MarketplaceStats> {
    return api.get(`${this.baseUrl}/titulos/estatisticas`);
  }
}
