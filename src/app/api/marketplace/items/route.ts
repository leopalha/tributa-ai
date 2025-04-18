import { NextResponse } from 'next/server';
import { Anuncio, OrigemTC, TipoNegociacao, StatusAnuncio } from '@/types/marketplace';
import { TC } from '@/types/tc';

// Mock data for TC listings
const mockAnuncios: Anuncio[] = [
  {
    id: '1',
    tcId: '1',
    tc: {
      id: '1',
      numero: 'TC-2024-001',
      tipo: 'TC-F',
      valorTotal: 150000.00,
      valorDisponivel: 150000.00,
      emissor: {
        id: '1',
        nome: 'Empresa A',
        documento: '12345678900',
      },
      origemCredito: 'Precatório Judicial',
      tipoTributo: 'ICMS',
      dataEmissao: new Date('2024-01-15'),
      dataValidade: new Date('2024-02-15'),
      status: 'PENDENTE',
      documentos: [],
      transacoes: [],
    },
    vendedorId: '1',
    titulo: 'TC-F - Precatório Judicial - ICMS',
    descricao: 'Título de Crédito proveniente de precatório judicial, com garantia real e processo em fase de execução.',
    valorOriginal: 150000.00,
    valorMinimo: 140000.00,
    valorSugerido: 145000.00,
    tipoNegociacao: 'venda_direta',
    status: 'ativo',
    dataPublicacao: '2024-01-15T00:00:00.000Z',
    dataExpiracao: '2024-02-15T00:00:00.000Z',
    visualizacoes: 0,
    interessados: 0,
    origemTC: 'precatorio',
    documentosNecessarios: [
      'Documento de Identidade',
      'Comprovante de Residência',
      'Certidão Negativa de Débitos',
    ],
    garantias: [
      {
        tipo: 'real',
        descricao: 'Imóvel comercial',
        valor: 200000.00,
      },
    ],
    restricoes: {
      setoresPermitidos: ['Comércio', 'Indústria'],
      regioesPermitidas: ['Sudeste', 'Sul'],
      faturamentoMinimo: 1000000.00,
    },
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    tcId: '2',
    tc: {
      id: '2',
      numero: 'TC-2024-002',
      tipo: 'TC-E',
      valorTotal: 50000.00,
      valorDisponivel: 50000.00,
      emissor: {
        id: '2',
        nome: 'Empresa B',
        documento: '98765432100',
      },
      origemCredito: 'Honorários Advocatícios',
      tipoTributo: 'IRPJ',
      dataEmissao: new Date('2024-01-20'),
      dataValidade: new Date('2024-03-20'),
      status: 'PENDENTE',
      documentos: [],
      transacoes: [],
    },
    vendedorId: '2',
    titulo: 'TC-E - Honorários Advocatícios - IRPJ',
    descricao: 'Título de Crédito proveniente de honorários advocatícios, com processo em fase de liquidação.',
    valorOriginal: 50000.00,
    valorMinimo: 45000.00,
    valorSugerido: 47500.00,
    tipoNegociacao: 'proposta',
    status: 'ativo',
    dataPublicacao: '2024-01-20T00:00:00.000Z',
    dataExpiracao: '2024-03-20T00:00:00.000Z',
    visualizacoes: 0,
    interessados: 0,
    origemTC: 'honorarios',
    documentosNecessarios: [
      'Documento de Identidade',
      'Comprovante de Residência',
      'Certidão Negativa de Débitos',
    ],
    garantias: [
      {
        tipo: 'pessoal',
        descricao: 'Fiador com renda comprovada',
        valor: 75000.00,
      },
    ],
    restricoes: {
      setoresPermitidos: ['Serviços', 'Comércio'],
      regioesPermitidas: ['Norte', 'Nordeste'],
      faturamentoMinimo: 500000.00,
    },
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origem = searchParams.get('origem') as OrigemTC | null;
  const tipoNegociacao = searchParams.get('tipoNegociacao') as TipoNegociacao | null;
  const status = searchParams.get('status') as StatusAnuncio | null;
  const valorMinimo = searchParams.get('valorMinimo') ? Number(searchParams.get('valorMinimo')) : null;
  const valorMaximo = searchParams.get('valorMaximo') ? Number(searchParams.get('valorMaximo')) : null;

  let filteredAnuncios = mockAnuncios;

  if (origem) {
    filteredAnuncios = filteredAnuncios.filter(anuncio => anuncio.origemTC === origem);
  }

  if (tipoNegociacao) {
    filteredAnuncios = filteredAnuncios.filter(anuncio => anuncio.tipoNegociacao === tipoNegociacao);
  }

  if (status) {
    filteredAnuncios = filteredAnuncios.filter(anuncio => anuncio.status === status);
  }

  if (valorMinimo) {
    filteredAnuncios = filteredAnuncios.filter(anuncio => anuncio.valorMinimo >= valorMinimo);
  }

  if (valorMaximo) {
    filteredAnuncios = filteredAnuncios.filter(anuncio => anuncio.valorMinimo <= valorMaximo);
  }

  return NextResponse.json(filteredAnuncios);
} 