import { NextApiRequest, NextApiResponse } from 'next';
import {
  AnaliseObrigacoesService,
  DocumentoAnaliseData,
} from '@/services/analise-obrigacoes.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analiseId, documentos } = req.body;

    if (!analiseId) {
      return res.status(400).json({
        success: false,
        error: 'ID da análise é obrigatório',
      });
    }

    // Iniciar análise
    await AnaliseObrigacoesService.iniciarAnalise(analiseId);

    // Simular documentos se não fornecidos
    const documentosParaProcessar: DocumentoAnaliseData[] = documentos || [
      {
        nomeArquivo: 'DCTF_2023.xml',
        tipoDocumento: 'DCTF',
        tamanhoBytes: 1024000,
        hashArquivo: 'hash123',
        caminhoArmazenamento: '/storage/dctf_2023.xml',
      },
      {
        nomeArquivo: 'EFD_Contribuicoes_2023.txt',
        tipoDocumento: 'EFD',
        tamanhoBytes: 2048000,
        hashArquivo: 'hash456',
        caminhoArmazenamento: '/storage/efd_2023.txt',
      },
      {
        nomeArquivo: 'PGDAS_2023.pdf',
        tipoDocumento: 'PGDAS',
        tamanhoBytes: 512000,
        hashArquivo: 'hash789',
        caminhoArmazenamento: '/storage/pgdas_2023.pdf',
      },
    ];

    // Processar análise completa
    const analiseCompleta = await AnaliseObrigacoesService.processarAnaliseCompleta(
      analiseId,
      documentosParaProcessar
    );

    return res.status(200).json({
      success: true,
      data: analiseCompleta,
      message: 'Análise processada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao processar análise:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
    });
  }
}
