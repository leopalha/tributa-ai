import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getAnuncios(req, res);
      case 'POST':
        return await createAnuncio(req, res);
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function getAnuncios(req: NextApiRequest, res: NextApiResponse) {
  const { categoria, status, page = 1, limit = 20 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {
    isListed: true,
    status: 'LISTED_FOR_SALE',
    ...(categoria && categoria !== 'all' && { category: categoria }),
    ...(status && status !== 'all' && { status: status }),
  };

  const [creditTitles, total] = await Promise.all([
    prisma.creditTitle.findMany({
      where,
      include: {
        issuer: {
          select: { id: true, name: true, email: true },
        },
        owner: {
          select: { id: true, name: true, email: true },
        },
        documents: {
          select: { id: true, name: true, type: true },
        },
        detailsTributario: true,
        _count: {
          select: { offers: true, transactions: true },
        },
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.creditTitle.count({ where }),
  ]);

  const anuncios = creditTitles.map(tc => ({
    id: tc.id,
    titulo: `${tc.category} - ${tc.detailsTributario?.nomeTributo || 'Título de Crédito'}`,
    categoria: tc.category,
    valor: tc.valueNominal,
    precoVenda: tc.listingPrice || tc.valueCurrent,
    desconto: tc.listingPrice ? ((tc.valueNominal - tc.listingPrice) / tc.valueNominal) * 100 : 0,
    vencimento: tc.expiryDate,
    emissor: {
      nome: tc.issuer.name || 'Emissor',
      documento: tc.issuer.email || '',
      rating: 4.5,
      transacoes: tc._count.transactions,
    },
    status: tc.status,
    blockchain: {
      tokenId: tc.tokenId,
      contractAddress: 'mock-contract',
      verified: !!tc.tokenId,
    },
    analytics: {
      visualizacoes: Math.floor(Math.random() * 200) + 10,
      favoritos: Math.floor(Math.random() * 20) + 1,
      propostas: tc._count.offers,
      liquidez: 0.85 + Math.random() * 0.15,
    },
    compliance: {
      kyc: true,
      aml: true,
      juridico: true,
      fiscal: true,
    },
    createdAt: tc.createdAt,
    updatedAt: tc.updatedAt,
  }));

  return res.status(200).json({
    success: true,
    data: anuncios,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
}

async function createAnuncio(req: NextApiRequest, res: NextApiResponse) {
  const { titulo, categoria, valor, precoVenda, vencimento, emissorId, documentos } = req.body;

  if (!titulo || !categoria || !valor || !emissorId) {
    return res.status(400).json({
      error: 'Campos obrigatórios: titulo, categoria, valor, emissorId',
    });
  }

  const creditTitle = await prisma.creditTitle.create({
    data: {
      category: categoria,
      valueNominal: Number(valor),
      valueCurrent: Number(precoVenda) || Number(valor),
      listingPrice: Number(precoVenda),
      expiryDate: vencimento ? new Date(vencimento) : null,
      issuerId: emissorId,
      ownerId: emissorId,
      status: 'LISTED_FOR_SALE',
      isListed: true,
      listingDate: new Date(),
      tokenId: `TKN-${categoria}-${Date.now()}`,
      tokenStandard: 'ERC-1400-TRIBUTA',
      blockchainTxHash: `0x${Math.random().toString(16).substring(2, 42)}`,
    },
    include: {
      issuer: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return res.status(201).json({
    success: true,
    data: {
      id: creditTitle.id,
      titulo: `${creditTitle.category} - ${titulo}`,
      categoria: creditTitle.category,
      valor: creditTitle.valueNominal,
      status: creditTitle.status,
      tokenId: creditTitle.tokenId,
      createdAt: creditTitle.createdAt,
    },
  });
}
