import { NextApiRequest, NextApiResponse } from 'next';
import { blockchainAnalyticsService } from '@/services/blockchain-analytics.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { action, address, timeframe = 'DAY' } = req.query;

  switch (action) {
    case 'contract-analysis':
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: 'Address parameter required' });
      }
      const contractAnalysis = await blockchainAnalyticsService.analyzeContract(address);
      return res.status(200).json(contractAnalysis);

    case 'anomalies':
      const anomalies = await blockchainAnalyticsService.detectAnomalies(timeframe as any);
      return res.status(200).json(anomalies);

    case 'clusters':
      const clusters = await blockchainAnalyticsService.clusterEntities();
      return res.status(200).json(clusters);

    case 'network-metrics':
      const metrics = await blockchainAnalyticsService.getNetworkMetrics();
      return res.status(200).json(metrics);

    case 'risk-assessment':
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: 'Address parameter required' });
      }
      const riskAssessment = await blockchainAnalyticsService.assessRisk(address);
      return res.status(200).json(riskAssessment);

    case 'flows':
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: 'Address parameter required' });
      }
      const { depth = '3' } = req.query;
      const flows = await blockchainAnalyticsService.analyzeFlows(address, parseInt(depth as string));
      return res.status(200).json(flows);

    case 'search':
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Search query parameter required' });
      }
      const searchResults = await blockchainAnalyticsService.intelligentSearch(q);
      return res.status(200).json(searchResults);

    case 'temporal-analysis':
      const temporalData = await blockchainAnalyticsService.getTemporalAnalysis(timeframe as any);
      return res.status(200).json(temporalData);

    default:
      return res.status(400).json({ error: 'Invalid action parameter' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;
  const { format = 'JSON' } = req.body;

  switch (action) {
    case 'export':
      const exportData = await blockchainAnalyticsService.exportAnalysis(format);
      const contentType = format === 'CSV' ? 'text/csv' : 
                         format === 'PDF' ? 'application/pdf' : 
                         'application/json';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="blockchain-analysis.${format.toLowerCase()}"`);
      
      // Convert Blob to Buffer for Node.js
      const buffer = Buffer.from(await exportData.arrayBuffer());
      return res.status(200).send(buffer);

    case 'clear-cache':
      blockchainAnalyticsService.clearCache();
      return res.status(200).json({ message: 'Cache cleared successfully' });

    default:
      return res.status(400).json({ error: 'Invalid action parameter' });
  }
}