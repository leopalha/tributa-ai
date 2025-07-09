import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { titulo, categoria, valor, precoVenda, vencimento, emissorId, detalhes, documentos } =
      req.body;

    if (!titulo || !categoria || !valor || !emissorId) {
      return res.status(400).json({
        error: 'Campos obrigatórios: titulo, categoria, valor, emissorId',
      });
    }

    // Criar título de crédito
    const creditTitle = await prisma.creditTitle.create({
      data: {
        category: categoria,
        valueNominal: Number(valor),
        valueCurrent: Number(precoVenda) || Number(valor) * 0.85,
        listingPrice: Number(precoVenda),
        issueDate: new Date(),
        expiryDate: vencimento ? new Date(vencimento) : null,
        issuerId: emissorId,
        ownerId: emissorId,
        status: 'PENDING_TOKENIZATION',
        isListed: false,
        tokenId: `TKN-${categoria}-${Date.now()}`,
        tokenStandard: 'ERC-1400-TRIBUTA',
        blockchainTxHash: `0x${Math.random().toString(16).substring(2, 42)}`,
      },
    });

    // Criar detalhes específicos se for tributário
    if (categoria === 'TRIBUTARIO' && detalhes) {
      await prisma.creditTitleTributario.create({
        data: {
          creditTitleId: creditTitle.id,
          esfera: detalhes.esfera || 'FEDERAL',
          nomeTributo: detalhes.nomeTributo || titulo,
          periodoApuracaoInicio: detalhes.periodoInicio
            ? new Date(detalhes.periodoInicio)
            : new Date(),
          periodoApuracaoFim: detalhes.periodoFim ? new Date(detalhes.periodoFim) : new Date(),
          numeroProcessoAdministrativo: detalhes.numeroProcesso,
          subTypeFederal: detalhes.esfera === 'FEDERAL' ? detalhes.subTipo : null,
          subTypeEstadual: detalhes.esfera === 'ESTADUAL' ? detalhes.subTipo : null,
          subTypeMunicipal: detalhes.esfera === 'MUNICIPAL' ? detalhes.subTipo : null,
        },
      });
    }

    // Simular processo de tokenização na blockchain
    setTimeout(async () => {
      await prisma.creditTitle.update({
        where: { id: creditTitle.id },
        data: {
          status: 'TOKENIZED',
          isListed: !!precoVenda,
          listingDate: precoVenda ? new Date() : null,
        },
      });
    }, 3000);

    return res.status(201).json({
      success: true,
      data: {
        id: creditTitle.id,
        tokenId: creditTitle.tokenId,
        status: creditTitle.status,
        blockchainTxHash: creditTitle.blockchainTxHash,
        message: 'Tokenização iniciada com sucesso',
      },
    });
  } catch (error) {
    console.error('Tokenization error:', error);
    return res.status(500).json({ error: 'Erro no processo de tokenização' });
  }
}
