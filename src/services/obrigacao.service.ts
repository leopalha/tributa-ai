import { api } from '@/services/api';
import {
  Obrigacao,
  ObrigacaoCreate,
  ObrigacaoUpdate,
  ObrigacaoFiltros,
  ObrigacaoEstatisticas,
  ObrigacaoPendencias,
  ObrigacaoCalendario,
  AnexoObrigacao,
  HistoricoObrigacao,
} from '@/types/obrigacao';
import { StatusObrigacao } from '@/types/common/status';
import { mapToBaseStatus, isStatusInState } from '@/types/common/status';

export class ObrigacaoService {
  async listar(filtros?: ObrigacaoFiltros): Promise<Obrigacao[]> {
    const response = await api.get('/obrigacoes', { params: filtros });
    return response.data;
  }

  async obter(id: string): Promise<Obrigacao> {
    const response = await api.get(`/obrigacoes/${id}`);
    return response.data;
  }

  async criar(obrigacao: ObrigacaoCreate): Promise<Obrigacao> {
    const response = await api.post('/obrigacoes', obrigacao);
    return response.data;
  }

  async atualizar(id: string, obrigacao: ObrigacaoUpdate): Promise<Obrigacao> {
    const response = await api.put(`/obrigacoes/${id}`, obrigacao);
    return response.data;
  }

  async excluir(id: string): Promise<void> {
    await api.delete(`/obrigacoes/${id}`);
  }

  async atualizarStatus(id: string, status: StatusObrigacao): Promise<Obrigacao> {
    const response = await api.patch(`/obrigacoes/${id}/status`, { status });
    return response.data;
  }

  async atribuirResponsavel(id: string, responsavelId: string): Promise<Obrigacao> {
    const response = await api.patch(`/obrigacoes/${id}/responsavel`, { responsavelId });
    return response.data;
  }

  async uploadAnexo(id: string, arquivo: File): Promise<AnexoObrigacao> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    const response = await api.upload(`/obrigacoes/${id}/anexos`, formData);
    return response.data;
  }

  async excluirAnexo(id: string, anexoId: string): Promise<void> {
    await api.delete(`/obrigacoes/${id}/anexos/${anexoId}`);
  }

  async baixarAnexo(id: string, anexoId: string): Promise<Blob> {
    const response = await api.get(`/obrigacoes/${id}/anexos/${anexoId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async validar(id: string): Promise<{ valido: boolean; mensagens: string[] }> {
    const response = await api.post(`/obrigacoes/${id}/validar`);
    return response.data;
  }

  async obterHistorico(id: string): Promise<HistoricoObrigacao[]> {
    const response = await api.get(`/obrigacoes/${id}/historico`);
    return response.data;
  }

  async gerarRelatorio(
    filtros?: ObrigacaoFiltros,
    formato: 'csv' | 'pdf' | 'excel' = 'pdf'
  ): Promise<Blob> {
    const response = await api.get('/obrigacoes/relatorio', {
      params: { ...filtros, formato },
      responseType: 'blob',
    });
    return response.data;
  }

  async obterEstatisticas(empresaId: string): Promise<ObrigacaoEstatisticas> {
    const response = await api.get(`/obrigacoes/estatisticas`, {
      params: { empresaId },
    });
    return response.data;
  }

  async verificarPendencias(empresaId: string): Promise<ObrigacaoPendencias> {
    const response = await api.get(`/obrigacoes/pendencias`, {
      params: { empresaId },
    });
    return response.data;
  }

  async obterCalendario(empresaId: string, mes: number, ano: number): Promise<ObrigacaoCalendario> {
    const response = await api.get(`/obrigacoes/calendario`, {
      params: { empresaId, mes, ano },
    });
    return response.data;
  }

  // Utility methods
  isObrigacaoPendente(status: StatusObrigacao): boolean {
    return isStatusInState('obrigacao', status, 'PENDENTE');
  }

  isObrigacaoEmAndamento(status: StatusObrigacao): boolean {
    return isStatusInState('obrigacao', status, 'PROCESSANDO');
  }

  isObrigacaoConcluida(status: StatusObrigacao): boolean {
    return isStatusInState('obrigacao', status, 'CONCLUIDO');
  }

  isObrigacaoAtrasada(status: StatusObrigacao): boolean {
    return isStatusInState('obrigacao', status, 'REJEITADO');
  }

  isObrigacaoDispensada(status: StatusObrigacao): boolean {
    return isStatusInState('obrigacao', status, 'CANCELADO');
  }
}
