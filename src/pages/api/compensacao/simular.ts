import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CompensationCredit {
  id: string;
  tipo: string;
  valor: number;
  saldo: number;
  esfera: 'federal' | 'estadual' | 'municipal';
  uf?: string;
  municipio?: string;
  dataGeracao: Date;
  dataVencimento?: Date;
  situacao: string;
  origem: string;
  proprietario: {
    id: string;
    nome: string;
    documento: string;
  };
}

interface CompensationDebt {
  id: string;
  tipo: string;
  valor: number;
  saldo: number;
  esfera: 'federal' | 'estadual' | 'municipal';
  uf?: string;
  municipio?: string;
  dataVencimento: Date;
  multa: number;
  juros: number;
  valorTotal: number;
  situacao: string;
  prioridade: string;
  devedor: {
    id: string;
    nome: string;
    documento: string;
  };
}

interface CompensationMatch {
  id: string;
  tipo: 'direto' | 'indireto' | 'multilateral';
  credito: CompensationCredit;
  debito: CompensationDebt;
  valorCompensacao: number;
  economia: number;
  percentualEconomia: number;
  viabilidade: number;
  prazoExecucao: number;
  restricoes: string[];
  beneficios: string[];
  custosOperacionais: number;
  taxasGov: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        return await simularCompensacao(req, res);
      case 'GET':
        return await listarOportunidades(req, res);
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function simularCompensacao(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório' });
  }

  // Buscar créditos disponíveis do usuário
  const creditTitles = await prisma.creditTitle.findMany({
    where: {
      ownerId: userId,
      status: 'TOKENIZED',
      category: 'TRIBUTARIO',
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      detailsTributario: true,
    },
  });

  // Simular débitos fiscais (mock - em produção viria de APIs governamentais)
  const mockDebts: CompensationDebt[] = [
    {
      id: 'debt-001',
      tipo: 'ICMS',
      valor: 150000,
      saldo: 150000,
      esfera: 'estadual',
      uf: 'SP',
      dataVencimento: new Date('2024-12-31'),
      multa: 15000,
      juros: 8500,
      valorTotal: 173500,
      situacao: 'pendente',
      prioridade: 'alta',
      devedor: {
        id: userId,
        nome: 'Empresa Demo',
        documento: '12.345.678/0001-90',
      },
    },
    {
      id: 'debt-002',
      tipo: 'PIS_COFINS',
      valor: 120000,
      saldo: 120000,
      esfera: 'federal',
      dataVencimento: new Date('2025-01-15'),
      multa: 12000,
      juros: 6800,
      valorTotal: 138800,
      situacao: 'pendente',
      prioridade: 'media',
      devedor: {
        id: userId,
        nome: 'Empresa Demo',
        documento: '12.345.678/0001-90',
      },
    },
  ];

  // Converter créditos para formato de compensação
  const credits: CompensationCredit[] = creditTitles.map(ct => ({
    id: ct.id,
    tipo:
      ct.detailsTributario?.subTypeFederal ||
      ct.detailsTributario?.subTypeEstadual ||
      ct.detailsTributario?.subTypeMunicipal ||
      'ICMS',
    valor: ct.valueNominal,
    saldo: ct.valueCurrent,
    esfera: (ct.detailsTributario?.esfera as any) || 'estadual',
    dataGeracao: ct.issueDate,
    dataVencimento: ct.expiryDate,
    situacao: 'disponivel',
    origem: ct.detailsTributario?.nomeTributo || 'Crédito Tributário',
    proprietario: {
      id: ct.owner.id,
      nome: ct.owner.name || 'Proprietário',
      documento: ct.owner.email || '',
    },
  }));

  // Algoritmo de matching inteligente
  const matches: CompensationMatch[] = [];

  for (const credit of credits) {
    for (const debt of mockDebts) {
      // Verificar compatibilidade básica
      const isCompatible =
        credit.tipo === debt.tipo ||
        (credit.esfera === debt.esfera && ['ICMS', 'PIS_COFINS'].includes(credit.tipo));

      if (isCompatible && credit.saldo >= debt.saldo * 0.5) {
        const valorCompensacao = Math.min(credit.saldo, debt.saldo);
        const economia = debt.multa + debt.juros;
        const percentualEconomia = economia / debt.valorTotal;

        const match: CompensationMatch = {
          id: `match-${credit.id}-${debt.id}`,
          tipo: credit.tipo === debt.tipo ? 'direto' : 'indireto',
          credito: credit,
          debito: debt,
          valorCompensacao,
          economia,
          percentualEconomia,
          viabilidade: credit.tipo === debt.tipo ? 0.95 : 0.75,
          prazoExecucao: credit.tipo === debt.tipo ? 7 : 15,
          restricoes: [
            credit.esfera !== debt.esfera ? 'Esferas diferentes' : 'Mesma esfera',
            credit.tipo !== debt.tipo ? 'Conversão necessária' : 'Mesmo tipo',
          ],
          beneficios: ['Liquidação imediata', 'Economia de juros e multas', 'Regularização fiscal'],
          custosOperacionais: valorCompensacao * 0.005, // 0.5%
          taxasGov: valorCompensacao * 0.002, // 0.2%
        };

        matches.push(match);
      }
    }
  }

  // Calcular estatísticas
  const totalEconomia = matches.reduce((sum, match) => sum + match.economia, 0);
  const totalCompensacao = matches.reduce((sum, match) => sum + match.valorCompensacao, 0);

  return res.status(200).json({
    success: true,
    data: {
      oportunidades: matches,
      estatisticas: {
        totalCreditos: credits.reduce((sum, c) => sum + c.saldo, 0),
        totalDebitos: mockDebts.reduce((sum, d) => sum + d.valorTotal, 0),
        potencialCompensacao: totalCompensacao,
        economiaEstimada: totalEconomia,
        oportunidadesEncontradas: matches.length,
        sucessoRate: matches.length > 0 ? 0.87 : 0,
        tempoMedioExecucao:
          matches.length > 0
            ? matches.reduce((sum, m) => sum + m.prazoExecucao, 0) / matches.length
            : 0,
      },
    },
  });
}

async function listarOportunidades(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório' });
  }

  // Mock de oportunidades históricas
  const oportunidades = [
    {
      id: 'opp-001',
      titulo: 'Compensação ICMS vs ICMS',
      descricao: 'Crédito acumulado de exportação pode compensar débito de apuração',
      potencialEconomia: 45000,
      valorCompensacao: 250000,
      prazoExecucao: 7,
      viabilidade: 0.95,
      status: 'disponivel',
      createdAt: new Date(),
    },
    {
      id: 'opp-002',
      titulo: 'Conversão PIS/COFINS',
      descricao: 'Crédito federal pode ser convertido para débito estadual',
      potencialEconomia: 32000,
      valorCompensacao: 180000,
      prazoExecucao: 15,
      viabilidade: 0.78,
      status: 'analisando',
      createdAt: new Date(Date.now() - 86400000),
    },
  ];

  return res.status(200).json({
    success: true,
    data: oportunidades,
  });
}
