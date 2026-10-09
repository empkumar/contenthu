import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchLiveFeedArticles } from './lib/rssService';
import type { ApiArticle } from './lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const topic = req.query.topic as string | undefined;
    const q = (req.query.q as string || '').toLowerCase().trim();
    const category = req.query.category as string | undefined;
    const type = req.query.type as string | undefined;
    const sort = (req.query.sort as string || 'trending').toLowerCase();
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string || '30', 10)));
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));

    // Fetch live articles from RSS
    const liveArticles = await fetchLiveFeedArticles();

    let results: ApiArticle[] = [...liveArticles];

    // Filter by Topic
    if (topic && topic !== 'all') {
      results = results.filter(a => a.topicId === topic);
    }

    // Filter by Category (RESEARCH, VENTURE, STARTUP, etc.)
    if (category && category !== 'all') {
      results = results.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Type (Articles, Research Papers, Case Studies, News)
    if (type && type !== 'all') {
      results = results.filter(a => a.type.toLowerCase() === type.toLowerCase());
    }

    // Full-text search
    if (q) {
      results = results.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.publisher.name.toLowerCase().includes(q) ||
        (a.keyTakeaway && a.keyTakeaway.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'latest') {
      results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sort === 'relevance') {
      results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    } else if (sort === 'saved') {
      results.sort((a, b) => (b.savesCount || 0) - (a.savesCount || 0));
    } else {
      // Default: trending
      results.sort((a, b) => ((b.savesCount || 0) + (b.sharesCount || 0)) - ((a.savesCount || 0) + (a.sharesCount || 0)));
    }

    const total = results.length;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      articles: paginated
    });
  } catch (error: any) {
    console.error('[API /api/articles] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to query articles',
      articles: []
    });
  }
}
