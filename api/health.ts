import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCachedArticlesCount, RSS_SOURCES } from './lib/rssService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasAnthropicKey = Boolean(process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY);
  const cacheStatus = getCachedArticlesCount();

  return res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      rssIngestion: {
        status: 'active',
        activeSources: RSS_SOURCES.length,
        sources: RSS_SOURCES.map(s => s.name),
        cachedArticles: cacheStatus.count,
        lastSync: cacheStatus.lastFetched
      },
      aiEngine: {
        provider: 'Anthropic Claude 3.5 (Sonnet & Haiku)',
        keyConfigured: hasAnthropicKey,
        mode: hasAnthropicKey ? 'live-api' : 'simulated-engine'
      }
    }
  });
}
