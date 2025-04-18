import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { TipoTitulo } from '@/types/tc';

interface ResultadoValidação {
  válido: boolean;
  mensagem: string;
  detalhes: string[];
  avisos?: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tcId, número, tipo, valor, dataEmissão, dataVencimento } = body;

    // Validar campos obrigatórios
    if (!tcId || !número || !tipo || !valor || !dataEmissão || !dataVencimento) {
      return NextResponse.json(
        {
          válido: false,
          mensagem: 'Dados incompletos',
          detalhes: ['Todos os campos são obrigatórios'],
        },
        { status: 400 }
      );
    }

    const resultadoValidação: ResultadoValidação = {
      válido: true,
      mensagem: 'Título de crédito validado com sucesso',
      detalhes: [],
      avisos: [],
    };

    // 1. Validar formato do número do título
    if (!/^[A-Z0-9]{8,20}$/.test(número)) {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Número do título inválido');
    }

    // 2. Validar tipo do título
    if (!['TC-F', 'TC-E', 'TC-M'].includes(tipo)) {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Tipo de título inválido');
    }

    // 3. Validar valor
    if (valor <= 0) {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Valor do título deve ser maior que zero');
    } else if (valor > 1000000000) { // 1 bilhão
      resultadoValidação.avisos?.push('Valor do título muito alto, verifique a autenticidade');
    }

    // 4. Validar datas
    const dataEmissãoObj = new Date(dataEmissão);
    const dataVencimentoObj = new Date(dataVencimento);
    const hoje = new Date();

    if (dataEmissãoObj > hoje) {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Data de emissão não pode ser futura');
    }

    if (dataVencimentoObj < hoje) {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Título expirado');
    }

    if (dataVencimentoObj < dataEmissãoObj) {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Data de vencimento anterior à data de emissão');
    }

    // 5. Validar status do título (simulado)
    const statusTítulo = await verificarStatusTítulo(tcId);
    if (statusTítulo === 'bloqueado') {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Título bloqueado pela autoridade fiscal');
    } else if (statusTítulo === 'compensado') {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Título já compensado');
    }

    // 6. Validar autenticidade do título (simulado)
    const autentico = await verificarAutenticidadeTítulo(tcId, número);
    if (!autentico) {
      resultadoValidação.válido = false;
      resultadoValidação.detalhes.push('Título não autenticado pela autoridade fiscal');
    }

    // 7. Verificar restrições (simulado)
    const restrições = await verificarRestrições(tcId);
    if (restrições.length > 0) {
      resultadoValidação.avisos?.push(...restrições);
    }

    return NextResponse.json(resultadoValidação);
  } catch (error) {
    console.error('Erro na validação do título de crédito:', error);
    return NextResponse.json(
      {
        válido: false,
        mensagem: 'Erro na validação do título de crédito',
        detalhes: ['Erro interno do servidor'],
      },
      { status: 500 }
    );
  }
}

// Funções simuladas para validação do título
async function verificarStatusTítulo(tcId: string): Promise<string> {
  // Em uma implementação real, isso verificaria com a autoridade emissora
  return 'ativo';
}

async function verificarAutenticidadeTítulo(tcId: string, número: string): Promise<boolean> {
  // Em uma implementação real, isso verificaria a assinatura digital do título
  return true;
}

async function verificarRestrições(tcId: string): Promise<string[]> {
  // Em uma implementação real, isso verificaria restrições ou bloqueios
  return [];
} 