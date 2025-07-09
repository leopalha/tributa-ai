import { NextApiRequest, NextApiResponse } from 'next';
import { getConnectedGateway } from '@/lib/fabric/gateway';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Caminho do connection profile
    const ccpPath = path.resolve(process.cwd(), 'fabric-connection-profile.json');
    if (!fs.existsSync(ccpPath)) {
      return res.status(500).json({ error: 'Connection profile do Fabric não encontrado.' });
    }
    // const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf-8'));

    // Usuário padrão para consulta (ajuste conforme necessário)
    const userId = 'admin';
    const gateway = await getConnectedGateway(userId);
    // Suporte tanto para mock quanto real
    let network, contract;
    if (typeof gateway.getNetwork === 'function') {
      network = await gateway.getNetwork('mychannel');
      if (typeof network.getContract === 'function') {
        contract = network.getContract('tributatoken');
      } else {
        contract = network.getContract;
      }
    } else {
      // fallback para mock antigo
      network = gateway.getNetwork;
      contract = network.getContract('tributatoken');
    }

    // Consulta real ao status do chaincode (ajuste o nome da função conforme chaincode)
    const resultBuffer = await contract.evaluateTransaction('GetStatus');
    const status = JSON.parse(resultBuffer.toString());

    if (typeof gateway.disconnect === 'function') {
      await gateway.disconnect();
    }

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    console.error('Blockchain status error:', error);
    return res
      .status(500)
      .json({ error: 'Erro ao obter status real da blockchain', details: error.message });
  }
}
