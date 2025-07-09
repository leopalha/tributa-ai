import { NextApiRequest, NextApiResponse } from 'next';
import { AnaliseObrigacoesService } from '@/services/analise-obrigacoes.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return await criarAnalise(req, res);
    case 'GET':
      return await buscarAnalises(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function criarAnalise(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { cnpjEmpresa, razaoSocialEmpresa, nomeFantasiaEmpresa, regimeTributario } = req.body;

    // TODO: Implementar autenticação real
    const criadoPorId = 'user-demo'; // Temporário para desenvolvimento

    const analise = await AnaliseObrigacoesService.criarAnalise({
      cnpjEmpresa,
      razaoSocialEmpresa,
      nomeFantasiaEmpresa,
      regimeTributario,
      criadoPorId,
    });

    return res.status(201).json({
      success: true,
      data: analise,
      message: 'Análise criada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao criar análise:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    });
  }
}

async function buscarAnalises(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { cnpj, userId } = req.query;

    // TODO: Implementar autenticação real
    const userIdFinal = (userId as string) || 'user-demo';

    if (cnpj) {
      const analise = await AnaliseObrigacoesService.buscarAnalisePorCNPJ(cnpj as string);
      return res.status(200).json({
        success: true,
        data: analise,
      });
    }

    const analises = await AnaliseObrigacoesService.buscarAnalisesPorUsuario(userIdFinal);
    return res.status(200).json({
      success: true,
      data: analises,
    });
  } catch (error) {
    console.error('Erro ao buscar análises:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    });
  }
}
