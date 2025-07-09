import { NextApiRequest, NextApiResponse } from 'next';
import { blockchainAnalyticsService } from '@/services/blockchain-analytics.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, type, detailed = 'false' } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ 
      error: 'Search query parameter required',
      usage: 'GET /api/blockchain/search?q=<query>&type=<address|transaction|block>&detailed=<true|false>'
    });
  }

  try {
    // Intelligent search
    const searchResults = await blockchainAnalyticsService.intelligentSearch(q);
    
    // If detailed analysis is requested
    if (detailed === 'true') {
      // Add additional context based on search type
      if (searchResults.type === 'address') {
        // Add flow analysis for addresses
        const flows = await blockchainAnalyticsService.analyzeFlows(q, 2);
        searchResults.flows = flows;
        
        // Add temporal analysis
        const temporal = await blockchainAnalyticsService.getTemporalAnalysis('WEEK');
        searchResults.temporal = temporal;
      }
    }

    // Add search metadata
    const response = {
      query: q,
      timestamp: new Date().toISOString(),
      results: searchResults,
      metadata: {
        searchType: type || 'auto',
        detailed: detailed === 'true',
        confidence: calculateSearchConfidence(searchResults),
        suggestions: generateSearchSuggestions(q, searchResults)
      }
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Search API Error:', error);
    return res.status(500).json({ 
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function calculateSearchConfidence(results: any): number {
  let confidence = 50; // Base confidence
  
  // Increase confidence based on available data
  if (results.riskAssessment) confidence += 20;
  if (results.contractAnalysis) confidence += 15;
  if (results.relatedEntities.length > 0) confidence += 10;
  if (results.anomalies.length > 0) confidence += 5;
  
  return Math.min(confidence, 100);
}

function generateSearchSuggestions(query: string, results: any): string[] {
  const suggestions = [];
  
  // Suggest related addresses from entities
  if (results.relatedEntities) {
    results.relatedEntities.forEach((entity: any) => {
      entity.addresses.forEach((addr: string) => {
        if (addr !== query && !suggestions.includes(addr)) {
          suggestions.push(addr);
        }
      });
    });
  }
  
  // Suggest addresses from anomalies
  if (results.anomalies) {
    results.anomalies.forEach((anomaly: any) => {
      anomaly.addresses.forEach((addr: string) => {
        if (addr !== query && !suggestions.includes(addr)) {
          suggestions.push(addr);
        }
      });
    });
  }
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
}