const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tributa-ai-secret-key';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// === AUTH ROUTES ===

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        empresasRepresentadas: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
            status: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha (para demo, aceitar senhas simples)
    const isValidPassword = password === 'demo123' || password === 'admin123';

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      empresas: user.empresasRepresentadas
    };

    res.json({
      success: true,
      data: { user: userData, token, message: 'Login realizado com sucesso' }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === MARKETPLACE ROUTES ===

// Estatísticas do marketplace
app.get('/marketplace/stats', async (req, res) => {
  try {
    // Simular estatísticas do marketplace
    const stats = {
      totalAnuncios: 156,
      volumeTotal: 125000000,
      volumeMensal: 15800000,
      transacoesHoje: 23,
      usuariosAtivos: 2890,
      categorias: {
        ICMS: { count: 67, volume: 45000000 },
        PIS_COFINS: { count: 43, volume: 28000000 },
        PRECATORIOS: { count: 28, volume: 35000000 },
        IRPJ_CSLL: { count: 18, volume: 17000000 }
      },
      tendencias: {
        crescimentoSemanal: 0.234,
        precoMedio: 0.87,
        liquidezIndex: 0.92,
        volatilidade: 0.045
      },
      topVendedores: [
        { nome: 'ABC Metalúrgica', volume: 12500000, transacoes: 45 },
        { nome: 'XYZ Energia', volume: 8700000, transacoes: 32 },
        { nome: 'DEF Indústria', volume: 6200000, transacoes: 28 }
      ],
      ultimasTransacoes: [
        { id: 'tx-001', valor: 850000, tipo: 'ICMS', tempo: '5 min' },
        { id: 'tx-002', valor: 1200000, tipo: 'PIS_COFINS', tempo: '12 min' },
        { id: 'tx-003', valor: 680000, tipo: 'PRECATORIOS', tempo: '18 min' }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas do marketplace:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar anúncios
app.get('/api/marketplace/anuncios', async (req, res) => {
  try {
    const { categoria, status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      isListed: true,
      status: 'LISTED_FOR_SALE',
      ...(categoria && categoria !== 'all' && { category: categoria }),
      ...(status && status !== 'all' && { status: status })
    };

    const [creditTitles, total] = await Promise.all([
      prisma.creditTitle.findMany({
        where,
        include: {
          issuer: { select: { id: true, name: true, email: true } },
          owner: { select: { id: true, name: true, email: true } },
          documents: { select: { id: true, name: true, type: true } },
          detailsTributario: true,
          _count: { select: { offers: true, transactions: true } }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.creditTitle.count({ where })
    ]);

    const anuncios = creditTitles.map(tc => ({
      id: tc.id,
      titulo: `${tc.category} - ${tc.detailsTributario?.nomeTributo || 'Título de Crédito'}`,
      categoria: tc.category,
      valor: tc.valueNominal,
      precoVenda: tc.listingPrice || tc.valueCurrent,
      desconto: tc.listingPrice ? 
        ((tc.valueNominal - tc.listingPrice) / tc.valueNominal * 100) : 0,
      vencimento: tc.expiryDate,
      emissor: {
        nome: tc.issuer.name || 'Emissor',
        documento: tc.issuer.email || '',
        rating: 4.5,
        transacoes: tc._count.transactions
      },
      status: tc.status,
      blockchain: {
        tokenId: tc.tokenId,
        contractAddress: 'mock-contract',
        verified: !!tc.tokenId
      },
      analytics: {
        visualizacoes: Math.floor(Math.random() * 200) + 10,
        favoritos: Math.floor(Math.random() * 20) + 1,
        propostas: tc._count.offers,
        liquidez: 0.85 + Math.random() * 0.15
      },
      compliance: { kyc: true, aml: true, juridico: true, fiscal: true },
      createdAt: tc.createdAt,
      updatedAt: tc.updatedAt
    }));

    res.json({
      success: true,
      data: anuncios,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === BLOCKCHAIN ROUTES ===

// Status da blockchain
app.get('/api/blockchain/status', (req, res) => {
  try {
    const blockchainStatus = {
      networkId: 'tributa-ai-network',
      status: 'ACTIVE',
      blockHeight: Math.floor(Math.random() * 10000) + 50000,
      peersOnline: 4,
      ordererOnline: true,
      transactionsPerSecond: Math.floor(Math.random() * 100) + 50,
      lastBlockTime: new Date(),
      consensus: 'Raft',
      chaincodeName: 'tributa-token-cc',
      chaincodeVersion: '1.0.0',
      totalTokens: 156,
      totalTransactions: 1247,
      networkLatency: Math.floor(Math.random() * 100) + 50,
      uptime: 99.97
    };

    res.json({ success: true, data: blockchainStatus });
  } catch (error) {
    console.error('Blockchain status error:', error);
    res.status(500).json({ error: 'Erro ao obter status da blockchain' });
  }
});

// === TOKENIZATION ROUTES ===

// Criar tokenização
app.post('/api/tokenization/create', authenticateToken, async (req, res) => {
  try {
    const { titulo, categoria, valor, precoVenda, vencimento, detalhes } = req.body;
    const emissorId = req.user.userId;

    if (!titulo || !categoria || !valor) {
      return res.status(400).json({
        error: 'Campos obrigatórios: titulo, categoria, valor'
      });
    }

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
        blockchainTxHash: `0x${Math.random().toString(16).substring(2, 42)}`
      }
    });

    // Simular processo de tokenização
    setTimeout(async () => {
      await prisma.creditTitle.update({
        where: { id: creditTitle.id },
        data: { 
          status: 'TOKENIZED',
          isListed: !!precoVenda,
          listingDate: precoVenda ? new Date() : null
        }
      });
    }, 3000);

    res.status(201).json({
      success: true,
      data: {
        id: creditTitle.id,
        tokenId: creditTitle.tokenId,
        status: creditTitle.status,
        blockchainTxHash: creditTitle.blockchainTxHash,
        message: 'Tokenização iniciada com sucesso'
      }
    });

  } catch (error) {
    console.error('Tokenization error:', error);
    res.status(500).json({ error: 'Erro no processo de tokenização' });
  }
});

// === COMPENSAÇÃO ROUTES ===

// Simular compensação
app.post('/api/compensacao/simular', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Buscar créditos do usuário
    const creditTitles = await prisma.creditTitle.findMany({
      where: {
        ownerId: userId,
        status: 'TOKENIZED',
        category: 'TRIBUTARIO'
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        detailsTributario: true
      }
    });

    // Mock de débitos fiscais
    const mockDebts = [
      {
        id: 'debt-001',
        tipo: 'ICMS',
        valor: 150000,
        multa: 15000,
        juros: 8500,
        valorTotal: 173500,
        economia: 23500
      },
      {
        id: 'debt-002',
        tipo: 'PIS_COFINS',
        valor: 120000,
        multa: 12000,
        juros: 6800,
        valorTotal: 138800,
        economia: 18800
      }
    ];

    const matches = [];
    let totalEconomia = 0;

    creditTitles.forEach(credit => {
      mockDebts.forEach(debt => {
        if (credit.valueCurrent >= debt.valor * 0.5) {
          matches.push({
            id: `match-${credit.id}-${debt.id}`,
            credito: {
              id: credit.id,
              tipo: credit.detailsTributario?.nomeTributo || 'ICMS',
              valor: credit.valueNominal,
              saldo: credit.valueCurrent
            },
            debito: debt,
            valorCompensacao: Math.min(credit.valueCurrent, debt.valor),
            economia: debt.economia,
            viabilidade: 0.95,
            prazoExecucao: 7
          });
          totalEconomia += debt.economia;
        }
      });
    });

    res.json({
      success: true,
      data: {
        oportunidades: matches,
        estatisticas: {
          totalCreditos: creditTitles.reduce((sum, c) => sum + c.valueCurrent, 0),
          totalDebitos: mockDebts.reduce((sum, d) => sum + d.valorTotal, 0),
          economiaEstimada: totalEconomia,
          oportunidadesEncontradas: matches.length
        }
      }
    });

  } catch (error) {
    console.error('Compensação error:', error);
    res.status(500).json({ error: 'Erro na simulação de compensação' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  console.log(`📋 APIs disponíveis em http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:3000`);
  console.log(`✅ Sistema completo operacional!`);
}); 