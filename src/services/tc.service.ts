import { api } from './api';
import { Titulo, TituloCreate, TituloUpdate, TituloFiltros } from '@/types/titulo';
import { Transacao, TransacaoCreate, TransacaoUpdate, TransacaoFiltros } from '@/types/transacao';

export class TCService {
  private static instance: TCService;
  private baseUrl = '/tcs';

  private constructor() {}

  public static getInstance(): TCService {
    if (!TCService.instance) {
      TCService.instance = new TCService();
    }
    return TCService.instance;
  }

  // Métodos para Títulos
  public async listarTitulos(filtros?: TituloFiltros): Promise<Titulo[]> {
    return api.get(`${this.baseUrl}/titulos`, filtros);
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

  // Métodos para Transações
  public async listarTransacoes(filtros?: TransacaoFiltros): Promise<Transacao[]> {
    return api.get(`${this.baseUrl}/transacoes`, filtros);
  }

  public async obterTransacao(id: string): Promise<Transacao> {
    return api.get(`${this.baseUrl}/transacoes/${id}`);
  }

  public async criarTransacao(transacao: TransacaoCreate): Promise<Transacao> {
    return api.post(`${this.baseUrl}/transacoes`, transacao);
  }

  public async atualizarTransacao(id: string, transacao: TransacaoUpdate): Promise<Transacao> {
    return api.put(`${this.baseUrl}/transacoes/${id}`, transacao);
  }

  public async excluirTransacao(id: string): Promise<void> {
    return api.delete(`${this.baseUrl}/transacoes/${id}`);
  }

  public async atualizarStatusTransacao(
    id: string,
    status: Transacao['status']
  ): Promise<Transacao> {
    return api.patch(`${this.baseUrl}/transacoes/${id}/status`, { status });
  }

  // Métodos de utilidade
  public isTituloAtivo(titulo: Titulo): boolean {
    return titulo.status === 'disponivel';
  }

  public isTituloPendente(titulo: Titulo): boolean {
    return titulo.status === 'reservado';
  }

  public isTituloConcluido(titulo: Titulo): boolean {
    return titulo.status === 'vendido';
  }

  public isTransacaoPendente(transacao: Transacao): boolean {
    return transacao.status === 'transacao_pendente';
  }

  public isTransacaoConcluida(transacao: Transacao): boolean {
    return transacao.status === 'transacao_concluida';
  }

  public isTransacaoRejeitada(transacao: Transacao): boolean {
    return transacao.status === 'transacao_erro';
  }
}

export const tcService = TCService.getInstance();
