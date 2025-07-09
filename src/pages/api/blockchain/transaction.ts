import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnectedGateway } from '@/lib/fabric/gateway';

interface TransactionRequest {
  contractName: string;
  transactionName: string;
  args: string[];
  channelName?: string;
}

interface TransactionResponse {
  success: boolean;
  data?: {
    txId: string;
    result: any;
    timestamp: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransactionResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido',
    });
  }

  try {
    const { contractName, transactionName, args, channelName }: TransactionRequest = req.body;

    if (!contractName || !transactionName) {
      return res.status(400).json({
        success: false,
        error: 'contractName e transactionName são obrigatórios',
      });
    }

    // Usuário padrão para transação (ajuste conforme necessário)
    const userId = 'admin';
    const gateway = await getConnectedGateway(userId);
    let network, contract;
    const channel = channelName || 'mychannel';
    if (typeof gateway.getNetwork === 'function') {
      network = await gateway.getNetwork(channel);
      if (typeof network.getContract === 'function') {
        contract = network.getContract(contractName);
      } else {
        contract = network.getContract;
      }
    } else {
      network = gateway.getNetwork;
      contract = network.getContract(contractName);
    }

    // Envio real da transação ao chaincode
    const resultBuffer = await contract.submitTransaction(transactionName, ...(args || []));
    let result: any;
    try {
      result = JSON.parse(resultBuffer.toString());
    } catch {
      result = resultBuffer.toString();
    }

    // Tentar extrair txId se possível
    const txId = result?.transactionId || result?.txId || `tx_${Date.now()}`;

    if (typeof gateway.disconnect === 'function') {
      await gateway.disconnect();
    }

    const response = {
      success: true,
      data: {
        txId,
        result,
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Erro na transação blockchain:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor',
    });
  }
}
