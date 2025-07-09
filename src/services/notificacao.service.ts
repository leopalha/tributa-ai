import { api } from './api';
import {
  Notificacao,
  NotificacaoCreate,
  NotificacaoUpdate,
  NotificacaoFiltros,
  NotificacaoPreferencias,
  NotificacaoQuantidade,
  NotificacaoEmail,
  NotificacaoSMS,
  StatusNotificacao,
} from '@/types/notificacao';

class NotificacaoService {
  async listar(filtros?: NotificacaoFiltros): Promise<Notificacao[]> {
    return api.get('/notificacoes', filtros);
  }

  async obter(id: string): Promise<Notificacao> {
    return api.get(`/notificacoes/${id}`);
  }

  async criar(notificacao: NotificacaoCreate): Promise<Notificacao> {
    return api.post('/notificacoes', notificacao);
  }

  async atualizar(id: string, notificacao: NotificacaoUpdate): Promise<Notificacao> {
    return api.put(`/notificacoes/${id}`, notificacao);
  }

  async excluir(id: string): Promise<void> {
    return api.delete(`/notificacoes/${id}`);
  }

  async marcarComoLida(id: string): Promise<Notificacao> {
    return api.patch(`/notificacoes/${id}/lida`);
  }

  async marcarTodasComoLidas(): Promise<void> {
    return api.patch('/notificacoes/lidas');
  }

  async obterNaoLidas(): Promise<Notificacao[]> {
    return api.get('/notificacoes/nao-lidas');
  }

  async obterQuantidadeNaoLidas(): Promise<NotificacaoQuantidade> {
    return api.get('/notificacoes/quantidade-nao-lidas');
  }

  async enviarEmail(notificacao: NotificacaoEmail): Promise<void> {
    return api.post('/notificacoes/email', notificacao);
  }

  async enviarSMS(notificacao: NotificacaoSMS): Promise<void> {
    return api.post('/notificacoes/sms', notificacao);
  }

  async obterPreferencias(usuarioId: string): Promise<NotificacaoPreferencias> {
    return api.get(`/notificacoes/preferencias/${usuarioId}`);
  }

  async atualizarPreferencias(
    usuarioId: string,
    preferencias: NotificacaoPreferencias
  ): Promise<void> {
    return api.put(`/notificacoes/preferencias/${usuarioId}`, preferencias);
  }

  isNotificacaoNaoLida(notificacao: Notificacao): boolean {
    return notificacao.status === 'notificacao_nao_lida';
  }

  isNotificacaoLida(notificacao: Notificacao): boolean {
    return notificacao.status === 'notificacao_lida';
  }

  isNotificacaoArquivada(notificacao: Notificacao): boolean {
    return notificacao.status === 'notificacao_arquivada';
  }
}

export const notificacaoService = new NotificacaoService();
