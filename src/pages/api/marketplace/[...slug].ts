import { NextApiRequest, NextApiResponse } from 'next';
import { 
  Anuncio, 
  Proposta, 
  Transacao, 
  TCType, 
  TCStatus, 
  TipoNegociacao, 
  TipoGarantia, 
  FormaPagamento,
  TC,
  Documento 
} from '../../../types/marketplace';

// Mock data
const anuncios: Anuncio[] = [
  {
    id: '1',
    tcId: 'TC001',
    tc: {
      id: 'TC001',
      tipo: 'credito_tributario',
      valor: 50000,
      dataEmissao: new Date('2024-01-15'),
      dataVencimento: new Date('2024-12-31'),
      status: 'aprovado',
      origem: 'credito_tributario',
      documentos: [
        { 
          id: 'doc1', 
          tipo: 'comprovante',
          nome: 'documento1.pdf', 
          url: '/docs/doc1.pdf'
        },
        { 
          id: 'doc2', 
          tipo: 'contrato',
          nome: 'documento2.pdf', 
          url: '/docs/doc2.pdf'
        }
      ],
      historico: [
        {
          data: new Date('2024-01-15'),
          tipo: 'emissao',
          descricao: 'Crédito tributário emitido',
          valor: 50000
        }
      ],
      garantias: [
        {
          tipo: 'fianca',
          descricao: 'Fiança bancária',
          valor: 50000
        }
      ]
    },
    vendedorId: 'user1',
    titulo: 'Crédito Tributário - TC001',
    descricao: 'Crédito tributário disponível para negociação',
    valorOriginal: 50000,
    valorMinimo: 45000,
    valorSugerido: 47500,
    tipoNegociacao: 'venda_direta',
    status: 'ativo',
    dataPublicacao: new Date('2024-01-16'),
    dataExpiracao: new Date('2024-12-31'),
    visualizacoes: 150,
    interessados: 5,
    origemTC: 'credito_tributario',
    documentosNecessarios: ['comprovante_identidade', 'comprovante_endereco'],
    garantias: [
      {
        tipo: 'fianca',
        descricao: 'Fiança bancária',
        valor: 50000
      }
    ],
    restricoes: {
      setoresPermitidos: ['financeiro'],
      regioesPermitidas: ['sudeste'],
      faturamentoMinimo: 100000,
      prazoMaximoPagamento: 12,
      garantiasObrigatorias: ['fianca']
    }
  },
  {
    id: '2',
    tcId: 'TC002',
    tc: {
      id: 'TC002',
      tipo: 'honorarios',
      valor: 30000,
      dataEmissao: new Date('2024-02-01'),
      dataVencimento: new Date('2024-12-31'),
      status: 'aprovado',
      origem: 'honorarios',
      documentos: [
        { 
          id: 'doc3', 
          tipo: 'contrato',
          nome: 'documento3.pdf', 
          url: '/docs/doc3.pdf'
        }
      ],
      historico: [
        {
          data: new Date('2024-02-01'),
          tipo: 'emissao',
          descricao: 'Honorários emitidos',
          valor: 30000
        }
      ],
      garantias: [
        {
          tipo: 'seguro',
          descricao: 'Seguro garantia',
          valor: 30000
        }
      ]
    },
    vendedorId: 'user2',
    titulo: 'Honorários - TC002',
    descricao: 'Honorários disponíveis para negociação',
    valorOriginal: 30000,
    valorMinimo: 27000,
    valorSugerido: 28500,
    tipoNegociacao: 'venda_direta',
    status: 'ativo',
    dataPublicacao: new Date('2024-02-02'),
    dataExpiracao: new Date('2024-12-31'),
    visualizacoes: 100,
    interessados: 3,
    origemTC: 'honorarios',
    documentosNecessarios: ['comprovante_oab'],
    garantias: [
      {
        tipo: 'seguro',
        descricao: 'Seguro garantia',
        valor: 30000
      }
    ],
    restricoes: {
      setoresPermitidos: ['juridico'],
      regioesPermitidas: ['sudeste'],
      faturamentoMinimo: 50000,
      prazoMaximoPagamento: 6,
      garantiasObrigatorias: ['seguro']
    }
  }
];

const propostas: Proposta[] = [
  {
    id: '1',
    anuncioId: '1',
    compradorId: 'user3',
    valor: 85000,
    condicoes: {
      parcelas: 12,
      entrada: 20000,
      prazoMaximo: new Date('2024-12-31'),
      garantiasAdicionais: ['aval'],
      formaPagamento: 'transferencia_bancaria'
    },
    mensagem: 'Interessado em adquirir o precatório com as condições acima.',
    status: 'pendente',
    dataExpiracao: new Date('2024-02-15'),
    documentos: [
      {
        id: 'doc4',
        tipo: 'documento_identidade',
        nome: 'rg.pdf',
        url: 'https://example.com/doc1.pdf',
        dataEnvio: new Date('2024-01-20'),
        status: 'aprovado'
      }
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

const transacoes: Transacao[] = [
  {
    id: '1',
    anuncioId: '1',
    tcId: 'tc1',
    vendedorId: 'user1',
    compradorId: 'user3',
    propostaId: '1',
    valor: 85000,
    status: 'aguardando_pagamento',
    formaPagamento: {
      tipo: 'transferencia_bancaria',
      detalhes: {
        banco: '001',
        agencia: '1234',
        conta: '56789-0'
      }
    },
    documentos: [
      {
        id: 'doc5',
        tipo: 'contrato',
        nome: 'contrato.pdf',
        url: 'https://example.com/contrato.pdf',
        dataEnvio: new Date('2024-01-21'),
        status: 'pendente'
      }
    ],
    timeline: [
      {
        status: 'aguardando_pagamento',
        data: new Date('2024-01-21'),
        descricao: 'Transação iniciada',
        responsavel: 'user3'
      }
    ],
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const [resource, action] = Array.isArray(slug) ? slug : [slug];

  switch (resource) {
    case 'anuncios':
      switch (action) {
        case 'listar':
          const { 
            origem, 
            tipoNegociacao, 
            status, 
            valorMin, 
            valorMax,
            setor,
            regiao,
            ordenarPor,
            ordenarDirecao = 'desc'
          } = req.query;
          
          let filteredAnuncios = [...anuncios];
          
          if (origem) {
            filteredAnuncios = filteredAnuncios.filter(a => a.origemTC === origem);
          }
          
          if (tipoNegociacao) {
            filteredAnuncios = filteredAnuncios.filter(a => a.tipoNegociacao === tipoNegociacao);
          }
          
          if (status) {
            filteredAnuncios = filteredAnuncios.filter(a => a.status === status);
          }
          
          if (valorMin) {
            filteredAnuncios = filteredAnuncios.filter(a => a.valorMinimo >= Number(valorMin));
          }
          
          if (valorMax) {
            filteredAnuncios = filteredAnuncios.filter(a => a.valorMinimo <= Number(valorMax));
          }

          if (setor) {
            filteredAnuncios = filteredAnuncios.filter(a => 
              a.restricoes.setoresPermitidos.includes(setor as string)
            );
          }

          if (regiao) {
            filteredAnuncios = filteredAnuncios.filter(a => 
              a.restricoes.regioesPermitidas.includes(regiao as string)
            );
          }

          // Ordenação
          if (ordenarPor) {
            filteredAnuncios.sort((a, b) => {
              const valorA = a[ordenarPor as keyof Anuncio];
              const valorB = b[ordenarPor as keyof Anuncio];

              if (typeof valorA === 'string' && typeof valorB === 'string') {
                return ordenarDirecao === 'asc' 
                  ? valorA.localeCompare(valorB)
                  : valorB.localeCompare(valorA);
              }

              if (typeof valorA === 'number' && typeof valorB === 'number') {
                return ordenarDirecao === 'asc'
                  ? valorA - valorB
                  : valorB - valorA;
              }

              if (valorA instanceof Date && valorB instanceof Date) {
                return ordenarDirecao === 'asc'
                  ? valorA.getTime() - valorB.getTime()
                  : valorB.getTime() - valorA.getTime();
              }

              return 0;
            });
          }
          
          return res.status(200).json(filteredAnuncios);
          
        case 'detalhes':
          const { id } = req.query;
          const anuncio = anuncios.find(a => a.id === id);
          if (!anuncio) {
            return res.status(404).json({ message: 'Anúncio não encontrado' });
          }
          return res.status(200).json(anuncio);
          
        default:
          return res.status(400).json({ message: 'Ação inválida' });
      }
      
    case 'propostas':
      switch (action) {
        case 'listar':
          const { anuncioId } = req.query;
          const filteredPropostas = anuncioId 
            ? propostas.filter(p => p.anuncioId === anuncioId)
            : propostas;
          return res.status(200).json(filteredPropostas);
          
        case 'detalhes':
          const { propostaId } = req.query;
          const proposta = propostas.find(p => p.id === propostaId);
          if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada' });
          }
          return res.status(200).json(proposta);
          
        default:
          return res.status(400).json({ message: 'Ação inválida' });
      }
      
    case 'transacoes':
      switch (action) {
        case 'listar':
          const { userId } = req.query;
          const filteredTransacoes = userId
            ? transacoes.filter(t => t.vendedorId === userId || t.compradorId === userId)
            : transacoes;
          return res.status(200).json(filteredTransacoes);
          
        case 'detalhes':
          const { transacaoId } = req.query;
          const transacao = transacoes.find(t => t.id === transacaoId);
          if (!transacao) {
            return res.status(404).json({ message: 'Transação não encontrada' });
          }
          return res.status(200).json(transacao);
          
        default:
          return res.status(400).json({ message: 'Ação inválida' });
      }
      
    default:
      return res.status(400).json({ message: 'Recurso inválido' });
  }
} 