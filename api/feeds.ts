import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchLiveFeedArticles, getCachedArticlesCount, RSS_SOURCES } from './lib/rssService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const forceRefresh = req.method === 'POST' || req.query.refresh === 'true';
    const articles = await fetchLiveFeedArticles(forceRefresh);
    const cacheInfo = getCachedArticlesCount();

    const topicFilter = req.query.topic as string | undefined;
    const searchFilter = (req.query.q as string || '').toLowerCase().trim();

    let filtered = articles;
    if (topicFilter && topicFilter !== 'all') {
      filtered = filtered.filter(a => a.topicId === topicFilter);
    }
    if (searchFilter) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchFilter) ||
        a.description.toLowerCase().includes(searchFilter) ||
        a.tags.some(t => t.toLowerCase().includes(searchFilter))
      );
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      totalLiveInCache: articles.length,
      lastFetched: cacheInfo.lastFetched,
      sources: RSS_SOURCES.map(s => ({ id: s.id, name: s.name, domain: s.domain })),
      articles: filtered
    });
  } catch (error: any) {
    console.error('[API /api/feeds] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch RSS feeds',
      articles: []
    });
  }
}
