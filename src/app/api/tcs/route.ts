import { NextResponse } from 'next/server';
import { TC } from '@/types/tc';

// Mock data for TCs
const mockTCs: TC[] = [
  {
    id: '1',
    numero: 'TC-2024-001',
    tipo: 'TC-F',
    valorTotal: 15000.00,
    valorDisponivel: 15000.00,
    emissor: {
      id: '1',
      nome: 'Empresa A',
      documento: '12345678900',
    },
    origemCredito: 'Compensação tributária',
    tipoTributo: 'ICMS',
    dataEmissao: new Date('2024-01-15'),
    dataValidade: new Date('2024-02-15'),
    status: 'PENDENTE',
    documentos: [],
    transacoes: [
      {
        id: '1',
        tipo: 'COMPENSACAO',
        tcId: '1',
        valorTotal: 15000.00,
        valorDesconto: 0,
        valorLiquido: 15000.00,
        dataTransacao: new Date('2024-01-15'),
        status: 'PENDENTE',
        detalhesCompensacao: {
          tipoTributo: 'ICMS',
          valorDebito: 15000.00,
          dataVencimento: new Date('2024-02-15'),
        },
      },
    ],
  },
  // Add more mock TCs as needed
];

export async function GET() {
  return NextResponse.json(mockTCs);
} 