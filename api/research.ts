import type { VercelRequest, VercelResponse } from '@vercel/node';
import { performClaudeResearch } from './lib/claudeService';
import { fetchLiveFeedArticles } from './lib/rssService';
import type { AIResearchRequest } from './lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body: AIResearchRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const query = (body.query || '').trim();

    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required for AI research' });
    }

    // Fetch relevant live feed articles as context
    let liveArticles = await fetchLiveFeedArticles();
    if (body.topicId && body.topicId !== 'all') {
      const topicMatches = liveArticles.filter(a => a.topicId === body.topicId);
      if (topicMatches.length > 0) {
        liveArticles = topicMatches;
      }
    }

    const contextArticles = liveArticles.slice(0, 6).map(a => ({
      title: a.title,
      description: a.description,
      source: a.publisher.name
    }));

    const report = await performClaudeResearch({
      ...body,
      articleContext: contextArticles
    });

    return res.status(200).json({
      success: true,
      report
    });
  } catch (error: any) {
    console.error('[API /api/research] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during research synthesis'
    });
  }
}
