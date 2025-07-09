import { NextApiRequest, NextApiResponse } from 'next';
import { AnaliseObrigacoesService } from '@/services/analise-obrigacoes.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    // TODO: Implementar autenticação real
    const userIdFinal = (userId as string) || 'user-demo';

    const estatisticas = await AnaliseObrigacoesService.obterEstatisticasGerais(userIdFinal);

    return res.status(200).json({
      success: true,
      data: estatisticas,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    });
  }
}
