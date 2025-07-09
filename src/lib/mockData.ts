import { CreditStatus } from '@prisma/client';

// Dados mockados para TCs (usando interface simplificada)
interface MockTC {
  id: string;
  numero: string;
  valorNominal: number;
  valorAtual: number;
  emissorId: string;
  portadorId: string;
  dataEmissao: string;
  dataVencimento?: string;
  status: CreditStatus;
  documentosIds: string[];
  historicoTransacoesIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockTCs: MockTC[] = [
  {
    id: '1',
    numero: 'TC-2024-001',
    valorNominal: 150000.0,
    valorAtual: 150000.0,
    emissorId: '1',
    portadorId: '1',
    dataEmissao: '2024-01-15',
    dataVencimento: '2024-12-31',
    status: CreditStatus.VALIDATED,
    documentosIds: ['1', '2'],
    historicoTransacoesIds: ['1'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    numero: 'TC-2024-002',
    valorNominal: 75000.0,
    valorAtual: 75000.0,
    emissorId: '2',
    portadorId: '2',
    dataEmissao: '2024-02-10',
    dataVencimento: '2025-02-10',
    status: CreditStatus.TOKENIZED,
    documentosIds: ['3'],
    historicoTransacoesIds: [],
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '3',
    numero: 'TC-2024-003',
    valorNominal: 35000.0,
    valorAtual: 25000.0,
    emissorId: '1',
    portadorId: '1',
    dataEmissao: '2024-03-05',
    dataVencimento: '2025-03-05',
    status: CreditStatus.LISTED_FOR_SALE,
    documentosIds: [],
    historicoTransacoesIds: ['2'],
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
];
